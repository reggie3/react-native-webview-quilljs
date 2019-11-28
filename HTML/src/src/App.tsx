import React from "react";
import * as ReactQuill from "react-quill"; // Typescript
import "react-quill/dist/quill.snow.css"; // ES6

interface State {
  text: any;
}

class App extends React.Component<null, State> {
  constructor(props: any) {
    super(props);
    this.state = { text: "" }; // You can also pass a Quill Delta here
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(value: any) {
    this.setState({ text: value });
  }

  render() {
    // @ts-ignore
    return <ReactQuill value={this.state.text} onChange={this.handleChange} />;
  }
}

export default App;
