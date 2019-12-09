import "@testing-library/jest-dom/extend-expect";
import React from "react";
import { render } from "@testing-library/react";
import { QuillComponentView } from "./QuillComponent.view";
import { DeltaObject } from "./models";
import renderer from 'react-test-renderer';
const snapshotDiff = require('snapshot-diff');

const props ={
  onQuillRef: ()=>{}
}
const defaultDelta: DeltaObject = {
  ops: [
    { insert: "This is default content", attributes: { bold: true } },

  ]
};

const sampleContent: DeltaObject = {
  ops: [
    { insert: "This is sample content", attributes: { bold: true } },
  ]
};

beforeEach(() => {
  document.getSelection = () => {
    return null;
  };
});

describe("QuillComponent.view.tsx", () => {
  it("should render an editable component", () => {
    const { container } = render(<QuillComponentView {...props}/>);
    expect(container).toMatchSnapshot();
  });

  it("should render a read only component", () => {
    const { container } = render(<QuillComponentView {...props} isReadOnly />);
    expect(container).toMatchSnapshot();
  });

  it("should display a read only component with default value provided by the defaultValue prop", () => {
    const { container } = render(
      <QuillComponentView isReadOnly defaultValue={defaultDelta} {...props}/>
    );
    expect(container.innerHTML.includes('This is default content')).toBe(true)
  });

  it('should display a read only component with content provided by content prop', () => {
    const {container} = render(<QuillComponentView isReadOnly content={sampleContent} {...props}/>)
    expect(container.innerHTML.includes('This is sample content')).toBe(true)
  });

  it("a readOnly viewer with no default value should differ from one where a default value is provided", () => {
    let readOnly = render(<QuillComponentView isReadOnly {...props}/>);
    expect(snapshotDiff(readOnly, render(
      <QuillComponentView isReadOnly defaultValue={defaultDelta} {...props} />
    ))).toMatchSnapshot();
  });


});
