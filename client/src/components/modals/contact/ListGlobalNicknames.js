import React from 'react';
import { withNamespaces } from 'react-i18next';
import { withRouter } from 'react-router';
import 'antd/dist/antd.css';
import { Avatar, Form, message, Spin, Input, Table, Button } from 'antd';
import { getUserAvatarUrl } from './../../../helpers/common';
import { SocketContext } from './../../../context/SocketContext';
import { getListContacts } from '../../../api/contact';
import InfiniteScroll from 'react-infinite-scroller';
import { setNicknames } from './../../../api/nickname';

class ListGlobalNicknames extends React.Component {
  static contextType = SocketContext;

  constructor(props) {
    super(props);

    this.state = {
      contacts: [],
      error: '',
      loading: false,
      hasMore: true,
      page: 1,
      totalContact: 0,
      searchText: '',
    };
  }

  fetchData = (page, searchText) => {
    getListContacts(page, searchText)
      .then(res => {
        const { contacts } = this.state;
        res.data.result.map(item => {
          contacts.push(item);
        });
        this.setState({
          contacts,
          page,
          loading: false,
        });
        if (res.data.totalContact.length !== 0) {
          this.setState({
            totalContact: res.data.totalContact,
          });
        }
      })
      .catch(error => {
        this.setState({
          error: error.response.data.error,
        });
      });
  };

  componentDidMount() {
    const { page, searchText } = this.state;

    this.fetchData(page, searchText);
  }

  handleInfiniteOnLoad = () => {
    const { t } = this.props;
    let { page, contacts, totalContact, searchText } = this.state;
    const newPage = parseInt(page) + 1;
    this.setState({
      loading: true,
    });

    if (contacts.length >= totalContact) {
      message.warning(t('contact:list_contact.loaded_all'));
      this.setState({
        hasMore: false,
        loading: false,
      });
      return;
    }

    this.fetchData(newPage, searchText);
  };

  setAvatar(avatar) {
    if (avatar) {
      return <Avatar src={getUserAvatarUrl(avatar)} />;
    }

    return <Avatar icon="user" size="large" />;
  }

  handleSubmit = e => {
    e.preventDefault();

    const { contacts } = this.state;
    const nicknames = this.props.form.getFieldsValue();
    const data = [];

    Object.keys(nicknames).map(function(key) {
      if (nicknames[key] !== undefined) {
        contacts.map(contact => {
          if (contact._id === key) {
            data.push({
              _id: contact.nickname !== undefined ? contact.nickname._id : undefined,
              user_id: contact._id,
              nickname: nicknames[key],
              room_id: null,
            });
          }
        });
      }
    });

    setNicknames(data)
      .then(res => {
        message.success(res.data.success);
      })
      .catch(error => {
        message.error(error.response.data.error);
      });

    this.props.handleOk();
  };

  render() {
    const { t } = this.props;
    const { getFieldDecorator } = this.props.form;

    const columns = [
      {
        title: '',
        key: 'avatar',
        width: 83,
        dataIndex: 'avatar',
        render: avatar => this.setAvatar(avatar),
      },
      {
        title: t('user:label.name'),
        width: 170,
        dataIndex: 'name',
      },
      {
        title: t('user:label.nickname'),
        dataIndex: 'nickname',
        render: (nickname, contact) => (
          <Form.Item name="nickname" className="form-nickname">
            {getFieldDecorator(contact._id, {
              initialValue: contact.nickname !== undefined ? nickname.nickname : undefined,
            })(<Input />)}
          </Form.Item>
        ),
      },
    ];

    return (
      <React.Fragment>
        <p>
          <b>{t('contact:nickname.note')}</b>: {t('contact:nickname.content')}
        </p>
        <div className="infinite-container-nickname">
          <InfiniteScroll
            initialLoad={false}
            pageStart={0}
            loadMore={this.handleInfiniteOnLoad}
            hasMore={!this.state.loading && this.state.hasMore}
            useWindow={false}
          >
            <Form>
              <Table
                columns={columns}
                dataSource={this.state.contacts}
                pagination={false}
                rowKey={members => members._id}
              />
              {this.state.loading && this.state.hasMore && (
                <div className="demo-loading-container">
                  <Spin />
                </div>
              )}
            </Form>
          </InfiniteScroll>
        </div>
        <div className="contact-check-all">
          <Button.Group className="btn-all-accept">
            <Button type="primary" onClick={this.handleSubmit}>
              {t('contact:button.save')}
            </Button>
          </Button.Group>
        </div>
      </React.Fragment>
    );
  }
}

ListGlobalNicknames = Form.create()(ListGlobalNicknames);
export default withRouter(withNamespaces(['contact', 'user'])(ListGlobalNicknames));
