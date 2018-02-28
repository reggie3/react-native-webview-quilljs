/********************************************
 * WebViewQuillEditor.js
 * A Quill.js editor component for use in react-native
 * applications that need to avoid using native code
 *
 */
import React from 'react';
import { View, ActivityIndicator, StyleSheet, WebView } from 'react-native';
import PropTypes from 'prop-types';
import renderIf from 'render-if';
import * as webViewDownloadHelper from './webViewDownloadHelper';
import { FileSystem } from 'expo';
import config from './config';

// name and version of the package that contains the index file(s) the webview will load

// path to the file that the webview will load
const INDEX_FILE_PATH = `${FileSystem.documentDirectory}${
  config.PACKAGE_NAME
}/${config.PACKAGE_VERSION}/reactQuillEditor-index.html`;
// the files that will be downloaded
const FILES_TO_DOWNLOAD = [
  'https://raw.githubusercontent.com/foysalit/react-native-webview-quilljs/master/dist/reactQuillViewer-index.html',
  'https://raw.githubusercontent.com/foysalit/react-native-webview-quilljs/master/dist/viewer.bundle.js',
  'https://raw.githubusercontent.com/foysalit/react-native-webview-quilljs/master/dist/reactQuillEditor-index.html',
  'https://raw.githubusercontent.com/foysalit/react-native-webview-quilljs/master/dist/editor.bundle.js',
  'https://raw.githubusercontent.com/foysalit/react-native-webview-quilljs/master/dist/common.js'
];

const MESSAGE_PREFIX = 'react-native-webview-quilljs';

export default class WebViewQuillEditor extends React.Component {
  constructor() {
    super();
    this.state = {
      webViewNotLoaded: true, // flag to show activity indicator
      webViewFilesNotAvailable: true
    };
  }
  componentDidMount() {
    this.downloadWebViewFiles(FILES_TO_DOWNLOAD);
  }

  downloadWebViewFiles = async filesToDownload => {
    if (!config.USE_LOCAL_FILES) {
      let downloadStatus = await webViewDownloadHelper.checkForFiles(
        config.PACKAGE_NAME,
        config.PACKAGE_VERSION,
        filesToDownload,
        this.webViewDownloadStatusCallBack
      );
      if (downloadStatus.success) {
        this.setState({ webViewFilesNotAvailable: false });
      } else if (!downloadStatus.success) {
        console.log(
          `unable to download html files: ${JSON.stringify(downloadStatus)}`
        );
        Alert.alert(
          'Error',
          `unable to download html files: ${JSON.stringify(downloadStatus)}`,
          [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
          { cancelable: false }
        );
      } else {
        this.setState({ webViewFilesNotAvailable: false });
      }
    } else {
      this.setState({ webViewFilesNotAvailable: false });
    }
  };

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
    this.setState({ webViewNotLoaded: false });
    // send the content to the editor if we have it
    if (this.props.hasOwnProperty('contentToDisplay')) {
      this.sendMessage('SET_CONTENTS', {
       
          delta: this.props.contentToDisplay
      
      });
    }
    if (this.props.hasOwnProperty('htmlContentToDisplay')) {
      this.sendMessage('SET_HTML_CONTENTS', {
       
          html: this.props.htmlContentToDisplay
      
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

  render = () => {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: '#ffebba'
        }}
      >
        {renderIf(this.state.webViewFilesNotAvailable)(
          <View style={styles.activityOverlayStyle}>
            <View style={styles.activityIndicatorContainer}>
              <ActivityIndicator
                size="large"
                animating={this.state.webViewFilesNotAvailable}
                color="blue"
              />
            </View>
          </View>
        )}
        {renderIf(!this.state.webViewFilesNotAvailable)(
          <WebView
            style={{
              ...StyleSheet.absoluteFillObject,
              backgroundColor: '#ffebba',
              padding: 10
            }}
            ref={this.createWebViewRef}
            source={
              { uri: INDEX_FILE_PATH }
            }
            onLoadEnd={this.webViewLoaded}
            onMessage={this.handleMessage}
          />
        )}
        {renderIf(
          this.state.webViewNotLoaded && !this.state.webViewFilesNotAvailable
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

WebViewQuillEditor.propTypes = {
  getDeltaCallback: PropTypes.func.isRequired,
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