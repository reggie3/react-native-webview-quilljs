import React from "react";
import {
  StyleSheet,
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView
} from "react-native";
import WebViewQuillJS from "react-native-webview-quilljs";

interface State {
  content: any;
  defaultContent: any;
}

export default class App extends React.Component<null, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      content: null,
      defaultContent: {
        ops: [
          { insert: "This", attributes: { bold: true } },
          { insert: " is " },
          {
            insert: "react-native-webview-quill-js",
            attributes: { color: "#fcc" }
          }
        ]
      }
    };
  }

  onMessageReceived = (message: any) => {
    const { instruction, payload } = message;
    if (payload?.delta) {
      this.setState({ content: payload.delta });
    }
  };

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>
            React Native Webview Leaflet Demo
          </Text>
        </View>
        <KeyboardAvoidingView
          style={{ flex: 1, padding: 5 }}
          behavior={Platform.OS == "ios" ? "padding" : "height"}
          enabled
        >
          <View style={{ flex: 1, padding: 10, marginBottom: 15 }}>
            <WebViewQuillJS
              defaultContent={this.state.defaultContent}
              backgroundColor={"#FAEBD7"}
              onMessageReceived={this.onMessageReceived}
            />
          </View>
          <View style={{ flex: 1 }}>
            <WebViewQuillJS
              backgroundColor={"#a0fbef"}
              content={this.state.content}
              isReadOnly
            />
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "aliceblue"
  },
  header: {
    height: 60,
    backgroundColor: "dodgerblue",
    paddingHorizontal: 10,
    paddingTop: 30,
    width: "100%"
  },
  headerText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600"
  }
});
