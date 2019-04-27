import React, { Component } from 'react';

import TransList from './transaction/transList';

export default class Transaction extends Component {
  render() {
  

    return(
          <div>
            <TransList  token = {this.props.token} />

          </div>
         
        );
  }
}


