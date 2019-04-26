import React, {Component} from 'react';

export default class TransItem extends Component{


    

    render(){
        const trans = this.props.trans
        // const progfront = (goal.progExp > goal.progNow)? "progress-bar" : "progress-bar progress-bar-success"
        // const datafront = (goal.progExp > goal.progNow)? goal.progNow : goal.progExp
        // const progback = (progfront === "progress-bar")?"progress-bar progress-bar-success" : "progress-bar"
        // const databack = (progfront === "progress-bar")? goal.progExp - goal.progNow: goal.progNow - goal.progExp

        return(
            <tr>
            <td width={120}>{trans.name}</td>
            <td width={200}>{trans.amount}</td>
            <td width={200}>{trans.date}</td>


            {/*<div className="progress">
                   
                    { <ProgressBar className={progfront} style={{width: `${datafront}%`}}/>
                    <ProgressBar className={progback} style={{width: `${databack}%`}}/>}
                    <ProgressBar className="progress-bar" style={{width:'40'}} />
                </div> 
        
            <td>
                <button type="button" className="btn-icon" onClick ={this.handleUpdateClick}>
                        <Icon name="update" width={20} fill={"#42778c"} />
                </button>
            </td>
            */}
        </tr>
)
    }
}