import React, { Component } from 'react';
import { Form, Input, DatePicker, InputNumber,Cascader,Button,Modal} from 'antd';
import PubSub from 'pubsub-js'

import CategoryOptions from './defaultOptions.jsx'
import moment from 'moment'
const FormItem = Form.Item;

class TransForm extends Component {

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
          if (!err) {
            console.log('Received values of form: ', values);
          }
        });
   
        const {getFieldsValue,validateFields} = this.props.form;
            const value = getFieldsValue();

            console.log(value)
 
      }


    
    render() {
        const { getFieldDecorator } = this.props.form;
        const { visible, onCancel, onCreate, form, item } = this.props;
       
        const formItemLayout = {
            labelCol: {
            xs: { span: 24 },
            sm: { span: 8 },
            },
            wrapperCol: {
            xs: { span: 24 },
            sm: { span: 16 },
            },
        };
        const timeConfig = {
          initialValue: moment(item.date),
            rules: [{ type: 'object', required: true, message: 'Please select time!' }],
        };
        const amountConfig = {
            initialValue: item.amount,
            rules: [{ type: 'number', required: true, message: 'Please enter amount!' }],
        };
        const CategConfig = {
            initialValue: item.category,
            rules: [{ type: 'array', required: true, message: 'Please select category!' }],
        };
        const TagConfig = {
          initialValue: item.tag,
          rules: [{ type: 'string'}],
      };
        
      
      return (
        <Modal
          visible={visible}
          title="Create a new collection"
          okText="Create"
          onCancel={onCancel}
          onOk={onCreate}
        >
            
        <Form {...formItemLayout} onSubmit={this.handleSubmit}>

            <Form.Item label="Transaction Date">
            {getFieldDecorator('transdate', timeConfig)(
                <DatePicker
                    disabledDate={current => { return current.isAfter(new Date());}}
                    dateRender={(current) => { return (
                            <div className="ant-calendar-date" >
                                {current.date()}
                            </div>
                        );
                    }}
                />
            )}
            </Form.Item>

            <Form.Item label="Category">
            {getFieldDecorator('category', CategConfig)(
                <Cascader options={CategoryOptions} placeholder="Please select" />,
            )}
            </Form.Item>

            <Form.Item label="Tag">
            {getFieldDecorator('tag',TagConfig)(
                <Input placeholder="Transaction Detail"/>
            )}
            </Form.Item>

            <Form.Item label="Amount">
            {getFieldDecorator('amount',amountConfig)(
                <InputNumber
                
                    min={1}
                    formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={value => value.replace(/\$\s?|(,*)/g, '')}
                    style={{width: '110px'}}
                />
            )}
            </Form.Item>

            
        </Form>
        </Modal>
    );
  }
}
 
const TransFormTable = Form.create({ name: 'form_in_modal' })(TransForm);
export default TransFormTable
 
