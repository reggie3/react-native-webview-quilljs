import Quill from './quill.js';
import './quill.snow.css';
import React from 'react';
import PropTypes from 'prop-types';
import renderIf from 'render-if';

const util = require('util');
let updateCounter = 0;
const MESSAGE_PREFIX = 'react-native-webview-quilljs';
const SHOW_DEBUG_INFORMATION = true;
let messageQueue = [];
let messageCounter = 0;

export default class ReactQuillEditor extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			editor: null,
			debugMessages: [],
			readyToSendNextMessage: true
		};
	}
	// print passed information in an html element; useful for debugging
	// since console.log and debug statements won't work in a conventional way
	printElement = (data) => {
		if (this.state.SHOW_DEBUG_INFORMATION) {
			let message = '';
			if (typeof data === 'object') {
				message = util.inspect(data, { showHidden: false, depth: null })
			} else if (typeof data === 'string') {
				message = data;
			}
			this.setState({
				debugMessages:
					this.state.debugMessages.concat([message])
			});
			console.log(message)
		}
	};

	componentDidMount() {
		if (document) {
			document.addEventListener('message', this.handleMessage);
		} else if (window) {
			window.addEventListener('message', this.handleMessage);
		} else {
			console.log('unable to add event listener');
		}
		this.printElement(`component mounted`);
		// this.loadEditor();
	}

	addTextChangeEventToEditor = () => {
		let that = this;
		this.state.editor.on('text-change', (delta, oldDelta, source) => {
			that.addMessageToQueue('TEXT_CHANGED', {
				type: 'success',
				delta,
				oldDelta,
				source
			});
		});
	};

	loadEditor = (theme) => {
		let that = this;
		this.printElement(`loading editor, theme = ${theme}`);
		this.setState(
			{
				editor: new Quill('#editor', {
					theme,
					bounds: '#Quill-Editor-Container'
				})
			},
			() => {
				that.printElement(`editor initialized`);
				that.addMessageToQueue('EDITOR_LOADED', {
					type: 'success',
					delta: this.state.editor.getContents()
				});
				that.addTextChangeEventToEditor();
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
			if (document) {
				document.postMessage(nextMessage, '*');
			} else if (window) {
				window.postMessage(nextMessage, '*');
			} else {
				console.log('unable to add event listener');
			}
			this.setState({ readyToSendNextMessage: false });
		}
	};

	handleMessage = (event) => {
		this.printElement(`received message`);
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
					case 'LOAD_EDITOR':
						this.loadEditor(msgData.payload.theme);
						break;
					case 'SEND_EDITOR':
						this.addMessageToQueue('EDITOR_SENT', {editor: this.state.editor});
						break;
					case 'GET_DELTA':
						this.addMessageToQueue('RECEIVE_DELTA', {
							type: 'success',
							delta: this.state.editor.getContents()
						});
						break;
					case 'SET_CONTENTS':
						this.state.editor.setContents(msgData.payload.delta);
						break;
					case 'SET_HTML_CONTENTS':
						this.state.editor.clipboard.dangerouslyPasteHTML(msgData.payload.html);
						break;
					case 'SET_BACKGROUND_COLOR':
						if (document) {
							this.printElement(`received SET_BACKGROUND_COLOR: ${msgData.payload.backgroundColor}`);
							document.getElementById('Quill-Editor-Container').style.backgroundColor =
								msgData.payload.backgroundColor;
						}
						break;
					case 'MESSAGE_ACKNOWLEDGED':
						this.printElement(`received MESSAGE_ACKNOWLEDGED`);
						this.setState({ readyToSendNextMessage: true });
						this.sendNextMessage();
						break;
					default:
						printElement(`reactQuillEditor Error: Unhandled message type received "${msgData.type}"`);
				}
			}
		} catch (err) {
			this.printElement(`reactQuillEditor error: ${err}`);
			return;
		}
	};

	render() {
		return (
			<div
				id="Quill-Editor-Container"
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
						id="editor"
						style={{
							fontSize: '20px',
							height: 'calc(100% - 42px)'
						}}
					/>
				</div>
				{renderIf(this.state.SHOW_DEBUG_INFORMATION)(
					<div
						style={{
							backgroundColor: 'orange',
							maxHeight: 200,
							overflow: 'auto',
							padding: 5
						}}
						id="messages"
					>
						<ul>
							{this.state.debugMessages.map((message, index) => {
								return (<li key={index}>{message}</li>)
							})}
						</ul>
					</div>
				)}
			</div>
		);
	}
}
