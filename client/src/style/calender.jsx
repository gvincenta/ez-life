import React from "react";
import PubSub from "pubsub-js";

class Calendar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            year: props.year,
            month: props.month,
            day: props.day,
            dayList: 31,
            yearList: props.yearList,
            daysMonth: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31] //每月对应的天数
        };
    }

    handelChangeYear = event => {
        const target = event.target;
        const { value, name } = target;
        const { month, day } = this.state;
        const yearVal = target.value;
        const monthIndex = this.state.month - 1;
        if ((yearVal % 4 === 0 && yearVal % 100 !== 0) || yearVal % 400 === 0) {
            this.setState({
                daysMonth: [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
            });
        }
        const dayListVal = this.state.daysMonth[monthIndex];
        this.setState({
            [name]: value,
            dayList: dayListVal
        }); //this.props.callback(value,this.state.month,this.state.day).bind(this);

        if (month === 2 && day > 28) {
            this.setState({
                day: 28
            });
        }
        const year = value;
        PubSub.publish("month", year);
    };

    handelChangeMonth = event => {
        const target = event.target;
        const { value, name } = target;
        const { year, day } = this.state;
        const monthIndex = event.target.value - 1;
        if ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) {
            this.setState({
                daysMonth: [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
            });
        }
        const dayListVal = this.state.daysMonth[monthIndex];

        this.setState({
            [name]: value,
            dayList: dayListVal
        }); //this.props.callback(this.state.year,value,this.state.day);
        if (event.target.value === 2 && day > 28) {
            console.log(this.state.daysMonth[1]);
            setTimeout(() => {
                this.setState({
                    day: this.state.daysMonth[1]
                });
            });
        }

        if (day > 30 && (event.target.value === 4 || 6 || 9 || 11)) {
            this.setState({
                day: 30
            });
        }

        const month = value;
        PubSub.publish("month", month);
    };

    handelChangeDay = event => {
        const target = event.target;
        const { value, name } = target;

        this.setState({
            [name]: value
        });
        const day = value;
        PubSub.publish("day", day);
    };

    render() {
        const list = [];
        const listYear = [];
        for (let j = this.state.yearList[0]; j < this.state.yearList[1]; j++) {
            listYear.push(j);
        }

        for (let i = 1; i <= this.state.dayList; i++) {
            list.push(i);
        }

        return (
            <form className="form-inline">
                <label className="col-sm-1 col-lg-offset-1 control-label">
                    Date
                </label>
                <div className="form-group">
                    <div className="col-sm-1">
                        <select
                            className="form-control"
                            name="year"
                            onChange={this.handelChangeYear}
                        >
                            <option value="0">Year</option>
                            {listYear.map((year, index) => {
                                return (
                                    <option key={index} value={year}>
                                        {year}
                                    </option>
                                );
                            })}
                        </select>
                    </div>
                </div>
                <div className="form-group">
                    <div className="col-sm-1">
                        <select
                            className="form-control"
                            name="month"
                            onChange={this.handelChangeMonth}
                        >
                            <option value="0">Month</option>
                            <option value="1">Jan</option>
                            <option value="2">Feb</option>
                            <option value="3">Mar</option>
                            <option value="4">Apr</option>
                            <option value="5">May</option>
                            <option value="6">Jun</option>
                            <option value="7">Jul</option>
                            <option value="8">Aug</option>
                            <option value="9">Sep</option>
                            <option value="10">Oct</option>
                            <option value="11">Nov</option>
                            <option value="12">Dec</option>
                        </select>
                    </div>
                </div>
                <div className="form-group">
                    <div className="col-sm-1">
                        <select
                            className="form-control"
                            name="day"
                            onChange={this.handelChangeDay}
                        >
                            <option value="0">Day</option>
                            {list.map((day, index) => {
                                return (
                                    <option key={index} value={day}>
                                        {day}
                                    </option>
                                );
                            })}
                        </select>
                    </div>
                </div>
            </form>
        );
    }
}

export default class CalendarCon extends React.Component {
    render() {
        const date = new Date();

        return (
            <Calendar
                year={date.getFullYear()}
                month={date.getMonth() + 1}
                day={date.getDate()}
                yearList={[2019, 2050]}
            />
        );
    }
}
