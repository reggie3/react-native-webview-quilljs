import ReactQuill from 'react-quill'; // ES6
import 'react-quill/dist/quill.snow.css'; // ES6
import React from 'react';


const util = require('util');
let updateCounter = 0;
const MESSAGE_PREFIX = 'react-native-webview-quilljs';

const ENABLE_BROWSER_TESTING = false; // flag to enable testing directly in browser
const SHOW_DEBUG_INFORMATION = false;

let messageCounter = 0;

export default class ReactQuillEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = { text: '' }; // You can also pass a Quill Delta here
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount = () => {
    this.printElement('leafletReactHTML.js componentDidMount');

    // add the event listeners
    if (document) {
      document.addEventListener('message', this.handleMessage), false;
      this.printElement('using document');
    } else if (window) {
      window.addEventListener('message', this.handleMessage), false;
      this.printElement('using window');
    } else {
      console.log('unable to add event listener');
      return;
    }

    this.eventListenersAdded = true;
    if (ENABLE_BROWSER_TESTING) {
     console.log('browser testing enabled');
	}
}

componentWillUnmount = () => {
    if (document) {
      document.removeEventListener('message', this.handleMessage);
    } else if (window) {
      window.removeEventListener('message', this.handleMessage);
    }
  };

  handleChange(value) {
    this.setState({ text: value });
  }



  // print passed information in an html element; useful for debugging
  // since console.log and debug statements won't work in a conventional way
  printElement = (data) => {
    if (SHOW_DEBUG_INFORMATION) {
      let message = '';
      if (typeof data === 'object') {
        message = util.inspect(data, { showHidden: false, depth: null });
      } else if (typeof data === 'string') {
        message = data;
      }
      this.setState({
        debugMessages: this.state.debugMessages.concat([message])
      });
      console.log(message);
    }
  };

    // data to send is an object containing key value pairs that will be
  // spread into the destination's state
  sendMessage = (payload) => {
    // this.printElement(`in send message payload = ${JSON.stringify(payload)}`);

    const message = JSON.stringify({
      prefix: MESSAGE_PREFIX,
      payload: payload
    });

    this.printElement(`message to send = ${message}`);

    try {
      if (document.hasOwnProperty('postMessage')) {
        document.postMessage(message, '*');
      } else if (window.hasOwnProperty('postMessage')) {
        window.postMessage(message, '*');
      } else {
        console.log('unable to find postMessage');
        this.printElement(`unable to find postMessage`);
      }
    } catch (error) {
      this.printElement(`error sending message: ${JSON.stringify(error)}`);
    }

    this.printElement(`sent message: ${message}`);
  };

  handleMessage = (event) => {
    this.printElement(
      `received message ${util.inspect(event.data, {
        showHidden: false,
        depth: null
      })}`
    );

    let msgData;
    try {
      msgData = JSON.parse(event.data);
      if (
        msgData.hasOwnProperty('prefix') &&
        msgData.prefix === MESSAGE_PREFIX
      ) {
        this.printElement(`Received: ${JSON.stringify(msgData)}`);
        this.setState({ ...this.state, ...msgData.payload }, () => {
          // this.printElement(`state: ${JSON.stringify(this.state)}`);
        });
      }
    } catch (err) {
      this.printElement(`leafletReactHTML error: ${err}`);
      return;
    }
  };

  render() {
    return (
      <React.Fragment>
        <ReactQuill value={this.state.text} onChange={this.handleChange} />
        {SHOW_DEBUG_INFORMATION ? (
          <div
            style={{
              backgroundColor: 'orange',
              maxHeight: '200px',
              overflow: 'auto',
              padding: 5,
              position: 'fixed',
              bottom: 0,
              left: 0,
              right: 0,
              zIndex: 15000
            }}
            id="messages"
          >
            <ul>
              {this.state.debugMessages.map((message, index) => {
                return <li key={index}>{message}</li>;
              })}
            </ul>
          </div>
        ) : null}
      </React.Fragment>
    );
  }
}
