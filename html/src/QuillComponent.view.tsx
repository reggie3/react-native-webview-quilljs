import React from "react";
import * as ReactQuill from "react-quill"; // Typescript
import "react-quill/dist/quill.snow.css"; // ES6
import { DeltaOperation, Delta } from "quill";
import { isEqual } from "lodash";

interface Props {
  addDebugMessage: (message: string) => void;
  content?: string | DeltaOperation[];
  debugMessages: string[];
  defaultValue: string | DeltaOperation[];
  height?: number,
  isReadOnly: boolean;
  modules: object;
  onChange: (
    content: string,
    delta: DeltaOperation[],
    source: any,
    editor: any
  ) => void;
  onChangeSelection: (range: any, source: any, editor: any) => void;
  onFocus: (range: any, source: any, editor: any) => void;
  onBlur: (previousRange: any, source: any, editor: any) => void;
  onKeyPress: (event: any) => void;
  onKeyDown: (event: any) => void;
  onKeyUp: (event: any) => void;
  onQuillRef: (quillRef: any) => void;
}

const QuillEditorComponentView = ({
  addDebugMessage,
  debugMessages,
  content,
  defaultValue,
  height,
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
    // @ts-ignore
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
      style={{
        height
      }}
      value={content}
    />
  );
};

export default QuillEditorComponentView;
