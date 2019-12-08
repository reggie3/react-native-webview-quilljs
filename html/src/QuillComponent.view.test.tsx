import "@testing-library/jest-dom/extend-expect";

import React from "react";
import { render } from "@testing-library/react";
import { QuillComponentView } from "./QuillComponent.view";
import { DeltaObject } from "./models";

const sampleDelta: DeltaObject = {
  ops: [
    { insert: "Gandalf 1", attributes: { bold: true } },
    { insert: " the " },
    { insert: "Grey", attributes: { color: "#cccccc" } }
  ]
};

beforeEach(() => {
  document.getSelection = () => {
    return null;
  };
});

describe("QuillComponent.view.tsx", () => {
  it("should render an editable component", () => {
    const { container } = render(<QuillComponentView />);
    expect(container).toMatchSnapshot();
  });
  it("should render a read only component", () => {
    const { container } = render(<QuillComponentView isReadOnly />);
    expect(container).toMatchSnapshot();
  });
  it("should render a read only component with a default value", () => {
    const { container } = render(
      <QuillComponentView isReadOnly defaultValue={sampleDelta} />
    );
    expect(container).toMatchSnapshot();
  });
  it("a readOnly viewer with no default value should differ from one where a default value is provided", () => {
    const { container: readOnly } = render(<QuillComponentView isReadOnly />);
    const { container: readOnlyWithDefaultContent } = render(
      <QuillComponentView isReadOnly content={sampleDelta} />
    );
    expect(readOnly).not.toEqual(readOnlyWithDefaultContent);
  });
});
