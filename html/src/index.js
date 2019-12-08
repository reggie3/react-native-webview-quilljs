import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import QuillComponent from './QuillComponent'
// import QuillEditorComponent from './QuillEditorComponent';
// import QuillViewerComponent from './QuillViewerComponent';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(<QuillComponent />, document.getElementById('root'));


/* ReactDOM.render(
    <div style={{ height: "500px", backgroundColor: "lightblue" }}>
      <div style={{ flex: 1, backgroundColor: 'goldenrod' }}>
        <QuillEditorComponent />
      </div>
      <div style={{ flex: 1, backgroundColor: 'lightsalmon' }}>
        <QuillViewerComponent />
      </div>
    </div>,
    document.getElementById("root")
  ); */
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
