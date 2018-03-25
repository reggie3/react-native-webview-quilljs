import Quill from './quill.js';
import './quill.bubble.css';
import React from 'react';
import PropTypes from 'prop-types';
import renderIf from 'render-if';

const util = require('util');
const MESSAGE_PREFIX = 'react-native-webview-quilljs';
const SHOW_DEBUG_INFORMATION = false;
let messageQueue = [];
let messageCounter = 0;


export default class ReactQuillViewer extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			viewer: null,
			readyToSendNextMessage: true
		};
	}

	// print passed information in an html element; useful for debugging
	// since console.log and debug statements won't work in a conventional way
	printElement = (data) => {
		if (SHOW_DEBUG_INFORMATION) {
			if (typeof data === 'object') {
				let el = document.createElement('pre');
				el.innerHTML = util.inspect(data, { showHidden: false, depth: null });
				document.getElementById('messages').appendChild(el);
				console.log(JSON.stringify(data));
			} else if (typeof data === 'string') {
				let el = document.createElement('pre');
				el.innerHTML = data;
				document.getElementById('messages').appendChild(el);
				console.log(data);
			}
		}
	};

	componentDidMount() {
		if (document) {
			document.addEventListener('message', this.handleMessage), false;
		} else if (window) {
			window.addEventListener('message', this.handleMessage), false;
		} else {
			console.log('unable to add event listener');
		}
		this.printElement(`component mounted`);
	}

	// load the viewer.  Don't do it in componentMount so that we can pass a theme
	// to this component based on component props
	loadViewer = (theme) => {
		let that = this;
		this.printElement(`loading viewer, theme = ${theme}`);
		this.setState(
			{
				viewer: new Quill('#viewer', {
					readOnly: true,
					theme,
					bounds: '#Quill-Viewer-Container'
				})
			},
			() => {
				that.printElement(`viewer initialized`);
				that.addMessageToQueue('VIEWER_LOADED', {
					type: 'success'
				});
			}
		);
	};

	componentWillUnmount() {
		if (document) {
			document.removeEventListener('message', this.handleMessage);
		} else if (window) {
			window.removeEventListener('message', this.handleMessage);
		}
	}

	addMessageToQueue = (type, payload) => {
		messageQueue.push(
			JSON.stringify({
				messageID: messageCounter++,
				prefix: MESSAGE_PREFIX,
				type,
				payload
			})
		);
		this.printElement(`adding message ${messageCounter} to queue`);
		if (this.state.readyToSendNextMessage) {
			this.printElement(`sending message`);
			this.sendNextMessage();
		}
	};

	sendNextMessage = () => {
		if (messageQueue.length > 0) {
			const nextMessage = messageQueue.shift();
			this.printElement(`sending message ${nextMessage}`);
			window.postMessage(nextMessage, '*');
			this.setState({ readyToSendNextMessage: false });
		}
	};

	handleMessage = (event) => {
		this.printElement(`viewer received message`);
		this.printElement(
			util.inspect(event.data, {
				showHidden: false,
				depth: null
			})
		);

		let msgData;
		try {
			msgData = JSON.parse(event.data);
			if (msgData.hasOwnProperty('prefix') && msgData.prefix === MESSAGE_PREFIX) {
				// this.printElement(msgData);
				switch (msgData.type) {
					case 'LOAD_VIEWER':
						this.loadViewer(msgData.payload.theme);
						break;
					case 'SET_CONTENTS':
						this.state.viewer.setContents(msgData.payload.ops);
						break;
					case 'SET_HTML_CONTENTS':
						this.state.viewer.clipboard.dangerouslyPasteHTML(msgData.payload.html);
						break;
					case 'SET_BACKGROUND_COLOR':
						if (document) {
							this.printElement(`received SET_BACKGROUND_COLOR: ${msgData.payload.backgroundColor}`);
							document.getElementById('Quill-Viewer-Container').style.backgroundColor =
								msgData.payload.backgroundColor;
						}
						break;
					case 'MESSAGE_ACKNOWLEDGED':
						this.printElement(`received MESSAGE_ACKNOWLEDGED`);
						this.setState({ readyToSendNextMessage: true });
						this.sendNextMessage();
						break;
					default:
						printElement(`reactQuillViewer Error: Unhandled message type received "${msgData.type}"`);
				}
			}
		} catch (err) {
			this.printElement(`reactQuillViewer error: ${err}`);
			return;
		}
	};

	render() {
		return (
			<div
				id="Quill-Viewer-Container"
				style={{
					height: '100%',
					display: 'flex',
					flexDirection: 'column'
				}}
			>
				<div
					style={{
						height: '100%',
						display: 'flex',
						flexDirection: 'column',
						paddingVertical: 5
					}}
				>
					<div
						id="viewer"
						style={{
							fontSize: '20px',
							height: '100%'
						}}
					/>
				</div>
				{renderIf(SHOW_DEBUG_INFORMATION)(
					<div
						id="messages"
						style={{
							backgroundColor: 'orange',
							maxHeight: 200,
							overflow: 'auto',
							position: 'absolute',
							bottom: 0,
							left: 0,
							right: 0,
							fontSize: 10
						}}
					/>
				)}
			</div>
		);
	}
}
