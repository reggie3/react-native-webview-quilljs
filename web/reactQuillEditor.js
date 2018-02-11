import Quill from './quill.js';
import './quill.snow.css';
import React from 'react';
import PropTypes from 'prop-types';
import glamorous from 'glamorous';
import renderIf from 'render-if';

const util = require('util');
let updateCounter = 0;
const MESSAGE_PREFIX = 'react-native-webview-quilljs';
const SHOW_DEBUG_INFORMATION = true;

let messageQueue = [];
let messageCounter = 0;

const MessagesDiv = glamorous.div({
  backgroundColor: 'orange',
  maxHeight: 200,
  overflow: 'auto',
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0
});

export default class ReactQuillEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editor: null,
      readyToSendNextMessage: true
    };
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
      editor: new Quill('#editor', {
        theme: 'snow',
        bounds: '#Quill-Editor-Container'
      })
    });
    if (document) {
      document.addEventListener('message', this.handleMessage), false;
    } else if (window) {
      window.addEventListener('message', this.handleMessage), false;
    } else {
      console.log('unable to add event listener');
    }
    this.printElement(`component mounted`);
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
      this.printElement(`sending message`);
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
          case 'GET_DELTA':
            this.addMessageToQueue('RECEIVE_DELTA', {
              payload: {
                type: 'success',
                delta: this.state.editor.getContents()
              }
            });
            break;

          case 'SET_CONTENTS':
            this.state.editor.setContents(event.payload.delta);
            break;

          case 'MESSAGE_ACKNOWLEDGED':
            this.printElement(`received MESSAGE_ACKNOWLEDGED`);
            this.setState({ readyToSendNextMessage: true });
            this.sendNextMessage();
            break;

          default:
            printElement(
              `reactQuillEditor Error: Unhandled message type received "${
                msgData.type
              }"`
            );
        }
      }
    } catch (err) {
      this.printElement(`reactQuillEditor error: ${err}`);
      return;
    }
  };

  render() {
    return (
      <div
        id="Quill-Editor-Container"
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
            id="editor"
            style={{
              backgroundColor: '#FAEBD7',
              fontSize: '20px',
              height: 'calc(100% - 42px)'
            }}
          >
            <p>Hello World!</p>
          </div>
        </div>
        {renderIf(SHOW_DEBUG_INFORMATION)(<MessagesDiv id="messages" />)}
      </div>
    );
  }
}
