import Quill from './quill.js';
import './quill.snow.css';
import RNMessageChannel from 'react-native-webview-messaging';
import React from 'react';
import PropTypes from 'prop-types';
const util = require('util');

export default class ReactQuillHTML extends React.Component {
  constructor(props) {
    super(props);
    this.state = { editor: null }; // You can also pass a Quill Delta here
  }

  handleChange(value) {
    this.setState({ text: value });
  }

  componentDidMount() {
    this.setState({
      editor: new Quill('#editor', {
        modules: { toolbar: '#toolbar' },
        theme: 'snow'
      })
    });
  }

  render() {
    return (
        <div
        style={{
          height: '100%',
          backgroundColor: 'red',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <div id="toolbar">
          <button className="ql-bold">Bold</button>
          <button className="ql-italic">Italic</button>
        </div>
        <div id="editor">
          <p>Hello World!</p>
        </div>
      </div>
    );
  }
}
