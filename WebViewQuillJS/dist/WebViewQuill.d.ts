/********************************************
 * WebViewQuillEditor.js
 * A Quill.js editor component for use in react-native
 * applications that need to avoid using native code
 *
 */
import * as React from "react";
import { ReactNativeWebViewQuillJSComponentProps as Props } from "./models";
interface State {
    debugMessages: string[];
    height: number;
    isLoading: boolean;
    webviewContent: string;
}
declare class WebViewQuill extends React.Component<Props, State> {
    static defaultProps: Partial<Props>;
    private webViewRef;
    constructor(props: any);
    componentDidMount: () => void;
    private loadHTMLFile;
    componentDidUpdate: (prevProps: Props, prevState: State) => void;
    private handleMessage;
    private sendStartupMessage;
    private updateDebugMessages;
    private onError;
    private onLayout;
    private onLoadEnd;
    private onLoadStart;
    render(): JSX.Element;
}
export default WebViewQuill;
