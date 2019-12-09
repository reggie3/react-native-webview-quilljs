import React from "react";
import {
  StyleSheet,
  View,
  Platform,
  ActivityIndicator
} from "react-native";
import { Container, Header, Body, Title } from "native-base";
import WebViewQuill, { DeltaObject, WebViewQuillJSMessage } from "react-native-webview-quilljs";
import * as Font from "expo-font";

interface State {
  content: DeltaObject;
  editorHeight: number;
  viewerHeight: number;
  isLoadingComplete: boolean;
  hasLoadingStarted: boolean;
  viewerMessageDelta: DeltaObject;
}

export default class App extends React.Component<null, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      content: null,
      hasLoadingStarted: null,
      isLoadingComplete: null,
      viewerMessageDelta: {
        ops: [
          { insert: "This", attributes: { bold: true } },
          { insert: " is " },
          { insert: "react-native-webview-quill-js", attributes: { color: "#fcc" } }
        ]
      },
      editorHeight: 0,
      viewerHeight: 0
    };
  }

  componentDidMount = () => {
    Font.loadAsync({
      Roboto: require("native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf")
    }).then(res => {
      this.setState({ isLoadingComplete: true });
    });
    this.setState({ hasLoadingStarted: true });
  };

  onMessageReceived = (message: WebViewQuillJSMessage) => {
    const { instruction, payload } = message;
    if (payload.delta) {
      this.setState({ content: payload.delta });
    }
  };

  render() {
    if (!this.state.isLoadingComplete) {
      return <ActivityIndicator />;
    } else {
      return (
        <Container>
          <Header
            style={{
              paddingTop: Platform.OS === "android" ? 30 : 10,
              paddingBottom: 10
            }}
          >
            <Body>
              <Title>React Native Webview QuillJS V2 Demo</Title>
            </Body>
          </Header>
          <View style={{ flex: 1}}>
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
             /*    content={this.state.content} */
                height={this.state.viewerHeight}
                isReadOnly
              />
            </View>
          </View>
        </Container>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#ccccff",
    display: "flex"
  },
  statusBar: {
    height: 48,
    backgroundColor: "#9be1ff"
  }
});
