import { ReactElement } from "react";
import { NativeSyntheticEvent, ViewStyle } from "react-native";
import { WebView } from "react-native-webview";
import { WebViewError } from "react-native-webview/lib/WebViewTypes";
import { DeltaOperation } from "quill";
export interface Props {
    backgroundColor?: string;
    containerStyle?: ViewStyle;
    debugMessages: string[];
    defaultValue?: string | DeltaOperation[];
    doShowDebugMessages?: boolean;
    handleMessage: (data: string) => void;
    webviewContent?: string;
    loadingIndicator?: () => ReactElement;
    onError?: (syntheticEvent: NativeSyntheticEvent<WebViewError>) => void;
    onLayout?: (event: any) => void;
    onLoadEnd?: () => void;
    onLoadStart?: () => void;
    setWebViewRef?: (ref: WebView) => void;
    style?: ViewStyle;
}
declare const WebViewQuillView: ({ backgroundColor, containerStyle, debugMessages, doShowDebugMessages, handleMessage, webviewContent, loadingIndicator, onError, onLayout, onLoadEnd, onLoadStart, setWebViewRef, style }: Props) => JSX.Element;
export default WebViewQuillView;
