webpackJsonp([1],{

/***/ 29:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _reactDom = __webpack_require__(11);

var _reactDom2 = _interopRequireDefault(_reactDom);

var _reactQuillEditor = __webpack_require__(38);

var _reactQuillEditor2 = _interopRequireDefault(_reactQuillEditor);

var _react = __webpack_require__(3);

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_reactDom2.default.render(_react2.default.createElement(_reactQuillEditor2.default, null), document.getElementById("root"));

/***/ }),

/***/ 38:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _quill = __webpack_require__(20);

var _quill2 = _interopRequireDefault(_quill);

__webpack_require__(44);

var _react = __webpack_require__(3);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(10);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _glamorous = __webpack_require__(24);

var _glamorous2 = _interopRequireDefault(_glamorous);

var _renderIf = __webpack_require__(27);

var _renderIf2 = _interopRequireDefault(_renderIf);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var util = __webpack_require__(28);
var updateCounter = 0;
var MESSAGE_PREFIX = 'react-native-webview-quilljs';
var SHOW_DEBUG_INFORMATION = true;
var messageQueue = [];
var messageCounter = 0;

var MessagesDiv = _glamorous2.default.div({
	backgroundColor: 'orange',
	maxHeight: 200,
	overflow: 'auto',
	position: 'absolute',
	bottom: 0,
	left: 0,
	right: 0,
	fontSize: 10
});

var ReactQuillEditor = function (_React$Component) {
	_inherits(ReactQuillEditor, _React$Component);

	function ReactQuillEditor(props) {
		_classCallCheck(this, ReactQuillEditor);

		var _this = _possibleConstructorReturn(this, (ReactQuillEditor.__proto__ || Object.getPrototypeOf(ReactQuillEditor)).call(this, props));

		_this.printElement = function (data) {
			if (SHOW_DEBUG_INFORMATION) {
				if ((typeof data === 'undefined' ? 'undefined' : _typeof(data)) === 'object') {
					var el = document.createElement('pre');
					el.innerHTML = util.inspect(data, { showHidden: false, depth: null });
					document.getElementById('messages').appendChild(el);
					console.log(JSON.stringify(data));
				} else if (typeof data === 'string') {
					var _el = document.createElement('pre');
					_el.innerHTML = data;
					document.getElementById('messages').appendChild(_el);
					console.log(data);
				}
			}
		};

		_this.addTextChangeEventToEditor = function () {
			var that = _this;
			_this.state.editor.on('text-change', function (delta, oldDelta, source) {
				that.addMessageToQueue('TEXT_CHANGED', {
					type: 'success',
					delta: delta,
					oldDelta: oldDelta,
					source: source
				});
			});
		};

		_this.loadEditor = function (theme) {
			var that = _this;
			_this.printElement('loading editor, theme = ' + theme);
			_this.setState({
				editor: new _quill2.default('#editor', {
					theme: theme,
					bounds: '#Quill-Editor-Container'
				})
			}, function () {
				that.printElement('editor initialized');
				that.addMessageToQueue('EDITOR_LOADED', {
					type: 'success',
					delta: _this.state.editor.getContents()
				});
				that.addTextChangeEventToEditor();
			});
		};

		_this.addMessageToQueue = function (type, payload) {
			messageQueue.push(JSON.stringify({
				messageID: messageCounter++,
				prefix: MESSAGE_PREFIX,
				type: type,
				payload: payload
			}));
			_this.printElement('adding message ' + messageCounter + ' to queue');
			if (_this.state.readyToSendNextMessage) {
				_this.printElement('sending message');
				_this.sendNextMessage();
			}
		};

		_this.sendNextMessage = function () {
			if (messageQueue.length > 0) {
				var nextMessage = messageQueue.shift();
				_this.printElement('sending message ' + nextMessage);
				window.postMessage(nextMessage, '*');
				_this.setState({ readyToSendNextMessage: false });
			}
		};

		_this.handleMessage = function (event) {
			_this.printElement('received message');
			_this.printElement(util.inspect(event.data, {
				showHidden: false,
				depth: null
			}));

			var msgData = void 0;
			try {
				msgData = JSON.parse(event.data);
				if (msgData.hasOwnProperty('prefix') && msgData.prefix === MESSAGE_PREFIX) {
					// this.printElement(msgData);
					switch (msgData.type) {
						case 'LOAD_EDITOR':
							_this.loadEditor(msgData.payload.theme);
							break;
						case 'GET_DELTA':
							_this.addMessageToQueue('RECEIVE_DELTA', {
								type: 'success',
								delta: _this.state.editor.getContents()
							});
							break;
						case 'SET_CONTENTS':
							_this.state.editor.setContents(msgData.payload.delta);
							break;
						case 'SET_HTML_CONTENTS':
							_this.state.editor.clipboard.dangerouslyPasteHTML(msgData.payload.html);
							break;
						case 'MESSAGE_ACKNOWLEDGED':
							_this.printElement('received MESSAGE_ACKNOWLEDGED');
							_this.setState({ readyToSendNextMessage: true });
							_this.sendNextMessage();
							break;
						default:
							printElement('reactQuillEditor Error: Unhandled message type received "' + msgData.type + '"');
					}
				}
			} catch (err) {
				_this.printElement('reactQuillEditor error: ' + err);
				return;
			}
		};

		_this.state = {
			editor: null,
			readyToSendNextMessage: true
		};
		return _this;
	}
	// print passed information in an html element; useful for debugging
	// since console.log and debug statements won't work in a conventional way


	_createClass(ReactQuillEditor, [{
		key: 'componentDidMount',
		value: function componentDidMount() {
			if (document) {
				document.addEventListener('message', this.handleMessage);
			} else if (window) {
				window.addEventListener('message', this.handleMessage);
			} else {
				console.log('unable to add event listener');
			}
			this.printElement('component mounted');
		}
	}, {
		key: 'componentWillUnmount',
		value: function componentWillUnmount() {
			if (document) {
				document.removeEventListener('message', this.handleMessage);
			} else if (window) {
				window.removeEventListener('message', this.handleMessage);
			}
		}
	}, {
		key: 'render',
		value: function render() {
			return _react2.default.createElement(
				'div',
				{
					id: 'Quill-Editor-Container',
					style: {
						height: '100%',
						display: 'flex',
						flexDirection: 'column'
					}
				},
				_react2.default.createElement(
					'div',
					{
						style: {
							height: '100%',
							display: 'flex',
							flexDirection: 'column',
							paddingVertical: 5
						}
					},
					_react2.default.createElement('div', {
						id: 'editor',
						style: {
							fontSize: '20px',
							height: 'calc(100% - 42px)'
						}
					})
				),
				(0, _renderIf2.default)(SHOW_DEBUG_INFORMATION)(_react2.default.createElement(MessagesDiv, { id: 'messages' }))
			);
		}
	}]);

	return ReactQuillEditor;
}(_react2.default.Component);

