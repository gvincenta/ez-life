import React, {Component} from 'react';


export default class GoalItem extends Component{
    
    
    
    handleEnter= (event) => {
        if(event.key === 'Enter'){
            
          }
    }
    render(){
        const goal = this.props.goals
        
       
       
        return(
            <tr>
            <td width={120}> <div  >{goal.due} </div> </td>
            <td width={200}> <div >{goal.name} </div></td>
            <td width={200}> <div > {goal.amount} </div></td>
            <td width={200}> <div > {goal.progress} </div></td>
            <td width={200}> <div > {goal.preference} </div></td>



            
        </tr>
)
    }
}