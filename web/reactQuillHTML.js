import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import RNMessageChannel from 'react-native-webview-messaging';
import React from 'react';
import PropTypes from 'prop-types';
const util = require('util');

export default class ReactQuillHTML extends React.Component {
  constructor(props) {
    super(props);
    this.state = { text: '' }; // You can also pass a Quill Delta here
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(value) {
    this.setState({ text: value });
  }

  render() {
    return (
      <div
        style={{
          height: '100%',
          backgroundColor: 'red',
          display: 'flex'
        }}
      >
        <ReactQuill
          style={{}}
          value={this.state.text}
          onChange={this.handleChange}
        />
      </div>
    );
  }
}
