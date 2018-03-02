import Quill from './quill.js';
import './quill.snow.css';
import React from 'react';
import PropTypes from 'prop-types';
import glamorous from 'glamorous';
import renderIf from 'render-if';

const util = require('util');
const MESSAGE_PREFIX = 'react-native-webview-quilljs';
const SHOW_DEBUG_INFORMATION = false;

let messageQueue = [];
let messageCounter = 0;

const MessagesDiv = glamorous.div({
  backgroundColor: 'orange',
  maxHeight: 200,
  overflow: 'auto',
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  fontSize: 10
});

export default class ReactQuillViewer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editor: null,
      readyToSendNextMessage: true
    }; // You can also pass a Quill Delta here
  }

  // print passed information in an html element; useful for debugging
  // since console.log and debug statements won't work in a conventional way
  printElement = data => {
    if (SHOW_DEBUG_INFORMATION) {
      if (typeof data === 'object') {
        let el = document.createElement('pre');
        el.innerHTML = util.inspect(data, { showHidden: false, depth: null });
        document.getElementById('messages').appendChild(el);
        console.log(JSON.stringify(data));
      } else if (typeof data === 'string') {
        let el = document.createElement('pre');
        el.innerHTML = data;
        document.getElementById('messages').appendChild(el);
        console.log(data);
      }
    }
  };

  componentDidMount() {
    this.setState({
      editor: new Quill('#viewer', {
        modules: { toolbar: false },
        readOnly: true,
        theme: null,
        bounds: '#Quill-Viewer-Container'
      })
    });
    if (document) {
      document.addEventListener('message', this.handleMessage);
    } else if (window) {
      window.addEventListener('message', this.handleMessage);
    } else {
      console.log('unable to add event listener');
    }
    this.printElement(`component mounted`);
  }

  componentWillUnmount(){
    if (document) {
      document.removeEventListener('message', this.handleMessage);
    } else if (window) {
      window.removeEventListener('message', this.handleMessage);
    }
  }

  addMessageToQueue = (type, payload) => {
    messageQueue.push(
      JSON.stringify({
        messageID: messageCounter++,
        prefix: MESSAGE_PREFIX,
        type,
        payload
      })
    );
    this.printElement(`adding message ${messageCounter} to queue`);
    if (this.state.readyToSendNextMessage) {
      this.sendNextMessage();
    }
  };

  sendNextMessage = () => {
    if (messageQueue.length > 0) {
      const nextMessage = messageQueue.shift();
      this.printElement(`sending message ${nextMessage}`);
      window.postMessage(nextMessage, '*');
      this.setState({ readyToSendNextMessage: false });
    }
  };

  handleMessage = event => {
    this.printElement(`received message`);
    this.printElement(
      util.inspect(event.data, {
        showHidden: false,
        depth: null
      })
    );

    let msgData;
    try {
      msgData = JSON.parse(event.data);
      if (
        msgData.hasOwnProperty('prefix') &&
        msgData.prefix === MESSAGE_PREFIX
      ) {
        // this.printElement(msgData);
        switch (msgData.type) {
          // receive an event when the webview is ready
          case 'SET_CONTENTS':
            // this.printElement('MAP_CENTER_COORD_CHANGE event recieved');
            this.state.editor.setContents(msgData.payload.ops);
            break;
          case 'MESSAGE_ACKNOWLEDGED':
            this.setState({ readyToSendNextMessage: true });
            this.sendNextMessage();
            break;

          default:
            printElement(
              `reactQuillViewer Error: Unhandled message type received "${
                msgData.type
              }"`
            );
        }
      }
    } catch (err) {
      this.printElement(`reactQuillViewer error: ${err}`);
      return;
    }
  };

  render() {
    return (
      <div
        id="Quill-Viewer-Container"
        style={{
          height: '100%',
          backgroundColor: '#dddddd',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <div
          style={{
            height: '100%',
            backgroundColor: '#ffebba',
            display: 'flex',
            flexDirection: 'column',
            paddingVertical: 5
          }}
        >
        <div
          id="viewer"
          style={{
            backgroundColor: '#FAEBD7',
            fontSize: '20px',
            height: '100%'
          }}
        />
        </div>
        {renderIf(SHOW_DEBUG_INFORMATION)(<MessagesDiv id="messages" />)}
      </div>
    );
  }
}
