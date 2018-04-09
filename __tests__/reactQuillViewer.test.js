// setup file
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });
// test file
import { shallow, mount, render } from 'enzyme';
import assert from 'assert';
import ReactQuillViewer from '../web/reactQuillViewer.js';
import React from 'react';
import ReactDom from 'react-dom';

describe('reactQuillViewer', () => {
	it('should render without crashing', () => {
		const component = shallow(<ReactQuillViewer />);

		assert(component.length, 'rendered');
    });
});