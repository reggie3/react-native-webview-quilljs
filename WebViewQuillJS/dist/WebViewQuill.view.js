"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
var react_1 = require("react");
var react_native_1 = require("react-native");
var react_native_webview_1 = require("react-native-webview");
var DebugMessageBox_1 = require("./DebugMessageBox");
var WebViewQuillView = function (_a) {
    var backgroundColor = _a.backgroundColor, containerStyle = _a.containerStyle, debugMessages = _a.debugMessages, doShowDebugMessages = _a.doShowDebugMessages, handleMessage = _a.handleMessage, webviewContent = _a.webviewContent, loadingIndicator = _a.loadingIndicator, onError = _a.onError, onLayout = _a.onLayout, onLoadEnd = _a.onLoadEnd, onLoadStart = _a.onLoadStart, setWebViewRef = _a.setWebViewRef, style = _a.style;
    return (<react_native_1.View onLayout={onLayout} style={__assign(__assign({}, react_native_1.StyleSheet.absoluteFillObject), { flex: 1, backgroundColor: backgroundColor })}>
      {webviewContent && (
    // @ts-ignore
    <react_native_webview_1.WebView allowFileAccess={true} containerStyle={containerStyle} ref={function (component) {
        setWebViewRef(component);
    }} javaScriptEnabled={true} onLoadEnd={onLoadEnd} onLoadStart={onLoadStart} onMessage={function (event) {
        if (event && event.nativeEvent && event.nativeEvent.data) {
            handleMessage(event.nativeEvent.data);
        }
    }} onError={onError} originWhitelist={["*"]} renderLoading={loadingIndicator || null} domStorageEnabled={true} startInLoadingState={true} source={{
        html: webviewContent
    }} style={style}/>)}
      <DebugMessageBox_1.default debugMessages={debugMessages} doShowDebugMessages={doShowDebugMessages}/>
    </react_native_1.View>);
};
exports["default"] = WebViewQuillView;
//# sourceMappingURL=WebViewQuill.view.js.map