/********************************************
 * WebViewQuillViewer.js
 * A Delta viewer suitable for viewing output from a Quill.js
 * editor.  The Delta format is discussed here: https://quilljs.com/docs/delta/
 * This component is useful for applications that must avoid using native code
 *  
 */
import React from './web/react.production.min.js';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
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

  sendContentToViewer = (delta) => {
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
          onLoad={this.sendContentToViewer}
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
