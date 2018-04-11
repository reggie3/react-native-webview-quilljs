// setup file
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });
// test file
import { shallow, mount, render } from 'enzyme';
import assert from 'assert';
import ReactQuillEditor from '../web/reactQuillEditor.js';
import React from 'react';
import ReactDom from 'react-dom';

describe('reactQuillEditor', () => {
	it('should render without crashing', () => {
		const component = shallow(<ReactQuillEditor />);

		assert(component.length, 'rendered');
    });
});