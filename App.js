import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import WebViewQuill from './WebViewQuill';

export default class App extends React.Component {
  render() {
    return (
      <View
        style={{
          paddingVertical: 40,
          paddingHorizontal: 20,
          backgroundColor: `#ffffff`,
          flex: 1
        }}
      >
        <Text>react-native-webview-quilljs-test-app</Text>
        <WebViewQuill />
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
