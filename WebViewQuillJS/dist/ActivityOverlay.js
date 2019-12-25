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
exports.ActivityOverlay = function (_a) {
    var isLoading = _a.isLoading;
    return (<react_native_1.View style={styles.activityOverlayStyle}>
      <react_native_1.View style={styles.activityIndicatorContainer}>
        <react_native_1.ActivityIndicator size="large" animating={isLoading}/>
      </react_native_1.View>
    </react_native_1.View>);
};
var styles = react_native_1.StyleSheet.create({
    activityOverlayStyle: __assign(__assign({}, react_native_1.StyleSheet.absoluteFillObject), { backgroundColor: "rgba(255, 255, 255, .5)", display: "flex", justifyContent: "center", alignContent: "center", borderRadius: 5 }),
    activityIndicatorContainer: {
        backgroundColor: "lightgray",
        padding: 10,
        borderRadius: 50,
        alignSelf: "center",
        shadowColor: "#000000",
        shadowOffset: {
            width: 0,
            height: 3
        },
        shadowRadius: 5,
        shadowOpacity: 1.0
    }
});
//# sourceMappingURL=ActivityOverlay.js.map