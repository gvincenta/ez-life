import React, { Component } from "react";

import "react-table/react-table.css";
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import Typography from '@material-ui/core/Typography';
import { Line ,Chart, Doughnut} from "react-chartjs-2";
import GoalList from "./goal/goalList";
import "bootstrap-directional-buttons";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

var income = [];
var needs= [];
var wants= []; 
var incomeTotal = 0;
var needsTotal = 0;
var wantsTotal = 0;
var wantsAvg = 0;
var incomeAvg = 0;
var needsAvg = 0;
var idx_above_needs = [];
var idx_above_wants = [];
var idx_above_income = [];
var run_span = 0; 
var maxWants, minWants;
function Suggest(props) {
  SpanningTable(props);

  var myPieChart = {
    labels : ["income","needs","wants"],
    datasets : [{ label :["income","needs","wants"], backgroundColor: ["rgb(120,230,240)","rgb(200,121,210)","rgb(10,200,21)"], data : [ 5 , 30,75 ]}]
  }
  /**Generates monthly report from backend. */
  if (wants.length > 0){

    wantsAvg =  wantsTotal / wants.length;
    
    
    if (income.length > 0){
      incomeAvg =  incomeTotal / income.length;
      
    }
    if (needs.length > 0){
      needsAvg =  needsTotal / needs.length;
    }
    console.log("rummm");
    console.log(maxWants.preference, maxWants);
    return (<div class="jumbotron card card-image" >
    <Doughnut data = {myPieChart}/>
  <div class="text-white text-center py-5 px-4">
    <div>
    <p class="mx-5 mb-5"> Your huge spending was on : {maxWants.name}, as much as : {maxWants.totalAmount}, with preference of: {maxWants.preference}</p>
      <p class="mx-5 mb-5">Your smallest spending was on :  {minWants.name}, as much as : {minWants.totalAmount}, with preference of: {minWants.preference}</p>
      { (maxWants.preference < minWants.preference)
        ? <p> You may want to re-prioritise your preferences for your wants' categories. </p>
        : <p> Your wants' preference seem to be sorted out. Keep up the good work! </p>
      }
    </div>
  </div>
</div>);
  }
    
  
  

  else{
    return (<div class="jumbotron card card-image" >
      <Doughnut data = {myPieChart}/>
    <div class="text-white text-center py-5 px-4">
      <div>
        <h2 class="card-title h1-responsive pt-3 mb-5 font-bold"><strong>No Non-Obligatory Spending this month!</strong></h2>
        <p class="mx-5 mb-5">Congratulations! You have endured your temptation this month!</p>
      </div>
    </div>
  </div>);
  }
  


  
  }
  function compareAvg(){
  
    for (var i = 0; i < wants.length ; i++){
      if (needsAvg > 0  && wants[i] > needsAvg){
        idx_above_needs.push(i);
      }
      if (wantsAvg > 0  && wants[i] > wantsAvg){
        idx_above_wants.push(i);

      }
      if (incomeAvg > 0  && wants[i] > incomeAvg){
        idx_above_income.push(i);

      }
    }
  }



 function SpanningTable(props) {
 /**Generates monthly report from backend. */
 var d =   props.res.document;
 if (run_span == 0){
  for (var i = 0; i < props.res.document.length ; i++){
    if (props.res.document[i].isIncome === "income"){
      income.push(props.res.document[i]);
      incomeTotal += props.res.document[i].totalAmount;
    }
    else if (props.res.document[i].isIncome === "needs"){
      needs.push(props.res.document[i]);
      needsTotal += props.res.document[i].totalAmount;
    }
    else if (props.res.document[i].isIncome === "wants"){
      if (wants.length == 0){
        maxWants = props.res.document[i];
        minWants = props.res.document[i];
      }
      else{
        if (maxWants.totalAmount < props.res.document[i].totalAmount){
          maxWants = props.res.document[i];
        }
        if (minWants.totalAmount > props.res.document[i].totalAmount){
          minWants = props.res.document[i];
        }
      }
      wants.push(props.res.document[i]);
      wantsTotal += props.res.document[i].totalAmount;
    }
 }
 }
 run_span +=1;


  
    
    return ( <Paper >
      <Table>
        <TableHead>
          <TableRow>
            <TableCell align="left">Income Category </TableCell>
            
            <TableCell align="right">Amount</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
       
        {income.map((item, index) => (
             
              <TableRow>
                
              <TableCell align="left" >{item.name}</TableCell>
              <TableCell align="right">{item.totalAmount}</TableCell>
            </TableRow>
            ))}
        <TableRow>

                <TableCell align="right">Subtotal</TableCell>
                <TableCell align="right">{incomeTotal}</TableCell>
        </TableRow>

      </TableBody></Table>
      <Table >
        <TableHead>
          <TableRow>
            <TableCell align="left">Needs Category </TableCell>
            
            <TableCell align="right">Amount</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
       
        {needs.map((item, index) => (
             
              <TableRow>
                
              <TableCell align="left">{item.name}</TableCell>
              <TableCell align="right">{item.totalAmount}</TableCell>
            </TableRow>
            ))}
        <TableRow>

                <TableCell align="right">Subtotal</TableCell>
                <TableCell align="right">{needsTotal}</TableCell>
        </TableRow> </TableBody>
      </Table>
        <Table >
        <TableHead>
          <TableRow>
            <TableCell align="left">Wants Category </TableCell>
            <TableCell align="left">Preference </TableCell>

            <TableCell align="right">Amount</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
       
      
      
       {wants.map((item, index) => (
             
             <TableRow>
             <TableCell align="left">{item.name}</TableCell>
             <TableCell align="right">{item.preference}</TableCell>
             <TableCell align="right">{item.totalAmount}</TableCell>
           </TableRow>
           ))}
       <TableRow>
       <TableCell ></TableCell>
               <TableCell align="right">Subtotal</TableCell>
               <TableCell align="right">{wantsTotal}</TableCell>
       </TableRow>
          
         
        </TableBody>
      </Table>
      <Table>
        <TableHead>
          <TableCell align="right"> Net: </TableCell>
          <TableCell align="right"> {incomeTotal - wantsTotal - needsTotal}</TableCell>
          </TableHead></Table>
</Paper>);
/*const { classes } = props;

);*/
}

