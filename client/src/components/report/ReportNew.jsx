import React, { Component } from "react";

import "react-table/react-table.css";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

import { Line, Doughnut } from "react-chartjs-2";
import GoalList from "../goal/goalList";
import "bootstrap-directional-buttons";

import SuggestFurther from "./SuggestFurther";
import BudgetSuggest from "./BudgetSuggest";
import BudgetList from "../budget/budgetList";
import {Button} from "react-bootstrap";
import "./report.css";
import introJs from "intro.js";


var income = [];
var needs = [];
var wants = [];
var incomeTotal = 0;
var needsTotal = 0;
var wantsTotal = 0;
var run_span = 0;
var maxWants, minWants;
function CheckWants() {
    return (
        <div>
            <p class="mx-5 mb-5">
                {" "}
                Your huge spending was on : {maxWants.name}, as much as :{" "}
                ${maxWants.totalAmount}, with preference of:{" "}
                {maxWants.preference} (out of 10)
            </p>
            <p class="mx-5 mb-5">
                Your smallest spending was on : {minWants.name}, as much as :{" "}
                ${minWants.totalAmount}, with preference of:{" "}
                {minWants.preference} (out of 10)
            </p>

            {maxWants.preference < minWants.preference ? (
                <p>
                    {" "}
                    You may want to <b>re-prioritise</b> your preferences for your
                    wants' categories.{" "}
                </p>
            ) : (
                <p>
                    {" "}
                    Your wants' preference seem to be sorted out. Keep up the
                    <i>good work!</i>{" "}
                </p>
            )}
        </div>
    );
}
function Suggest(props) {
    var data = props.daily;
    var myPieChart = {
        labels: ["saving", "needs", "wants"],
        datasets: [
            {
                label: ["saving", "needs", "wants"],
                backgroundColor: [
                    "rgba(120,230,240,0.8)",
                    "rgba(200,121,210,0.8)",
                    "rgba(10,200,21,0.8)"
                ],
                data: [
                    incomeTotal - needsTotal - wantsTotal,
                    needsTotal,
                    wantsTotal
                ]
            }
        ]
    };
    return (
        <div class="jumbotron card card-image">
            <h3 class="mx-5 mb-5"> Day to Day Transactions for this Month: </h3>
            <Line data={data} />
            <hr/>
            {incomeTotal - needsTotal - wantsTotal >= 0 ? (
                <div>
                
                <h3 class="mx-5 mb-5"> Overall saving for this month: </h3>
                <Doughnut data={myPieChart} />
                </div>
            ) : (
                <hr />
            )}
            <div class="text-white text-center py-5 px-4">
                <div>
                    {incomeTotal - needsTotal - wantsTotal >= 0 ? (
                        <p class="mx-5 mb-5">
                            You've gained{" "}
                            ${incomeTotal - needsTotal - wantsTotal} this month.
                            Great job! Don't forget to plan your goals and for
                            next month.{" "}
                        </p>
                    ) : (
                        <p class="mx-5 mb-5">
                            You've lost{" "}
                            ${(incomeTotal - needsTotal - wantsTotal) * -1} this
                            month. re-budgeting and re-planning goals is
                            strongly recommended.{" "}
                        </p>
                    )}

                    {wants.length > 0 ? (
                        <CheckWants />
                    ) : (
                        <p class="mx-5 mb-5">
                            Congratulations! You have endured your temptation on
                            "wants"-list this month!
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


function MonthlyTable(props) {
    return (
       
            <div >
            {props.item.length > 0 ? (
                <div className="table responsive">
                    <table class="table">
                        <thead>
                            <tr>
                                <th width={120}> {props.children} Category</th>
                                <th width={200}>Total Amount ($)</th>
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
                <div class="text-white text-center py-5 px-4">
                   <p class="mx-5 mb-5"> {" "}
                    No {props.children} found for this Month <hr />{" "} </p>
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
                    if (
                        maxWants.totalAmount < props.res.document[i].totalAmount
                    ) {
                        maxWants = props.res.document[i];
                    }
                    if (
                        minWants.totalAmount > props.res.document[i].totalAmount
                    ) {
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
        <div className = "jumbotron card card-image">
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
                <p>
                    {" "}
                    Total : ${incomeTotal - needsTotal - wantsTotal}{" "}
                </p>{" "}
            </div>
        </div>
    );
}

/**Handles monthly report for client. */


function Graph(props) {

    return (
      <div class="jumbotron card card-image">
            <h3> Yearly Graph on all Budget Categories:  </h3> 
            <Line data={props.yearly} />
        </div>
    );
}

class Report extends Component {
    constructor(props) {
        super(props); // mandatory

        this.state = {
            value: 0,
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
   
    handleDailyRetrieval = () => {
        var self = this;

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
    componentDidMount() {
        
        if (RegExp("multipage=4", "gi").test(window.location.search)) {
            introJs()
                .setOption("doneLabel", "Next page")
                .start()
                
        }
    }

    render() {
        var value = this.state.value;
        var res = this.state.res;
        return (
          
            <div>
                <h1 data-step="1" data-intro="Welcome to the report section, where you can get insights on your spending."> Report  <Button
                    className="btn btn-large"
                    onClick={() => introJs().start()}
                >
                    ?
                </Button></h1>
                 &nbsp;
          

                <AppBar position="static" style={{ background: "#3ca4ff" }}>
                    <Tabs 
                      
                        value={value}
                        onChange={this.handleTabChange}
                        variant="scrollable"
                        scrollButtons="auto"
                        indicatorColor="inherit"
                        textColor="inherit"
                    >
                      <Tab data-step="2" data-intro="Get a general yearly graphical report on all your budget categories here."
                            label="Yeary Graph"
                        />
                      <Tab data-step="3" data-intro="Here's a detailed income-expense report of the month."
                            label="Monthly Report Details"
                            onActive={this.handleReportRetrieval}
                        />
                        <Tab data-step="4" data-intro="Get day to day transactions, overall  saving / loss, as well as suggestions here."
                            label="Suggestion"
                        />
                        <Tab  data-step="5" data-intro="Track certain budget category over the past year."
                            label="Tell Me Further"
                        />
               
                        <Tab data-step="6" data-intro="Change your goals based on your saving / loss this month."
                            label="Change Goals"
                        />
                        <Tab data-step="7" data-intro="Plan your budget for the next month."
                            label="Plan My Budget"
                       />
                    </Tabs>
                </AppBar>

                {value === 3 && <SuggestFurther axios={this.props.axios} />}
                {value === 2 && (
                    <Suggest daily={this.state.daily} res={this.state.res} />
                )}
                {value === 1 && <SpanningTable res={this.state.res} />}

                {value === 0 && (
                    <Graph yearly={this.state.yearly}>Item 1</Graph>
                )}
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
 