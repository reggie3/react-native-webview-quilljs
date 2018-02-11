webpackJsonp([1],{

/***/ 28:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _reactDom = __webpack_require__(11);

var _reactDom2 = _interopRequireDefault(_reactDom);

var _reactQuillEditor = __webpack_require__(37);

var _reactQuillEditor2 = _interopRequireDefault(_reactQuillEditor);

var _react = __webpack_require__(3);

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_reactDom2.default.render(_react2.default.createElement(_reactQuillEditor2.default, null), document.getElementById("root"));

/***/ }),

/***/ 37:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _quill = __webpack_require__(20);

var _quill2 = _interopRequireDefault(_quill);

__webpack_require__(22);

var _react = __webpack_require__(3);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(10);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _glamorous = __webpack_require__(23);

var _glamorous2 = _interopRequireDefault(_glamorous);

var _renderIf = __webpack_require__(26);

var _renderIf2 = _interopRequireDefault(_renderIf);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var util = __webpack_require__(27);
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
  right: 0
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
            // receive an event when the webview is ready
            case 'GET_DELTA':
              _this.addMessageToQueue('RECEIVE_DELTA', {
                payload: {
                  type: 'success',
                  delta: _this.state.editor.getContents()
                }
              });
              break;

            case 'SET_CONTENTS':
              _this.state.editor.setContents(event.payload.delta);
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
      this.setState({
        editor: new _quill2.default('#editor', {
          theme: 'snow',
          bounds: '#Quill-Editor-Container'
        })
      });
      if (document) {
        document.addEventListener('message', this.handleMessage), false;
      } else if (window) {
        window.addEventListener('message', this.handleMessage), false;
      } else {
        console.log('unable to add event listener');
      }
      this.printElement('component mounted');
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
            backgroundColor: '#dddddd',
            display: 'flex',
            flexDirection: 'column'
          }
        },
        _react2.default.createElement(
          'div',
          {
            style: {
              height: '100%',
              backgroundColor: '#ffebba',
              display: 'flex',
              flexDirection: 'column',
              paddingVertical: 5
            }
          },
          _react2.default.createElement(
            'div',
            {
              id: 'editor',
              style: {
                backgroundColor: '#FAEBD7',
                fontSize: '20px',
                height: 'calc(100% - 42px)'
              }
            },
            _react2.default.createElement(
              'p',
              null,
              'Hello World!'
            )
          )
        ),
        (0, _renderIf2.default)(SHOW_DEBUG_INFORMATION)(_react2.default.createElement(MessagesDiv, { id: 'messages' }))
      );
    }
  }]);

  return ReactQuillEditor;
}(_react2.default.Component);

exports.default = ReactQuillEditor;

/***/ })

},[28]);