/********************************************
 * WebViewQuillEditor.js
 * A Quill.js editor component for use in react-native
 * applications that need to avoid using native code
 *
 */
import React from 'react';
import {
  View,
  ActivityIndicator,
  StyleSheet,
  WebView,
  Platform,
} from 'react-native';
import PropTypes from 'prop-types';
import { Asset } from 'expo';

// path to the file that the webview will load

const INDEX_FILE_PATH = `./assets/dist/reactQuillEditor-index.html`;
const INDEX_FILE_ASSET_URI = Asset.fromModule(require(INDEX_FILE_PATH)).uri;
const MESSAGE_PREFIX = 'react-native-webview-quilljs';

export default class WebViewQuillEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editorLoaded: false,
      webviewErrorMessages: [],
      hasError: false,
      hasErrorMessage: '',
      hasErrorInfo: ''
    };
  }



  /* handleMessage = (event) => {
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
          case 'EDITOR_LOADED':
            this.editorLoaded();
            break;
          case 'EDITOR_SENT':
            this.props.getEditorCallback(msgData.payload.editor);
            break;
          case 'TEXT_CHANGED':
            if (this.props.onDeltaChangeCallback) {
			  delete msgData.payload.type;
			  let {deltaChange, delta, deltaOld, changeSource } = msgData.payload;
              this.props.onDeltaChangeCallback(deltaChange, deltaChange, deltaOld, changeSource );
            }
            break;
          case 'RECEIVE_DELTA':
            if (this.props.getDeltaCallback)
              this.props.getDeltaCallback(msgData.payload);
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
  }; */

  onWebViewLoaded = () => {
    console.log('Webview loaded');
    this.setState({ webViewNotLoaded: false });
    this.sendMessage('LOAD_EDITOR');
    if (this.props.hasOwnProperty('backgroundColor')) {
      this.sendMessage('SET_BACKGROUND_COLOR', {
        backgroundColor: this.props.backgroundColor
      });
    }
    if (this.props.hasOwnProperty('onLoad')) {
      this.props.onLoad();
    }
    if (this.props.hasOwnProperty('getEditorCallback')) {
      this.sendMessage('SEND_EDITOR');
    }
  };

  editorLoaded = () => {
    // send the content to the editor if we have it
    if (this.props.hasOwnProperty('contentToDisplay')) {
      console.log(this.props.contentToDisplay);
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

  handleMessage = (data) => {
    let msgData;
    // console.log({ data });
    msgData = JSON.parse(data);
    if (msgData.hasOwnProperty('prefix') && msgData.prefix === MESSAGE_PREFIX) {
      // console.log(`WebViewLeaflet: received message: `, msgData.payload);

      // if we receive an event, then pass it to the parent by calling
      // the parent function wtith the same name as the event, and passing
      // the entire payload as a parameter
      if (
        msgData.payload.event &&
        this.props.eventReceiver.hasOwnProperty(msgData.payload.event)
      ) {
        this.props.eventReceiver[msgData.payload.event](msgData.payload);
      }
      // WebViewLeaflet will also need to know of some state changes, such as
      // when the editor is mounted
      else {
        this.props.eventReceiver.setState({
          state: {
            ...this.props.eventReceiver.state,
            editorState: {
              ...this.props.eventReceiver.editorState,
              ...msgData.payload
            }
          }
        });
      }
    }
  };

  sendMessage = (payload) => {
    if (this.state.editorLoaded) {
      // only send message when webview is loaded

      const message = JSON.stringify({
        prefix: MESSAGE_PREFIX,
        payload
      });

      // If the user has sent a centering messaging, then store the location
      // so that we can refer to it later if the built in centering button
      // is pressed
      /* if (payload.centerPosition) {
        this.setState({ centerPosition: payload.centerPosition });
      } */
      // console.log(`WebViewLeaflet: sending message: `, JSON.stringify(message));
      this.webview.postMessage(message, '*');
    }
  };

  // get the contents of the editor.  The contents will be in the Delta format
  // defined here: https://quilljs.com/docs/delta/
  getDelta = () => {
    this.sendMessage('GET_DELTA');
  };

  renderLoadingIndicator = () => {
    return (
      <View style={styles.activityOverlayStyle}>
        <View style={styles.activityIndicatorContainer}>
          <ActivityIndicator
            size="large"
            animating={!this.props.eventReceiver.state.editorState.editorLoaded}
          />
        </View>
      </View>
    );
  };


  /* <WebView
          style={{ ...StyleSheet.absoluteFillObject }}
          ref={this.createWebViewRef}
          source={
            Platform.OS === 'ios'
              ? require('./assets/dist/reactQuillEditor-index.html')
              : { uri: INDEX_FILE_ASSET_URI }
          }
          onLoadEnd={this.onWebViewLoaded}
          onMessage={this.handleMessage}
          startInLoadingState={true}
          renderLoading={this.showLoadingIndicator}
          renderError={this.renderError}
          javaScriptEnabled={true}
          onError={this.onError}
          scalesPageToFit={false}
          mixedContentMode={'always'}
          domStorageEnabled={true}
        /> */

  maybeRenderEditor = () => {
    return (
      <View style={{flex: 1, overflow: 'hidden'}}>
      <WebView
        style={{
          ...StyleSheet.absoluteFillObject
        }}
        ref={(ref) => {
          this.webview = ref;
        }}
        source={
          Platform.OS === 'ios'
            ? require('./assets/dist/reactQuillEditor-index.html')
            : { uri: INDEX_FILE_ASSET_URI }
        }
        startInLoadingState={true}
        renderLoading={this.renderLoading}
        renderError={(error) => {
          console.log(
            'RENDER ERROR: ',
            util.inspect(error, {
              showHidden: false,
              depth: null
            })
          );
        }}
        javaScriptEnabled={true}
        onError={(error) => {
          console.log(
            'ERROR: ',
            util.inspect(error, {
              showHidden: false,
              depth: null
            })
          );
        }}
        scalesPageToFit={false}
        mixedContentMode={'always'}
        onMessage={(event) => {
          if (event && event.nativeEvent && event.nativeEvent.data) {
            this.handleMessage(event.nativeEvent.data);
          }
        }}
        onLoadStart={() => {}}
        onLoadEnd={() => {
          if (this.props.eventReceiver.hasOwnProperty('onLoad')) {
            this.props.eventReceiver.onLoad();
          }
          // Set the component state to showw that the map has been loaded.
          // This will let us do things during component update once the map
          // is loaded.
          this.setState({ editorLoaded: true });
        }}
        domStorageEnabled={true}
      />
      </View>
    );
  };


  maybeRenderWebviewError = () => {
    if (this.state.webviewErrorMessages.length > 0) {
      return (
        <View style={{ zIndex: 2000, backgroundColor: 'orange', margin: 4 }}>
          {this.state.webviewErrorMessages.map((errorMessage, index) => {
            return <Text key={index}>{errorMessage}</Text>;
          })}
        </View>
      );
    }
    return null;
  };

  maybeRenderErrorBoundaryMessage = () => {
    if (this.state.hasError)
      return (
        <View style={{ zIndex: 2000, backgroundColor: 'red', margin: 5 }}>
          {util.inspect(this.state.webviewErrorMessages, {
            showHidden: false,
            depth: null
          })}
        </View>
      );
    return null;
  };

  render = () => {
    return (
      <View
        style={{
          flex: 1
        }}
      >
      <View
          style={{
            ...StyleSheet.absoluteFillObject,
            backgroundColor: '#fff1ad'
          }}
        >
          {this.maybeRenderEditor()}
          {this.maybeRenderErrorBoundaryMessage()}
          {this.maybeRenderWebviewError()}
        </View>
        
      </View>
    );
  };
}

WebViewQuillEditor.propTypes = {
  getDeltaCallback: PropTypes.func,
  onDeltaChangeCallback: PropTypes.func,
  backgroundColor: PropTypes.string,
  onLoad: PropTypes.func
};

// Specifies the default values for props:
WebViewQuillEditor.defaultProps = {
  theme: 'snow'
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
