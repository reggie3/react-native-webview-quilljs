/********************************************
 * WebViewQuillEditor.js
 * A Quill.js editor component for use in react-native
 * applications that need to avoid using native code
 *  
 */
import React from './web/react.production.min.js';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview-messaging/WebView';
import PropTypes from 'prop-types';
import renderIf from 'render-if';

export default class WebViewQuillEditor extends React.Component {
  constructor() {
    super();
    this.state = {
      showActivityIndicator: true // flag to show activity indicator
    };
  }
  componentDidMount() {
    // register listeners to listen for events from the html
    // we'll receive a nonce once the requestPaymentMethodComplete is completed
    this.registerMessageListeners();
  console.log('wbvw quill mounted');
  }

  registerMessageListeners = () => {
    const { messagesChannel } = this.webview;
    // receive a component mounted message from child so that we can turn
    // of the activity indicator

    messagesChannel.on('EDITOR_MOUNTED', event => {
      this.setState({ showActivityIndicator: false });
    });

    // receiving a Delta from the child editor
    messagesChannel.on('RECEIVE_DELTA', event => {
      // console.log('RECEIVE_HTML');
      // console.log(event.payload.HTML);
      this.props.getDeltaCallback(event.payload.delta);
    });
  };

  // send a delta to the child editor for display, parent should pass a full
  // Delta object with an 'ops' key pointing to an array of operations like so:
  /*
  {
    ops: [
      { insert: 'Hello\n' },
      { insert: 'This is colorful', attributes: { color: '#f00' } }
    ]
  };
  */
  sendContentToEditor = () => {
    if (this.props.hasOwnProperty('contentToDisplay')) {
      this.webview.emit('SET_CONTENTS', {
        payload: {
          delta: this.props.contentToDisplay
        }
      });
    }
  };

  // get the contents of the editor.  The contents will be in the Delta format
  // defined here: https://quilljs.com/docs/delta/
  getDelta = () => {
    this.webview.emit('GET_DELTA');
  };

  render = () => {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: 'green'
        }}
      >
        <WebView
          onLoad={this.sendContentToEditor}
          style={{
            flex: 1
          }}
          source={require('./dist/reactQuillEditor-index.html')}
          ref={component => (this.webview = component)}
        />
      </View>
    );
  };
}

WebViewQuillEditor.propTypes = {
  getDeltaCallback: PropTypes.func.isRequired,
  contentToDisplay: PropTypes.object
};

const styles = StyleSheet.create({
  activityOverlayStyle: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(150, 150, 150, .55)',
    marginHorizontal: 20,
    marginVertical: 60,
    display: 'flex',
    justifyContent: 'center',
    alignContent: 'center',
    borderRadius: 5
  },
  activityIndicatorContainer: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 50,
    alignSelf: 'center',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 3
    },
    shadowRadius: 5,
    shadowOpacity: 1.0
  }
});
