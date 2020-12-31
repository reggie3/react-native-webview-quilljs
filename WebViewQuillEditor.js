/********************************************
 * WebViewQuillEditor.js
 * A Quill.js editor component for use in react-native
 * applications that need to avoid using native code
 *
 */
import React from 'react';
import { ActivityIndicator, Alert, Linking, Platform, StyleSheet, View, } from 'react-native';
import PropTypes from 'prop-types';
import WebView from 'react-native-webview';
import Toast from "react-native-root-toast";

// path to the file that the webview will load

const requiredAsset = Platform.OS === 'ios' ? require(`./assets/quill/reactQuillEditor-index.html`)
    : {uri: 'file:///android_asset/quill/reactQuillEditor-index.html'};
// const INDEX_FILE_ASSET_URI = Asset.fromModule(require(EDITOR_INDEX_FILE_PATH)).uri;
const MESSAGE_PREFIX = 'react-native-webview-quilljs';

export default class WebViewQuillEditor extends React.Component {
    constructor(props) {
        super(props);
        this.webview = null;
        this.state = {
            webViewNotLoaded: true, // flag to show activity indicator,
            asset: undefined
        };
        this.isSignatureURL = props.isSignatureURL === undefined ? true : props.isSignatureURL;
    }

    componentDidMount() {
        try {
            const asset = requiredAsset;
            console.log({asset})
            this.setState({asset})
        } catch (error) {
            console.log({error})
        }
    };

    createWebViewRef = (webview) => {
        this.webview = webview;
    };

    handleMessage = (event) => {
        let msgData;
        try {
            msgData = JSON.parse(event.nativeEvent.data);
            if (
                msgData.hasOwnProperty('prefix') &&
                msgData.prefix === MESSAGE_PREFIX
            ) {
                console.log(`WebViewQuillEditor: received message ${msgData.type}`);
                this.sendMessage('MESSAGE_ACKNOWLEDGED');
                console.log(`WebViewQuillEditor: sent MESSAGE_ACKNOWLEDGED`);

                switch (msgData.type) {
                    case 'EDITOR_LOADED':
                        this.editorLoaded();
                        break;
                    case 'EDITOR_SENT':
                        this.props.getEditorCallback(msgData.payload.editor);
                        break;
                    case 'TEXT_CHANGED':
                        if (this.props.onDeltaChangeCallback) {
                            delete msgData.payload.type;
                            let {
                                deltaChange,
                                delta,
                                deltaOld,
                                changeSource
                            } = msgData.payload;
                            this.props.onDeltaChangeCallback(
                                deltaChange,
                                deltaChange,
                                deltaOld,
                                changeSource
                            );
                        }
                        break;
                    case 'RECEIVE_DELTA':
                        if (this.props.getDeltaCallback)
                            this.props.getDeltaCallback(msgData.payload);
                        break;
                    case 'OPEN_LINK':
                        this._openLink(msgData.payload);
                        break;
                    case 'TO_CHOOSE_PIC':
                        const {toChoosePic} = this.props;
                        toChoosePic && toChoosePic();
                        break;
                    case 'ADD_LINK':
                        this._showAddLink();
                        break;
                    case 'START_SIGNATURE_URL_NOTICE':
                        const { toStartSignatureUrl } = this.props;
                        toStartSignatureUrl && toStartSignatureUrl();
                        break;
                    default:
                        console.warn(
                            `WebViewQuillEditor Error: Unhandled message type received "${
                                msgData.type
                                }"`
                        );
                }
            }
        } catch (err) {
            console.warn(err);
            return;
        }
    };

    onWebViewLoaded = () => {
        console.log('Webview loaded');
        this.setState({webViewNotLoaded: false});
        this.sendMessage('LOAD_EDITOR');
        if (this.props.hasOwnProperty('backgroundColor')) {
            this.sendMessage('SET_BACKGROUND_COLOR', {
                backgroundColor: this.props.backgroundColor
            });
        }
        if (this.props.hasOwnProperty('onLoad')) {
            this.props.onLoad();
        }
        if (this.props.hasOwnProperty('getEditorCallback')) {
            this.sendMessage('SEND_EDITOR');
        }
        if (this.props.hasOwnProperty('contentToDisplay')) {
            this.props.contentToDisplay();
        }
    };

