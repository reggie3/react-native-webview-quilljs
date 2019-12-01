import React from "react";
import {
  StyleSheet,
  View,
  Button,
  Platform,
  ActivityIndicator
} from "react-native";
import { Container, Header, Body, Title } from "native-base";
import WebViewQuill from "react-native-webview-quilljs";
import { AppLoading } from "expo";
import * as Font from "expo-font";
import { DeltaOperation } from "quill";

// example content to display
/* const contentToDisplay = {
  ops: [{ insert: 'Hello\n' }, { insert: 'This is another line' }]
}; */

interface State {
  content: DeltaOperation[];
  editorHeight: number;
  viewerHeight: number;
  editorMessageDelta: any[];
  isLoadingComplete: boolean;
  hasLoadingStarted: boolean;
  viewerMessageDelta: any[];
}

export default class App extends React.Component<null, State> {
  webViewQuillEditor: any;
  webViewQuillViewer: any;
  constructor(props) {
    super(props);
    this.state = {
      editorMessageDelta: [
        { insert: "Hello World" },
        { insert: "!", attributes: { bold: true } }
      ],
      hasLoadingStarted: null,
      isLoadingComplete: null,
      viewerMessageDelta:{ ops:[
        { insert: "Gandalf", attributes: { bold: true } },
        { insert: " the " },
        { insert: "Grey", attributes: { color: "#ccc" } }
      ]},
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
          <View style={{ flex: 1, backgroundColor: "#bbffbb", padding: 5 }}>
            <View style={{ flex: 1, padding: 10 }}>
              <WebViewQuill
                backgroundColor={"#ffbbea"}
                contentToDisplay={this.state.editorMessageDelta}
                doShowDebugMessages={false}
                doShowQuillComponentDebugMessages={true}
                height={this.state.editorHeight}
                onMessageReceived={this.onMessageReceived}
                ref={component => (this.webViewQuillEditor = component)}
              />
            </View>
            <View
              style={{
                margin: 5
              }}
            >
              <Button
                onPress={this.getEditorDelta}
                title="Get Text"
                color="#4286f4"
                accessibilityLabel="Click this button to copy text from the editor to the viewer"
              />
            </View>
            <View style={{ flex: 1 }} onLayout={this.onLayoutEditor}>
              <WebViewQuill
                backgroundColor={"#fffbea"}
                defaultValue={this.state.viewerMessageDelta}
                doShowDebugMessages={false}
                doShowQuillComponentDebugMessages={true}
                content={this.state.content}
                height={this.state.viewerHeight}
                isReadOnly
                onMessageReceived={this.onMessageReceived}
                ref={component => (this.webViewQuillEditor = component)}
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
