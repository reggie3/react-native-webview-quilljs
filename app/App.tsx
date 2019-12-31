import React from "react";
import {
  StyleSheet,
  View,
  Platform,
  ActivityIndicator,
  Text
} from "react-native";
import WebViewQuill, {
  DeltaObject,
  WebViewQuillJSMessage
} from "react-native-webview-quilljs";
import * as Font from "expo-font";

interface State {
  content: DeltaObject;
  editorHeight: number;
  viewerHeight: number;
  viewerMessageDelta: DeltaObject;
}

export default class App extends React.Component<null, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      content: null,
      viewerMessageDelta: {
        ops: [
          { insert: "This", attributes: { bold: true } },
          { insert: " is " },
          {
            insert: "react-native-webview-quill-js",
            attributes: { color: "#fcc" }
          }
        ]
      },
      editorHeight: 0,
      viewerHeight: 0
    };
  }

  onMessageReceived = (message: WebViewQuillJSMessage) => {
    const { instruction, payload } = message;
    if (payload.delta) {
      this.setState({ content: payload.delta });
    }
  };

  render() {
    return (
      <View>
        <View
          style={{
            backgroundColor: "dodgerblue",
            paddingTop: Platform.OS === "android" ? 30 : 10,
            paddingBottom: 10
          }}
        >
          <Text>React Native Webview QuillJS V2 Demo</Text>
        </View>
        <View style={{ flex: 1 }}>
          <View style={{ flex: 1, padding: 10, marginBottom: 15 }}>
            <WebViewQuill
              backgroundColor={"#FAEBD7"}
              doShowDebugMessages={false}
              doShowQuillComponentDebugMessages={false}
              height={this.state.editorHeight}
              onMessageReceived={this.onMessageReceived}
            />
          </View>
          <View style={{ flex: 1 }}>
            <WebViewQuill
              backgroundColor={"#fffbea"}
              defaultValue={this.state.viewerMessageDelta}
              doShowDebugMessages={false}
              doShowQuillComponentDebugMessages={true}
              height={this.state.viewerHeight}
              isReadOnly
            />
          </View>
        </View>
      </View>
    );
  }
}
