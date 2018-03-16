/********************************************
 * WebViewQuillViewer.js
 * A Delta viewer suitable for viewing output from a Quill.js
 * editor.  The Delta format is discussed here: https://quilljs.com/docs/delta/
 * This component is useful for applications that must avoid using native code
 *
 */
import React from 'react';
import { View, ActivityIndicator, StyleSheet, WebView } from 'react-native';
import PropTypes from 'prop-types';
import renderIf from 'render-if';
import * as webViewDownloadHelper from './webViewDownloadHelper';
import { FileSystem } from 'expo';
import config from './config';

// path to the file that the webview will load
const INDEX_FILE_PATH = `${FileSystem.documentDirectory}${config.PACKAGE_NAME}/${config.PACKAGE_VERSION}/reactQuillViewer-index.html`;

// the files that will be downloaded
const FILES_TO_DOWNLOAD = [
	'https://raw.githubusercontent.com/reggie3/react-native-webview-quilljs/master/dist/reactQuillViewer-index.html',
	'https://raw.githubusercontent.com/reggie3/react-native-webview-quilljs/master/dist/viewer.bundle.js',
	'https://raw.githubusercontent.com/reggie3/react-native-webview-quilljs/master/dist/reactQuillEditor-index.html',
	'https://raw.githubusercontent.com/reggie3/react-native-webview-quilljs/master/dist/editor.bundle.js',
	'https://raw.githubusercontent.com/reggie3/react-native-webview-quilljs/master/dist/common.js'
];

const MESSAGE_PREFIX = 'react-native-webview-quilljs';

export default class WebViewQuillViewer extends React.Component {
	constructor() {
		super();
		this.webview = null;
		this.state = {
			webViewNotLoaded: true, // flag to show activity indicator
			webViewFilesNotAvailable: true
		};
	}

	componentDidMount = () => {
		this.downloadWebViewFiles(FILES_TO_DOWNLOAD);
	};

	downloadWebViewFiles = async (filesToDownload) => {
		if (!config.USE_LOCAL_FILES) {
			let downloadStatus = await webViewDownloadHelper.checkForFiles(
				config.PACKAGE_NAME,
				config.PACKAGE_VERSION,
				filesToDownload,
				this.webViewDownloadStatusCallBack
			);
			if (downloadStatus.success) {
				this.setState({ webViewFilesNotAvailable: false });
			} else if (!downloadStatus.success) {
				console.log(`unable to download html files: ${JSON.stringify(downloadStatus)}`);
				Alert.alert(
					'Error',
					`unable to download html files: ${JSON.stringify(downloadStatus)}`,
					[ { text: 'OK', onPress: () => console.log('OK Pressed') } ],
					{ cancelable: false }
				);
			} else {
				this.setState({ webViewFilesNotAvailable: false });
			}
		} else {
			this.setState({ webViewFilesNotAvailable: false });
		}
	};

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
					case 'VIEWER_LOADED':
						this.setState({ webViewNotLoaded: false });
						this.viewerLoaded();
						break;
					default:
						console.warn(`WebViewQuillViewer Error: Unhandled message type received "${msgData.type}"`);
				}
			}
		} catch (err) {
			console.warn(err);
			return;
		}
	};

	webViewLoaded = () => {
		console.log('Webview loaded');
		this.setState({ webViewNotLoaded: false });
		this.sendMessage('LOAD_VIEWER', {
			theme: this.props.theme
		});
	};

	viewerLoaded = () => {
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

	sendContentToViewer = (delta) => {
		this.sendMessage('SET_CONTENTS', {
			ops: delta.ops
		});
	};

	sendMessage = (type, payload) => {
		// only send message when webview is loaded
		if (this.webview) {
			console.log(`WebViewQuillViewer: sending message ${type}`);
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

	render = () => {
		return (
			<View
				style={{
					flex: 1
				}}
			>
				{renderIf(this.state.webViewFilesNotAvailable)(
					<View style={styles.activityOverlayStyle}>
						<View style={styles.activityIndicatorContainer}>
							<ActivityIndicator
								size="large"
								animating={this.state.webViewFilesNotAvailable}
								color="blue"
							/>
						</View>
					</View>
				)}
				{renderIf(!this.state.webViewFilesNotAvailable && config.USE_LOCAL_FILES)(
					<WebView
						style={{
							...StyleSheet.absoluteFillObject,
							padding: 10
						}}
						ref={this.createWebViewRef}
						source={require('./assets/dist/reactQuillViewer-index.html')}
						onLoadEnd={this.webViewLoaded}
						onMessage={this.handleMessage}
					/>
				)}
				{renderIf(!this.state.webViewFilesNotAvailable && !config.USE_LOCAL_FILES)(
					<WebView
						style={{
							...StyleSheet.absoluteFillObject,
							padding: 10
						}}
						ref={this.createWebViewRef}
						source={{ uri: INDEX_FILE_PATH }}
						onLoadEnd={this.webViewLoaded}
						onMessage={this.handleMessage}
					/>
				)}
				{renderIf(this.state.webViewNotLoaded && !this.state.webViewFilesNotAvailable)(
					<View style={styles.activityOverlayStyle}>
						<View style={styles.activityIndicatorContainer}>
							<ActivityIndicator size="large" animating={this.state.webViewNotLoaded} color="orange" />
						</View>
					</View>
				)}
			</View>
		);
	};
}

WebViewQuillViewer.propTypes = {
	contentToDisplay: PropTypes.object,
	theme: PropTypes.string
};

// Specifies the default values for props:
WebViewQuillViewer.defaultProps = {
	theme: 'bubble'
};

const styles = StyleSheet.create({
	activityOverlayStyle: {
		...StyleSheet.absoluteFillObject,
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
