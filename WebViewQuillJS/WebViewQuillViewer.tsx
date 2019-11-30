/********************************************
 * WebViewQuillEditor.js
 * A Quill.js editor component for use in react-native
 * applications that need to avoid using native code
 *
 */
import * as React from "react";
import {
  NativeSyntheticEvent
} from "react-native";
import { WebView } from "react-native-webview";
import AssetUtils from "expo-asset-utils";
import { Asset } from "expo-asset";
import * as FileSystem from "expo-file-system";
import {
  ReactNativeWebViewQuillJSComponentProps as Props,
  WebViewQuillJSMessage,
  StartupMessage,
  MessageInstruction
} from ".";
import { WebViewError } from "react-native-webview/lib/WebViewTypes";
import WebViewQuillJSView from "./WebViewQuillJS.view";
import { ActivityOverlay } from "./ActivityOverlay";
import { DeltaOperation } from "quill";

// path to the file that the webview will load

const INDEX_FILE_PATH = require(`./assets/index.html`);
const MESSAGE_PREFIX = "react-native-webview-quilljs";

interface State {
  debugMessages: string[];
  isLoading: boolean;
  webviewContent: string;
}

const defaultProps: Partial<Props> = {
  backgroundColor: "#ccc",
  containerStyle: {},
  isReadOnly: false,
  loadingIndicator: () => <ActivityOverlay />,
  onContentChange: (html: string, delta: DeltaOperation[])=>{},
  onError: (syntheticEvent: NativeSyntheticEvent<WebViewError>) => {},
  onLoadEnd: () => {},
  onLoadStart: () => {},
  style:{}
};

class WebViewQuill extends React.Component<Props, State> {
  static defaultProps = defaultProps;

  private webViewRef: any;

  constructor(props) {
    super(props);

    this.state = {
      debugMessages: [],
      webviewContent: null,
      isLoading: null // flag to show activity indicator,
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
    if (!prevState.webviewContent && webviewContent) {
      this.updateDebugMessages("file loaded");
    }
  };

  // Handle messages received from webview contents
  private handleMessage = (data: string) => {
    let message: WebViewQuillJSMessage = JSON.parse(data);
    this.updateDebugMessages(`received: ${JSON.stringify(message)}`);
    console.log(message)
    
    if (message.instruction === 'QUILL_READY') {
      this.sendStartupMessage();
    }
    if(message.instruction === 'CONTENT_CHANGED'){

    }

  };

  private sendMessage = (message: WebViewQuillJSMessage) => {
    const stringMessage = JSON.stringify(message);

    this.updateDebugMessages(`sending: ${stringMessage}`);
    // this.webview.postMessage(stringMessage, '*');

    // var event = new CustomEvent('payrookMessage', stringMessage);

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
    let startupMessage: StartupMessage = {} as StartupMessage;
    const { defaultValue, isReadOnly } = this.props;
    if (defaultValue) {
      startupMessage.defaultValue = defaultValue;
    }
    if (isReadOnly) {
      startupMessage.isReadOnly = isReadOnly;
    }

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
        <WebViewQuillJSView
          backgroundColor={backgroundColor}
          debugMessages={debugMessages}
          defaultValue={defaultValue}
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

export default WebViewQuill;
