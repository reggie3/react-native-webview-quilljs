import React from "react";
import {
  StyleSheet,
  View,
  Platform,
  ActivityIndicator,
  Text
} from "react-native";
import { Container, Content, Header, Body, Title } from "native-base";
import WebViewQuill, {
  DeltaObject,
  WebViewQuillJSMessage
} from "react-native-webview-quilljs";
import * as Font from "expo-font";
import {default as BasicReactNativeComponent} from "basic-react-native-package";
import {default as BasicReactNativeTypescriptComponent} from "basic-react-native-typescript-package";

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
          <Content>
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            {/*  <View style={{ flex: 1, padding: 10, marginBottom: 15 }}>
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
            </View> */}
            <Text>In App</Text>
             <View>
              <BasicReactNativeComponent />
              <BasicReactNativeTypescriptComponent/>
              <WebViewQuill/>
            </View>  

          </View>
          </Content>
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