exports.default = ReactQuillEditor;

/***/ }),

/***/ 44:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(45);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(23)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../node_modules/css-loader/index.js!./quill.snow.css", function() {
			var newContent = require("!!../node_modules/css-loader/index.js!./quill.snow.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ 45:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(22)(false);
// imports


// module
exports.push([module.i, "/*!\r\n * Quill Editor v1.0.0\r\n * https://quilljs.com/\r\n * Copyright (c) 2014, Jason Chen\r\n * Copyright (c) 2013, salesforce.com\r\n */\r\n.ql-container {\r\n    box-sizing: border-box;\r\n    font-family: Helvetica, Arial, sans-serif;\r\n    font-size: 13px;\r\n    height: 100%;\r\n    margin: 0px;\r\n    position: relative;\r\n  }\r\n  .ql-clipboard {\r\n    left: -100000px;\r\n    height: 1px;\r\n    overflow-y: hidden;\r\n    position: absolute;\r\n    top: 50%;\r\n  }\r\n  .ql-clipboard p {\r\n    margin: 0;\r\n    padding: 0;\r\n  }\r\n  .ql-editor {\r\n    box-sizing: border-box;\r\n    cursor: text;\r\n    line-height: 1.42;\r\n    height: 100%;\r\n    outline: none;\r\n    overflow-y: auto;\r\n    padding: 12px 15px;\r\n    tab-size: 4;\r\n    -moz-tab-size: 4;\r\n    text-align: left;\r\n    white-space: pre-wrap;\r\n    word-wrap: break-word;\r\n  }\r\n  .ql-editor p,\r\n  .ql-editor ol,\r\n  .ql-editor ul,\r\n  .ql-editor pre,\r\n  .ql-editor blockquote,\r\n  .ql-editor h1,\r\n  .ql-editor h2,\r\n  .ql-editor h3,\r\n  .ql-editor h4,\r\n  .ql-editor h5,\r\n  .ql-editor h6 {\r\n    margin: 0;\r\n    padding: 0;\r\n    counter-reset: list-1 list-2 list-3 list-4 list-5 list-6 list-7 list-8 list-9;\r\n  }\r\n  .ql-editor ol,\r\n  .ql-editor ul {\r\n    padding-left: 1.5em;\r\n  }\r\n  .ql-editor ol > li,\r\n  .ql-editor ul > li {\r\n    list-style-type: none;\r\n  }\r\n  .ql-editor ul > li::before {\r\n    content: '\\25CF';\r\n  }\r\n  .ql-editor li::before {\r\n    display: inline-block;\r\n    margin-right: 0.3em;\r\n    text-align: right;\r\n    white-space: nowrap;\r\n    width: 1.2em;\r\n  }\r\n  .ql-editor li:not(.ql-direction-rtl)::before {\r\n    margin-left: -1.5em;\r\n  }\r\n  .ql-editor ol li,\r\n  .ql-editor ul li {\r\n    padding-left: 1.5em;\r\n  }\r\n  .ql-editor ol li {\r\n    counter-reset: list-1 list-2 list-3 list-4 list-5 list-6 list-7 list-8 list-9;\r\n    counter-increment: list-num;\r\n  }\r\n  .ql-editor ol li:before {\r\n    content: counter(list-num, decimal) '. ';\r\n  }\r\n  .ql-editor ol li.ql-indent-1 {\r\n    counter-increment: list-1;\r\n  }\r\n  .ql-editor ol li.ql-indent-1:before {\r\n    content: counter(list-1, lower-alpha) '. ';\r\n  }\r\n  .ql-editor ol li.ql-indent-1 {\r\n    counter-reset: list-2 list-3 list-4 list-5 list-6 list-7 list-8 list-9;\r\n  }\r\n  .ql-editor ol li.ql-indent-2 {\r\n    counter-increment: list-2;\r\n  }\r\n  .ql-editor ol li.ql-indent-2:before {\r\n    content: counter(list-2, lower-roman) '. ';\r\n  }\r\n  .ql-editor ol li.ql-indent-2 {\r\n    counter-reset: list-3 list-4 list-5 list-6 list-7 list-8 list-9;\r\n  }\r\n  .ql-editor ol li.ql-indent-3 {\r\n    counter-increment: list-3;\r\n  }\r\n  .ql-editor ol li.ql-indent-3:before {\r\n    content: counter(list-3, decimal) '. ';\r\n  }\r\n  .ql-editor ol li.ql-indent-3 {\r\n    counter-reset: list-4 list-5 list-6 list-7 list-8 list-9;\r\n  }\r\n  .ql-editor ol li.ql-indent-4 {\r\n    counter-increment: list-4;\r\n  }\r\n  .ql-editor ol li.ql-indent-4:before {\r\n    content: counter(list-4, lower-alpha) '. ';\r\n  }\r\n  .ql-editor ol li.ql-indent-4 {\r\n    counter-reset: list-5 list-6 list-7 list-8 list-9;\r\n  }\r\n  .ql-editor ol li.ql-indent-5 {\r\n    counter-increment: list-5;\r\n  }\r\n  .ql-editor ol li.ql-indent-5:before {\r\n    content: counter(list-5, lower-roman) '. ';\r\n  }\r\n  .ql-editor ol li.ql-indent-5 {\r\n    counter-reset: list-6 list-7 list-8 list-9;\r\n  }\r\n  .ql-editor ol li.ql-indent-6 {\r\n    counter-increment: list-6;\r\n  }\r\n  .ql-editor ol li.ql-indent-6:before {\r\n    content: counter(list-6, decimal) '. ';\r\n  }\r\n  .ql-editor ol li.ql-indent-6 {\r\n    counter-reset: list-7 list-8 list-9;\r\n  }\r\n  .ql-editor ol li.ql-indent-7 {\r\n    counter-increment: list-7;\r\n  }\r\n  .ql-editor ol li.ql-indent-7:before {\r\n    content: counter(list-7, lower-alpha) '. ';\r\n  }\r\n  .ql-editor ol li.ql-indent-7 {\r\n    counter-reset: list-8 list-9;\r\n  }\r\n  .ql-editor ol li.ql-indent-8 {\r\n    counter-increment: list-8;\r\n  }\r\n  .ql-editor ol li.ql-indent-8:before {\r\n    content: counter(list-8, lower-roman) '. ';\r\n  }\r\n  .ql-editor ol li.ql-indent-8 {\r\n    counter-reset: list-9;\r\n  }\r\n  .ql-editor ol li.ql-indent-9 {\r\n    counter-increment: list-9;\r\n  }\r\n  .ql-editor ol li.ql-indent-9:before {\r\n    content: counter(list-9, decimal) '. ';\r\n  }\r\n  .ql-editor .ql-indent-1:not(.ql-direction-rtl) {\r\n    padding-left: 3em;\r\n  }\r\n  .ql-editor li.ql-indent-1:not(.ql-direction-rtl) {\r\n    padding-left: 4.5em;\r\n  }\r\n  .ql-editor .ql-indent-1.ql-direction-rtl.ql-align-right {\r\n    padding-right: 3em;\r\n  }\r\n  .ql-editor li.ql-indent-1.ql-direction-rtl.ql-align-right {\r\n    padding-right: 4.5em;\r\n  }\r\n  .ql-editor .ql-indent-2:not(.ql-direction-rtl) {\r\n    padding-left: 6em;\r\n  }\r\n  .ql-editor li.ql-indent-2:not(.ql-direction-rtl) {\r\n    padding-left: 7.5em;\r\n  }\r\n  .ql-editor .ql-indent-2.ql-direction-rtl.ql-align-right {\r\n    padding-right: 6em;\r\n  }\r\n  .ql-editor li.ql-indent-2.ql-direction-rtl.ql-align-right {\r\n    padding-right: 7.5em;\r\n  }\r\n  .ql-editor .ql-indent-3:not(.ql-direction-rtl) {\r\n    padding-left: 9em;\r\n  }\r\n  .ql-editor li.ql-indent-3:not(.ql-direction-rtl) {\r\n    padding-left: 10.5em;\r\n  }\r\n  .ql-editor .ql-indent-3.ql-direction-rtl.ql-align-right {\r\n    padding-right: 9em;\r\n  }\r\n  .ql-editor li.ql-indent-3.ql-direction-rtl.ql-align-right {\r\n    padding-right: 10.5em;\r\n  }\r\n  .ql-editor .ql-indent-4:not(.ql-direction-rtl) {\r\n    padding-left: 12em;\r\n  }\r\n  .ql-editor li.ql-indent-4:not(.ql-direction-rtl) {\r\n    padding-left: 13.5em;\r\n  }\r\n  .ql-editor .ql-indent-4.ql-direction-rtl.ql-align-right {\r\n    padding-right: 12em;\r\n  }\r\n  .ql-editor li.ql-indent-4.ql-direction-rtl.ql-align-right {\r\n    padding-right: 13.5em;\r\n  }\r\n  .ql-editor .ql-indent-5:not(.ql-direction-rtl) {\r\n    padding-left: 15em;\r\n  }\r\n  .ql-editor li.ql-indent-5:not(.ql-direction-rtl) {\r\n    padding-left: 16.5em;\r\n  }\r\n  .ql-editor .ql-indent-5.ql-direction-rtl.ql-align-right {\r\n    padding-right: 15em;\r\n  }\r\n  .ql-editor li.ql-indent-5.ql-direction-rtl.ql-align-right {\r\n    padding-right: 16.5em;\r\n  }\r\n  .ql-editor .ql-indent-6:not(.ql-direction-rtl) {\r\n    padding-left: 18em;\r\n  }\r\n  .ql-editor li.ql-indent-6:not(.ql-direction-rtl) {\r\n    padding-left: 19.5em;\r\n  }\r\n  .ql-editor .ql-indent-6.ql-direction-rtl.ql-align-right {\r\n    padding-right: 18em;\r\n  }\r\n  .ql-editor li.ql-indent-6.ql-direction-rtl.ql-align-right {\r\n    padding-right: 19.5em;\r\n  }\r\n  .ql-editor .ql-indent-7:not(.ql-direction-rtl) {\r\n    padding-left: 21em;\r\n  }\r\n  .ql-editor li.ql-indent-7:not(.ql-direction-rtl) {\r\n    padding-left: 22.5em;\r\n  }\r\n  .ql-editor .ql-indent-7.ql-direction-rtl.ql-align-right {\r\n    padding-right: 21em;\r\n  }\r\n  .ql-editor li.ql-indent-7.ql-direction-rtl.ql-align-right {\r\n    padding-right: 22.5em;\r\n  }\r\n  .ql-editor .ql-indent-8:not(.ql-direction-rtl) {\r\n    padding-left: 24em;\r\n  }\r\n  .ql-editor li.ql-indent-8:not(.ql-direction-rtl) {\r\n    padding-left: 25.5em;\r\n  }\r\n  .ql-editor .ql-indent-8.ql-direction-rtl.ql-align-right {\r\n    padding-right: 24em;\r\n  }\r\n  .ql-editor li.ql-indent-8.ql-direction-rtl.ql-align-right {\r\n    padding-right: 25.5em;\r\n  }\r\n  .ql-editor .ql-indent-9:not(.ql-direction-rtl) {\r\n    padding-left: 27em;\r\n  }\r\n  .ql-editor li.ql-indent-9:not(.ql-direction-rtl) {\r\n    padding-left: 28.5em;\r\n  }\r\n  .ql-editor .ql-indent-9.ql-direction-rtl.ql-align-right {\r\n    padding-right: 27em;\r\n  }\r\n  .ql-editor li.ql-indent-9.ql-direction-rtl.ql-align-right {\r\n    padding-right: 28.5em;\r\n  }\r\n  .ql-editor .ql-video {\r\n    display: block;\r\n    max-width: 100%;\r\n  }\r\n  .ql-editor .ql-video.ql-align-center {\r\n    margin: 0 auto;\r\n  }\r\n  .ql-editor .ql-video.ql-align-right {\r\n    margin: 0 0 0 auto;\r\n  }\r\n  .ql-editor .ql-bg-black {\r\n    background-color: #000;\r\n  }\r\n  .ql-editor .ql-bg-red {\r\n    background-color: #e60000;\r\n  }\r\n  .ql-editor .ql-bg-orange {\r\n    background-color: #f90;\r\n  }\r\n  .ql-editor .ql-bg-yellow {\r\n    background-color: #ff0;\r\n  }\r\n  .ql-editor .ql-bg-green {\r\n    background-color: #008a00;\r\n  }\r\n  .ql-editor .ql-bg-blue {\r\n    background-color: #06c;\r\n  }\r\n  .ql-editor .ql-bg-purple {\r\n    background-color: #93f;\r\n  }\r\n  .ql-editor .ql-color-white {\r\n    color: #fff;\r\n  }\r\n  .ql-editor .ql-color-red {\r\n    color: #e60000;\r\n  }\r\n  .ql-editor .ql-color-orange {\r\n    color: #f90;\r\n  }\r\n  .ql-editor .ql-color-yellow {\r\n    color: #ff0;\r\n  }\r\n  .ql-editor .ql-color-green {\r\n    color: #008a00;\r\n  }\r\n  .ql-editor .ql-color-blue {\r\n    color: #06c;\r\n  }\r\n  .ql-editor .ql-color-purple {\r\n    color: #93f;\r\n  }\r\n  .ql-editor .ql-font-serif {\r\n    font-family: Georgia, Times New Roman, serif;\r\n  }\r\n  .ql-editor .ql-font-monospace {\r\n    font-family: Monaco, Courier New, monospace;\r\n  }\r\n  .ql-editor .ql-size-small {\r\n    font-size: 0.75em;\r\n  }\r\n  .ql-editor .ql-size-large {\r\n    font-size: 1.5em;\r\n  }\r\n  .ql-editor .ql-size-huge {\r\n    font-size: 2.5em;\r\n  }\r\n  .ql-editor .ql-direction-rtl {\r\n    direction: rtl;\r\n    text-align: inherit;\r\n  }\r\n  .ql-editor .ql-align-center {\r\n    text-align: center;\r\n  }\r\n  .ql-editor .ql-align-justify {\r\n    text-align: justify;\r\n  }\r\n  .ql-editor .ql-align-right {\r\n    text-align: right;\r\n  }\r\n  .ql-editor.ql-blank::before {\r\n    color: rgba(0,0,0,0.6);\r\n    content: attr(data-placeholder);\r\n    font-style: italic;\r\n    pointer-events: none;\r\n    position: absolute;\r\n  }\r\n  .ql-snow.ql-toolbar:after,\r\n  .ql-snow .ql-toolbar:after {\r\n    clear: both;\r\n    content: '';\r\n    display: table;\r\n  }\r\n  .ql-snow.ql-toolbar button,\r\n  .ql-snow .ql-toolbar button {\r\n    background: none;\r\n    border: none;\r\n    cursor: pointer;\r\n    display: inline-block;\r\n    float: left;\r\n    height: 24px;\r\n    outline: none;\r\n    padding: 3px 5px;\r\n    width: 28px;\r\n  }\r\n  .ql-snow.ql-toolbar button svg,\r\n  .ql-snow .ql-toolbar button svg {\r\n    float: left;\r\n    height: 100%;\r\n  }\r\n  .ql-snow.ql-toolbar input.ql-image[type=file],\r\n  .ql-snow .ql-toolbar input.ql-image[type=file] {\r\n    display: none;\r\n  }\r\n  .ql-snow.ql-toolbar button:hover,\r\n  .ql-snow .ql-toolbar button:hover,\r\n  .ql-snow.ql-toolbar button.ql-active,\r\n  .ql-snow .ql-toolbar button.ql-active,\r\n  .ql-snow.ql-toolbar .ql-picker-label:hover,\r\n  .ql-snow .ql-toolbar .ql-picker-label:hover,\r\n  .ql-snow.ql-toolbar .ql-picker-label.ql-active,\r\n  .ql-snow .ql-toolbar .ql-picker-label.ql-active,\r\n  .ql-snow.ql-toolbar .ql-picker-item:hover,\r\n  .ql-snow .ql-toolbar .ql-picker-item:hover,\r\n  .ql-snow.ql-toolbar .ql-picker-item.ql-selected,\r\n  .ql-snow .ql-toolbar .ql-picker-item.ql-selected {\r\n    color: #06c;\r\n  }\r\n  .ql-snow.ql-toolbar button:hover .ql-fill,\r\n  .ql-snow .ql-toolbar button:hover .ql-fill,\r\n  .ql-snow.ql-toolbar button.ql-active .ql-fill,\r\n  .ql-snow .ql-toolbar button.ql-active .ql-fill,\r\n  .ql-snow.ql-toolbar .ql-picker-label:hover .ql-fill,\r\n  .ql-snow .ql-toolbar .ql-picker-label:hover .ql-fill,\r\n  .ql-snow.ql-toolbar .ql-picker-label.ql-active .ql-fill,\r\n  .ql-snow .ql-toolbar .ql-picker-label.ql-active .ql-fill,\r\n  .ql-snow.ql-toolbar .ql-picker-item:hover .ql-fill,\r\n  .ql-snow .ql-toolbar .ql-picker-item:hover .ql-fill,\r\n  .ql-snow.ql-toolbar .ql-picker-item.ql-selected .ql-fill,\r\n  .ql-snow .ql-toolbar .ql-picker-item.ql-selected .ql-fill,\r\n  .ql-snow.ql-toolbar button:hover .ql-stroke.ql-fill,\r\n  .ql-snow .ql-toolbar button:hover .ql-stroke.ql-fill,\r\n  .ql-snow.ql-toolbar button.ql-active .ql-stroke.ql-fill,\r\n  .ql-snow .ql-toolbar button.ql-active .ql-stroke.ql-fill,\r\n  .ql-snow.ql-toolbar .ql-picker-label:hover .ql-stroke.ql-fill,\r\n  .ql-snow .ql-toolbar .ql-picker-label:hover .ql-stroke.ql-fill,\r\n  .ql-snow.ql-toolbar .ql-picker-label.ql-active .ql-stroke.ql-fill,\r\n  .ql-snow .ql-toolbar .ql-picker-label.ql-active .ql-stroke.ql-fill,\r\n  .ql-snow.ql-toolbar .ql-picker-item:hover .ql-stroke.ql-fill,\r\n  .ql-snow .ql-toolbar .ql-picker-item:hover .ql-stroke.ql-fill,\r\n  .ql-snow.ql-toolbar .ql-picker-item.ql-selected .ql-stroke.ql-fill,\r\n  .ql-snow .ql-toolbar .ql-picker-item.ql-selected .ql-stroke.ql-fill {\r\n    fill: #06c;\r\n  }\r\n  .ql-snow.ql-toolbar button:hover .ql-stroke,\r\n  .ql-snow .ql-toolbar button:hover .ql-stroke,\r\n  .ql-snow.ql-toolbar button.ql-active .ql-stroke,\r\n  .ql-snow .ql-toolbar button.ql-active .ql-stroke,\r\n  .ql-snow.ql-toolbar .ql-picker-label:hover .ql-stroke,\r\n  .ql-snow .ql-toolbar .ql-picker-label:hover .ql-stroke,\r\n  .ql-snow.ql-toolbar .ql-picker-label.ql-active .ql-stroke,\r\n  .ql-snow .ql-toolbar .ql-picker-label.ql-active .ql-stroke,\r\n  .ql-snow.ql-toolbar .ql-picker-item:hover .ql-stroke,\r\n  .ql-snow .ql-toolbar .ql-picker-item:hover .ql-stroke,\r\n  .ql-snow.ql-toolbar .ql-picker-item.ql-selected .ql-stroke,\r\n  .ql-snow .ql-toolbar .ql-picker-item.ql-selected .ql-stroke,\r\n  .ql-snow.ql-toolbar button:hover .ql-stroke-mitter,\r\n  .ql-snow .ql-toolbar button:hover .ql-stroke-mitter,\r\n  .ql-snow.ql-toolbar button.ql-active .ql-stroke-mitter,\r\n  .ql-snow .ql-toolbar button.ql-active .ql-stroke-mitter,\r\n  .ql-snow.ql-toolbar .ql-picker-label:hover .ql-stroke-mitter,\r\n  .ql-snow .ql-toolbar .ql-picker-label:hover .ql-stroke-mitter,\r\n  .ql-snow.ql-toolbar .ql-picker-label.ql-active .ql-stroke-mitter,\r\n  .ql-snow .ql-toolbar .ql-picker-label.ql-active .ql-stroke-mitter,\r\n  .ql-snow.ql-toolbar .ql-picker-item:hover .ql-stroke-mitter,\r\n  .ql-snow .ql-toolbar .ql-picker-item:hover .ql-stroke-mitter,\r\n  .ql-snow.ql-toolbar .ql-picker-item.ql-selected .ql-stroke-mitter,\r\n  .ql-snow .ql-toolbar .ql-picker-item.ql-selected .ql-stroke-mitter {\r\n    stroke: #06c;\r\n  }\r\n  .ql-snow {\r\n    box-sizing: border-box;\r\n  }\r\n  .ql-snow * {\r\n    box-sizing: border-box;\r\n  }\r\n  .ql-snow .ql-hidden {\r\n    display: none;\r\n  }\r\n  .ql-snow .ql-out-bottom,\r\n  .ql-snow .ql-out-top {\r\n    visibility: hidden;\r\n  }\r\n  .ql-snow .ql-tooltip {\r\n    position: absolute;\r\n  }\r\n  .ql-snow .ql-tooltip a {\r\n    cursor: pointer;\r\n    text-decoration: none;\r\n  }\r\n  .ql-snow .ql-formats {\r\n    display: inline-block;\r\n    vertical-align: middle;\r\n  }\r\n  .ql-snow .ql-formats:after {\r\n    clear: both;\r\n    content: '';\r\n    display: table;\r\n  }\r\n  .ql-snow .ql-toolbar.snow,\r\n  .ql-snow .ql-stroke {\r\n    fill: none;\r\n    stroke: #444;\r\n    stroke-linecap: round;\r\n    stroke-linejoin: round;\r\n    stroke-width: 2;\r\n  }\r\n  .ql-snow .ql-stroke-mitter {\r\n    fill: none;\r\n    stroke: #444;\r\n    stroke-mitterlimit: 10;\r\n    stroke-width: 2;\r\n  }\r\n  .ql-snow .ql-fill,\r\n  .ql-snow .ql-stroke.ql-fill {\r\n    fill: #444;\r\n  }\r\n  .ql-snow .ql-empty {\r\n    fill: none;\r\n  }\r\n  .ql-snow .ql-even {\r\n    fill-rule: evenodd;\r\n  }\r\n  .ql-snow .ql-thin,\r\n  .ql-snow .ql-stroke.ql-thin {\r\n    stroke-width: 1;\r\n  }\r\n  .ql-snow .ql-transparent {\r\n    opacity: 0.4;\r\n  }\r\n  .ql-snow .ql-direction svg:last-child {\r\n    display: none;\r\n  }\r\n  .ql-snow .ql-direction.ql-active svg:last-child {\r\n    display: inline;\r\n  }\r\n  .ql-snow .ql-direction.ql-active svg:first-child {\r\n    display: none;\r\n  }\r\n  .ql-snow .ql-editor h1 {\r\n    font-size: 2em;\r\n  }\r\n  .ql-snow .ql-editor h2 {\r\n    font-size: 1.5em;\r\n  }\r\n  .ql-snow .ql-editor h3 {\r\n    font-size: 1.17em;\r\n  }\r\n  .ql-snow .ql-editor h4 {\r\n    font-size: 1em;\r\n  }\r\n  .ql-snow .ql-editor h5 {\r\n    font-size: 0.83em;\r\n  }\r\n  .ql-snow .ql-editor h6 {\r\n    font-size: 0.67em;\r\n  }\r\n  .ql-snow .ql-editor a {\r\n    text-decoration: underline;\r\n  }\r\n  .ql-snow .ql-editor blockquote {\r\n    border-left: 4px solid #ccc;\r\n    margin-bottom: 5px;\r\n    margin-top: 5px;\r\n    padding-left: 16px;\r\n  }\r\n  .ql-snow .ql-editor code,\r\n  .ql-snow .ql-editor pre {\r\n    background-color: #f0f0f0;\r\n    border-radius: 3px;\r\n  }\r\n  .ql-snow .ql-editor pre {\r\n    white-space: pre-wrap;\r\n    margin-bottom: 5px;\r\n    margin-top: 5px;\r\n    padding: 5px 10px;\r\n  }\r\n  .ql-snow .ql-editor code {\r\n    font-size: 85%;\r\n    padding-bottom: 2px;\r\n    padding-top: 2px;\r\n  }\r\n  .ql-snow .ql-editor code:before,\r\n  .ql-snow .ql-editor code:after {\r\n    content: \"\\A0\";\r\n    letter-spacing: -2px;\r\n  }\r\n  .ql-snow .ql-editor pre.ql-syntax {\r\n    background-color: #23241f;\r\n    color: #f8f8f2;\r\n    overflow: visible;\r\n  }\r\n  .ql-snow .ql-editor img {\r\n    max-width: 100%;\r\n  }\r\n  .ql-snow .ql-picker {\r\n    color: #444;\r\n    display: inline-block;\r\n    float: left;\r\n    font-size: 14px;\r\n    font-weight: 500;\r\n    height: 24px;\r\n    position: relative;\r\n    vertical-align: middle;\r\n  }\r\n  .ql-snow .ql-picker-label {\r\n    cursor: pointer;\r\n    display: inline-block;\r\n    height: 100%;\r\n    padding-left: 8px;\r\n    padding-right: 2px;\r\n    position: relative;\r\n    width: 100%;\r\n  }\r\n  .ql-snow .ql-picker-label::before {\r\n    display: inline-block;\r\n    line-height: 22px;\r\n  }\r\n  .ql-snow .ql-picker-options {\r\n    background-color: #fff;\r\n    display: none;\r\n    min-width: 100%;\r\n    padding: 4px 8px;\r\n    position: absolute;\r\n    white-space: nowrap;\r\n  }\r\n  .ql-snow .ql-picker-options .ql-picker-item {\r\n    cursor: pointer;\r\n    display: block;\r\n    padding-bottom: 5px;\r\n    padding-top: 5px;\r\n  }\r\n  .ql-snow .ql-picker.ql-expanded .ql-picker-label {\r\n    color: #ccc;\r\n    z-index: 2;\r\n  }\r\n  .ql-snow .ql-picker.ql-expanded .ql-picker-label .ql-fill {\r\n    fill: #ccc;\r\n  }\r\n  .ql-snow .ql-picker.ql-expanded .ql-picker-label .ql-stroke {\r\n    stroke: #ccc;\r\n  }\r\n  .ql-snow .ql-picker.ql-expanded .ql-picker-options {\r\n    display: block;\r\n    margin-top: -1px;\r\n    top: 100%;\r\n    z-index: 1;\r\n  }\r\n  .ql-snow .ql-color-picker,\r\n  .ql-snow .ql-icon-picker {\r\n    width: 28px;\r\n  }\r\n  .ql-snow .ql-color-picker .ql-picker-label,\r\n  .ql-snow .ql-icon-picker .ql-picker-label {\r\n    padding: 2px 4px;\r\n  }\r\n  .ql-snow .ql-color-picker .ql-picker-label svg,\r\n  .ql-snow .ql-icon-picker .ql-picker-label svg {\r\n    right: 4px;\r\n  }\r\n  .ql-snow .ql-icon-picker .ql-picker-options {\r\n    padding: 4px 0px;\r\n  }\r\n  .ql-snow .ql-icon-picker .ql-picker-item {\r\n    height: 24px;\r\n    width: 24px;\r\n    padding: 2px 4px;\r\n  }\r\n  .ql-snow .ql-color-picker .ql-picker-options {\r\n    padding: 3px 5px;\r\n    width: 152px;\r\n  }\r\n  .ql-snow .ql-color-picker .ql-picker-item {\r\n    border: 1px solid transparent;\r\n    float: left;\r\n    height: 16px;\r\n    margin: 2px;\r\n    padding: 0px;\r\n    width: 16px;\r\n  }\r\n  .ql-snow .ql-color-picker .ql-picker-item.ql-primary-color {\r\n    margin-bottom: toolbarPadding;\r\n  }\r\n  .ql-snow .ql-picker:not(.ql-color-picker):not(.ql-icon-picker) svg {\r\n    position: absolute;\r\n    margin-top: -9px;\r\n    right: 0;\r\n    top: 50%;\r\n    width: 18px;\r\n  }\r\n  .ql-snow .ql-picker.ql-header .ql-picker-label[data-label]:not([data-label=''])::before,\r\n  .ql-snow .ql-picker.ql-font .ql-picker-label[data-label]:not([data-label=''])::before,\r\n  .ql-snow .ql-picker.ql-size .ql-picker-label[data-label]:not([data-label=''])::before,\r\n  .ql-snow .ql-picker.ql-header .ql-picker-item[data-label]:not([data-label=''])::before,\r\n  .ql-snow .ql-picker.ql-font .ql-picker-item[data-label]:not([data-label=''])::before,\r\n  .ql-snow .ql-picker.ql-size .ql-picker-item[data-label]:not([data-label=''])::before {\r\n    content: attr(data-label);\r\n  }\r\n  .ql-snow .ql-picker.ql-header {\r\n    width: 98px;\r\n  }\r\n  .ql-snow .ql-picker.ql-header .ql-picker-label::before,\r\n  .ql-snow .ql-picker.ql-header .ql-picker-item::before {\r\n    content: 'Normal';\r\n  }\r\n  .ql-snow .ql-picker.ql-header .ql-picker-label[data-value=\"1\"]::before,\r\n  .ql-snow .ql-picker.ql-header .ql-picker-item[data-value=\"1\"]::before {\r\n    content: 'Heading 1';\r\n  }\r\n  .ql-snow .ql-picker.ql-header .ql-picker-label[data-value=\"2\"]::before,\r\n  .ql-snow .ql-picker.ql-header .ql-picker-item[data-value=\"2\"]::before {\r\n    content: 'Heading 2';\r\n  }\r\n  .ql-snow .ql-picker.ql-header .ql-picker-label[data-value=\"3\"]::before,\r\n  .ql-snow .ql-picker.ql-header .ql-picker-item[data-value=\"3\"]::before {\r\n    content: 'Heading 3';\r\n  }\r\n  .ql-snow .ql-picker.ql-header .ql-picker-label[data-value=\"4\"]::before,\r\n  .ql-snow .ql-picker.ql-header .ql-picker-item[data-value=\"4\"]::before {\r\n    content: 'Heading 4';\r\n  }\r\n  .ql-snow .ql-picker.ql-header .ql-picker-label[data-value=\"5\"]::before,\r\n  .ql-snow .ql-picker.ql-header .ql-picker-item[data-value=\"5\"]::before {\r\n    content: 'Heading 5';\r\n  }\r\n  .ql-snow .ql-picker.ql-header .ql-picker-label[data-value=\"6\"]::before,\r\n  .ql-snow .ql-picker.ql-header .ql-picker-item[data-value=\"6\"]::before {\r\n    content: 'Heading 6';\r\n  }\r\n  .ql-snow .ql-picker.ql-header .ql-picker-item[data-value=\"1\"]::before {\r\n    font-size: 2em;\r\n  }\r\n  .ql-snow .ql-picker.ql-header .ql-picker-item[data-value=\"2\"]::before {\r\n    font-size: 1.5em;\r\n  }\r\n  .ql-snow .ql-picker.ql-header .ql-picker-item[data-value=\"3\"]::before {\r\n    font-size: 1.17em;\r\n  }\r\n  .ql-snow .ql-picker.ql-header .ql-picker-item[data-value=\"4\"]::before {\r\n    font-size: 1em;\r\n  }\r\n  .ql-snow .ql-picker.ql-header .ql-picker-item[data-value=\"5\"]::before {\r\n    font-size: 0.83em;\r\n  }\r\n  .ql-snow .ql-picker.ql-header .ql-picker-item[data-value=\"6\"]::before {\r\n    font-size: 0.67em;\r\n  }\r\n  .ql-snow .ql-picker.ql-font {\r\n    width: 108px;\r\n  }\r\n  .ql-snow .ql-picker.ql-font .ql-picker-label::before,\r\n  .ql-snow .ql-picker.ql-font .ql-picker-item::before {\r\n    content: 'Sans Serif';\r\n  }\r\n  .ql-snow .ql-picker.ql-font .ql-picker-label[data-value=serif]::before,\r\n  .ql-snow .ql-picker.ql-font .ql-picker-item[data-value=serif]::before {\r\n    content: 'Serif';\r\n  }\r\n  .ql-snow .ql-picker.ql-font .ql-picker-label[data-value=monospace]::before,\r\n  .ql-snow .ql-picker.ql-font .ql-picker-item[data-value=monospace]::before {\r\n    content: 'Monospace';\r\n  }\r\n  .ql-snow .ql-picker.ql-font .ql-picker-item[data-value=serif]::before {\r\n    font-family: Georgia, Times New Roman, serif;\r\n  }\r\n  .ql-snow .ql-picker.ql-font .ql-picker-item[data-value=monospace]::before {\r\n    font-family: Monaco, Courier New, monospace;\r\n  }\r\n  .ql-snow .ql-picker.ql-size {\r\n    width: 98px;\r\n  }\r\n  .ql-snow .ql-picker.ql-size .ql-picker-label::before,\r\n  .ql-snow .ql-picker.ql-size .ql-picker-item::before {\r\n    content: 'Normal';\r\n  }\r\n  .ql-snow .ql-picker.ql-size .ql-picker-label[data-value=small]::before,\r\n  .ql-snow .ql-picker.ql-size .ql-picker-item[data-value=small]::before {\r\n    content: 'Small';\r\n  }\r\n  .ql-snow .ql-picker.ql-size .ql-picker-label[data-value=large]::before,\r\n  .ql-snow .ql-picker.ql-size .ql-picker-item[data-value=large]::before {\r\n    content: 'Large';\r\n  }\r\n  .ql-snow .ql-picker.ql-size .ql-picker-label[data-value=huge]::before,\r\n  .ql-snow .ql-picker.ql-size .ql-picker-item[data-value=huge]::before {\r\n    content: 'Huge';\r\n  }\r\n  .ql-snow .ql-picker.ql-size .ql-picker-item[data-value=small]::before {\r\n    font-size: 10px;\r\n  }\r\n  .ql-snow .ql-picker.ql-size .ql-picker-item[data-value=large]::before {\r\n    font-size: 18px;\r\n  }\r\n  .ql-snow .ql-picker.ql-size .ql-picker-item[data-value=huge]::before {\r\n    font-size: 32px;\r\n  }\r\n  .ql-snow .ql-color-picker.ql-background .ql-picker-item {\r\n    background-color: #fff;\r\n  }\r\n  .ql-snow .ql-color-picker.ql-color .ql-picker-item {\r\n    background-color: #000;\r\n  }\r\n  .ql-toolbar.ql-snow {\r\n    border: 1px solid #ccc;\r\n    box-sizing: border-box;\r\n    font-family: 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif;\r\n    padding: 8px;\r\n  }\r\n  .ql-toolbar.ql-snow .ql-formats {\r\n    margin-right: 15px;\r\n  }\r\n  .ql-toolbar.ql-snow .ql-picker-label {\r\n    border: 1px solid transparent;\r\n  }\r\n  .ql-toolbar.ql-snow .ql-picker-options {\r\n    border: 1px solid transparent;\r\n    box-shadow: rgba(0,0,0,0.2) 0 2px 8px;\r\n  }\r\n  .ql-toolbar.ql-snow .ql-picker.ql-expanded .ql-picker-label {\r\n    border-color: #ccc;\r\n  }\r\n  .ql-toolbar.ql-snow .ql-picker.ql-expanded .ql-picker-options {\r\n    border-color: #ccc;\r\n  }\r\n  .ql-toolbar.ql-snow .ql-color-picker .ql-picker-item.ql-selected,\r\n  .ql-toolbar.ql-snow .ql-color-picker .ql-picker-item:hover {\r\n    border-color: #000;\r\n  }\r\n  .ql-toolbar.ql-snow + .ql-container.ql-snow {\r\n    border-top: 0px;\r\n  }\r\n  .ql-snow .ql-tooltip {\r\n    background-color: #fff;\r\n    border: 1px solid #ccc;\r\n    box-shadow: 0px 0px 5px #ddd;\r\n    color: #444;\r\n    margin-top: 10px;\r\n    padding: 5px 12px;\r\n    white-space: nowrap;\r\n  }\r\n  .ql-snow .ql-tooltip::before {\r\n    content: \"Visit URL:\";\r\n    line-height: 26px;\r\n    margin-right: 8px;\r\n  }\r\n  .ql-snow .ql-tooltip input[type=text] {\r\n    display: none;\r\n    border: 1px solid #ccc;\r\n    font-size: 13px;\r\n    height: 26px;\r\n    margin: 0px;\r\n    padding: 3px 5px;\r\n    width: 170px;\r\n  }\r\n  .ql-snow .ql-tooltip a.ql-preview {\r\n    display: inline-block;\r\n    max-width: 200px;\r\n    overflow-x: hidden;\r\n    text-overflow: ellipsis;\r\n    vertical-align: top;\r\n  }\r\n  .ql-snow .ql-tooltip a.ql-action::after {\r\n    border-right: 1px solid #ccc;\r\n    content: 'Edit';\r\n    margin-left: 16px;\r\n    padding-right: 8px;\r\n  }\r\n  .ql-snow .ql-tooltip a.ql-remove::before {\r\n    content: 'Remove';\r\n    margin-left: 8px;\r\n  }\r\n  .ql-snow .ql-tooltip a {\r\n    line-height: 26px;\r\n  }\r\n  .ql-snow .ql-tooltip.ql-editing a.ql-preview,\r\n  .ql-snow .ql-tooltip.ql-editing a.ql-remove {\r\n    display: none;\r\n  }\r\n  .ql-snow .ql-tooltip.ql-editing input[type=text] {\r\n    display: inline-block;\r\n  }\r\n  .ql-snow .ql-tooltip.ql-editing a.ql-action::after {\r\n    border-right: 0px;\r\n    content: 'Save';\r\n    padding-right: 0px;\r\n  }\r\n  .ql-snow .ql-tooltip[data-mode=link]::before {\r\n    content: \"Enter link:\";\r\n  }\r\n  .ql-snow .ql-tooltip[data-mode=formula]::before {\r\n    content: \"Enter formula:\";\r\n  }\r\n  .ql-snow .ql-tooltip[data-mode=video]::before {\r\n    content: \"Enter video:\";\r\n  }\r\n  .ql-snow a {\r\n    color: #06c;\r\n  }\r\n  .ql-container.ql-snow {\r\n    border: 1px solid #ccc;\r\n  }", ""]);

// exports


/***/ })

},[29]);