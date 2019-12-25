"use strict";
exports.__esModule = true;
var react_1 = require("react");
var react_native_1 = require("react-native");
var DebugMessageBox = function (_a) {
    var _b = _a.debugMessages, debugMessages = _b === void 0 ? [] : _b, _c = _a.doShowDebugMessages, doShowDebugMessages = _c === void 0 ? false : _c;
    if (doShowDebugMessages) {
        return (<react_native_1.View style={{
            height: 100,
            backgroundColor: "aliceblue",
            padding: 5,
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 1000
        }}>
        <react_native_1.ScrollView>
          {debugMessages.map(function (msg, idx) {
            if (typeof msg === "object") {
                return (<react_native_1.Text style={{ fontSize: 10 }} key={idx}>{"- " + JSON.stringify(msg)}</react_native_1.Text>);
            }
            return <react_native_1.Text style={{ fontSize: 10 }} key={idx}>{"- " + msg}</react_native_1.Text>;
        })}
        </react_native_1.ScrollView>
      </react_native_1.View>);
    }
    return null;
};
exports["default"] = DebugMessageBox;
//# sourceMappingURL=DebugMessageBox.js.map