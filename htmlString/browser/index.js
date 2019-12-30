import _defineProperty from "C:\\Users\\regin\\Dropbox\\react-native-webview-quilljs\\htmlString\\node_modules\\babel-preset-react-app\\node_modules\\@babel\\runtime/helpers/esm/defineProperty";
var _jsxFileName = "C:\\Users\\regin\\Dropbox\\react-native-webview-quilljs\\htmlString\\src\\QuillComponent.view.tsx";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

import React from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // ES6

export const QuillComponentView = ({
  addDebugMessage = () => {},
  debugMessages = [],
  content,
  defaultValue,
  isReadOnly = false,
  modules = {},
  onChange,
  onChangeSelection,
  onFocus,
  onBlur,
  onKeyPress,
  onKeyDown,
  onKeyUp,
  onQuillRef,
  style
}) => {
  const getModules = () => {
    if (isReadOnly) {
      return _objectSpread({}, modules, {
        toolbar: false
      });
    }

    return modules;
  };

  const getContentProps = () => {
    if (content) {
      return {
        value: content
      };
    }

    if (defaultValue) {
      return {
        defaultValue
      };
    }

    return "";
  };

  return React.createElement(ReactQuill, Object.assign({
    modules: getModules(),
    onChange: onChange,
    onChangeSelection: onChangeSelection,
    onFocus: onFocus,
    onBlur: onBlur,
    onKeyPress: onKeyPress,
    onKeyDown: onKeyDown,
    onKeyUp: onKeyUp,
    readOnly: isReadOnly,
    ref: component => {
      onQuillRef(component);
    },
    style: style
  }, getContentProps(), {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 65
    },
    __self: this
  }));
};
export default QuillComponentView;