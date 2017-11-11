import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import {WebViewQuillEditor, WebViewQuillViewer} from 'react-native-webview-quilljs';

// example content to display
const contentToDisplay = {
  ops: [
    { insert: 'Hello\n' },
    { insert: 'This is another line' }
  ]
};

export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      messageHTML: '',
      messageDelta: {}
    };
  }

  getEditorDelta = () => {
    this.webViewQuillEditor.getDelta();
  };

  getDeltaCallback = delta => {
    console.log('getDeltaCallback');
    console.log(delta);
    this.webViewQuillViewer.sendContentToViewer(delta);
  };

  render() {
    return (
      <View
        style={{
             ...StyleSheet.absoluteFillObject,
             padding: 5,
             marginTop: 15             
        }}
      >
        <Text>react-native-webview-quilljs-test-app</Text>
        <View
          style={{
            flex: 1
          }}
        >
          <WebViewQuillEditor
            ref={component => (this.webViewQuillEditor = component)}
            getDeltaCallback={this.getDeltaCallback}
            contentToDisplay={contentToDisplay}
          />
        </View>
        <View
          style={{
            marginVertical: 5
          }}
        >
          <Button
            onPress={this.getEditorDelta}
            title="Get Text"
            color="#841584"
            accessibilityLabel="Learn more about this purple button"
          />
        </View>
        <View
          style={{
            backgroundColor: 'goldenrod',
            flex: 1
          }}
        >
          <WebViewQuillViewer
            ref={component => (this.webViewQuillViewer = component)}
            contentToDisplay={this.state.messageDelta}
          />
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
