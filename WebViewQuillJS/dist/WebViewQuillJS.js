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
exports.__esModule = true;
var react_native_1 = require("react-native");
var React = require("react");
var WebViewQuillJS = /** @class */ (function (_super) {
    __extends(WebViewQuillJS, _super);
    function WebViewQuillJS() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /* return (
      <Text style={{color: 'orange'}} >Webview quill js in separate file now</Text>
    ) */
    WebViewQuillJS.prototype.render = function () {
        return (<react_native_1.Text style={{ color: 'orange' }}>Webview quill js in separate file now</react_native_1.Text>
        /*  <WebView source={{ uri: "https://facebook.github.io/react-native/" }} /> */
        );
    };
    return WebViewQuillJS;
}(React.Component));
exports["default"] = WebViewQuillJS;
//# sourceMappingURL=WebViewQuillJS.js.map