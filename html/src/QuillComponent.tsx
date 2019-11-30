import React from "react";
import * as ReactQuill from "react-quill"; // Typescript
import "react-quill/dist/quill.snow.css"; // ES6
import { DeltaOperation } from "quill";
import QuillEditorComponentView from "./QuillEditorComponent.view";
import { WebViewQuillJSMessage, MessageInstruction } from "./models";
import { isEqual } from "lodash";

export enum ContentType {
  DELTA = "DELTA",
  HTML = "HTML"
}
interface State {
  contentType: ContentType;
  content: string | DeltaOperation[] | null;
  delta: DeltaOperation[];
  debugMessages: string[];
  html: string;
}

class QuillEditorComponent extends React.Component<null, State> {
  private quillRef = null;
  constructor(props: any) {
    super(props);
    this.state = {
      contentType: ContentType.DELTA,
      debugMessages: ["test message"],
      content: null,
      delta: [],
      html: ""
    };
  }

  componentDidMount = () => {
    this.sendMessage({
      instruction: MessageInstruction.COMPONENT_MOUNTED
    });
    console.log("componentDidMount");
    this.setState(
      { debugMessages: [...this.state.debugMessages, "componentDidMount"] },
      () => {
        try {
          this.sendMessage({
            instruction: MessageInstruction.QUILL_READY
          });
        } catch (error) {
          this.addDebugMessage(error);
        }

        if (document) {
          document.addEventListener("message", this.handleMessage);
          this.addDebugMessage("set document listeners");
          this.sendMessage({
            instruction: MessageInstruction.DOCUMENT_EVENT_LISTENER_ADDED
          });
        }
        if (window) {
          window.addEventListener("message", this.handleMessage);
          this.addDebugMessage("setting Window");
          this.sendMessage({
            instruction: MessageInstruction.WINDOW_EVENT_LISTENER_ADDED
          });
        }
        if (!document && !window) {
          this.sendMessage({
            error: "UNABLE_TO_ADD_EVENT_LISTENER"
          });
          return;
        }
      }
    );
  };

  componentDidUpdate = (prevProps: any, prevState: State) => {
    const { content, debugMessages } = this.state;
    if (debugMessages !== prevState.debugMessages) {
      console.log(debugMessages);
    }
    if (content && !isEqual(content, prevState.content)) {
      if (Array.isArray(content)) {
        this.setState({
          delta: content,
          contentType: ContentType.DELTA
        });
      } else if (typeof content === "string") {
        this.setState({
          html: content,
          contentType: ContentType.HTML
        });
      } else {
        throw `Unexpected content type ${typeof content}`;
      }
    }
  };

  componentWillUnmount = () => {
    if (document) {
      document.removeEventListener("message", this.handleMessage);
      this.sendMessage({
        instruction: MessageInstruction.DOCUMENT_EVENT_LISTENER_REMOVED
      });
    }
    if (window) {
      window.removeEventListener("message", this.handleMessage);
      this.sendMessage({
        instruction: MessageInstruction.WINDOW_EVENT_LISTENER_REMOVED
      });
    }
  };

  private addDebugMessage = (msg: any) => {
    if (typeof msg === "object") {
      this.addDebugMessage("STRINGIFIED");
      this.setState({
        debugMessages: [
          ...this.state.debugMessages,
          JSON.stringify(msg, null, 4)
        ]
      });
    } else {
      this.setState({ debugMessages: [...this.state.debugMessages, msg] });
    }
  };

  private handleMessage = (event: any) => {
    this.addDebugMessage(event.data);
    try {
      // this.setState({ ...this.state, ...event.data });
    } catch (error) {
      this.addDebugMessage({ error: JSON.stringify(error) });
    }
  };

  protected sendMessage = (message: WebViewQuillJSMessage) => {
    // @ts-ignore
    if (window.ReactNativeWebView) {
      // @ts-ignore
      window.ReactNativeWebView.postMessage(JSON.stringify(message));
      console.log("sendMessage  ", JSON.stringify(message));
    }
  };

  handleChange = (
    html: string,
    delta: DeltaOperation[],
    source: any,
    editor: any
  ) => {
    this.sendMessage({
      instruction: MessageInstruction.CONTENT_CHANGED,
      payload: { html, delta }
    });
  };

  onQuillRef = (ref: any) => {
    if (this.quillRef === null) {
      this.quillRef = ref;
    }
  };

  render() {
    const { contentType, delta, html } = this.state;
    return (
      // @ts-ignore
      <QuillEditorComponentView
        content={contentType === ContentType.DELTA ? delta : html}
        debugMessages={this.state.debugMessages}
        handleChange={this.handleChange}
        onQuillRef={this.onQuillRef}
      />
    );
  }
}

export default QuillEditorComponent;
