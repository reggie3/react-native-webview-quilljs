import React from "react";
import * as ReactQuill from "react-quill"; // Typescript
import "react-quill/dist/quill.snow.css"; // ES6
import { DeltaOperation } from "quill";
import QuillComponentView from "./QuillComponent.view";
import { WebViewQuillJSMessage, MessageInstruction } from "./models";
import { isEqual } from "lodash";

export enum ContentType {
  DELTA = "DELTA",
  HTML = "HTML"
}
interface State {
  content: string | DeltaOperation[];
  defaultValue: string | DeltaOperation[];
  delta: DeltaOperation[];
  debugMessages: string[];
  doShowQuillComponentDebugMessages: boolean;
  height: number;
  html: string;
  isReadOnly: boolean | null;
  modules: object;
}

class QuillEditorComponent extends React.Component<null, State> {
  private quillRef = null;
  constructor(props: any) {
    super(props);
    this.state = {
      debugMessages: ["test message"],
      doShowQuillComponentDebugMessages: false,
      defaultValue: "",
      content: "",
      delta: [],
      height: 100,
      html: "",
      isReadOnly: null,
      modules: {}
    };
  }

  componentDidMount = () => {
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
      this.setState({ ...this.state, ...event.data });
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

  private onChange = (
    html: string,
    delta: DeltaOperation[],
    source: any,
    editor: any
  ) => {
    editor.getContent();
    this.sendMessage({
      instruction: MessageInstruction.CONTENT_CHANGED,
      payload: {
        html: editor.getHTML(),
        delta: editor.getContents(),
        text: editor.getText(),
        source,
        editor
      }
    });
  };

  private onChangeSelection = (range: any, source: any, editor: any) => {
    this.sendMessage({
      instruction: MessageInstruction.ON_CHANGE_SELECTION,
      payload: {
        range,
        selection: editor.getSelection(),
        html: editor.getHTML(),
        delta: editor.getContents(),
        text: editor.getText(),
        source,
        editor
      }
    });
  };
  private onFocus = (range: any, source: any, editor: any) => {
    this.sendMessage({
      instruction: MessageInstruction.ON_FOCUS,
      payload: { range, source, editor }
    });
  };
  private onBlur = (previousRange: any, source: any, editor: any) => {
    this.sendMessage({
      instruction: MessageInstruction.ON_BLUR,
      payload: { previousRange, source, editor }
    });
  };
  private onKeyPress = (event: any) => {
    this.sendMessage({
      instruction: MessageInstruction.ON_KEY_PRESS,
      payload: { event }
    });
  };
  private onKeyDown = (event: any) => {
    this.sendMessage({
      instruction: MessageInstruction.ON_KEY_DOWN,
      payload: { event }
    });
  };
  private onKeyUp = (event: any) => {
    this.sendMessage({
      instruction: MessageInstruction.ON_KEY_UP,
      payload: { event }
    });
  };

  onQuillRef = (ref: any) => {
    if (this.quillRef === null) {
      this.quillRef = ref;
    }
  };

  private shouldRenderQuillComponentView = () => {
    const { isReadOnly } = this.state;
    return isReadOnly === true || isReadOnly === false;
  };

  render() {
    const {
      content,
      debugMessages,
      defaultValue,
      doShowQuillComponentDebugMessages,
      height,
      isReadOnly
    } = this.state;
    return (
      <>
        {this.shouldRenderQuillComponentView() && (
          // @ts-ignore
          <QuillComponentView
            addDebugMessage={this.addDebugMessage}
            content={content}
            debugMessages={debugMessages}
            defaultValue={defaultValue}
            height={height}
            onChange={this.onChange}
            onChangeSelection={this.onChangeSelection}
            onFocus={this.onFocus}
            onBlur={this.onBlur}
            onKeyPress={this.onKeyPress}
            onKeyDown={this.onKeyDown}
            onKeyUp={this.onKeyUp}
            isReadOnly={isReadOnly as boolean}
            onQuillRef={this.onQuillRef}
          />
        )}
        {doShowQuillComponentDebugMessages && (
          <div
            style={{
              backgroundColor: "orange",
              maxHeight: "200px",
              overflow: "auto",
              padding: 5,
              position: "fixed",
              bottom: 0,
              left: 0,
              right: 0,
              zIndex: 15000
            }}
            id="messages"
          >
            <ul>
              {debugMessages.map((message: string, index: number) => {
                return <li key={index}>{message}</li>;
              })}
            </ul>
          </div>
        )}
      </>
    );
  }
}

export default QuillEditorComponent;
