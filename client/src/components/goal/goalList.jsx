import React from "react";

import "antd/dist/antd.css";
import styles from "./goalList.css";

import { Row, Col, Tooltip, Popconfirm, Card, Icon, Progress } from "antd";
import { Button } from "react-bootstrap";

import GoalsFormTable from "./goalsForm";
import introJs from "intro.js";
import "intro.js/introjs.css";
import moment from "moment";

const { Meta } = Card;

// Goal page
// display the goal table
// handle the function of adding, updating and deleting of goals
export default class EditableGoal extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            goals: [
                {
                    name: "empty",
                    due: "YYYY-MM-DD",
                    preference: 2,
                    amount: 0,
                    progress: 0
                }
            ],

            visible: false,

            onfirmLoading: false,
            editingKey: "-1"
        };
    }
    // load the existing data
    // and intro guide tour
    componentDidMount() {
        this.handleLoad();
        if (RegExp("multipage=3", "gi").test(window.location.search)) {
            introJs()
                .setOption("doneLabel", "Next page")
                .start()
                .oncomplete(function() {
                    window.location.href = "report?multipage=4";
                });
        }
    }
    //handles loading all goals:
    handleLoad = () => {
        var self = this;
        this.props.axios
            .get("/goals")
            .then(function(response) {
                var d = response.data;
                self.setState({ goals: d });
                console.log(d);
            })
            .catch(function(error) {
                alert(error);
            });
    };

    // handle update goal
    handleUpdate = newData => {
        var data = newData;

        var self = this;

        this.props.axios
            .put("/goals", {
                name: data.name,
                amount: data.amount,
                preference: data.preference,
                progress: data.progress,
                due: data.due
            })
            .then(function(response) {
                self.handleLoad();
            })
            .catch(function(err) {
                alert(err);
                self.setState({ error: err });
            });
    };

    // handle add new goals
    handleAddNew = newData => {
        var data = newData;
        var self_2 = this;

        this.props.axios
            .post("/goals", {
                name: data.name,
                amount: data.amount,
                preference: data.preference,
                due: data.due
            })
            .then(function(response) {
                self_2.handleLoad();
            })
            .catch(function(err) {
                alert(err);
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

            console.log("Received values of form: ", values);

            form.resetFields();

            const { goals, editingKey } = this.state;

            const newData = {
                amount: values.amount,
                due: moment(values.due).format("YYYY-MM-DD"),
                name: values.name,
                preference: parseInt(values.preference),
                progress: isNaN(values.progress) ? 0 : values.progress
            };

            if (editingKey !== "-1") {
                // update existing goal
                const item =
                    editingKey === "-1"
                        ? {}
                        : goals.find(item => item._id === editingKey);

                item.progress += newData.progress;
                this.handleUpdate(item);
            } else {
                // add new goal
                this.handleAddNew(newData);
            }
            this.setState({ visible: false, editingKey: "-1" });
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

    // handle delete a goal
    handleDelete = goal => {
        var self_2 = this;

        this.props.axios
            .delete("/goals", {
                data: { name: goal }
            })
            .then(function(response) {
                self_2.handleLoad();
            })
            .catch(function(err) {
                self_2.setState({ error: err });
            });
    };

    // render the goal table
    render() {
        const { goals, editingKey } = this.state;
        const item =
            editingKey === "-1"
                ? {}
                : goals.find(item => item._id === editingKey);

        return (
            <div>
                <h1
                    data-step="1"
                    data-intro="Record your Goals (a.k.a wishlist) here"
                >
                    {" "}
                    Goals{" "}
                </h1>
                <Button
                    className="btn btn-large"
                    onClick={() => introJs().start()}
                >
                    ?
                </Button>{" "}
                <Button
                    name="add"
                    type="Button"
                    class="btn btn-secondary"
                    data-step="2"
                    data-intro="add new Goal"
                    onClick={this.showModal}
                    data-step="2"
                    data-intro="Add a new goal along with its required amount, preference (1 the least  to 5 the most), and its due date."
                >
                    Add New Goals
                </Button>
                <hr />
                <GoalsFormTable
                    wrappedComponentRef={this.saveFormRef}
                    visible={this.state.visible}
                    onCancel={this.handleCancel}
                    onCreate={this.handleCreate}
                    item={item}
                />
                <Row gutter={320}>
                    {goals.map((item, key) => (
                        <Col key={key} lg={5} md={20}>
                            <Card
                                className={styles.NumberCard}
                                style={{ width: 300 }}
                                actions={[
                                    item.progress !== item.amount ? (
                                        <Tooltip
                                            placement="bottom"
                                            title="Update amount"
                                        >
                                            <Icon
                                                type="edit"
                                                onClick={() =>
                                                    this.edit(item._id)
                                                }
                                            />
                                        </Tooltip>
                                    ) : null,
                                    <Tooltip
                                        placement="bottom"
                                        title="delete goal"
                                    >
                                        <Popconfirm
                                            title="Sure to delete?"
                                            onConfirm={() =>
                                                this.handleDelete(item.name)
                                            }
                                        >
                                            <Icon type="delete" />
                                        </Popconfirm>
                                    </Tooltip>
                                ]}
                            >
                                <Progress
                                    type="dashboard"
                                    percent={Math.floor(
                                        (item.progress / item.amount) * 100
                                    )}
                                    strokeColor="#f8bd83"
                                />

                                <Meta
                                    title={item.name}
                                    description={
                                        "Amount Required: " + item.amount
                                    }
                                />
                                <Meta
                                    description={
                                        "Due: " +
                                        moment(item.due).format("YYYY-MM-DD")
                                    }
                                />
                                <Meta
                                    description={"Now Saving: " + item.progress}
                                />
                                <Meta
                                    description={
                                        "Preference: " + item.preference
                                    }
                                />
                            </Card>
                        </Col>
                    ))}
                </Row>
            </div>
        );
    }
}
