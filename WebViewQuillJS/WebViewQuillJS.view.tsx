import React, { ReactElement } from "react";
// @ts-ignore
import { StyleSheet, View, NativeSyntheticEvent } from "react-native";
import { WebView } from "react-native-webview";
import DebugMessageBox from "./DebugMessageBox";
import { WebViewError } from "react-native-webview/lib/WebViewTypes";

export interface Props {
  backgroundColor: string;
  debugMessages: string[];
  doShowDebugMessages: boolean;
  handleMessage: (data: string) => void;
  webviewContent: string;
  loadingIndicator: () => ReactElement;
  onError: (syntheticEvent: NativeSyntheticEvent<WebViewError>) => void;
  onLoadEnd: () => void;
  onLoadStart: () => void;
  setWebViewRef: (ref: WebView) => void;
}

class WebViewQuillJSView extends React.Component<Props> {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      backgroundColor,
      debugMessages,
      doShowDebugMessages,
      handleMessage,
      webviewContent,
      loadingIndicator,
      onError,
      onLoadEnd,
      onLoadStart,
      setWebViewRef
    } = this.props;
    return (
      <View
        style={{
          ...StyleSheet.absoluteFillObject,
          flex: 1,
          backgroundColor: backgroundColor
        }}
      >
        {webviewContent ? (
          <WebView
            containerStyle={{
              flex: 0,
              height: "100%",
              width: "100%"
            }}
            ref={component => {
              setWebViewRef(component);
            }}
            javaScriptEnabled={true}
            onLoadEnd={onLoadEnd}
            onLoadStart={onLoadStart}
            onMessage={event => {
              if (event && event.nativeEvent && event.nativeEvent.data) {
                handleMessage(event.nativeEvent.data);
              }
            }}
            domStorageEnabled={true}
            startInLoadingState={true}
            onError={onError}
            originWhitelist={["*"]}
            renderLoading={loadingIndicator || null}
            source={{
              html: webviewContent
            }}
            allowFileAccess={true}
            allowUniversalAccessFromFileURLs={true}
            allowFileAccessFromFileURLs={true}
          />
        ) : null}
        <DebugMessageBox
          debugMessages={debugMessages}
          doShowDebugMessages={doShowDebugMessages}
        />
      </View>
    );
  }
}

export default WebViewQuillJSView;
