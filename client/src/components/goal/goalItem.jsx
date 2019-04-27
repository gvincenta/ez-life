import React, {Component} from 'react';


export default class GoalItem extends Component{
    
    
    
    handleEnter= (event) => {
        if(event.key === 'Enter'){
            
          }
    }
    render(){
        const goal = this.props.goals
        
       
       //renders each cell for goal's table:
        return(
            <tr>
            <td width={120}> <div contenteditable = "true" onChange= {this.handleChange} onKeyPress = {this.handleEnter} >{goal.due} </div> </td>
            <td width={200}> <div contenteditable = "true">{goal.name} </div></td>
            <td width={200}> <div contenteditable = "true"> {goal.amount} </div></td>
            <td width={200}> <div contenteditable = "true"> {goal.progress} </div></td>
            <td width={200}> <div contenteditable = "true"> {goal.preference} </div></td>



            
        </tr>
)
    }
}