/**Handles monthly report for client. */
function TabContainer(props) {
  return (
    <Typography component="div" style={{ padding: 8 * 3 }}>
      {props.children}
    </Typography>
  );
}

function Graph(props) {
  //console.log(props.axios);
  var data = handleGraphRetrieval(props); 
    
  return (
    <div>
      <Line data={data} />
    </div>
  );
}
/** gets yearly graph report:*/
var handleGraphRetrieval = (props)=> {

  props.axios.get("/report/graph")
    .then(function(response) {
      var d = response.data;
      processData(d);
    })

    .catch(function(error) {
      alert(error);
    });
}
  /** process garph report:*/
var processData = data =>{
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
  return newData;

}

class Report extends Component {
  constructor(props) {
    super(props); // mandatory
    this.handleSelect = this.handleSelect.bind(this);


    this.state = {
      value: 3,
      openGraph: false,
      openReport: false,
      openGoal: false,
      index: 0,
      direction: null,

      mode:"unclicked",
      res: {},

      data: {
        labels: [],
      }
    };
    this.handleReportRetrieval();

  }

  handleReportRetrieval = (event) =>{
    console.log("finish");

    var self = this;
    this.props.axios.get("/report/monthly")
      .then(function(response) {
        var d = response.data;
        self.setState({ res: d });
      })

      .catch(function(error) {
        alert(error);
      });
  }
  handleSelect(selectedIndex, e) {
    this.setState({
      index: selectedIndex,
      direction: e.direction,
    });
  }
  handleTabChange = (event, value) => {
    this.setState({ value });
  };

  render() {
      var value = this.state.value;
      var res = this.state.res;
      return (
      
      <div> 
        	
          <AppBar position="static"  style={{ background: '#437487' }}>
          <Tabs style={{ background: '#437487', fontSize: 30 }} value={value} onChange={this.handleTabChange} variant="scrollable" scrollButtons="auto" indicatorColor="inherit"textColor="inherit">
          <Tab label="Tell Me Further"  class="btn btn-info btn-arrow-left" />
          <Tab label="Suggestion" class="btn btn-info btn-arrow-left"  />
          <Tab label="Monthly Report Details" class="btn btn-info btn-arrow-left"  onActive = {this.handleReportRetrieval} />
          <Tab label="Report Graph"  class="btn btn-info btn-arrow-left" />
            
            
            
            <Tab label="Change Goals"  class="btn btn-info btn-arrow-right" />
            <Tab label="Plan My Budget"  class="btn btn-info btn-arrow-right" />
            <Tab label="Compare"  class="btn btn-info btn-arrow"  />

            
          </Tabs>
        </AppBar>
       
        {value === 0 && <Graph axios = {this.props.axios}>Item 1</Graph>}
        {value === 1 && <Suggest  res = {this.state.res}/>}
        {value === 2 && <SpanningTable res = {this.state.res}/>}
        {/** 
        {value === 3 && <Graph axios = {this.props.axios}>Item 1</Graph>}
        {value === 4 && <GoalList axios = {this.props.axios}/>}
        {value === 5 && <TabContainer>Item Three</TabContainer>}
        {value === 6 && <Graph axios = {this.props.axios}>Item 1</Graph>}
        */}
   
      </div>);
    
  }
}

export default Report;
