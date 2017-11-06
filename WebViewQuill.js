import React from './web/react.production.min.js';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview-messaging/WebView';
import PropTypes from 'prop-types';

export default class WebViewQuill extends React.Component {
  constructor() {
    super();

    this.state = {
      paymentAPIResponse: null,
      showGetNonceActivityIndicator: false,
      showSubmitPaymentActivityIndicator: false
    };
  }
  componentDidMount() {
    // register listeners to listen for events from the html
    // we'll receive a nonce once the requestPaymentMethodComplete is completed
    this.registerMessageListeners();
    console.log('wbvw braintree mounted');
  }

  registerMessageListeners = () => {
    const { messagesChannel } = this.webview;

    messagesChannel.on('RECEIVE_CONTENT', event => {
      console.log('RECEIVE_CONTENT');
      console.log(event.payload.deltaContent);      
    });

    messagesChannel.on('RECEIVE_HTML', event => {
      console.log('RECEIVE_HTML');
      //console.log(event.payload.HTML);  
      this.props.getHTMLCallback(event.payload.HTML)    
    });
  };

  getContent=(a)=>{
    console.log('getting contents');
    this.webview.emit('GET_CONTENT');
  }

  getHTML=(a)=>{
    console.log('getting HTML');
    this.webview.emit('GET_HTML');
  }

  render = () => {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: 'green',
        }}
      >
        <WebView
          onLoad={this.sendClientTokenToHTML}
          style={{
            flex: 1
          }}
          source={require('./dist/index.html')}
          ref={component => (this.webview = component)}
        />
      </View>
    );
  };
}

WebViewQuill.propTypes = {
  /* options: PropTypes.object,
    clientToken: PropTypes.string.isRequired,
    paymentAPIResponse: PropTypes.string.isRequired,
    nonceObtainedCallback: PropTypes.func.isRequired,
    navigationBackCallback: PropTypes.func */
};
