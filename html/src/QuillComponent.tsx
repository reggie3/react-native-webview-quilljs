import React from "react";
import * as ReactQuill from "react-quill"; // Typescript
import "react-quill/dist/quill.snow.css"; // ES6
import { DeltaOperation } from "quill";

interface State {
  isReadonly: boolean;
  text: DeltaOperation[];
}

class QuillComponent extends React.Component<null, State> {
  constructor(props: any) {
    super(props);
    this.state = { isReadonly: false, text: [] }; // You can also pass a Quill Delta here
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(content: string, delta: DeltaOperation[]) {
    this.setState({ text: delta });
  }

  render() {
    return (
      // @ts-ignore
      <ReactQuill
        onChange={this.handleChange}
        readonly={this.state.isReadonly}
        value={this.state.text}
      />
    );
  }
}

export default QuillComponent;
