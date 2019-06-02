import React, { Component } from "react";
import { Form, Input, InputNumber, Select, Modal } from "antd";

const { Option } = Select;

// Provided Budget Form format and data validation
class BudgetForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isDisabled: true,
            inital: 0
        };
    }

    // only wants can be updated
    componentDidUpdate() {
        if (
            this.state.isDisabled !== false &&
            this.state.inital === 0 &&
            this.props.item.isIncome === "wants"
        ) {
            this.setState({ isDisabled: false });
            this.setState({ inital: -1 });
        }
    }

     // reset the form field after close it
    afterClose = () => {
        this.setState({ isDisabled: true });
        this.setState({ inital: 0 });
        this.props.form.resetFields();
    };

    // handle submit the form
    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.props.onCreate(values);
            }
        });
    };

    // handle the type be chosen 
    handleTypeChange = e => {
        console.log("e,", e, this.state.isDisabled);
        if (e === "wants") {
            this.setState({ isDisabled: false });
        } else {
            this.setState({ isDisabled: true });
        }
    };

    render() {
        const { getFieldDecorator } = this.props.form;
        const { visible, onCancel, onCreate, form, item } = this.props;

        console.log(item);

        const { isDisabled } = this.state;
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 8 }
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 16 }
            }
        };

        // validation for amount field
        // range is 1 and beyond
        const amountConfig = {
            initialValue: item.budgetedAmount,
            rules: [
                {
                    type: "number",
                    required: !isDisabled,
                    message: "Please enter amount!"
                }
            ]
        };
        // validation for preference field
        // range is 1 to 5
        const preferenceConfig = {
            initialValue: item.preference === undefined ? item.preference : item.preference.toString(),
            rules: [
                {
                    type: "string",
                    required: !isDisabled,
                    message: "Please enter preference!"
                }
            ]
        };
        // validation for type field
        const typeConfig = {
            initialValue: item.isIncome,
            rules: [
                {
                    type: "string",
                    required: true,
                    message: "Please select type!"
                }
            ]
        };
        // validation for name field
        const nameConfig = {
            initialValue: item.name,
            rules: [
                {
                    type: "string",
                    required: true,
                    message: "Please enter budget item!"
                }
            ]
        };

        return (
            // modal form
            // preference and budget amount only appear when u select 'wants' as type
            <Modal
                className="popup"
                visible={visible}
                title= {item.name ? "Updating " + item.name : "Create a new Budget Category"}
                okText="Confirm"
                onCancel={onCancel}
                onOk={onCreate}
                afterClose={this.afterClose}
            >
                <Form {...formItemLayout} onSubmit={this.handleSubmit}>
                    {item.name ? null :
                    <div>
                    <Form.Item label="Name">
                        {getFieldDecorator("name", nameConfig)(
                            <Input placeholder="Budget Category Name" />
                        )}
                    </Form.Item>
                     <Form.Item label="Type">
                     {getFieldDecorator("isIncome", typeConfig)(
                         <Select
                             style={{ width: 120 }}
                             onChange={this.handleTypeChange}
                         >
                             <Option value="income">Income</Option>
                             <Option value="needs">Needs</Option>
                             <Option value="wants">Wants</Option>
                         </Select>
                     )}
                 </Form.Item>
                 </div>
                    }
                   

                    {!this.state.isDisabled ? (
                        <div>
                            <Form.Item label="Preference">
                                {getFieldDecorator(
                                    "preference",
                                    preferenceConfig
                                )(
                                    <Select style={{ width: 120 }}>
                                        <Option value="1">1</Option>
                                        <Option value="2">2</Option>
                                        <Option value="3">3</Option>
                                        <Option value="4">4</Option>
                                        <Option value="5">5</Option>
                                    </Select>
                                )}
                            </Form.Item>

                            <Form.Item label="Budget Amount">
                                {getFieldDecorator(
                                    "budgetAmount",
                                    amountConfig
                                )(
                                    <InputNumber
                                        min={1}
                                        formatter={value =>
                                            `$ ${value}`.replace(
                                                /\B(?=(\d{3})+(?!\d))/g,
                                                ","
                                            )
                                        }
                                        parser={value =>
                                            value.replace(/\$\s?|(,*)/g, "")
                                        }
                                        style={{ width: "110px" }}
                                    />
                                )}
                            </Form.Item>
                        </div>
                    ) : null}
                </Form>
            </Modal>
        );
    }
}

const BudgetFormTable = Form.create({ name: "form_in_modal" })(BudgetForm);
export default BudgetFormTable;
