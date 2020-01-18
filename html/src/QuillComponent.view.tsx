import * as React from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

interface QuillComponentViewProps {
  addDebugMessage?: (message: string) => void;
  backgroundColor: string;
  content?: string | any | undefined;
  debugMessages?: string[];
  defaultContent?: string | any;
  containerHeight: number;
  isReadOnly?: boolean;
  modules?: object;
  onChange: (content: string, delta: any, source: any, editor: any) => void;
  onChangeSelection: (range: any, source: any, editor: any) => void;
  onFocus: (range: any, source: any, editor: any) => void;
  onBlur: (previousRange: any, source: any, editor: any) => void;
  onKeyPress: (event: any) => void;
  onKeyDown: (event: any) => void;
  onKeyUp: (event: any) => void;
  quillComponentRef: React.RefObject<HTMLDivElement>;
}

const QuillComponentView = ({
  backgroundColor,
  containerHeight,
  defaultContent,
  isReadOnly,
  modules,
  onChange,
  onChangeSelection,
  onFocus,
  onBlur,
  onKeyPress,
  onKeyDown,
  onKeyUp,
  quillComponentRef,
  content
}: QuillComponentViewProps) => {
  const getDynamicProps = () => {
    let dynamicProps: any = {};
    if (content) {
      dynamicProps.value = content;
    } else if (defaultContent) {
      dynamicProps.defaultValue = defaultContent;
    }
    return dynamicProps;
  };

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
    <div
      ref={quillComponentRef}
      style={{
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor
      }}
    >
      <ReactQuill
        modules={getModules()}
        onChange={onChange}
        onChangeSelection={onChangeSelection}
        onFocus={onFocus}
        onBlur={onBlur}
        onKeyPress={onKeyPress}
        onKeyDown={onKeyDown}
        onKeyUp={onKeyUp}
        readOnly={isReadOnly}
        style={{ height: containerHeight ?? 0 }}
        {...getDynamicProps()}
      />
    </div>
  );
};

export default QuillComponentView;
