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
      viewerMessageDelta: [
        { insert: "Gandalf", attributes: { bold: true } },
        { insert: " the " },
        { insert: "Grey", attributes: { color: "#ccc" } }
      ]
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

  getEditorDelta = () => {
    this.webViewQuillEditor.getDelta();
  };

  getDeltaCallback = response => {
    console.log("getDeltaCallback");
    console.log(response.delta);
    this.webViewQuillViewer.sendContentToViewer(response.delta);
  };

  onContentChange = (html: string, delta: DeltaOperation[]) => {
    console.log("onContentChange: ", { html }, { delta });
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
                doShowDebugMessages
                getDeltaCallback={this.getDeltaCallback}
                onContentChange={this.onContentChange}
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
            <View style={{ flex: 1 }}>
              <WebViewQuill
                backgroundColor={"#fffbea"}
                defaultValue={this.state.viewerMessageDelta}
                getDeltaCallback={this.getDeltaCallback}
                isReadOnly
                onContentChange={this.onContentChange}
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
