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
  COMPONENT_MOUNTED = "COMPONENT_MOUNTED"
}

export interface ReactNativeWebViewQuillJSComponentProps {
  backgroundColor?: any; // this can be set by user
  containerStyle?: ViewStyle;
  defaultValue?: string | DeltaOperation[];
  doShowDebugMessages?: boolean;
  getDeltaCallback?: any;
  getEditorCallback?: any;
  height?: number;
  htmlContentToDisplay?: string;
  isReadOnly?: boolean;
  loadingIndicator?: () => React.ReactElement;
  onContentChange?: (content: string, delta: DeltaOperation[]) => void;
  onError?: (syntheticEvent: NativeSyntheticEvent<WebViewError>) => void;
  onLoadEnd?: () => void;
  onLoadStart?: () => void;
  onMessageReceived?: (message: WebViewQuillJSMessage) => void;
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
  defaultValue: string | DeltaOperation[];
  isReadOnly: boolean;
  isReadyToRenderQuillComponent: boolean;
}

export { Quill } from "quill";
