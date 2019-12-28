import { Text } from 'react-native'
import React from "react"
import { WebView } from 'react-native-webview';

export default (props) => {
  return (
    <WebView source={{ uri: 'https://facebook.github.io/react-native/' }} />
  );
}