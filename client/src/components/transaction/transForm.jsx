import React, { Component } from "react";
import { Form, DatePicker, InputNumber, Cascader, Modal } from "antd";

import moment from "moment";

class TransForm extends Component {
    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log("Received values of form: ", values);
            }
        });
    };

    render() {
        const { getFieldDecorator } = this.props.form;
        const {
            visible,
            onCancel,
            onCreate,
            item,
            categoryOption
        } = this.props;

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
        const timeConfig = {
            initialValue: moment(item.date),
            rules: [
                {
                    type: "object",
                    required: true,
                    message: "Please select time!"
                }
            ]
        };
        const amountConfig = {
            initialValue: item.amount,
            rules: [
                {
                    type: "number",
                    required: true,
                    message: "Please enter amount!"
                }
            ]
        };
        const CategConfig = {
            initialValue: item.category,
            rules: [
                {
                    type: "array",
                    required: true,
                    message: "Please select category!"
                }
            ]
        };

        return (
            <Modal
                visible={visible}
                title="Create a new transaction log"
                okText="Create"
                onCancel={onCancel}
                onOk={onCreate}
            >
                <Form {...formItemLayout} onSubmit={this.handleSubmit}>
                    <Form.Item label="Transaction Date">
                        {getFieldDecorator("transdate", timeConfig)(
                            <DatePicker
                                disabledDate={current => {
                                    return current.isAfter(new Date());
                                }}
                                dateRender={current => {
                                    return (
                                        <div className="ant-calendar-date">
                                            {current.date()}
                                        </div>
                                    );
                                }}
                            />
                        )}
                    </Form.Item>

                    <Form.Item label="Category">
                        {getFieldDecorator("category", CategConfig)(
                            <Cascader
                                options={categoryOption}
                                placeholder="Please select"
                            />
                        )}
                    </Form.Item>

                    <Form.Item label="Amount">
                        {getFieldDecorator("amount", amountConfig)(
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
                </Form>
            </Modal>
        );
    }
}

const TransFormTable = Form.create({ name: "form_in_modal" })(TransForm);
export default TransFormTable;
