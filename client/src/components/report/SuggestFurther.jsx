import React, { Component } from "react";
import { Cascader } from "antd";
import { Line } from "react-chartjs-2";

export default class SuggestFurther extends Component {
    constructor(props) {
        super(props); // mandatory

        this.state = {
            option: "",
            oneCat: "",
            maxVal: 0,
            minVal: 0,
            isIncome: "",
            currVal: 0
        };
        this.categoryOption();
    }
    categoryOption = () => {
        var self = this;

        this.props.axios
            .get("/transactions/cat")
            .then(function(response) {
                var answer = [
                    { value: "income", label: "income", children: [] },
                    { value: "needs", label: "needs", children: [] },
                    { value: "wants", label: "wants", children: [] }
                ];

                var d = response.data;

                for (var i = 0; i < d.length; i++) {
                    if (d[i].isIncome === "needs") {
                        answer[1].children.push({
                            value: d[i].name,
                            label: d[i].name
                        });
                    } else if (d[i].isIncome === "income") {
                        answer[0].children.push({
                            value: d[i].name,
                            label: d[i].name
                        });
                    } else if (d[i].isIncome === "wants") {
                        answer[2].children.push({
                            value: d[i].name,
                            label: d[i].name
                        });
                    }
                }

                self.setState({ option: answer });
            })
            .catch(function(err) {
                alert(err);
                self.setState({ error: err });
            });
    };
    processOneCategory(data, isIncome, catName) {
        var labels = [];
        var min = data[0];
        var max = data[0];
        var colour = "rgba(22,211,20,0.8)";
        if (isIncome === "needs") {
            colour = "rgba(111,121,211,0.8)";
        } else if (isIncome === "wants") {
            colour = "rgba(211,0,5,0.8)";
        }

        var process = {
            fill: true,
            backgroundColor: colour,

            label: [catName],
            data: [],
            borderColor: colour,
            borderWidth: 0
        };

        for (var i = 0; i < data.length; i++) {
            labels.push(data[i].month);
            process.data.push(data[i].amount);
            if (data[i].amount > max.amount) {
                max = data[i];
            }
            if (data[i].amount < min.amount) {
                min = data[i];
            }
        }
        var newData = { labels: labels, datasets: [process] };
        this.setState({
            maxVal: max,
            minVal: min,
            currVal: data[data.length - 1]
        });
        return newData;
    }
    handleOnChange = res => {
        var self = this;
        var cat = res[1];
        var isIncome = res[0];
        this.setState({ isIncome: isIncome });
        this.props.axios
            .post("/report/oneCategory", { name: res[1] })
            .then(function(response) {
                var d = response.data;

                var res = self.processOneCategory(d, isIncome, cat);

                self.setState({ oneCat: res });
            })
            .catch(function(error) {
                alert(error);
            });
    };
    render() {
        var { oneCat, maxVal, minVal, currVal, isIncome } = this.state;
        var catName = "";
        if (oneCat !== "") {
            catName = oneCat.datasets[0].label[0];
        }

        return (
            <div className="jumbotron card card-image">
                <h2> Find a Category's transaction history </h2>
                <p> Please select certain Budget Category: </p>
                <Cascader
                    options={this.state.option}
                    placeholder="Please select"
                    onChange={this.handleOnChange}
                />
                {oneCat !== "" ? (
                    <div>
                        {" "}
                        <h2> Overview of {catName} for the past 1 year:</h2>
                        <Line data={oneCat} />{" "}
                        <div class="text-white text-center py-5 px-4">
                            <p class="mx-5 mb-5">
                                the highest amount was ${maxVal.amount} on{" "}
                                {maxVal.month}.
                            </p>
                            <p class="mx-5 mb-5">
                                the lowest was ${minVal.amount} on{" "}
                                {minVal.month}.
                            </p>
                            <p class="mx-5 mb-5">
                                the most recent is ${currVal.amount} at{" "}
                                {currVal.month}.
                            </p>
                            {(isIncome === "wants" || isIncome === "needs") &&
                            currVal.amount < maxVal.amount ? (
                                <p class="mx-5 mb-5">
                                    {" "}
                                    Your spending on {catName} seems to be
                                    dropping. Congratulations!{" "}
                                </p>
                            ) : null}
                            {(isIncome === "wants" || isIncome === "needs") &&
                            currVal.amount > maxVal.amount ? (
                                <p class="mx-5 mb-5">
                                    {" "}
                                    Your spending on {catName} seems to be
                                    increasing. Let's lower it down.{" "}
                                </p>
                            ) : null}
                        </div>
                    </div>
                ) : (
                    <hr />
                )}
            </div>
        );
    }
}
