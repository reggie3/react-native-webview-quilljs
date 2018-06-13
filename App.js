import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { Constants } from 'expo';
import WebViewQuillEditor from './WebViewQuillEditor';
import WebViewQuillViewer from './WebViewQuillViewer';

// example content to display
/* const contentToDisplay = {
  ops: [{ insert: 'Hello\n' }, { insert: 'This is another line' }]
}; */

export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      editorMessageDelta:[
        { insert: 'Hello World' },
        { insert: '!', attributes: { bold: true }}
      ],
      viewerMessageDelta: [
        { insert: 'Gandalf', attributes: { bold: true } },
        { insert: ' the ' },
        { insert: 'Grey', attributes: { color: '#ccc' } }
      ]
    };
  }

  getEditorDelta = () => {
    this.webViewQuillEditor.getDelta();
  };

  getDeltaCallback = response => {
    console.log('getDeltaCallback');
    console.log(response.delta);
    this.webViewQuillViewer.sendContentToViewer(response.delta);
  };

  onDeltaChangeCallback = (delta, deltaChange, deltaOld, changeSource) => {
    console.log('onDeltaChangeCallback: ',{delta}, {deltaChange}, {deltaOld}, changeSource);
  };

  render() {
    return (
      <View
        style={{
          ...StyleSheet.absoluteFillObject,
          backgroundColor: '#e2e2e2'
        }}
      >
        <View style={styles.statusBar} />
        <Text
          style={{
            paddingHorizontal: 10,
            paddingVertical: 5,
            fontSize: 20,
            backgroundColor: '#9be1ff',
            color: 'black'
          }}
        >
          React Native Webview Quill-js
        </Text>
        <View
          style={{
            flex: 1,
            padding: 5,
            backgroundColor: 'rgba(100, 100, 255, 1)'
          }}
        >
          <WebViewQuillEditor
            ref={component => (this.webViewQuillEditor = component)}
            getDeltaCallback={this.getDeltaCallback}
            onDeltaChangeCallback={this.onDeltaChangeCallback}
            backgroundColor={'#fffbea'}
            contentToDisplay={this.state.editorMessageDelta}
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
        <View
          style={{
            flex: 1,
            padding: 5,
            backgroundColor: 'rgba(255, 255, 100, 1)'
          }}
        >
          <WebViewQuillViewer
            ref={component => (this.webViewQuillViewer = component)}
            contentToDisplay={this.state.viewerMessageDelta}
            backgroundColor={'#fffbea'}

          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#ccccff',
    display: 'flex'
  },
  statusBar: {
    height: Constants.statusBarHeight,
    backgroundColor: '#9be1ff'
  }
});
