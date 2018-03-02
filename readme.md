# React Native Webview Quilljs
## Quill.js editor and viewer components with no native code for React Native apps.

[![npm](https://img.shields.io/npm/v/react-native-webview-quilljs.svg)](https://www.npmjs.com/package/react-native-webview-quilljs)
[![npm](https://img.shields.io/npm/dm/react-native-webview-quilljs.svg)](https://www.npmjs.com/package/react-native-webview-quilljs)
[![npm](https://img.shields.io/npm/dt/react-native-webview-quilljs.svg)](https://www.npmjs.com/package/react-native-webview-quilljs)
[![npm](https://img.shields.io/npm/l/react-native-webview-quilljs.svg)](https://github.com/react-native-component/react-native-webview-quilljs/blob/master/LICENSE)


![Image](https://thumbs.gfycat.com/CelebratedSilentDromedary-size_restricted.gif)

## Try it in Expo
![QR Code](https://github.com/reggie3/react-native-webview-quilljs/blob/master/expo-qr-code.png)


[Link to Expo Project Page](https://expo.io/@reggie3/react-native-webview-quilljs)


## Installation
~~~
npm install --save react-native-webview-quilljs
~~~
or 
~~~
yarn add react-native-webview-quilljs
~~~

and then
~~~
import {WebViewQuillEditor, WebViewQuillViewer} from 'react-native-webview-quilljs'
~~~

## Usage
This package can be used to create both an editor and a viewer

Creating a Quill.js editor with the standard toolbar:
~~~~
 <WebViewQuillEditor
    ref={component => (this.webViewQuillEditor = component)}
    getDeltaCallback={this.getDeltaCallback}
    contentToDisplay={contentToDisplay}
    onLoad={this.onLoadCallback}
  />
~~~~

This component accepts the following props:
* ref
* getDeltaCallback
* contentToDisplay

| Name                   | Required      | Description |
| ---------------------- | ------------- | ----------- |
| ref            |    yes        | A reference to the editor componment to be used to retrieve its contents using     this.webViewQuillEditor.getDelta();
| getDeltaCallback  |    yes        | Function called in response to a call to this.webViewQuillEditor.getDelta().  It will receive a Delta object containing the contents of editor |
| contentToDisplay     |    no        | A Delta object that will be displayed by the editor when it mounts|
| onLoad | no| A function called when the Editor finishes loading |
| onDeltaChangeCallback | no | Function called when the contents of Quill editor have changed |


Creating a Delta viewer that can display content created with Quill.js:
~~~
<WebViewQuillViewer
    ref={component => (this.webViewQuillViewer = component)}
    contentToDisplay={this.state.messageDelta}
    onLoad={this.onLoadCallback}
  />
~~~

This component accepts the following props:
* ref
* contentToDisplay

| Name                   | Required      | Description |
| ---------------------- | ------------- | ----------- |
| ref            |    yes        | A reference to the editor componment to be used to update its contents using     this.webViewQuillViewer.sendContentToViewer(delta);
| contentToDisplay     |    no        | A Delta object that will be displayed by the viewer when it mounts|
|onLoad | no| A function called when the Editor finishes loading |




## LICENSE

MIT
