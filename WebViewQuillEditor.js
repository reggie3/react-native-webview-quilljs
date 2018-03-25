/********************************************
 * WebViewQuillEditor.js
 * A Quill.js editor component for use in react-native
 * applications that need to avoid using native code
 *
 */
import React from 'react';
import { View, ActivityIndicator, StyleSheet, WebView, Alert } from 'react-native';
import PropTypes from 'prop-types';
import renderIf from 'render-if';

// path to the file that the webview will load
const INDEX_FILE = require(`./assets/assets/dist/reactQuillEditor-index.html`);

const MESSAGE_PREFIX = 'react-native-webview-quilljs';

export default class WebViewQuillEditor extends React.Component {
	constructor() {
		super();
		this.state = {
			webViewNotLoaded: true, // flag to show activity indicator
			webViewFilesNotAvailable: true
		};
	}

	createWebViewRef = (webview) => {
		this.webview = webview;
	};

	handleMessage = (event) => {
		let msgData;
		try {
			msgData = JSON.parse(event.nativeEvent.data);
			if (msgData.hasOwnProperty('prefix') && msgData.prefix === MESSAGE_PREFIX) {
				// console.log(`WebViewQuillEditor: received message ${msgData.type}`);
				this.sendMessage('MESSAGE_ACKNOWLEDGED');
				// console.log(`WebViewQuillEditor: sent MESSAGE_ACKNOWLEDGED`);

				switch (msgData.type) {
					case 'EDITOR_LOADED':
						this.editorLoaded();
						break;
					case 'TEXT_CHANGED':
						if (this.props.onDeltaChangeCallback) this.props.onDeltaChangeCallback(msgData.payload.delta);
						break;
					case 'RECEIVE_DELTA':
						if (this.props.getDeltaCallback) this.props.getDeltaCallback(msgData.payload);
						break;
					default:
						console.warn(`WebViewQuillEditor Error: Unhandled message type received "${msgData.type}"`);
				}
			}
		} catch (err) {
			console.warn(err);
			return;
		}
	};

	onWebViewLoaded = () => {
		console.log('Webview loaded');
		this.setState({ webViewNotLoaded: false });
		this.sendMessage('LOAD_EDITOR', {
			theme: this.props.theme
		});
		if (this.props.hasOwnProperty('backgroundColor')) {
			this.sendMessage('SET_BACKGROUND_COLOR', {
				backgroundColor: this.props.backgroundColor
			});
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
			// console.log(`WebViewQuillEditor: sending message ${type}`);
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

	showLoadingIndicator = () => {
		return (
			<View style={styles.activityOverlayStyle}>
				<View style={styles.activityIndicatorContainer}>
					<ActivityIndicator size="large" animating={this.state.webViewNotLoaded} color="green" />
				</View>
			</View>
		);
	};

	onError = (error) => {
		Alert.alert('WebView onError', error, [ { text: 'OK', onPress: () => console.log('OK Pressed') } ]);
	};

	renderError = (error) => {
		Alert.alert('WebView renderError', error, [ { text: 'OK', onPress: () => console.log('OK Pressed') } ]);
	};

	render = () => {
		return (
			<View
				style={{
					flex: 1
				}}
			>
					<WebView
					style={{ ...StyleSheet.absoluteFillObject }}
						ref={this.createWebViewRef}
						source={INDEX_FILE}
						onLoadEnd={this.onWebViewLoaded}
						onMessage={this.handleMessage}
						startInLoadingState={true}
						renderLoading={this.showLoadingIndicator}
						renderError={this.renderError}
						javaScriptEnabled={true}
						onError={this.onError}
						scalesPageToFit={false}
						mixedContentMode={'always'}
					/>
			</View>
		);
	};
}

WebViewQuillEditor.propTypes = {
	getDeltaCallback: PropTypes.func,
	contentToDisplay: PropTypes.object,
	onDeltaChangeCallback: PropTypes.func,
	backgroundColor: PropTypes.string
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
