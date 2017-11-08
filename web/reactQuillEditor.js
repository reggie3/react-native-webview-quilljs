import Quill from './quill.js';
import './quill.snow.css';
import RNMessageChannel from 'react-native-webview-messaging';
import React from 'react';
import PropTypes from 'prop-types';
const util = require('util');

// print passed information in an html element; useful for debugging
// since console.log and debug statements won't work in a conventional way
const PrintElement = data => {
  if (typeof data === 'object') {
    let el = document.createElement('pre');
    el.innerHTML = util.inspect(data, { showHidden: false, depth: null });
    document.getElementById('editor-messages').appendChild(el);
  } else if (typeof data === 'string') {
    let el = document.createElement('pre');
    el.innerHTML = data;
    document.getElementById('editor-messages').appendChild(el);
  }
};

export default class ReactQuillEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editor: null
    };
  }

  componentDidMount() {
    this.setState({
      editor: new Quill('#editor', {
        theme: 'snow',
        bounds: '#Quill-Editor-Container'
      })
    });

    // send a message to parent that the component is loaded
    // RNMessageChannel.send('EDITOR_MOUNTED', {});
    this.registerMessageListeners();
  }

  /*******************************
   * register message listeners to receive events from parent
  */
  registerMessageListeners = () => {
    /* PrintElement('registering message listeners'); */

    RNMessageChannel.on('GET_DELTA', event => {
      /* PrintElement('GET_DELTA');
      PrintElement(this.state.editor.getContents()); */
      RNMessageChannel.emit('RECEIVE_DELTA', {
        payload: {
          type: 'success',
          delta: this.state.editor.getContents()
        }
      });
    });

    RNMessageChannel.on('SET_CONTENTS', event => {
      /*  PrintElement('SET_CONTENTS');
      PrintElement(event.payload.ops); */
      this.state.editor.setContents(event.payload.delta);
    });
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
        {/*       div to contain debugger information from PrintElement */}
        {/*         <div id="editor-messages" /> */}
        <div
          style={{
            height: '100%',
            backgroundColor: '#eeeeee',
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
      </div>
    );
  }
}
