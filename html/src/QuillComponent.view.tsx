import React from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // ES6
import { Delta } from "quill";

import * as CSS from "csstype";

interface Props {
  addDebugMessage?: (message: string) => void;
  content?: string | any | undefined;
  debugMessages?: string[];
  defaultValue?: string | any | undefined;
  height?: number;
  isReadOnly?: boolean;
  modules?: object;
  onChange?: (content: string, delta: Delta, source: any, editor: any) => void;
  onChangeSelection?: (range: any, source: any, editor: any) => void;
  onFocus?: (range: any, source: any, editor: any) => void;
  onBlur?: (previousRange: any, source: any, editor: any) => void;
  onKeyPress?: (event: any) => void;
  onKeyDown?: (event: any) => void;
  onKeyUp?: (event: any) => void;
  onQuillRef: (quillRef: any) => void;
  style?: CSS.Properties;
}

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
  style,
}: Props) => {
  const getModules = (): object => {
    if (isReadOnly) {
      return {
        ...modules,
        toolbar: false
      };
    }
    return modules;
  };


  return (
    <>
      <ReactQuill
        defaultValue={defaultValue}
        modules={getModules()}
        onChange={onChange}
        onChangeSelection={onChangeSelection}
        onFocus={onFocus}
        onBlur={onBlur}
        onKeyPress={onKeyPress}
        onKeyDown={onKeyDown}
        onKeyUp={onKeyUp}
        readOnly={isReadOnly}
        ref={(component: any) => {
          onQuillRef(component);
        }}
        style={style}
        /* value={content} */
      />
    </>
  );
};

export default QuillComponentView;
