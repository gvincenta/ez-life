import React, { Component } from 'react';

import TransList from './transaction/transList';
//import TransList from './newTransaction/newTransList.jsx' <-- is now under deprecated directory. this was our attempt on ant design. 

export default class Transaction extends Component {
  render() {
  

    return(
          <div>
            <TransList />

          </div>
         
        );
  }
}



