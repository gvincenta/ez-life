import React, { Component } from 'react';

//import TransList from './transaction/transList';
import TransList from './newTransaction/newTransList.jsx'

export default class Transaction extends Component {
  render() {
  

    return(
          <div>
            <TransList />

          </div>
         
        );
  }
}



