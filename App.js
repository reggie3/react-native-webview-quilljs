import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import WebViewQuill from './WebViewQuill';

export default class App extends React.Component {
  getEditorContent=()=>{
    this.webViewQuill.getContent();
  }
  render() {
    return (
      <View
        style={{
          marginTop: 40,
          backgroundColor: `#dddddd`,
          flex: 1,
          padding: 10
        }}
      >
        <Text>react-native-webview-quilljs-test-app</Text>
        <View
          style={{
            flex: 1
          }}
        >
          <WebViewQuill ref={component => (this.webViewQuill = component)} />
          <View
            style={{
              display: 'flex',
              flex: 1
            }}
          >
            <Text>Spacing test</Text>
            <Button
              onPress={this.getEditorContent}
              title="Get Text"
              color="#841584"
              accessibilityLabel="Learn more about this purple button"
            />
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  }
});
