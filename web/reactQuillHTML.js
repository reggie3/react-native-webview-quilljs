import Quill from './quill.js';
import './quill.snow.css';
import RNMessageChannel from 'react-native-webview-messaging';
import React from 'react';
import PropTypes from 'prop-types';
const QuillRender = require('quill-render');
const util = require('util');

// print passed information in an html element; useful for debugging
// since console.log and debug statements won't work in a conventional way
const PrintElement = data => {
  if (typeof data === 'object') {
    let el = document.createElement('pre');
    el.innerHTML = util.inspect(data, { showHidden: false, depth: null });
    document.getElementById('messages').appendChild(el);
  } else if (typeof data === 'string') {
    let el = document.createElement('pre');
    el.innerHTML = data;
    document.getElementById('messages').appendChild(el);
  }
};

export default class ReactQuillHTML extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editor: null
    }; // You can also pass a Quill Delta here
  }

  handleChange(value) {
    this.setState({ text: value });
  }

  componentDidMount() {
    const toolbarOptions = ['bold', 'italic', 'underline', 'strike'];
    this.setState({
      editor: new Quill('#editor', {
        modules: { toolbar: '#toolbar' },
        theme: 'snow',
        bounds: '#Quill-Container'
      })
    });

    this.registerMessageListeners();
  }

  /*******************************
   * register message listeners to receive events from parent
  */
  registerMessageListeners = () => {
    PrintElement('registering message listeners');

    // will receive client token as a prop immediately upon mounting
    RNMessageChannel.on('GET_CONTENT', event => {
      PrintElement('GET_CONTENT');
      RNMessageChannel.emit('RECEIVE_CONTENT', {
        payload: {
          type: 'success',
          deltaContent
        }
      });
    });

    RNMessageChannel.on('GET_HTML', event => {
      PrintElement('GET_HTML');
      const deltaContent = this.state.editor.getContents();
      const HTML = QuillRender(deltaContent.ops);
      RNMessageChannel.emit('RECEIVE_HTML', {
        payload: {
          type: 'success',
          HTML
        }
      });
    });
  };

  render() {
    return (
      <div
        id="Quill-Container"
        style={{
          height: '100%',
          backgroundColor: '#dddddd',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <div id="messages" />
        <div id="toolbar">
          <button className="ql-bold">Bold</button>
          <button className="ql-italic">Italic</button>
          <button className="ql-underline">Underline</button>
        </div>
        <div
          style={{
            height: '100%',
            backgroundColor: 'orange',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <div
            id="editor"
            style={{
              height: '100%',
              backgroundColor: '#eeeeee'
            }}
          >
            <p>Hello World!</p>
          </div>
        </div>
      </div>
    );
  }
}
