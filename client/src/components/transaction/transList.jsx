import React from "react";

import "antd/dist/antd.css";

import { Table, Popconfirm, Form, Divider } from "antd";
import { Button } from "react-bootstrap";
import TransFormTable from "./transForm";

import moment from "moment";
import introJs from "intro.js";
import "intro.js/introjs.css";
import "./transaction.css";
import { configConsumerProps } from "antd/lib/config-provider";

// Transaction page
// display the transaction table
// handle the function of adding transaction
class EditableTable extends React.Component {
    constructor(props) {
        super(props);

        // table columns
        this.columns = [
            {
                title: "Date",
                dataIndex: "date"
            },
            {
                title: "Category",
                dataIndex: "category",
                render: (category, record) => {
                    return `${record.name}`;
                }
            },
            {
                title: "Amount",
                dataIndex: "amount"
            }
        ];

        this.state = {
            option: [],

            transactions: [
                {
                    name: "empty",
                    due: "YYYY-MM-DD",
                    amount: 0,
                    _id: "s"
                }
            ],
            visible: false,
            onfirmLoading: false,
            editingKey: "-1",
            error: ""
        };
    }

    // load the existing data
    // and intro guide tour
    componentDidMount() {
        this.handleLoad();
        this.categoryOption();
        if (RegExp("multipage=2", "gi").test(window.location.search)) {
            introJs()
                .setOption("doneLabel", "Next page")
                .start()
                .oncomplete(function() {
                    window.location.href = "goal?multipage=3";
                });
        }
    }

    //handle item loading:
    handleLoad = () => {
        var self = this;
        this.props.axios
            .get("/transactions")
            .then(function(response) {
                var d = response.data;

                self.setState({ transactions: d });
            })
            .catch(function(err) {
                alert(err);
                self.setState({ error: err });
            });
    };

    // show pop up modal
    showModal = () => {
        this.setState({ visible: true });
    };

    // handle cancel modal
    handleCancel = () => {
        this.setState({ visible: false, editingKey: "-1" });
    };

    // handle add new transaction
    handleCreate = () => {
        const form = this.formRef.props.form;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }


            form.resetFields();

            const { transactions, editingKey } = this.state;

            const newData = {
                date: moment(values.transdate).format("YYYY-MM-DD"),
                name: values.category[1],
                amount: values.amount.toString()
            };

            this.handleAddNew(newData);

            this.setState({ visible: false, editingKey: "-1" });
        });
    };

    // handle add new transaction
    handleAddNew = newData => {
        var self = newData;
        var self_2 = this;
        this.props.axios
            .post("/transactions", {
                name: self.name,
                realAmount: self.amount,
                date: self.date
            })
            .then(function(response) {
                self_2.handleLoad();
            })
            .catch(function(err) {
                alert(err);
                self_2.setState({ error: err });
            });
    };

    // handle edit
    edit(key) {
        this.setState({ editingKey: key });
        this.setState({ visible: true });
    }

    // collect the data from the form when 'Confirm' be click
    saveFormRef = formRef => {
        this.formRef = formRef;
    };

    // handle the category option loading
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

    // render the transaction table
    render() {
        const { transactions, editingKey, option } = this.state;
        const item =
            editingKey === "-1"
                ? {}
                : transactions.find(item => item.key === editingKey);

        const columns = this.columns.map(col => {
            if (!col.editable) {
                return col;
            }
            return {
                ...col,
                onCell: record => ({
                    record,
                    dataIndex: col.dataIndex,
                    title: col.title,
                    editing: this.isEditing(record)
                })
            };
        });

        return (
            <div>
                <h1 data-step="1" data-intro="Record your Transaction here">
                    {" "}
                    Transaction Logs For{" "}
                    {new Date().toLocaleString("en-us", {
                        month: "long"
                    })}
                    , {new Date().getFullYear()}{" "}
                </h1>
                <Button
                    className="btn btn-large"
                    onClick={() => introJs().start()}
                >
                    ?
                </Button>{" "}
                &nbsp;
                <Button
                    data-step="2"
                    data-intro="Record the category, along its amount (spent / recieved) and date of occurence (for this month only). If you can't find the category here, don't forget to add it on the Budget section first."
                    type="primary"
                    onClick={this.showModal}
                >
                    Add New Transaction
                </Button>
                <hr />
                <TransFormTable
                    wrappedComponentRef={this.saveFormRef}
                    visible={this.state.visible}
                    onCancel={this.handleCancel}
                    onCreate={this.handleCreate}
                    item={item}
                    categoryOption={this.state.option}
                />
                <Table
                    bordered
                    dataSource={transactions}
                    columns={columns}
                    rowClassName="editable-row"
                    pagination={{
                        pageSizeOptions: ["10", "15", "20"],
                        showSizeChanger: true
                    }}
                />
            </div>
        );
    }
}

const EditableFormTable = Form.create()(EditableTable);
export default EditableFormTable;
