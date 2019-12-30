import React from "react";
import {
  StyleSheet,
  View,
  Platform,
  ActivityIndicator,
  Text
} from "react-native";
import { WebViewQuill } from "react-native-webview-quilljs";
import BasicReactNativeTypescriptComponent from "basic-react-native-typescript-package";
import * as Font from "expo-font";
import { default as BasicReactNativeComponent } from "basic-react-native-package";
import { WebView } from "react-native-webview";
import { default as BasicJavascriptWebView } from "basic-javascript-webview-package";
// import html from "./html";
interface State {
  //content: DeltaObject;
  editorHeight: number;
  viewerHeight: number;
  isLoadingComplete: boolean;
  hasLoadingStarted: boolean;
  //viewerMessageDelta: DeltaObject;
}

export default class App extends React.Component<null, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      //  content: null,
      hasLoadingStarted: null,
      isLoadingComplete: null,
      /*  viewerMessageDelta: {
        ops: [
          { insert: "This", attributes: { bold: true } },
          { insert: " is " },
          {
            insert: "react-native-webview-quill-js",
            attributes: { color: "#fcc" }
          }
        ]
      }, */
      editorHeight: 0,
      viewerHeight: 0
    };
  }

  onMessageReceived = (/* message: WebViewQuillJSMessage */) => {
    /*  const { instruction, payload } = message;
    if (payload.delta) {
      this.setState({ content: payload.delta });
    } */
  };

  render() {
    debugger;
    return (
      <View style={StyleSheet.absoluteFill}>
        <View
          style={{
            backgroundColor: "dodgerblue",
            paddingTop: Platform.OS === "android" ? 30 : 10,
            paddingBottom: 10,
            height: 60,
            width: "100%"
          }}
        >
          <Text style={{ color: "white" }}>
            React Native Webview QuillJS V2 Demo
          </Text>
        </View>
        {/* <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center"
              }}
            > */}
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
        {/* <Text>In App</Text>
              <View style={{ backgroundColor: "gray" }}>
                <BasicReactNativeComponent />
                
              </View>
              <View style={{ flex: 1,backgroundColor: "green" }}> */}

        {/*  <BasicReactNativeTypescriptComponent /> */}
        {/*  <WebViewQuill /> */}
        {/*  <BasicJavascriptWebView /> */}
        <WebView
          originWhitelist={["*"]}
          source={{
            html: `<html>
            <body>
              <div id="root"></div>
              <script
                crossorigin
                src="https://unpkg.com/react@16/umd/react.development.js"
              ></script>
              <script
                crossorigin
                src="https://unpkg.com/react-dom@16/umd/react-dom.development.js"
              ></script>
              <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
              <script type="text/babel">
                ReactDOM.render(<p>hello from react</p>, document.getElementById("root"));
              </script>
            </body>
          </html>
          `
          }}
          onError={syntheticEvent => {
            const { nativeEvent } = syntheticEvent;
            console.warn("WebView error: ", nativeEvent);
          }}
        />
      </View>
    );
  }
}
