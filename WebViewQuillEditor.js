import React from './web/react.production.min.js';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview-messaging/WebView';
import PropTypes from 'prop-types';

export default class WebViewQuillEditor extends React.Component {
  componentDidMount() {
    // register listeners to listen for events from the html
    // we'll receive a nonce once the requestPaymentMethodComplete is completed
    this.registerMessageListeners();
    // console.log('wbvw quill mounted');
  }

  registerMessageListeners = () => {
    const { messagesChannel } = this.webview;

    messagesChannel.on('RECEIVE_CONTENT', event => {
      // console.log('RECEIVE_CONTENT');
      // console.log(event.payload.deltaContent);
    });

    messagesChannel.on('RECEIVE_DELTA', event => {
      // console.log('RECEIVE_HTML');
      // console.log(event.payload.HTML);
      this.props.getDeltaCallback(event.payload.delta);
    });
    
  };

  sendContentToDisplay = () => {
    if (this.props.hasOwnProperty('contentToDisplay')) {
      this.webview.emit('SET_CONTENTS', {
        payload: {
          delta: this.props.contentToDisplay
        }
      });
    }
  };

  getContent = () => {
    // console.log('getting contents');
    this.webview.emit('GET_CONTENT');
  };

  getHTML = () => {
    // console.log('getting HTML');
    this.webview.emit('GET_HTML');
  };

  getDelta = () =>{
    this.webview.emit('GET_DELTA');
    
  }

  render = () => {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: 'green'
        }}
      >
        <WebView
          onLoad={this.sendContentToDisplay}
          style={{
            flex: 1
          }}
          source={require('./dist/reactQuillEditor-index.html')}
          ref={component => (this.webview = component)}
        />
      </View>
    );
  };
}

WebViewQuillEditor.propTypes = {
  getDeltaCallback: PropTypes.func.isRequired,
  contentToDisplay: PropTypes.object
};
