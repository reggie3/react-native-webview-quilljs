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

  quillGetHTML(inputDelta) {    
    var tempCont = document.createElement('div');
    new Quill(tempCont).setContents([
      {insert: "Hello\n"},
      {insert: "This is colorful", attributes: {color: '#f00'}}
  ]);
    return tempCont.getElementsByClassName('editor')[0].innerHTML;
  }


  /*******************************
   * register message listeners to receive events from parent
  */
  registerMessageListeners = () => {
    PrintElement('registering message listeners');

    // will receive client token as a prop immediately upon mounting
    RNMessageChannel.on('GET_CONTENT', event => {
      PrintElement('GET_CONTENT');
      const deltaContent = this.state.editor.getContents();
      // const HTML = this.quillGetHTML(deltaContent);
      // PrintElement(HTML);
      PrintElement(deltaContent);
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
