import React from "react";

import "antd/dist/antd.css";

import { Table,  Popconfirm, Form, Divider } from "antd";
import {Button} from "react-bootstrap";
import TransFormTable from "./transForm";

import moment from "moment";
import introJs from "intro.js";
import "intro.js/introjs.css";
import "./transaction.css";

class EditableTable extends React.Component {
    constructor(props) {
        super(props);

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
            },
            {
                title: "Operation",
                dataIndex: "operation",
                width: "20%",
                render: (text, record) => {
                    const { editingKey } = this.state;
                    return (
                        <div>
                            <span>
                                {
                                    <a
                                        disabled={editingKey !== "-1"}
                                        onClick={() => this.edit(record.key)}
                                    >
                                        Edit
                                    </a>
                                }
                                <Divider type="vertical" />

                                {this.state.transactions.length >= 1 ? (
                                    <Popconfirm
                                        title="Sure to delete?"
                                        onConfirm={() =>
                                            this.handleDelete(record.key)
                                        }
                                    >
                                        <a href={"javascript:;"}>Delete</a>
                                    </Popconfirm>
                                ) : null}
                            </span>
                        </div>
                    );
                }
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

    componentDidMount() {
        // TODO handleload()
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
    handleLoad = () => {
        var self = this;
        this.props.axios
            .get("/transactions")
            .then(function(response) {
                var d = response.data;

                self.setState({ transactions: d });
                console.log(self.state.transactions);
            })
            .catch(function(err) {
                alert(err);
                self.setState({ error: err });
            });
    };

    showModal = () => {
        this.setState({ visible: true });
    };

    handleCancel = () => {
        this.setState({ visible: false, editingKey: "-1" });
    };

    handleCreate = () => {
        const form = this.formRef.props.form;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }

            console.log("Received values of form: ", values);

            form.resetFields();

            const { transactions, editingKey } = this.state;

            const newData = {
                //key: editingKey === '-1' ? this.state.count : parseInt(editingKey),
                date: moment(values.transdate).format("YYYY-MM-DD"),
                name: values.category[1],
                amount: values.amount.toString()
            };

            console.log("newData", newData);
            if (editingKey !== "-1") {
                // edit
                let newd = transactions.map(item => {
                    if (item.key === parseInt(editingKey)) {
                        item = newData;
                    }
                    return item;
                });
                // TODO update a transaction
                //this.setState({dataSource: newd})
            } else {
                // TODO create new transaction

                this.handleAddNew(newData);
                //this.setState({dataSource:[...dataSource,newData],count: this.state.count+1});
            }
            //
            this.setState({ visible: false, editingKey: "-1" });
        });
    };

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

    edit(key) {
        this.setState({ editingKey: key });
        this.setState({ visible: true });
    }

    saveFormRef = formRef => {
        this.formRef = formRef;
    };

    handleDelete = key => {
        // TODO delete a transaction
        const transactions = [...this.state.transactions];
        this.setState({
            transactions: transactions.filter(item => item.key !== key)
        });
        
    };

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
                <h1 data-step="1" data-intro="Record your Transaction!">
                    {" "}
                    Transaction Logs{" "}
                </h1>

                <Button
                    className="btn btn-large"
                    onClick={() => introJs().start()}
                >
                    intro
                </Button> &nbsp;
                <Button
                    data-step="2"
                    data-intro="Add a new transaction"
                    type="primary"
                    onClick={this.showModal}
                >
                    New Transaction
                </Button>
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
                        onChange: this.cancel
                    }}
                />
            </div>
        );
    }
}

const EditableFormTable = Form.create()(EditableTable);
export default EditableFormTable;
