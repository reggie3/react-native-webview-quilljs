export interface Props {
    debugMessages: string[];
    doShowDebugMessages: boolean;
}
declare const DebugMessageBox: ({ debugMessages, doShowDebugMessages }: Props) => JSX.Element;
export default DebugMessageBox;
