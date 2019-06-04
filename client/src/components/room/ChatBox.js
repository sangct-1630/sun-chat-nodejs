import React from 'react';
import { withRouter } from 'react-router';
import { Layout, Input } from 'antd';
import { SocketContext } from './../../context/SocketContext';
const { Content } = Layout;

class ChatBox extends React.Component {
  static contextType = SocketContext;

  render() {
    return (
      <Content className="chat-room">
        <div className="list-message">
          ...
          <br />
          <br />
          ...
          <br />
          ...
          <br />
          ...
          <br />
          <br />
          ...
          <br />
          ...
          <br />
          ...
          <br />
          ...
          <br />
          ...
          <br />
          ...
          <br />
          ...
          <br />
          ...
          <br />
          ...
          <br />
          ...
          <br />
          ...
          <br />
          ...
          <br />
          ...
          <br />
          ...
          <br />
          ...
          <br />
          ...
          <br />
          ...
          <br />
          ...
          <br />
          ...
          <br />
          ...
          <br />
          ...
          <br />
          <br />
          ...
          <br />
          ...
          <br />
          ...
          <br />
          ...
          <br />
          ...
          <br />
          ...
          <br />
          ...
          <br />
          ...
          <br />
          ...
          <br />
          ...
          <br />
          ...
          <br />
          ...
          <br />
          ...
          <br />
          ...
          <br />
          ...
          <br />
          ...
          <br />
          ...
          <br />
          ...
          <br />
          ...
          <br />
          ...
          <br />
          ...
          <br />
        </div>
        <Input.TextArea placeholder="Typing in here !!!" rows={4} style={{ resize: 'none' }} />
      </Content>
    );
  }
}

export default withRouter(ChatBox);
