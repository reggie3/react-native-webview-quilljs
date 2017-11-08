webpackJsonp([0],{

/***/ 49:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _reactDom = __webpack_require__(11);

var _reactDom2 = _interopRequireDefault(_reactDom);

var _reactQuillViewer = __webpack_require__(50);

var _reactQuillViewer2 = _interopRequireDefault(_reactQuillViewer);

var _react = __webpack_require__(3);

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_reactDom2.default.render(_react2.default.createElement(_reactQuillViewer2.default, null), document.getElementById("root"));

/***/ }),

/***/ 50:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _quill = __webpack_require__(17);

var _quill2 = _interopRequireDefault(_quill);

__webpack_require__(19);

var _reactNativeWebviewMessaging = __webpack_require__(20);

var _reactNativeWebviewMessaging2 = _interopRequireDefault(_reactNativeWebviewMessaging);

var _react = __webpack_require__(3);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(10);

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var util = __webpack_require__(21);

// print passed information in an html element; useful for debugging
// since console.log and debug statements won't work in a conventional way
var PrintElement = function PrintElement(data) {
  if ((typeof data === 'undefined' ? 'undefined' : _typeof(data)) === 'object') {
    var el = document.createElement('pre');
    el.innerHTML = util.inspect(data, { showHidden: false, depth: null });
    document.getElementById('viewer-messages').appendChild(el);
  } else if (typeof data === 'string') {
    var _el = document.createElement('pre');
    _el.innerHTML = data;
    document.getElementById('viewer-messages').appendChild(_el);
  }
};

var ReactQuillViewer = function (_React$Component) {
  _inherits(ReactQuillViewer, _React$Component);

  function ReactQuillViewer(props) {
    _classCallCheck(this, ReactQuillViewer);

    var _this = _possibleConstructorReturn(this, (ReactQuillViewer.__proto__ || Object.getPrototypeOf(ReactQuillViewer)).call(this, props));

    _this.registerMessageListeners = function () {
      // PrintElement('registering message listeners');

      _reactNativeWebviewMessaging2.default.on('SET_CONTENTS', function (event) {
        // PrintElement('SET_CONTENTS');
        // PrintElement(event.payload.delta);
        _this.state.editor.setContents(event.payload.ops);
      });
    };

    _this.state = {
      editor: null
    }; // You can also pass a Quill Delta here
    return _this;
  }

  _createClass(ReactQuillViewer, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.setState({
        editor: new _quill2.default('#viewer', {
          modules: { toolbar: false },
          readOnly: true,
          theme: null,
          bounds: '#Quill-Viewer-Container'
        })
      });

      this.registerMessageListeners();
    }

    /*******************************
     * register message listeners to receive events from parent
    */

  }, {
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'div',
        {
          id: 'Quill-Viewer-Container',
          style: {
            height: '100%',
            backgroundColor: '#dddddd',
            display: 'flex',
            flexDirection: 'column'
          }
        },
        _react2.default.createElement('div', { id: 'viewer-messages' }),
        _react2.default.createElement('div', {
          id: 'viewer',
          style: {
            height: '100%',
            backgroundColor: '#FAEBD7',
            fontSize: '20px'
          }
        })
      );
    }
  }]);

  return ReactQuillViewer;
}(_react2.default.Component);

exports.default = ReactQuillViewer;

/***/ })

},[49]);