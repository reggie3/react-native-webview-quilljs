import * as React from "react";
import * as Quill from "quill";
import * as ReactQuill from "react-quill";
import { DeltaOperation } from "quill";
import { NativeSyntheticEvent, ViewStyle } from "react-native";
import { WebViewError } from "react-native-webview/lib/WebViewTypes";

export enum MessageInstruction {
  DOCUMENT_EVENT_LISTENER_ADDED = "DOCUMENT_EVENT_LISTENER_ADDED",
  DOCUMENT_EVENT_LISTENER_REMOVED = "DOCUMENT_EVENT_LISTENER_REMOVED",
  WINDOW_EVENT_LISTENER_ADDED = "WINDOW_EVENT_LISTENER_ADDED",
  WINDOW_EVENT_LISTENER_REMOVED = "WINDOW_EVENT_LISTENER_REMOVED",
  QUILL_READY = "QUILL_READY",
  GET_CONTENT = "GET_CONTENT",
  SET_CONTENT = "SET_CONTENT",
  CONTENT_CHANGED = "CONTENT_CHANGED",
  UNABLE_TO_ADD_EVENT_LISTENER = "UNABLE_TO_ADD_EVENT_LISTENER",
  COMPONENT_MOUNTED = "COMPONENT_MOUNTED",
  ON_CHANGE_SELECTION = "ON_CHANGE_SELECTION",
  ON_FOCUS = "ON_FOCUS",
  ON_BLUR = "ON_BLUR",
  ON_KEY_PRESS = "ON_KEY_PRESS",
  ON_KEY_DOWN = "ON_KEY_DOWN",
  ON_KEY_UP = "ON_KEY_UP"
}

export interface DeltaObject {
  ops: DeltaOperation[];
}
export interface ReactNativeWebViewQuillJSComponentProps {
  backgroundColor?: any; // this can be set by user
  containerStyle?: ViewStyle;
  content?: string | DeltaOperation[];
  defaultValue?: string | DeltaOperation[];
  doShowDebugMessages?: boolean;
  doShowQuillComponentDebugMessages: boolean;
  height?: number;
  isReadOnly?: boolean;
  loadingIndicator?: () => React.ReactElement;
  onContentChange?: (content: string, delta: DeltaOperation[]) => void;
  onError?: (syntheticEvent: NativeSyntheticEvent<WebViewError>) => void;
  onLoadEnd?: () => void;
  onLoadStart?: () => void;
  onMessageReceived?: (message: object) => void;
  style?: ViewStyle;
}

export interface WebViewQuillJSMessage {
  instruction?: MessageInstruction;
  payload?: SetContentPayload | any;
  error?: string;
}

export interface SetContentPayload {
  html: string;
  delta: DeltaOperation[];
}

export interface StartupMessage {
  backgroundColor: string;
  defaultValue: string | DeltaOperation[];
  doShowQuillComponentDebugMessages: boolean;
  height: number;
  isReadOnly: boolean;
}

export { Quill } from "quill";
