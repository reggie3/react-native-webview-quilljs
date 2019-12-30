/********************************************
 * WebViewQuillEditor.js
 * A Quill.js editor component for use in react-native
 * applications that need to avoid using native code
 *
 */
import * as React from "react";
import AssetUtils from "expo-asset-utils";
import * as FileSystem from "expo-file-system";

import WebViewQuillView from "./WebViewQuill.view";
import isEqual from "lodash.isequal";

// path to the file that the webview will load
// @ts-ignore typescript doesn't like the require
const INDEX_FILE_PATH = require(`./assets/index.html`);

class WebViewQuill extends React.Component {
  webViewRef;

  constructor(props) {
    super(props);

    this.state = {
      debugMessages: [],
      height: 0,
      isLoading: null,
      webviewContent: null
    };
    this.webViewRef = null;
  }

  componentDidMount = () => {
    this.loadHTMLFile();
  };

  loadHTMLFile = async () => {
    try {
      let asset = await AssetUtils.resolveAsync(INDEX_FILE_PATH);
      let fileString = await FileSystem.readAsStringAsync(asset.localUri);

      this.setState({ webviewContent: fileString });
    } catch (error) {
      console.warn(error);
      console.warn("Unable to resolve index file");
    }
  };

  componentDidUpdate = (prevProps, prevState) => {
    const { webviewContent } = this.state;
    const { content } = this.props;
    if (!prevState.webviewContent && webviewContent) {
      this.updateDebugMessages("file loaded");
    }
    if (!isEqual(content, prevProps.content)) {
      this.updateDebugMessages("sending startup message");

      this.webViewRef.injectJavaScript(
        `window.postMessage(${JSON.stringify({ content })}, '*');`
      );
    }
  };

  // Handle messages received from webview contents
  handleMessage = message => {
    let parsedMessage = JSON.parse(message);
    this.updateDebugMessages(`received: ${JSON.stringify(parsedMessage)}`);
    console.log(parsedMessage);

    switch (parsedMessage.instruction) {
      case "QUILL_READY":
        this.sendStartupMessage();
        break;
      case "CONTENT_CHANGED":
      case "ON_CHANGE_SELECTION":
      case "ON_FOCUS":
      case "ON_BLUR":
      case "ON_KEY_PRESS":
      case "ON_KEY_DOWN":
      case "ON_KEY_UP":
        this.props.onMessageReceived(parsedMessage);
        break;
    }
  };

  /* private sendMessage = (message: WebViewQuillJSMessage) => {
    const stringMessage = JSON.stringify(message);

    this.updateDebugMessages(`sending: ${stringMessage}`);
    this.webViewRef.injectJavaScript(
      `handleMessage(${stringMessage}, '*'); true;`
    );
  }; */

  // Send a startup message with initalizing values to the map
  sendStartupMessage = () => {
    const {
      backgroundColor,
      defaultValue,
      doShowQuillComponentDebugMessages,
      isReadOnly
    } = this.props;

    const startupMessage = {
      backgroundColor,
      defaultValue,
      doShowQuillComponentDebugMessages,
      height: this.state.height,
      isReadOnly
    };

    this.setState({ isLoading: false });
    this.updateDebugMessages("sending startup message");

    this.webViewRef.injectJavaScript(
      `window.postMessage(${JSON.stringify(startupMessage)}, '*');`
    );
  };

  // Add a new debug message to the debug message array
  updateDebugMessages = debugMessage => {
    this.setState({
      debugMessages: [...this.state.debugMessages, debugMessage]
    });
  };

  onError = syntheticEvent => {
    this.props.onError(syntheticEvent);
  };
  onLayout = e => {
    this.setState({
      height: e.nativeEvent.layout.height
    });
  };
  onLoadEnd = () => {
    this.setState({ isLoading: false });
    this.props.onLoadEnd();
  };
  onLoadStart = () => {
    this.setState({ isLoading: true });
    this.props.onLoadStart();
  };

  render() {
    const { debugMessages, webviewContent } = this.state;
    const {
      backgroundColor,
      defaultValue,
      doShowDebugMessages,
      loadingIndicator
    } = this.props;

    if (webviewContent) {
      return (
        // @ts-ignore
        <WebViewQuillView
          backgroundColor={backgroundColor}
          debugMessages={debugMessages}
          defaultValue={defaultValue}
          doShowDebugMessages={doShowDebugMessages}
          handleMessage={this.handleMessage}
          webviewContent={webviewContent}
          loadingIndicator={loadingIndicator}
          onError={this.onError}
          onLayout={this.onLayout}
          onLoadEnd={this.onLoadEnd}
          onLoadStart={this.onLoadStart}
          setWebViewRef={ref => {
            this.webViewRef = ref;
          }}
        />
      );
    } else {
      return null;
    }
  }
}

export default WebViewQuill;
