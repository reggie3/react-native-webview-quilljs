/********************************************
 * WebViewQuillEditor.js
 * A Quill.js editor component for use in react-native
 * applications that need to avoid using native code
 *
 */
import React from 'react';
import { View, ActivityIndicator, StyleSheet, WebView, Alert } from 'react-native';
import PropTypes from 'prop-types';
import renderIf from 'render-if';
const reactHtml = require('./assets/dist/reactQuillEditor-index.html');
const viewer = require('./assets/dist/viewer.bundle.js');
const common = require('./assets/dist/common.js');

const MESSAGE_PREFIX = 'react-native-webview-quilljs';

export default class WebViewQuillEditor extends React.Component {
  constructor() {
    super();
    this.state = {
      webViewNotLoaded: true, // flag to show activity indicator
      webViewFilesNotAvailable: true
    };
  }
  componentDidMount() {}

  createWebViewRef = webview => {
    this.webview = webview;
  };

  handleMessage = event => {
    let msgData;
    try {
      msgData = JSON.parse(event.nativeEvent.data);
      if (
        msgData.hasOwnProperty('prefix') &&
        msgData.prefix === MESSAGE_PREFIX
      ) {
        console.log(`WebViewQuillEditor: received message ${msgData.type}`);
        this.sendMessage('MESSAGE_ACKNOWLEDGED');
        console.log(`WebViewQuillEditor: sent MESSAGE_ACKNOWLEDGED`);

        switch (msgData.type) {
          case 'EDITOR_MOUNTED':
            this.setState({ webViewNotLoaded: false });
            break;
          case 'TEXT_CHANGED':
            if (this.props.onChangeCallback)
              this.props.onChangeCallback(msgData.payload.delta);
            break;
          case 'RECEIVE_DELTA':
            this.props.getDeltaCallback(msgData.payload.delta);
            break;
          default:
            console.warn(
              `WebViewQuillEditor Error: Unhandled message type received "${
                msgData.type
              }"`
            );
        }
      }
    } catch (err) {
      console.warn(err);
      return;
    }
  };

  webViewLoaded = () => {
    console.log('Webview loaded');
    this.setState({ webViewNotLoaded: false });
    // send the content to the editor if we have it
    if (this.props.hasOwnProperty('contentToDisplay')) {
      console.log(this.props.contentToDisplay);
      this.sendMessage('SET_CONTENTS', {
        delta: this.props.contentToDisplay
      });
    }
  };

  sendMessage = (type, payload) => {
    // only send message when webview is loaded
    if (this.webview) {
      console.log(`WebViewQuillEditor: sending message ${type}`);
      this.webview.postMessage(
        JSON.stringify({
          prefix: MESSAGE_PREFIX,
          type,
          payload
        }),
        '*'
      );
    }
  };

  // get the contents of the editor.  The contents will be in the Delta format
  // defined here: https://quilljs.com/docs/delta/
  getDelta = () => {
    this.sendMessage('GET_DELTA');
  };

  showLoadingIndicator = () => {
    return (
      <View style={styles.activityOverlayStyle}>
        <View style={styles.activityIndicatorContainer}>
          <ActivityIndicator
            size="large"
            animating={this.state.webViewNotLoaded}
            color="green"
          />
        </View>
      </View>
    );
  };

  onError = error => {
    Alert.alert('WebView onError', error, [
      { text: 'OK', onPress: () => console.log('OK Pressed') }
    ]);
  };

  renderError = error => {
    Alert.alert('WebView renderError', error, [
      { text: 'OK', onPress: () => console.log('OK Pressed') }
    ]);
  };

  render = () => {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: '#ffebba'
        }}
      >
        <WebView
          style={{
            ...StyleSheet.absoluteFillObject,
            backgroundColor: '#ffebba',
            padding: 10
          }}
          ref={this.createWebViewRef}
          source={reactHtml}
          onLoadEnd={this.webViewLoaded}
          onMessage={this.handleMessage}
          startInLoadingState={true}
          renderLoading={this.showLoadingIndicator}
          renderError={this.renderError}
          onError={this.onError}
        />
      </View>
    );
  };
}

WebViewQuillEditor.propTypes = {
  getDeltaCallback: PropTypes.func.isRequired,
  contentToDisplay: PropTypes.object,
  onChangeCallback: PropTypes.func
};

const styles = StyleSheet.create({
  activityOverlayStyle: {
    ...StyleSheet.absoluteFillObject,
    display: 'flex',
    justifyContent: 'center',
    alignContent: 'center',
    borderRadius: 0
  },
  activityIndicatorContainer: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 50,
    alignSelf: 'center',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 3
    },
    shadowRadius: 5,
    shadowOpacity: 1.0
  }
});
