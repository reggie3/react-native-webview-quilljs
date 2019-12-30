import React from "react";
import { StyleSheet, View } from "react-native";
import { WebView } from "react-native-webview";
import DebugMessageBox from "./DebugMessageBox";

const WebViewQuillView = ({
  backgroundColor,
  containerStyle,
  debugMessages,
  doShowDebugMessages,
  handleMessage,
  webviewContent,
  loadingIndicator,
  onError,
  onLayout,
  onLoadEnd,
  onLoadStart,
  setWebViewRef,
  style
}) => {
  return (
    <View
      onLayout={onLayout}
      style={{
        ...StyleSheet.absoluteFillObject,
        flex: 1,
        backgroundColor
      }}
    >
      {webviewContent && (
        // @ts-ignore
        <WebView
          allowFileAccess={true}
          containerStyle={containerStyle}
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
          onError={onError}
          originWhitelist={["*"]}
          renderLoading={loadingIndicator || null}
          domStorageEnabled={true}
          startInLoadingState={true}
          source={{
            html: webviewContent
          }}
          style={style}
        />
      )}
      <DebugMessageBox
        debugMessages={debugMessages}
        doShowDebugMessages={doShowDebugMessages}
      />
    </View>
  );
};

export default WebViewQuillView;
