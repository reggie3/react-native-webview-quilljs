import WebViewQuillView from "../WebViewQuill.view";
import { render } from "@testing-library/react-native";
import * as React from "react";

// End up getting a "ReferenceError: React is not defined" error if I don't declare React globally
// @ts-ignore
global.React = React;

const props={
  debugMessages:[], 
  handleMessage:()=>{}
}

beforeEach(() => {});

describe("WebViewQuill.view.test.tsx", () => {
  it("should render", () => {
    const { container  } = render(<WebViewQuillView {...props} />);
    expect(container).toMatchSnapshot()
  });
});
