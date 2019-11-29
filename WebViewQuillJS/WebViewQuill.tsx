/********************************************
 * WebViewQuillEditor.js
 * A Quill.js editor component for use in react-native
 * applications that need to avoid using native code
 *
 */
import * as React from "react";
import { View, ActivityIndicator, StyleSheet, Text } from "react-native";
import { WebView } from "react-native-webview";
import AssetUtils from "expo-asset-utils";
import { Asset } from "expo-asset";
import * as FileSystem from "expo-file-system";

// path to the file that the webview will load

const INDEX_FILE_PATH = require(`./assets/dist/reactQuillEditor-index.html`);
// const INDEX_FILE_ASSET_URI = Asset.fromModule(require(EDITOR_INDEX_FILE_PATH)).uri;
const MESSAGE_PREFIX = "react-native-webview-quilljs";

interface Props {
  backgroundColor: any; // this can be set by user
  contentToDisplay: any;
  getDeltaCallback?: any;
  getEditorCallback?: any;
  htmlContentToDisplay?: any;
  onDeltaChangeCallback: any;
  onLoad?: () => void;
}

interface State {
  asset;
  webViewNotLoaded;
  webviewContent;
}

class WebViewQuillEditor extends React.Component<Props, State> {
  private webViewRef: any;

  constructor(props) {
    super(props);

    this.state = {
      asset: undefined,
      webviewContent: null,
      webViewNotLoaded: true // flag to show activity indicator,
    };
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

  createWebViewRef = webViewRef => {
    this.webViewRef = webViewRef;
  };

  handleMessage = event => {
    let msgData;
    const decoded = unescape(decodeURIComponent(event.nativeEvent.data));
    try {
      msgData = JSON.parse(decoded);
      if (
        msgData.hasOwnProperty("prefix") &&
        msgData.prefix === MESSAGE_PREFIX
      ) {
        console.log(`WebViewQuillEditor: received message ${msgData.type}`);
        this.sendMessage("MESSAGE_ACKNOWLEDGED");
        console.log(`WebViewQuillEditor: sent MESSAGE_ACKNOWLEDGED`);

        switch (msgData.type) {
          case "EDITOR_LOADED":
            this.editorLoaded();
            break;
          case "EDITOR_SENT":
            this.props.getEditorCallback(msgData.payload.editor);
            break;
          case "TEXT_CHANGED":
            if (this.props.onDeltaChangeCallback) {
              delete msgData.payload.type;
              let {
                deltaChange,
                delta,
                deltaOld,
                changeSource
              } = msgData.payload;
              this.props.onDeltaChangeCallback(
                deltaChange,
                deltaChange,
                deltaOld,
                changeSource
              );
            }
            break;
          case "RECEIVE_DELTA":
            if (this.props.getDeltaCallback)
              this.props.getDeltaCallback(msgData.payload);
            break;
          default:
            console.warn(
              `WebViewQuillEditor Error: Unhandled message type received "${msgData.type}"`
            );
        }
      }
    } catch (err) {
      console.warn(err);
      return;
    }
  };

  onWebViewLoaded = () => {
    console.log("Webview loaded");
    this.setState({ webViewNotLoaded: false });
    this.sendMessage("LOAD_EDITOR");
    if (this.props.hasOwnProperty("backgroundColor")) {
      this.sendMessage("SET_BACKGROUND_COLOR", {
        backgroundColor: this.props.backgroundColor
      });
    }
    if (this.props.hasOwnProperty("onLoad")) {
      this.props.onLoad();
    }
    if (this.props.hasOwnProperty("getEditorCallback")) {
      this.sendMessage("SEND_EDITOR");
    }
  };

  editorLoaded = () => {
    // send the content to the editor if we have it
    if (this.props.hasOwnProperty("contentToDisplay")) {
      console.log(this.props.contentToDisplay);
      this.sendMessage("SET_CONTENTS", {
        delta: this.props.contentToDisplay
      });
    }
    if (this.props.hasOwnProperty("htmlContentToDisplay")) {
      this.sendMessage("SET_HTML_CONTENTS", {
        html: this.props.htmlContentToDisplay
      });
    }
  };

  sendMessage = (type, payload?) => {
    // only send message when webview is loaded
    if (this.webViewRef) {
      console.log(`WebViewQuillEditor: sending message ${type}`);
      const data = JSON.stringify({ prefix: MESSAGE_PREFIX, type, payload });
      this.webViewRef.injectJavaScript(
        `document.dispatchEvent(new MessageEvent('message', { data: ${data} }))`
      );
    }
  };

  // get the contents of the editor.  The contents will be in the Delta format
  // defined here: https://quilljs.com/docs/delta/
  getDelta = () => {
    this.sendMessage("GET_DELTA");
  };

  showLoadingIndicator = () => {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator color="green" />
      </View>
    );
  };

  onError = error => {
    console.log("error :", error);
  };

  renderError = (errorDomain: string, errorCode: number, errorDesc: string) => {
    return (
      <View>
        <Text>{errorDesc}</Text>
      </View>
    );
  };

  render = () => {
    return (
      <View style={{ flex: 1, overflow: "hidden" }}>
        {this.state.webviewContent ? (
          <WebView
            style={{ ...StyleSheet.absoluteFillObject }}
            ref={this.createWebViewRef}
            source={{ html: this.state.webviewContent }}
            onLoadEnd={this.onWebViewLoaded}
            onMessage={this.handleMessage}
            startInLoadingState={true}
            renderLoading={this.showLoadingIndicator}
            renderError={this.renderError}
            javaScriptEnabled={true}
            onError={this.onError}
            scalesPageToFit={false}
            mixedContentMode={"always"}
            domStorageEnabled={true}
          />
        ) : (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <ActivityIndicator />
          </View>
        )}
      </View>
    );
  };
}

/* WebViewQuillEditor.propTypes = {
  getDeltaCallback: PropTypes.func,
  onDeltaChangeCallback: PropTypes.func,
  backgroundColor: PropTypes.string,
  onLoad: PropTypes.func
};

// Specifies the default values for props:
WebViewQuillEditor.defaultProps = {
  theme: 'snow'
};
 */
const styles = StyleSheet.create({
  activityOverlayStyle: {
    ...StyleSheet.absoluteFillObject,
    display: "flex",
    justifyContent: "center",
    alignContent: "center",
    borderRadius: 0
  },
  activityIndicatorContainer: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 50,
    alignSelf: "center",
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 3
    },
    shadowRadius: 5,
    shadowOpacity: 1.0
  }
});

export default WebViewQuillEditor;
