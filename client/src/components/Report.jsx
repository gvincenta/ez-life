import React, { Component } from "react";
import ReactTable from "react-table";
import "react-table/react-table.css";
import Collapse from 'react-bootstrap/Collapse'
import Button from 'react-bootstrap/Button'
import GoalList from "./goal/goalList";
import { Line } from "react-chartjs-2";
/**Handles monthly report for client. */
var incomeData = {
  fill: false,
  backgroundColor: "rgb(0,0,240)",

  label: "income",
  data: [],
  borderColor: "rgb(0,0,240)",
  borderWidth: 0
};
var needsData = {
  fill: false,
  backgroundColor: "rgb(244,0,0)",

  label: "needs",
  data: [],
  borderColor: "rgb(244,0,0)",
  borderWidth: 0
};
var wantsData = {
  fill: false,
  backgroundColor:"rgb(254,0,250)",
  label: "wants",
  data: [],
  borderColor: "rgb(254,0,250)",
  borderWidth: 0
};
class Report extends Component {
  constructor(props) {
    super(props); // mandatory
    this.state = {
      openGraph: false,
      openReport: false,
      openGoal: false,

      mode:"unclicked",
      res: {},

      data: {
        labels: [],
        datasets: [incomeData, needsData, wantsData]
      }
    };

  }
  /**Generates monthly report from backend. */

  handleReportRetrieval = (event) =>{
    event.preventDefault();
    var self = this;
    this.props.axios.get("/report/monthly")
      .then(function(response) {
        var d = response.data;
        self.setState({ res: d });
        self.handleGraphRetrieval(event);
      })

      .catch(function(error) {
        alert(error);
      });
  }
  /** gets yearly graph report:*/
  handleGraphRetrieval = event=> {

    var self = this;
    this.props.axios.get("/report/graph")
      .then(function(response) {
        var d = response.data;
        self.processData(d);
      })

      .catch(function(error) {
        alert(error);
      });
  }
    /** process garph report:*/
  processData(data){
    //clean all arrays: 
    incomeData.data = []
    wantsData.data = []
    needsData.data = []
    var month_label = [] 
    //append to each array: 
    for (var i = 0; i <data.length; i++){
        if (data[i].label === "income"){
          incomeData.data.push(data[i].data);
        }
        //bug: will they always be sorted? 
        else if (data[i].label === "needs"){
          needsData.data.push(data[i].data);
        }
        else if (data[i].label === "wants"){
          wantsData.data.push(data[i].data);
        }
        //add label, if not yet added: 
        if(month_label.includes(data[i].month ) === false){
          month_label.push(data[i].month );
        }
    }


    // now, put back to state: 
    var newData = {labels: month_label, datasets: [incomeData, wantsData, needsData] }
    this.setState({data: newData});
    console.log(this.state.data, "finish");
    this.setState({mode:"clicked"});


  }

  render() {
    var res;
    var cols = [
      { Header: "Name", accessor: "name" },
      { Header: "Total Amount Spent/Received", accessor: "totalAmount" },
      { Header: "Type", accessor: "isIncome" }
    ];

    //displays button if not yet clicked:
    if(this.state.mode === "unclicked"){
      res = (<div> 
        

      {/* for later, allow report of any date(s): <input type="date"  onClick={this.handleChange}/> */}
        <button name = "add" type="button" class="btn btn-secondary" onClick = {this.handleReportRetrieval}> Get This Month's Report</button>
            </div>);
      
    }
    else{
      const { openGraph, openReport, openGoal } = this.state;
      res = (<div> 
        
        <table > 
          <tr>
            <td><Button
          onClick={() => this.setState({ openGraph: !openGraph,openReport: false,  openGoal:false })}
          aria-controls="example-collapse-text"
          aria-expanded={openGraph}
        >
          1a. View Graph
        </Button></td>
        <td>
        <Button
          onClick={() => this.setState({ openGraph: false,openReport: !openReport,  openGoal:false})}
          aria-controls="example-collapse-text"
          aria-expanded={openReport}
        >

          1b. View Report
        </Button>
        
        </td>
        <td> 
        <Button
          onClick={() => this.setState({ openGraph: false,openReport: false,  openGoal: !openGoal})}
          aria-controls="example-collapse-text"
          aria-expanded={openGoal}
        >
        
          2. Alter Your Goal
        </Button>
        </td>
          </tr>
          </table>
       
        <Collapse in={this.state.openGraph}>
          <div id="example-collapse-text">
          <h1>Graph on Annual Report: </h1>
            <Line data={this.state.data} />
          </div>
        </Collapse>
        
        <Collapse in={this.state.openReport}>
          <div id="example-collapse-text">
          <h1>Report of the Month: </h1>
          <ReactTable data={this.state.res.document} columns={cols} />
          </div>
        </Collapse>

        
        <Collapse in={this.state.openGoal}>
          <div id="example-collapse-text">
            <GoalList axios={this.props.axios} />
          </div>
        </Collapse>

            

        </div>);
    }


    
    //displays spending per category, net income, and instructions on what to do with goals:




    return res;
  }
}

export default Report;
