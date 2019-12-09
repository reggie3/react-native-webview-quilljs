import React, { ReactElement } from "react";
import {
  StyleSheet,
  View,
  NativeSyntheticEvent,
  ViewStyle
} from "react-native";
import { WebView } from "react-native-webview";
import DebugMessageBox from "./DebugMessageBox";
import { WebViewError } from "react-native-webview/lib/WebViewTypes";
import { DeltaOperation } from "quill";

export interface Props {
  backgroundColor?: string;
  containerStyle?: ViewStyle;
  debugMessages: string[];
  defaultValue?: string | DeltaOperation[];
  doShowDebugMessages?: boolean;
  handleMessage: (data: string) => void;
  webviewContent?: string;
  loadingIndicator?: () => ReactElement;
  onError?: (syntheticEvent: NativeSyntheticEvent<WebViewError>) => void;
  onLayout?: (event: any) => void;
  onLoadEnd?: () => void;
  onLoadStart?: () => void;
  setWebViewRef?: (ref: WebView) => void;
  style?: ViewStyle;
}

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
}: Props) => {
  /* return (
    <View
      onLayout={onLayout}
      style={{
        ...StyleSheet.absoluteFillObject,
        flex: 1,
        backgroundColor: 'orange'
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
          /*  renderLoading={loadingIndicator || null} 
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
  ); */
  return(
    <>
    </>
  )
};

export default WebViewQuillView;
