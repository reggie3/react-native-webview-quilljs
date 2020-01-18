import * as React from "react";
import { WebView } from "react-native-webview";
import AssetUtils from "expo-asset-utils";
import { Asset } from "expo-asset";
import WebViewQuillJSView from "./WebViewQuillJS.view";

import { ActivityOverlay } from "./ActivityOverlay";
import * as FileSystem from "expo-file-system";
import {
  WebviewQuillJSMessage,
  WebviewQuillJSEvents,
  StartupMessage,
  WebViewQuillJSProps
} from "./models";

// @ts-ignore node types
const INDEX_FILE_PATH = require(`./assets/index.html`);

interface State {
  debugMessages: string[];
  isLoading: boolean;
  webviewContent: string;
}

class WebViewQuillJS extends React.Component<WebViewQuillJSProps, State> {
  private webViewRef: any;
  static defaultProps = {
    backgroundColor: "#FAEBD7",
    doShowDebugMessages: false,
    loadingIndicator: () => {
      return null;
    },
    onError: (syntheticEvent: any) => {},
    onMessageReceived: (message: WebviewQuillJSMessage) => {},
    onLoadEnd: () => {},
    onLoadStart: () => {}
  };

  constructor(props: any) {
    super(props);
    this.state = {
      debugMessages: [],
      isLoading: null,
      webviewContent: null
    };
    this.webViewRef = null;
  }

  componentDidMount = () => {
    this.loadHTMLFile();
  };

  private loadHTMLFile = async () => {
    try {
      let asset: Asset = await AssetUtils.resolveAsync(INDEX_FILE_PATH);
      let fileString: string = await FileSystem.readAsStringAsync(
        asset.localUri
      );

      this.setState({ webviewContent: fileString });
    } catch (error) {
      console.warn(error);
      console.warn("Unable to resolve index file");
    }
  };

  componentDidUpdate = (prevProps: WebViewQuillJSProps, prevState: State) => {
    const { webviewContent } = this.state;
    const { content } = this.props;
    if (!prevState.webviewContent && webviewContent) {
      this.updateDebugMessages("file loaded");
    }
    if (content !== prevProps.content) {
      this.sendMessage({ content });
    }
  };

  // Handle messages received from webview contents
  private handleMessage = (data: string) => {
    const { onMessageReceived } = this.props;

    if (onMessageReceived) {
      let message: WebviewQuillJSMessage = JSON.parse(data);
      this.updateDebugMessages(`received: ${JSON.stringify(message)}`);
      if (message.msg === WebviewQuillJSEvents.QUILLJS_COMPONENT_MOUNTED) {
        this.sendStartupMessage();
      }

      onMessageReceived(message);
    }
  };

  // Send message to webview
  private sendMessage = (payload: object) => {
    this.updateDebugMessages(`sending: ${payload}`);

    this.webViewRef?.injectJavaScript(
      `window.postMessage(${JSON.stringify(payload)}, '*');`
    );
  };

  // Send a startup message with initalizing values to the map
  private sendStartupMessage = () => {
    const {
      backgroundColor,
      content,
      doShowQuillComponentDebugMessages,
      isReadOnly
    } = this.props;

    const startupMessage: StartupMessage = {
      backgroundColor,
      content,
      doShowQuillComponentDebugMessages,
      isReadOnly
    };

    this.setState({ isLoading: false });
    this.updateDebugMessages("sending startup message");

    this.webViewRef.injectJavaScript(
      `window.postMessage(${JSON.stringify(startupMessage)}, '*');`
    );
  };

  // Add a new debug message to the debug message array
  private updateDebugMessages = (debugMessage: string) => {
    this.setState({
      debugMessages: [...this.state.debugMessages, debugMessage]
    });
  };

  private onError = (syntheticEvent: any) => {
    this.props.onError(syntheticEvent);
  };
  private onLoadEnd = () => {
    this.setState({ isLoading: false });
    this.props.onLoadEnd();
  };
  private onLoadStart = () => {
    this.setState({ isLoading: true });
    this.props.onLoadStart();
  };

  // Output rendered item to screen
  render() {
    const { debugMessages, webviewContent } = this.state;
    const {
      backgroundColor,
      doShowDebugMessages,
      loadingIndicator
    } = this.props;

    if (webviewContent) {
      return (
        <WebViewQuillJSView
          backgroundColor={backgroundColor}
          debugMessages={debugMessages}
          doShowDebugMessages={doShowDebugMessages}
          handleMessage={this.handleMessage}
          webviewContent={webviewContent}
          loadingIndicator={loadingIndicator}
          onError={this.onError}
          onLoadEnd={this.onLoadEnd}
          onLoadStart={this.onLoadStart}
          setWebViewRef={(ref: WebView) => {
            this.webViewRef = ref;
          }}
        />
      );
    } else {
      return null;
    }
  }
}

export default WebViewQuillJS;
