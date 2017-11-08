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
    document.getElementById('viewer-messages').appendChild(el);
  } else if (typeof data === 'string') {
    let el = document.createElement('pre');
    el.innerHTML = data;
    document.getElementById('viewer-messages').appendChild(el);
  }
};

export default class ReactQuillViewer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editor: null
    }; // You can also pass a Quill Delta here
  }

  componentDidMount() {
    this.setState({
      editor: new Quill('#viewer', {
        modules: { toolbar: false },
        readOnly: true,
        theme: null,
        bounds: '#Quill-Viewer-Container'
      })
    });

    this.registerMessageListeners();
  }

  /*******************************
   * register message listeners to receive events from parent
  */
  registerMessageListeners = () => {
    // PrintElement('registering message listeners');

    RNMessageChannel.on('SET_CONTENTS', event => {
      // PrintElement('SET_CONTENTS');
      // PrintElement(event.payload.delta);
      this.state.editor.setContents(event.payload.ops);
    });
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
        {/*       div to contain debugger information from PrintElement */}
        <div id="viewer-messages" />
        <div
          id="viewer"
          style={{
            height: '100%',
            backgroundColor: '#FAEBD7',
            fontSize: '20px'
          }}
        />
      </div>
    );
  }
}
