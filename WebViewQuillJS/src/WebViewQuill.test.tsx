import WebViewQuill from './WebViewQuill';
import {render} from 'react-native-testing-library'
import * as React from 'react'

const props ={
    debugMessages:[],
    handleMessage:(message: string)=>{}
}

describe('WebViewQuill.view.test.tsx', () => {
    it('should run a test', () => {
        expect(1+1).toBe(2)
    });
   
 it('should render', () => {
         const {toJSON} = render(<WebViewQuill {...props} />)
         console.log(toJSON)
    }); 

});