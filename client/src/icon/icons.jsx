import React from 'react';

import Plus from './plus/plus'
import Update from './update/update'

const Icon = props => {
    if(props.name === "plus"){
        return <Plus {...props} />;
    } else if(props.name === "update"){
        return <Update {...props} />;
    } else {
        return
    }
}

export default Icon;