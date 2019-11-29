import React from 'react';
import ReactDOM from 'react-dom';
import QuillComponent from './QuillComponent';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<QuillComponent />, div);
  ReactDOM.unmountComponentAtNode(div);
});
