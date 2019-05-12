import React, { Component } from "react";
import ReactTable from "react-table";
import "react-table/react-table.css";
import Collapse from 'react-bootstrap/Collapse'
import Button from 'react-bootstrap/Button'
import GoalList from "./goal/goalList";

import { Line } from "react-chartjs-2";
/**Handles monthly report for client. */
var incomeData = {
  label: "income",
  data: [],
  backgroundColor: "rgba(67,116,135, 0.6)",
  borderWidth: 0
};
var needsData = {
  label: "needs",
  data: [],
  backgroundColor: "rgba(244,164,100, 0.6)",
  borderWidth: 0
};
var wantsData = {
  label: "wants",
  data: [],
  backgroundColor: "rgba(100,164,100, 0.6)",
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
    this.props.axios
      .get("/report/monthly")
      .then(function(response) {
        var d = response.data;
        self.setState({ res: d });
        self.handleGraphRetrieval(event);
      })

      .catch(function(error) {
        alert(error);
      });
  }
  handleGraphRetrieval = event=> {

    var self = this;
    this.props.axios
      .get("/report/graph")
      .then(function(response) {
        var d = response.data;
        self.processData(d);
      })

      .catch(function(error) {
        alert(error);
      });
  }
  processData(data){
    console.log(data, "pcoressing");
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
    //var res;
    var res;


    //displays button if not yet clicked:
    if(this.state.mode === "unclicked"){
      res = (<div> 
        

        <input type="date"  onClick={this.handleChange}/> 
        <button name = "add" type="button" class="btn btn-secondary" onClick = {this.handleReportRetrieval}> Get This Month's Report</button>
            </div>);
      
    }
    else{
      const { openGraph, openReport, openGoal } = this.state;
      res = (<div> 
       <Button
          onClick={() => this.setState({ openGraph: !openGraph })}
          aria-controls="example-collapse-text"
          aria-expanded={openGraph}
        >
          Click to View Graph
        </Button>
        <Collapse in={this.state.openGraph}>
          <div id="example-collapse-text">
            <Line data={this.state.data} />
          </div>
        </Collapse>
        <hr />
        <Button
          onClick={() => this.setState({ openReport: !openReport })}
          aria-controls="example-collapse-text"
          aria-expanded={openReport}
        >
          Click to View Report
        </Button>
        <Collapse in={this.state.openReport}>
          <div id="example-collapse-text">
            <p> hi 1 </p>
          </div>
        </Collapse>
        <hr />

        <Button
          onClick={() => this.setState({ openGoal: !openGoal })}
          aria-controls="example-collapse-text"
          aria-expanded={openGoal}
        >
          Click to View Goal
        </Button>
        <Collapse in={this.state.openGoal}>
          <div id="example-collapse-text">
            <GoalList token={this.props.token} />
          </div>
        </Collapse>

            

        </div>);
    }


    
    //displays spending per category, net income, and instructions on what to do with goals:



    // if (Object.keys(this.state.res).length !== 0) {
    //   var cols = [
    //     { Header: "Name", accessor: "name" },
    //     { Header: "Total Amount Spent/Received", accessor: "totalAmount" },
    //     { Header: "Type", accessor: "isIncome" }
    //   ];
    //   var len = this.state.res.document.length - 1;
    //   console.log(this.state.res.document);
    //   var arr = this.state.res.document;

    //   if (this.state.res.found === false) {
    //     arr = this.state.res.document.slice(0, len);
    //     var remain = this.state.res.document[len];

    //     var msg = "Neither loses or savings made. here are your goals: ";
    //     if (remain > 0) {
    //       msg = "Nice save! please assign these remaining to your goals:";
    //     } else if (remain < 0) {
    //       msg =
    //         "OH no! you've made losses! please accomodate these losses by taking away your long term saving or emergency funds:";
    //     }
    //     res = (
    //       <div>
    //         <ReactTable data={arr} columns={cols} minRows={len} />
    //         <br />
    //         <h2>
    //           {" "}
    //           Your Remaining Balance For this{" "}
    //           {new Intl.DateTimeFormat("en-US", { month: "long" }).format(
    //             new Date()
    //           )}{" "}
    //           : {remain}{" "}
    //         </h2>
    //         <br />
    //         <h2> {msg} </h2>
    //         <Goals token={this.props.token} />
    //       </div>
    //     );
    //   } else {
    //     res = (
    //       <div>
    //         <ReactTable data={arr} columns={cols} minRows={len} />
    //         <br />
    //         <h2>
    //           {" "}
    //           {"You've made report for this "}
    //           {new Intl.DateTimeFormat("en-US", { month: "long" }).format(
    //             new Date()
    //           )}{" "}
    //         </h2>
    //       </div>
    //     );
    //   }
    // }

    return res;
  }
}

export default Report;
