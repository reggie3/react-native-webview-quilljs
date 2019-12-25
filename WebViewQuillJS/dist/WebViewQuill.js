"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
/********************************************
 * WebViewQuillEditor.js
 * A Quill.js editor component for use in react-native
 * applications that need to avoid using native code
 *
 */
var React = require("react");
var expo_asset_utils_1 = require("expo-asset-utils");
var FileSystem = require("expo-file-system");
var WebViewQuill_view_1 = require("./WebViewQuill.view");
var ActivityOverlay_1 = require("./ActivityOverlay");
var lodash_isequal_1 = require("lodash.isequal");
// path to the file that the webview will load
// @ts-ignore typescript doesn't like the require
var INDEX_FILE_PATH = require("./assets/index.html");
var defaultProps = {
    backgroundColor: "#ccc",
    containerStyle: {},
    defaultValue: "",
    doShowDebugMessages: false,
    doShowQuillComponentDebugMessages: false,
    isReadOnly: false,
    loadingIndicator: function () { return <ActivityOverlay_1.ActivityOverlay />; },
    // @ts-ignore arguments are declared but its value is never read
    onContentChange: function (html, delta) { },
    // @ts-ignore arguments are declared but its value is never read
    onError: function (syntheticEvent) { },
    onLoadEnd: function () { },
    onLoadStart: function () { },
    // @ts-ignore arguments are declared but its value is never read
    onMessageReceived: function (message) { },
    style: {}
};
var WebViewQuill = /** @class */ (function (_super) {
    __extends(WebViewQuill, _super);
    function WebViewQuill(props) {
        var _this = _super.call(this, props) || this;
        _this.componentDidMount = function () {
            _this.loadHTMLFile();
        };
        _this.loadHTMLFile = function () { return __awaiter(_this, void 0, void 0, function () {
            var asset, fileString, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, expo_asset_utils_1["default"].resolveAsync(INDEX_FILE_PATH)];
                    case 1:
                        asset = _a.sent();
                        return [4 /*yield*/, FileSystem.readAsStringAsync(asset.localUri)];
                    case 2:
                        fileString = _a.sent();
                        this.setState({ webviewContent: fileString });
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _a.sent();
                        console.warn(error_1);
                        console.warn("Unable to resolve index file");
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        }); };
        _this.componentDidUpdate = function (prevProps, prevState) {
            var webviewContent = _this.state.webviewContent;
            var content = _this.props.content;
            if (!prevState.webviewContent && webviewContent) {
                _this.updateDebugMessages("file loaded");
            }
            if (!lodash_isequal_1["default"](content, prevProps.content)) {
                _this.updateDebugMessages("sending startup message");
                _this.webViewRef.injectJavaScript("window.postMessage(" + JSON.stringify({ content: content }) + ", '*');");
            }
        };
        // Handle messages received from webview contents
        _this.handleMessage = function (message) {
            var parsedMessage = JSON.parse(message);
            _this.updateDebugMessages("received: " + JSON.stringify(parsedMessage));
            console.log(parsedMessage);
            switch (parsedMessage.instruction) {
                case "QUILL_READY":
                    _this.sendStartupMessage();
                    break;
                case "CONTENT_CHANGED":
                case "ON_CHANGE_SELECTION":
                case "ON_FOCUS":
                case "ON_BLUR":
                case "ON_KEY_PRESS":
                case "ON_KEY_DOWN":
                case "ON_KEY_UP":
                    _this.props.onMessageReceived(parsedMessage);
                    break;
            }
        };
        /* private sendMessage = (message: WebViewQuillJSMessage) => {
          const stringMessage = JSON.stringify(message);
      
          this.updateDebugMessages(`sending: ${stringMessage}`);
          this.webViewRef.injectJavaScript(
            `handleMessage(${stringMessage}, '*'); true;`
          );
        }; */
        // Send a startup message with initalizing values to the map
        _this.sendStartupMessage = function () {
            var _a = _this.props, backgroundColor = _a.backgroundColor, defaultValue = _a.defaultValue, doShowQuillComponentDebugMessages = _a.doShowQuillComponentDebugMessages, isReadOnly = _a.isReadOnly;
            var startupMessage = {
                backgroundColor: backgroundColor,
                defaultValue: defaultValue,
                doShowQuillComponentDebugMessages: doShowQuillComponentDebugMessages,
                height: _this.state.height,
                isReadOnly: isReadOnly
            };
            _this.setState({ isLoading: false });
            _this.updateDebugMessages("sending startup message");
            _this.webViewRef.injectJavaScript("window.postMessage(" + JSON.stringify(startupMessage) + ", '*');");
        };
        // Add a new debug message to the debug message array
        _this.updateDebugMessages = function (debugMessage) {
            _this.setState({
                debugMessages: __spreadArrays(_this.state.debugMessages, [debugMessage])
            });
        };
        _this.onError = function (syntheticEvent) {
            _this.props.onError(syntheticEvent);
        };
        _this.onLayout = function (e) {
            _this.setState({
                height: e.nativeEvent.layout.height
            });
        };
        _this.onLoadEnd = function () {
            _this.setState({ isLoading: false });
            _this.props.onLoadEnd();
        };
        _this.onLoadStart = function () {
            _this.setState({ isLoading: true });
            _this.props.onLoadStart();
        };
        _this.state = {
            debugMessages: [],
            height: 0,
            isLoading: null,
            webviewContent: null
        };
        _this.webViewRef = null;
        return _this;
    }
    WebViewQuill.prototype.render = function () {
        var _this = this;
        var _a = this.state, debugMessages = _a.debugMessages, webviewContent = _a.webviewContent;
        var _b = this.props, backgroundColor = _b.backgroundColor, defaultValue = _b.defaultValue, doShowDebugMessages = _b.doShowDebugMessages, loadingIndicator = _b.loadingIndicator;
        if (webviewContent) {
            return (
            // @ts-ignore
            <WebViewQuill_view_1.default backgroundColor={backgroundColor} debugMessages={debugMessages} defaultValue={defaultValue} doShowDebugMessages={doShowDebugMessages} handleMessage={this.handleMessage} webviewContent={webviewContent} loadingIndicator={loadingIndicator} onError={this.onError} onLayout={this.onLayout} onLoadEnd={this.onLoadEnd} onLoadStart={this.onLoadStart} setWebViewRef={function (ref) {
                _this.webViewRef = ref;
            }}/>);
        }
        else {
            return null;
        }
    };
    WebViewQuill.defaultProps = defaultProps;
    return WebViewQuill;
}(React.Component));
exports["default"] = WebViewQuill;
//# sourceMappingURL=WebViewQuill.js.map