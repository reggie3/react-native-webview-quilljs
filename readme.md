# React Native Webview Quilljs

## Quill.js editor and viewer components with no native code for React Native apps. This is a purely JavaScript component based on @zenomaro's react-quill project (https://github.com/zenoamaro/react-quill/)

[![npm](https://img.shields.io/npm/v/react-native-webview-quilljs.svg)](https://www.npmjs.com/package/react-native-webview-quilljs)
[![npm](https://img.shields.io/npm/dm/react-native-webview-quilljs.svg)](https://www.npmjs.com/package/react-native-webview-quilljs)
[![npm](https://img.shields.io/npm/dt/react-native-webview-quilljs.svg)](https://www.npmjs.com/package/react-native-webview-quilljs)
[![npm](https://img.shields.io/npm/l/react-native-webview-quilljs.svg)](https://github.com/react-native-component/react-native-webview-quilljs/blob/master/LICENSE)

![Image](https://thumbs.gfycat.com/CelebratedSilentDromedary-size_restricted.gif)

## Try it in Expo

![QR Code](https://github.com/reggie3/react-native-webview-quilljs/blob/master/expo-qr-code.png)

[Link to Expo Project Page](https://expo.io/@reggie3/react-native-webview-quilljs)

## Installation

```
npm install --save react-native-webview-quilljs
```

or

```
yarn add react-native-webview-quilljs
```

and then

```
import {WebViewQuillEditor, WebViewQuillViewer} from 'react-native-webview-quilljs'
```

## Usage

This package can be used to create both an editor and a viewer

```javascript
// A Quill.js editor with the standard toolbar
<WebViewQuillJS
  defaultContent={this.state.defaultContent}
  backgroundColor={"#FAEBD7"}
  onMessageReceived={this.onMessageReceived}
/>

// A Quill.js viewer with no toolbar
<WebViewQuillJS
  backgroundColor={"#fffbef"}
  content={this.state.content}
  isReadOnly
/>
```

This component accepts the following props:

| property                          | required | type                                                        | purpose                                                                              |
| --------------------------------- | -------- | ----------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| backgroundColor                   | optional | string                                                      | The background color of the Quill Component                                          |
| content                           | optional | HTML, a Quill Delta, or a plain object representing a Delta | Content of a controlled viewer component                                             |
| defaultContent                    | optional | HTML, a Quill Delta, or a plain object representing a Delta | Inital value of an uncontrolled editor component                                     |
| doShowDebugMessages               | optional | boolean                                                     | Show debug messages from the Webview Component                                       |
| doShowQuillComponentDebugMessages | optional | boolean                                                     | Show debug messages from the contents of the Webview component                       |
| isReadOnly                        | optional | boolean                                                     | Editor or viewer component (false or true)                                           |
| onError                           | optional | function                                                    | Function called if the Webview component experiences an Error                        |
| onLoadEnd                         | optional | function                                                    | Function called when the Webview has finished loading                                |
| onLoadStart                       | optional | function                                                    | Function called if the Webview begins loading                                        |
| onMessageReceived                 | optional | function                                                    | Function called when the WebViewQuillJS component receives a message from the editor |

### Editor Messages & onMessageReceived function

A WebviewQuillJSMessage object is passed to the onMessageReceived function:

```javascript
export type WebviewQuillJSMessage = {
  event?: WebviewQuillJSEvents,
  msg?: string,
  error?: string,
  payload?: any
};
```

WebviewQuillJSEvents consists of the following enumerated values:

```javascript
export enum WebviewQuillJSEvents {
  QUILLJS_COMPONENT_MOUNTED = "QUILLJS_COMPONENT_MOUNTED",
  DOCUMENT_EVENT_LISTENER_ADDED = "DOCUMENT_EVENT_LISTENER_ADDED",
  WINDOW_EVENT_LISTENER_ADDED = "WINDOW_EVENT_LISTENER_ADDED",
  UNABLE_TO_ADD_EVENT_LISTENER = "UNABLE_TO_ADD_EVENT_LISTENER",
  DOCUMENT_EVENT_LISTENER_REMOVED = "DOCUMENT_EVENT_LISTENER_REMOVED",
  WINDOW_EVENT_LISTENER_REMOVED = "WINDOW_EVENT_LISTENER_REMOVED",

  // The following events correlate to the similarly named react-quill props
  // https://github.com/zenoamaro/react-quill/#props
  ON_CHANGE = "ON_CHANGE",
  ON_CHANGE_SELECTION = "ON_CHANGE_SELECTION",
  ON_FOCUS = "ON_FOCUS",
  ON_BLUR = "ON_BLUR",
  ON_KEY_PRESS = "ON_KEY_PRESS",
  ON_KEY_DOWN = "ON_KEY_DOWN",
  ON_KEY_UP = "ON_KEY_UP"
}
```

The `payload` object contains the values passed to by the corresponding react-quilljs prop functions here: https://github.com/zenoamaro/react-quill/#props

## Changelog

### 0.9.0

- Replace Expo dependency with expo-asset-utils

### 0.8.3

- Updated onChangeCallback to receive the changes, contents, and previous contents of the delta

### 0.8.0

- Removes the propType specification for contentToDisplay to address issue #19

### 0.6.5

- Added initial testing framework

### 0.6.0

- Removed requirement to download JavaScript files from GitHub in order for the package to work. JavaScript files are now inline with the HTML which enables the package to work without an Internet connection.

- Added getViewerCallback and getEditorCallback

### 0.4.4

- Changed HTTP path for files to be downloaded in preparation for potential inline JS bundling or Expo Packager bundling of files.

### 0.4.0

- Added "backgroundColor" props for both the WebViewQuillViewer and WebViewQuillEditor

### 0.3.20

- Added copy and paste of HTML

### 0.3.10

- Revert file access features from 0.3.0.

### 0.3.0

- Library no longer relies on accessing WebView files from the Internet. All files needed by both the Editor and Viewer are included with the packages.
- Fonts display correctly on iOS devices

### 0.2.5

- Added onContentChange property to Editor

### 2.0.0

- Add TypeScript support
- Switch to react-native-community/react-native-webview implementation
- Simplify event communication

## LICENSE

MIT
