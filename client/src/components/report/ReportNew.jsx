import React, { Component } from "react";

import "react-table/react-table.css";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

import Typography from "@material-ui/core/Typography";
import { Line, Doughnut } from "react-chartjs-2";
import GoalList from "../goal/goalList";
import "bootstrap-directional-buttons";

import SuggestFurther from "./SuggestFurther";
import BudgetSuggest from "./BudgetSuggest";
import BudgetList from "../budget/budgetList";

var income = [];
var needs = [];
var wants = [];
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
function CheckWants() {
  return (
    <div>
      <p class="mx-5 mb-5">
        {" "}
        Your huge spending was on : {maxWants.name}, as much as :{" "}
        {maxWants.totalAmount}, with preference of: {maxWants.preference}
      </p>
      <p class="mx-5 mb-5">
        Your smallest spending was on : {minWants.name}, as much as :{" "}
        {minWants.totalAmount}, with preference of: {minWants.preference}
      </p>

      {maxWants.preference < minWants.preference ? (
        <p>
          {" "}
          You may want to re-prioritise your preferences for your wants'
          categories.{" "}
        </p>
      ) : (
        <p>
          {" "}
          Your wants' preference seem to be sorted out. Keep up the good work!{" "}
        </p>
      )}
    </div>
  );
}
function Suggest(props) {
  var data = props.daily;
  var myPieChart = {
    labels: ["income", "needs", "wants"],
    datasets: [
      {
        label: ["income", "needs", "wants"],
        backgroundColor: [
          "rgb(120,230,240)",
          "rgb(200,121,210)",
          "rgb(10,200,21)"
        ],
        data: [incomeTotal - needsTotal - wantsTotal, needsTotal, wantsTotal]
      }
    ]
  };
  return (
    <div class="jumbotron card card-image">
      <Line data={data} />
      {incomeTotal - needsTotal - wantsTotal >= 0 ? (
        <Doughnut data={myPieChart} />
      ) : (
        <hr />
      )}
      <div class="text-white text-center py-5 px-4">
        <div>
          {incomeTotal - needsTotal - wantsTotal >= 0 ? (
            <p class="mx-5 mb-5">
              You've gained {incomeTotal - needsTotal - wantsTotal} this month.
              Great job! Don't forget to plan your goals and for next month.{" "}
            </p>
          ) : (
            <p class="mx-5 mb-5">
              You've lost {(incomeTotal - needsTotal - wantsTotal) * -1} this
              month. re-budgeting and re-planning goals is strongly recommended.{" "}
            </p>
          )}

          {wants.length > 0 ? (
            <CheckWants />
          ) : (
            <p class="mx-5 mb-5">
              Congratulations! You have endured your temptation on "wants"-list
              this month!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
function processDaily(daily) {
  var data = daily;

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
    backgroundColor: "rgb(254,0,250)",
    label: "wants",
    data: [],
    borderColor: "rgb(254,0,250)",
    borderWidth: 0
  };

  var daily_label = [];
  //append to each array:
  for (var i = 0; i < data.length; i++) {
    if (data[i].isIncome === "income") {
      incomeData.data.push(data[i].amount);
    }
    //bug: will they always be sorted?
    else if (data[i].isIncome === "needs") {
      needsData.data.push(data[i].amount);
    } else if (data[i].isIncome === "wants") {
      wantsData.data.push(data[i].amount);
    }
    //add label, if not yet added:
    if (daily_label.includes(data[i].date) === false) {
      daily_label.push(data[i].date);
    }
  }
  // now, put back to state:
  var newData = {
    labels: daily_label,
    datasets: [incomeData, wantsData, needsData]
  };
  return newData;
}
/*function compareAvg(){
  
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
  }*/

function MonthlyTable(props) {
  return (
    <div>
      {props.item.length > 0 ? (
        <div className="table responsive">
          <table class="table">
            <thead>
              <tr>
                <th width={120}> {props.children} Category</th>
                <th width={200}>Total Amount</th>
              </tr>
            </thead>
            <tbody>
              {props.item.map((item, index) => (
                <tr>
                  <td>{item.name}</td>
                  <td>{item.totalAmount}</td>
                </tr>
              ))}

              <tr>
                <td> SubTotal : </td>
                <td> {props.subtotal}</td>
              </tr>
            </tbody>
          </table>
          <hr />
        </div>
      ) : (
        <div>
          {" "}
          No {props.children} found for this Month <hr />{" "}
        </div>
      )}{" "}
    </div>
  );
}
function SpanningTable(props) {
  /**Generates monthly report from backend. */
  var d = props.res.document;
  if (run_span == 0) {
    for (var i = 0; i < props.res.document.length; i++) {
      if (props.res.document[i].isIncome === "income") {
        income.push(props.res.document[i]);
        incomeTotal += props.res.document[i].totalAmount;
      } else if (props.res.document[i].isIncome === "needs") {
        needs.push(props.res.document[i]);
        needsTotal += props.res.document[i].totalAmount;
      } else if (props.res.document[i].isIncome === "wants") {
        if (wants.length == 0) {
          maxWants = props.res.document[i];
          minWants = props.res.document[i];
        } else {
          if (maxWants.totalAmount < props.res.document[i].totalAmount) {
            maxWants = props.res.document[i];
          }
          if (minWants.totalAmount > props.res.document[i].totalAmount) {
            minWants = props.res.document[i];
          }
        }
        wants.push(props.res.document[i]);
        wantsTotal += props.res.document[i].totalAmount;
      }
    }
  }
  run_span += 1;

  return (
    <div>
      <h1> Monthly Report </h1>

      <MonthlyTable item={income} subtotal={incomeTotal}>
        {" "}
        Income{" "}
      </MonthlyTable>
      <MonthlyTable item={needs} subtotal={needsTotal}>
        {" "}
        Needs{" "}
      </MonthlyTable>
      <MonthlyTable item={wants} subtotal={wantsTotal}>
        {" "}
        Wants{" "}
      </MonthlyTable>
      <div class="text-white text-center py-5 px-4">
        <p class="mx-5 mb-5">
          {" "}
          Total : {incomeTotal - needsTotal - wantsTotal}{" "}
        </p>{" "}
      </div>
    </div>
  );
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
  console.log(props.yearly);

  return (
    <div>
      <Line data={props.yearly} />
    </div>
  );
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

      mode: "unclicked",
      res: {},
      daily: {},
      yearly: {},

      data: {
        labels: []
      }
    };
    this.handleReportRetrieval();
    this.handleDailyRetrieval();
    this.handleGraphRetrieval();
    console.log(this.state.yearly, "yearly");
  }
  /** gets yearly graph report:*/
  handleGraphRetrieval = () => {
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
  };
  /** process garph report:*/
  processData = data => {
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
      backgroundColor: "rgb(254,0,250)",
      label: "wants",
      data: [],
      borderColor: "rgb(254,0,250)",
      borderWidth: 0
    };

    var month_label = [];
    //append to each array:
    for (var i = 0; i < data.length; i++) {
      if (data[i].label === "income") {
        incomeData.data.push(data[i].data);
      }
      //bug: will they always be sorted?
      else if (data[i].label === "needs") {
        needsData.data.push(data[i].data);
      } else if (data[i].label === "wants") {
        wantsData.data.push(data[i].data);
      }
      //add label, if not yet added:
      if (month_label.includes(data[i].month) === false) {
        month_label.push(data[i].month);
      }
    }
    // now, put back to state:
    var newData = {
      labels: month_label,
      datasets: [incomeData, wantsData, needsData]
    };

    this.setState({ yearly: newData });
    console.log(this.state.yearly);
  };

  handleReportRetrieval = () => {
    var self = this;
    this.props.axios
      .get("/report/monthly")
      .then(function(response) {
        var d = response.data;
        self.setState({ res: d });
        SpanningTable({ res: self.state.res });
      })

      .catch(function(error) {
        alert(error);
      });
  };
  handleSelect(selectedIndex, e) {
    this.setState({
      index: selectedIndex,
      direction: e.direction
    });
  }
  handleDailyRetrieval = () => {
    var self = this;
    console.log("asking for daily");

    this.props.axios
      .get("/report/daily")
      .then(function(response) {
        var d = response.data;
        var res = processDaily(d);
        self.setState({ daily: res });
      })
      .catch(function(error) {
        alert(error);
      });
  };
  handleTabChange = (event, value) => {
    this.setState({ value });
  };

  render() {
    var value = this.state.value;
    var res = this.state.res;
    return (
      <div>
        <AppBar position="static" style={{ background: "#437487" }}>
          <Tabs
            style={{ background: "#437487", fontSize: 30 }}
            value={value}
            onChange={this.handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            indicatorColor="inherit"
            textColor="inherit"
          >
            <Tab label="Tell Me Further" class="btn btn-info btn-arrow-left" />
            <Tab label="Suggestion" class="btn btn-info btn-arrow-left" />
            <Tab
              label="Monthly Report Details"
              class="btn btn-info btn-arrow-left"
              onActive={this.handleReportRetrieval}
            />
            <Tab label="Report Graph" class="btn btn-info btn-arrow-left" />

            <Tab label="Change Goals" class="btn btn-info btn-arrow-right" />
            <Tab label="Plan My Budget" class="btn btn-info btn-arrow-right" />
            <Tab label="Compare" class="btn btn-info btn-arrow" />
          </Tabs>
        </AppBar>

        {value === 0 && <SuggestFurther axios={this.props.axios} />}
        {value === 1 && (
          <Suggest daily={this.state.daily} res={this.state.res} />
        )}
        {value === 2 && <SpanningTable res={this.state.res} />}

        {value === 3 && <Graph yearly={this.state.yearly}>Item 1</Graph>}
        {value === 4 && <GoalList axios={this.props.axios} />}
        {value === 5 && (
          <div>
            <BudgetSuggest axios={this.props.axios} />
            <div className="col-s-6">
              <BudgetList axios={this.props.axios} />
            </div>
          </div>
        )}
        {value === 6 && <Graph axios={this.props.axios}>Item 1</Graph>}
      </div>
    );
  }
}

export default Report;