    editorLoaded = () => {
        // send the content to the editor if we have it
        if (this.props.hasOwnProperty('contentToDisplay')) {
            console.log(this.props.contentToDisplay);
            this.sendMessage('SET_CONTENTS', {
                delta: this.props.contentToDisplay
            });
        }
        if (this.props.hasOwnProperty('htmlContentToDisplay')) {
            this.sendMessage('SET_HTML_CONTENTS', {
                html: this.props.htmlContentToDisplay
            });
        }
    };

    sendMessage = (type, payload) => {
        // only send message when webview is loaded
        if (this.webview) {
            console.log(`WebViewQuillEditor: sending message ${type}`);
            this.webview.postMessage(
                JSON.stringify({
                    prefix: MESSAGE_PREFIX,
                    type,
                    payload
                }),
                '*'
            );
        }
    };

    // get the contents of the editor.  The contents will be in the Delta format
    // defined here: https://quilljs.com/docs/delta/
    getDelta = () => {
        this.sendMessage('GET_DELTA');
    };

    choosePicOnFinish = (url) => {
        this.sendMessage('CHOOSE_PIC_ONFINISH', {url: url});
    };

    contentToDisplay = (content) => {
        this.sendMessage('SET_CONTENTS', content);
    };
    showLoadingIndicator = () => {
        return (
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <ActivityIndicator color="green" />
            </View>
        );
    };

    onError = (error) => {
        Alert.alert('WebView onError', error, [
            {text: 'OK', onPress: () => console.log('OK Pressed')}
        ]);
    };

    renderError = (error) => {
        Alert.alert('WebView renderError', error, [
            {text: 'OK', onPress: () => console.log('OK Pressed')}
        ]);
    };

    render = () => {
        const INJECTEDJAVASCRIPT = `const meta = document.createElement('meta'); 
            meta.setAttribute('content', 'initial-scale=1, maximum-scale=1, user-scalable=0'); 
            meta.setAttribute('name', 'viewport'); 
            document.getElementsByTagName('head')[0].appendChild(meta);`
        if (this.state.asset) {
            return (
                <View style={{flex: 1, overflow: 'hidden'}}>
                    <WebView
                        style={{...StyleSheet.absoluteFillObject}}
                        ref={this.createWebViewRef}
                        source={this.state.asset}
                        onLoadEnd={this.onWebViewLoaded}
                        onMessage={this.handleMessage}
                        startInLoadingState={true}
                        renderLoading={this.showLoadingIndicator}
                        renderError={this.renderError}
                        javaScriptEnabled={true}
                        onError={this.onError}
                        scalesPageToFit={false}
                        mixedContentMode={'always'}
                        domStorageEnabled={true}
                        originWhitelist={["*"]}
                        injectedJavaScript={ INJECTEDJAVASCRIPT }
                    />
                </View>
            );
        }
        return (
            <View
                style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}
            >
                <ActivityIndicator color="red" />
            </View>
        )
    };


    _openLink = (url) => {
        Linking.openURL(url).catch((err) => Toast.show(err.message));
    };

    _showAddLink = () => {
        const {showAddLinkDialog} = this.props;
        showAddLinkDialog && showAddLinkDialog();
    }

    _insertLink = (data) => {
        this.sendMessage('INSERT_LINK', {data: data});
    };


    _singatureURL = (data) => {
        const type =  this.isSignatureURL ? 'SINGURE_URL' : 'CHOOSE_PIC_ONFINISH';
        const msgData = this.isSignatureURL ? {'data': data} : {url: data.url};
        this.sendMessage(type, msgData);
    };

    _toStartSingatureURL = (data) => {
        this.isSignatureURL && this.sendMessage('START_SIGNATURE_URL_ACTION', {data: data});
    }
}

WebViewQuillEditor.propTypes = {
    getDeltaCallback: PropTypes.func,
    onDeltaChangeCallback: PropTypes.func,
    backgroundColor: PropTypes.string,
    onLoad: PropTypes.func,
    contentToDisplay: PropTypes.func,
    toChoosePic: PropTypes.func,
    showAddLinkDialog: PropTypes.func,
    toStartSignatureUrl: PropTypes.func,
    isSignatureURL: PropTypes.bool
};

// Specifies the default values for props:
WebViewQuillEditor.defaultProps = {
    theme: 'snow'
};

const styles = StyleSheet.create({
    activityOverlayStyle: {
        ...StyleSheet.absoluteFillObject,
        display: 'flex',
        justifyContent: 'center',
        alignContent: 'center',
        borderRadius: 0
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
