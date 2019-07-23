import React, { Component } from 'react';
import { Modal, Form, Button, message, Badge, Icon } from 'antd';
import '../../../scss/messages.scss';
import '../../../scss/nickname.scss';
import ListGlobalNicknames from './ListGlobalNicknames';
import { withNamespaces } from 'react-i18next';
import { withRouter } from 'react-router';
import { setNicknames } from './../../../api/nickname';

class ModalSetGlobalNicknames extends Component {
  state = {
    visible: false,
    showComponent: false,
    members: this.props.members,
    room_id: this.props.match.params.id,
  };

  componentWillReceiveProps(nextProps) {
    this.setState({
      members: nextProps.members,
      room_id: nextProps.match.params.id,
    });
  }

  showModal = () => {
    this.setState({
      visible: true,
      showComponent: true,
    });
  };

  handleOk = e => {
    this.setState({
      visible: false,
    });
  };

  handleCancel = e => {
    this.setState({
      visible: false,
      showComponent: false,
    });
  };

  handleSubmit = e => {
    e.preventDefault();

    const { members, room_id } = this.state;
    const nicknames = this.props.form.getFieldsValue();
    const data = [];
    Object.keys(nicknames).map(function(key) {
      if (nicknames[key] !== undefined) {
        members.map(member => {
          if (member._id == key) {
            data.push({
              _id: member.nickname !== undefined ? member.nickname._id : undefined,
              user_id: member._id,
              nickname: nicknames[key],
              room_id,
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

    this.setState({
      visible: false,
    });
  };

  render() {
    const { t } = this.props;
    const { getFieldDecorator } = this.props.form;

    return (
      <Badge className="header-icon">
        <Icon type="idcard" onClick={this.showModal} />
        <Form>
          <Modal
            visible={this.state.visible}
            onCancel={this.handleCancel}
            width="550px"
            okText="Submit"
            footer={[
              <Button key="back" onClick={this.handleCancel}>
                Cancel
              </Button>,
              <Button key="submit" type="primary" onClick={this.handleSubmit}>
                Submit
              </Button>,
            ]}
          >
            <ListGlobalNicknames
              handleOk={this.handleOk}
              members={this.state.members}
              getFieldDecorator={getFieldDecorator}
            />
          </Modal>
        </Form>
      </Badge>
    );
  }
}

ModalSetGlobalNicknames = Form.create()(ModalSetGlobalNicknames);

export default withRouter(withNamespaces(['contact', 'user'])(ModalSetGlobalNicknames));
