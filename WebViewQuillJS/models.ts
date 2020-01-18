import * as React from "react";
import * as Quill from "quill";

export interface WebViewQuillJSProps {
  backgroundColor?: string;
  content?: Quill.Delta | string | object;
  defaultContent?: Quill.Delta | string | object;
  doShowDebugMessages?: boolean;
  doShowQuillComponentDebugMessages?: boolean;
  isReadOnly?: boolean;
  loadingIndicator?: () => React.ReactElement;
  onError?: (syntheticEvent: any) => void;
  onLoadEnd?: () => void;
  onLoadStart?: () => void;
  onMessageReceived?: (message: any) => void;
}
export enum WebviewQuillJSEvents {
  QUILLJS_COMPONENT_MOUNTED = "QUILLJS_COMPONENT_MOUNTED",
  DOCUMENT_EVENT_LISTENER_ADDED = "DOCUMENT_EVENT_LISTENER_ADDED",
  WINDOW_EVENT_LISTENER_ADDED = "WINDOW_EVENT_LISTENER_ADDED",
  UNABLE_TO_ADD_EVENT_LISTENER = "UNABLE_TO_ADD_EVENT_LISTENER",
  DOCUMENT_EVENT_LISTENER_REMOVED = "DOCUMENT_EVENT_LISTENER_REMOVED",
  WINDOW_EVENT_LISTENER_REMOVED = "WINDOW_EVENT_LISTENER_REMOVED",
  ON_CHANGE = "ON_CHANGE",
  ON_CHANGE_SELECTION = "ON_CHANGE_SELECTION",
  ON_FOCUS = "ON_FOCUS",
  ON_BLUR = "ON_BLUR",
  ON_KEY_PRESS = "ON_KEY_PRESS",
  ON_KEY_DOWN = "ON_KEY_DOWN",
  ON_KEY_UP = "ON_KEY_UP"
}

export type WebviewQuillJSMessage = {
  event?: WebviewQuillJSEvents;
  msg?: string;
  error?: string;
  payload?: any;
};

export type StartupMessage = {
  backgroundColor?: string;
  content?: Quill.Delta | string | object;
  doShowQuillComponentDebugMessages?: boolean;
  isReadOnly?: boolean;
};
