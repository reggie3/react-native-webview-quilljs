/********************************************
 * WebViewQuillViewer.js
 * A Delta viewer suitable for viewing output from a Quill.js
 * editor.  The Delta format is discussed here: https://quilljs.com/docs/delta/
 * This component is useful for applications that must avoid using native code
 *
 */
import React from 'react';
import { View, ActivityIndicator, StyleSheet, WebView } from 'react-native';
import PropTypes from 'prop-types';
import renderIf from 'render-if';


const MESSAGE_PREFIX = 'react-native-webview-quilljs';

export default class WebViewQuillViewer extends React.Component {
  constructor() {
    super();
    this.webview = null;
    this.state = {
      webViewNotLoaded: true, // flag to show activity indicator
    };
  }

  componentDidMount = () => {
    // this.downloadWebViewFiles(FILES_TO_DOWNLOAD);
  };

 

  sendContentToViewer = (delta) => {
    if (this.props.hasOwnProperty('contentToDisplay')) {
      this.sendMessage('SET_CONTENTS', {
          ops: delta.ops
      });
    }
  };

  sendMessage = (type, payload) => {
    // only send message when webview is loaded
    if (this.webview) {
      console.log(`WebViewQuillViewer: sending message ${type}`);
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

  webViewLoaded = () => {
    this.setState({ webViewNotLoaded: false });

    // send content to viewer if any was passed
    if (this.props.hasOwnProperty('contentToDisplay')) {
      console.log(this.props.contentToDisplay);
      this.sendMessage('SET_CONTENTS', {
        payload: {
          ops: this.props.contentToDisplay.ops
        }
      });
    }
  };

  createWebViewRef = webview => {
    this.webview = webview;
  };

  handleMessage = event => {
    console.log('WebViewQuillViewer handleMessage');
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
            source={
              { uri: "./dist/reactQuillViewer-index.html" }
            }
            onLoadEnd={this.webViewLoaded}
            onMessage={this.handleMessage}
          />
        {renderIf(
          this.state.webViewNotLoaded 
        )(
          <View style={styles.activityOverlayStyle}>
            <View style={styles.activityIndicatorContainer}>
              <ActivityIndicator
                size="large"
                animating={this.state.webViewNotLoaded}
                color="orange"
              />
            </View>
          </View>
        )}
      </View>
    );
  };
}

WebViewQuillViewer.propTypes = {
  contentToDisplay: PropTypes.object
};

const styles = StyleSheet.create({
  activityOverlayStyle: {
    ...StyleSheet.absoluteFillObject,
    marginHorizontal: 20,
    marginVertical: 60,
    display: 'flex',
    justifyContent: 'center',
    alignContent: 'center',
    borderRadius: 5
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