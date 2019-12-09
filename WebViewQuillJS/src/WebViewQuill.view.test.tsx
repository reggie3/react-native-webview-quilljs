import WebViewQuillView from "./WebViewQuill.view";
import { render } from "@testing-library/react-native";
import * as React from "react";

// End up getting a "ReferenceError: React is not defined" error if I don't declare React globally
// @ts-ignore
global.React = React;

const props = {
  debugMessages: [],
  handleMessage: (message: string) => {}
};

beforeEach(() => {});

describe("WebViewQuill.view.test.tsx", () => {
  it("should run a test", () => {
    expect(1 + 1).toBe(2);
  });

  it("should render", () => {
    const { container  } = render(<WebViewQuillView {...props} />);

    console.log(container);
    console.log("-------------");
  });
});
