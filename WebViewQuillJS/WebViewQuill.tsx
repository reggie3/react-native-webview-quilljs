/********************************************
 * WebViewQuillEditor.js
 * A Quill.js editor component for use in react-native
 * applications that need to avoid using native code
 *
 */
import * as React from "react";
import { NativeSyntheticEvent } from "react-native";
import { WebView } from "react-native-webview";
import AssetUtils from "expo-asset-utils";
import { Asset } from "expo-asset";
import * as FileSystem from "expo-file-system";
import {
  ReactNativeWebViewQuillJSComponentProps as Props,
  WebViewQuillJSMessage,
  StartupMessage,
} from ".";
import { WebViewError } from "react-native-webview/lib/WebViewTypes";
import WebViewQuillView from "./WebViewQuill.view";
import { ActivityOverlay } from "./ActivityOverlay";
import { DeltaOperation } from "quill";
import { isEqual } from "lodash";

// path to the file that the webview will load

const INDEX_FILE_PATH = require(`./assets/index.html`);

interface State {
  debugMessages: string[];
  height: number;
  isLoading: boolean;
  webviewContent: string;
}

const defaultProps: Partial<Props> = {
  backgroundColor: "#ccc",
  containerStyle: {},
  defaultValue: "",
  doShowDebugMessages: false,
  doShowQuillComponentDebugMessages: false,
  isReadOnly: false,
  loadingIndicator: () => <ActivityOverlay />,
  onContentChange: (html: string, delta: DeltaOperation[]) => {},
  onError: (syntheticEvent: NativeSyntheticEvent<WebViewError>) => {},
  onLoadEnd: () => {},
  onLoadStart: () => {},
  onMessageReceived: (message: object) => {},
  style: {}
};

class WebViewQuill extends React.Component<Props, State> {
  static defaultProps = defaultProps;

  private webViewRef: any;

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

  componentDidUpdate = (prevProps: Props, prevState: State) => {
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
  private handleMessage = (message: string) => {
    let parsedMessage: WebViewQuillJSMessage = JSON.parse(message);
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

  private sendMessage = (message: WebViewQuillJSMessage) => {
    const stringMessage = JSON.stringify(message);

    this.updateDebugMessages(`sending: ${stringMessage}`);

    const js = `
    handleMessage(${JSON.stringify(message)});
    `;
    /* var event = new Event('message'); */
    this.webViewRef.injectJavaScript(
      `handleMessage(${stringMessage}, '*'); true;`
    );
  };

  // Send a startup message with initalizing values to the map
  private sendStartupMessage = () => {
    const {
      backgroundColor,
      defaultValue,
      doShowQuillComponentDebugMessages,
      isReadOnly
    } = this.props;

    const startupMessage: StartupMessage = {
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
  private updateDebugMessages = (debugMessage: string) => {
    this.setState({
      debugMessages: [...this.state.debugMessages, debugMessage]
    });
  };

  private onError = (syntheticEvent: NativeSyntheticEvent<WebViewError>) => {
    this.props.onError(syntheticEvent);
  };
  private onLayout = e => {
    this.setState({
      height: e.nativeEvent.layout.height
    });
  };
  private onLoadEnd = () => {
    this.setState({ isLoading: false });
    this.props.onLoadEnd();
  };
  private onLoadStart = () => {
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

export default WebViewQuill;
