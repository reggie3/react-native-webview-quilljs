import React from './web/react.production.min.js';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview-messaging/WebView';
import PropTypes from 'prop-types';

export default class WebViewQuillViewer extends React.Component {
  componentDidMount() {
    // register listeners to listen for events from the html
    // we'll receive a nonce once the requestPaymentMethodComplete is completed
    this.registerMessageListeners();
    // console.log('wbvw quill mounted');
  }

  registerMessageListeners = () => {
    const { messagesChannel } = this.webview;

  };

  sendContentToDisplay = (delta) => {
    if (this.props.hasOwnProperty('contentToDisplay')) {
      this.webview.emit('SET_CONTENTS', {
        payload: {
          ops: delta.ops
        }
      });
    }
  };


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
          source={require('./dist/reactQuillViewer-index.html')}
          ref={component => (this.webview = component)}
        />
      </View>
    );
  };
}

WebViewQuillViewer.propTypes = {
  contentToDisplay: PropTypes.object
};
