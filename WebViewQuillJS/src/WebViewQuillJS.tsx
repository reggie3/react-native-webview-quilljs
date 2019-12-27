import { Text } from 'react-native'
import * as React from "react"
import { WebView } from 'react-native-webview';

const WebViewQuill= (props: any) => {
  /* return (
    <Text style={{color: 'orange'}} >Webview quill js in separate file now</Text>
  ) */

  return (
    <WebView source={{ uri: 'https://facebook.github.io/react-native/' }} />
  );
}

export default WebViewQuill;