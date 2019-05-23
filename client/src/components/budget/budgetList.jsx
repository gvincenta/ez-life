

import React from 'react';

import 'antd/dist/antd.css';
import './budgetList.css'


import {Table, Button, Popconfirm, Form,Divider,Icon} from 'antd';

import BudgetFormTable from './budgetForm'


class EditableTable extends React.Component {
  constructor(props) {
    super(props);
    
    // talble columns
    this.columns =
      [{
        title: 'Type',
        dataIndex: 'type',
        render: (type,record) => {
          return `${record.isIncome}`
        }
      }, {
        title: 'Name',
        dataIndex: 'name',
      }, {
        title: 'Operation',
        dataIndex: 'operation',
        width: '20%',
        render: (text, record) => {
          const { editingKey } = this.state;
          return(
            <div>
              <span>
                { record.isIncome === "wants" ? 
                    (<a disabled={editingKey !== "-1"} onClick={() => this.edit(record._id)}>Edit</a>)
                    : null
                   
                }
                { record.isIncome === "wants" ? 
                    <Divider type="vertical" /> : null
                }
                {
                  this.state.budgets.length >= 1
                  ? (
                    <Popconfirm title="Sure to delete?" onConfirm={() => this.handleDelete(record.name)}>
                      <a href={"javascript:;"}>Delete</a>
                    </Popconfirm>
                  )
                  : null
                } 
              </span>
            </div>
          )}
      }];

    this.state = {
      budgets: [
        {
          name: "",
          budgetedAmount: 1,
          isIncome: "needs/wants/income",
          preference: 1,
        }
      ],
      error: {},
      count: 0,
      visible: false,
      onfirmLoading: false,
      editingKey: "-1" ,
    };
  }

  componentDidMount(){
    // TODO handleload()
    this.handleLoad();
  }

  //handle item loading:
  handleLoad = () => {
    var self = this;
    this.props.axios
      .get("/budget")
      .then(function(response) {
        var d = response.data;
        console.log(d);
        self.setState({ budgets: d });
      })
      .catch(function(err) {
        self.setState({ error: err });
      });
  };

    // handle add new budget
    handleAddNew = (newData) => {
      console.log("new",newData)
      var self = newData;
      var self_2 = this; 
    
      this.props.axios
        .post("/budget", { 
          name: self.name,
          isIncome: self.isIncome,
          preference: self.preference,
          budgetedAmount: self.budgetAmount
        })
        .then(function(response) {
          console.log("res", response);
          self_2.handleLoad();
        })
        .catch(function(err) {
          alert(err);
          self_2.setState({ error: err });
        });
    };
  
    //handles updating budget amounts:
    handleUpdate = (newData) => {
      console.log("handling update");
      var self = newData;
      var self_2 = this; 
  
      console.log("update",newData);
  
  
      this.props.axios
        .put("/budget", {
          name: self.name,
          preference: self.preference,
          budgetedAmount: self.budgetAmount
        })
        .then(function(response) {
          console.log("res", response);
  
          self_2.handleLoad();
        })
        .catch(function(err) {
          self_2.setState({ error: err });
        });
    };
  
    //handles deleting a  category:
    handleDelete = (budget) => {
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
    this.setState({ visible: false, editingKey: "-1"});
  };

  // handle add new/ edit 
  handleCreate = () => {
    const form = this.formRef.props.form;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      console.log('Received values of form: ', values);

      form.resetFields();
      
      const {budgets,editingKey} = this.state;
  
      let newData = {
        isIncome: values.isIncome,
        name: values.name,
        preference: values.preference,
        budgetAmount: values.budgetAmount
      }

     if(editingKey !== '-1'){
  
       // TODO update a transaction
      //this.setState({budgets: newd})
      this.handleUpdate(newData)
     } else {
         // TODO create new transaction
      //this.setState({budgets:[...budgets,newData],count: this.state.count+1});
      this.handleAddNew(newData);
     }

      this.setState({ visible: false, editingKey: "-1"});
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
  
    const { budgets, editingKey} = this.state;
    const item = (editingKey === '-1' ? {} : budgets.find(item => item._id === editingKey));

    const columns = this.columns.map((col) => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          dataIndex: col.dataIndex,
          title: col.title,
          editing: this.isEditing(record),
        }),
      };
    });

    return (
      <div>
        <h2>Budget</h2>
        <Button type="primary" onClick={this.showModal}>
          New Budget
        </Button>
        <BudgetFormTable 
          wrappedComponentRef={this.saveFormRef}
          visible={this.state.visible}
          onCancel={this.handleCancel}
          onCreate={this.handleCreate}
          item = {item}
        />
    
      <Table
          bordered
          dataSource={budgets}
          columns={columns}
          rowClassName={record => record.isIncome==='wants' ? "editable-row" : "no-expand"} 
          pagination={{
            onChange: this.cancel,
          }}
          expandedRowRender={record => record.isIncome==='wants' ? <div>
                                                                  <p style={{ margin: 0 }}>{`Preference: ${record.preference}`}</p>
                                                                  <p style={{ margin: 0 }}>{`Amount: ${record.budgetedAmount}`}</p>
                                                              </div> : null}
      />
 
      </div>
    );
  }
}

const EditableFormTable = Form.create()(EditableTable);
export default EditableFormTable;
    
    
              