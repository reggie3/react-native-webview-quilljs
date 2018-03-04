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
    this.webViewQuillViewer = null;
    this.webViewQuillEditor = null;
    this.state = {
      messageDelta: {}
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

  onDeltaChangeCallback = delta => {
    console.log('onDeltaChangeCallback: ', delta);
  };

  onLoadViewer=(a,b,c)=>{
    debugger;
  }

  onLoadEditor=(a,b,c)=>{
    debugger;
  }

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
            padding: 5
          }}
        >
          <WebViewQuillEditor
            ref={component => (
              this.webViewQuillEditor = component)}
            getDeltaCallback={this.getDeltaCallback}
            onDeltaChangeCallback={this.onDeltaChangeCallback}
            onLoad={this.onLoadEditor}
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
            color="#841584"
            accessibilityLabel="Learn more about this purple button"
          />
        </View>
        <View
          style={{
            flex: 1,
            padding: 5
          }}
        >
          <WebViewQuillViewer
            ref={component => (this.webViewQuillViewer = component)}
            contentToDisplay={this.state.messageDelta}
            onLoad={this.onLoadViewer}
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
