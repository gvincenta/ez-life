import React, { Component } from 'react';
import { Form, Input, DatePicker, InputNumber, Modal, Select} from 'antd';

import moment from 'moment'
const FormItem = Form.Item;
const {Option} = Select;

// Provided Goal Form format and validation
class GoalsForm extends Component {

  state = {
    isDisabled: true,
    inital: 0
  }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
          if (!err) {
            console.log('Received values of form: ', values);
          }
        });
   
        const {getFieldsValue,validateFields} = this.props.form;
           
 
    }

    // if it is in update mode, show up the "update goal amount" field
    // else hide it
    componentDidUpdate(){
      if(this.state.isDisabled !== false && this.state.inital === 0 && this.props.item.name !== undefined){
        this.setState({isDisabled: false})
        this.setState({inital: -1})
      }      
    }

    // reset the form field after close it
    afterClose = () =>{
      this.setState({isDisabled: true})
      this.setState({inital: 0})
      this.props.form.resetFields();
  }

    // render the form
    // which has due date, goal, amount, preference
    // and update goal amount (which only appear when u update a goal)
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

        // validation for due date field
        // range is torromw and beyond
        const timeConfig = {
          initialValue: item.due === undefined ? moment().endOf('day').add('1','day'): moment(item.due),
            rules: [{ type: 'object', required: true, message: 'Please select time!' }],
        };
        // validation for amount field
        // range is 1 and beyond
        const amountConfig = {
            initialValue: item.amount,
            rules: [{ type: 'number', required: true, message: 'Please enter amount!' }],
        };
        // validation for preference field
        // range is 1 to 5
        const preferenceConfig = {
          initialValue: item.preference === undefined ? item.preference : item.preference.toString()
          ,
          rules: [{ type: 'string', required: true, message: 'Please enter preference!' }],
        };
        // validation for update goal amount field
        // range is 1 to remaining of goal amount
        const goalAmountConfig = {
          rules: [{ type: 'number', message: 'Please enter amount!' }],
        };
        // validation for name field
        const nameConfig = {
          initialValue: item.name,
          rules: [{ type: 'string', required: true, message: 'Please enter goal name!' }],
        };
        
      
      return (
        // modal form
        // update goal amount only appear when u update a goal
        <Modal
          className="popup"
          visible={visible}
          title= {item.name ? item.name : "Create a new Goal"}
          okText="Confirm"
          onCancel={onCancel}
          onOk={onCreate}
          afterClose={this.afterClose}
        >
      
        <Form {...formItemLayout} onSubmit={this.handleSubmit}>
            <Form.Item label="Achieved Date">
            {getFieldDecorator('due', timeConfig)(
                <DatePicker
                    disabledDate={current => { return  moment().endOf('day').add('1','day') > current }}
                   
                />

            )}
            </Form.Item>

            <Form.Item label="Name">
            {getFieldDecorator('name',nameConfig)(
                <Input placeholder="Goal Theme/Name"/>
            )}
            </Form.Item>

            <Form.Item label="Amount Required">
            {getFieldDecorator('amount',amountConfig)(
                <InputNumber
                
                    min={1}
                    formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={value => value.replace(/\$\s?|(,*)/g, '')}
                    style={{width: '110px'}}
                />
            )}
            </Form.Item>
              <Form.Item label="Preference">
                      {getFieldDecorator('preference', preferenceConfig)(
                          <Select  style={{ width: 120 }}>
                              <Option value="1">1</Option>
                              <Option value="2">2</Option>
                              <Option value="3">3</Option>
                              <Option value="4">4</Option>
                              <Option value="5">5</Option>
                      </Select>
                      )}
              </Form.Item>
        
              {!this.state.isDisabled ? (
    
            <Form.Item label="Update Goal Amount">
            {getFieldDecorator('progress', goalAmountConfig)(
                <InputNumber
                    min={1}
                    max = {isNaN(item.progress)? item.amount - 0 : item.amount - item.progress}
                    formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={value => value.replace(/\$\s?|(,*)/g, '')}
                    style={{width: '110px'}}
            />
            )}
            </Form.Item>
            ) : null }

            
        </Form>
        </Modal>
    );
  }
}
 
const GoalsFormTable = Form.create({ name: 'form_in_modal' })(GoalsForm);
export default GoalsFormTable
 
