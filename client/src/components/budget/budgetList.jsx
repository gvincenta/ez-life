import React from "react";

import "antd/dist/antd.css";
import "./budgetList.css";

import introJs from "intro.js";
import "intro.js/introjs.css";

import { Table, Popconfirm, Form, Divider } from "antd";
import { Button } from "react-bootstrap";
import BudgetFormTable from "./budgetForm";

class EditableTable extends React.Component {
    constructor(props) {
        super(props);

        // table columns
        this.columns = [
            {
                title: "Type",
                dataIndex: "type",
                render: (type, record) => {
                    return `${record.isIncome}`;
                }
            },
            {
                title: "Name",
                dataIndex: "name"
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
                                {record.isIncome === "wants" ? (
                                    <a
                                        disabled={editingKey !== "-1"}
                                        onClick={() => this.edit(record._id)}
                                    >
                                        Edit
                                    </a>
                                ) : null}
                                {record.isIncome === "wants" ? (
                                    <Divider type="vertical" />
                                ) : null}
                                {this.state.budgets.length >= 1 ? (
                                    <Popconfirm
                                        title="Confirm deletion?"
                                        onConfirm={() =>
                                            this.handleDelete(record.name)
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
            budgets: [
                {
                    name: "",
                    budgetedAmount: 1,
                    isIncome: "needs/wants/income",
                    preference: 1
                }
            ],
            error: {},
            count: 0,
            visible: false,
            onfirmLoading: false,
            editingKey: "-1"
        };
    }

    componentDidMount() {
        // TODO handleload()
        this.handleLoad();

        // introJs
        if (RegExp("multipage", "gi").test(window.location.search)) {
            introJs()
                .setOption("doneLabel", "Next page")
                .start()
                .oncomplete(function() {
                    window.location.href = "transaction?multipage=2";
                });
        }
    }

    //handle item loading:
    handleLoad = () => {
        var self = this;
        this.props.axios
            .get("/budget")
            .then(function(response) {
                var d = response.data;
                self.setState({ budgets: d });
            })
            .catch(function(err) {
                self.setState({ error: err });
            });
    };

    // handle add new budget
    handleAddNew = newData => {
        var data = newData;
        var self = this;

        this.props.axios
            .post("/budget", {
                name: data.name,
                isIncome: data.isIncome,
                preference: data.preference,
                budgetedAmount: data.budgetAmount
            })
            .then(function(response) {
                self.handleLoad();
            })
            .catch(function(err) {
                alert(err);
                self.setState({ error: err });
            });
    };

    //handles updating budget amounts:
    handleUpdate = newData => {
        var data = newData;
        var self = this;

        this.props.axios
            .put("/budget", {
                name: data.name,
                preference: data.preference,
                budgetedAmount: data.budgetAmount
            })
            .then(function(response) {
                self.handleLoad();
            })
            .catch(function(err) {
                self.setState({ error: err });
            });
    };

    //handles deleting a  category:
    handleDelete = budget => {
        var self_2 = this;

        this.props.axios
            .delete("/budget", {
                data: { name: budget }
            })
            .then(function(response) {
                self_2.handleLoad();
            })
            .catch(function(err) {
                self_2.setState({ error: err });
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

    // handle add new/ edit
    handleCreate = () => {
        const form = this.formRef.props.form;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }

            form.resetFields();

            const { editingKey } = this.state;

            let newData = {
                isIncome: values.isIncome,
                name: values.name,
                preference: values.preference,
                budgetAmount: values.budgetAmount
            };

            if (editingKey !== "-1") {
                // TODO update a transaction
                this.handleUpdate(newData);
            } else {
                // TODO create new transaction
                this.handleAddNew(newData);
            }

            this.setState({ visible: false, editingKey: "-1" });
        });
    };

    edit(key) {
        this.setState({ editingKey: key });
        this.setState({ visible: true });
    }

    saveFormRef = formRef => {
        this.formRef = formRef;
    };

    render() {
        const { budgets, editingKey } = this.state;
        const item =
            editingKey === "-1"
                ? {}
                : budgets.find(item => item._id === editingKey);

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
        var str =
            " needs :  expenses that are immediate and inevitable. \nwants : expenses  that you can cut down. \npreference : 1 (least) to 5 (most). \nBudget Amount : $ allocated to this category.";

        return (
            <div>
                <h1
                    data-step="1"
                    data-intro="Add any category for income / expenses here"
                >
                    Budget
                </h1>
                <Button
                    className="btn btn-large"
                    onClick={() => introJs().start()}
                >
                    ?
                </Button>{" "}
                &nbsp;
                <Button
                    type="primary"
                    onClick={this.showModal}
                    data-step="2"
                    data-intro={str}
                >
                    Add New Budget
                </Button>
                <hr />
                <BudgetFormTable
                    wrappedComponentRef={this.saveFormRef}
                    visible={this.state.visible}
                    onCancel={this.handleCancel}
                    onCreate={this.handleCreate}
                    item={item}
                />
                <Table
                    bordered
                    dataSource={budgets}
                    columns={columns}
                    rowClassName={record =>
                        record.isIncome === "wants"
                            ? "editable-row"
                            : "no-expand"
                    }
                    pagination={{
                        pageSizeOptions: ["10", "15", "20"],
                        showSizeChanger: true
                    }}
                    expandedRowRender={record =>
                        record.isIncome === "wants" ? (
                            <div>
                                <p style={{ margin: 0 }}>{`Preference: ${
                                    record.preference
                                }`}</p>
                                <p style={{ margin: 0 }}>{`Amount: ${
                                    record.budgetedAmount
                                }`}</p>
                            </div>
                        ) : null
                    }
                />
            </div>
        );
    }
}

const EditableFormTable = Form.create()(EditableTable);
export default EditableFormTable;
