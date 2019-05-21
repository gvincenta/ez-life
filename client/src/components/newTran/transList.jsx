
import React from 'react';

import 'antd/dist/antd.css';

import {Table, Button, Popconfirm, Form,Divider} from 'antd';

import TransFormTable from './transForm'

import moment from 'moment'


class EditableTable extends React.Component {
  constructor(props) {
    super(props);
    
    this.columns =
      [{
        title: 'Date',
        dataIndex: 'date',
      }, {
        title: 'Category',
        dataIndex: 'category',
        render: (category, record) => {
          return `${record.category[0]} / ${record.category[1]}`
        }
      }, {
        title: 'Tag',
        dataIndex: 'tag',
      }, {
        title: 'Amount',
        dataIndex: 'amount',
      }, {
        title: 'Operation',
        dataIndex: 'operation',
        width: '20%',
        render: (text, record) => {
          const { editingKey } = this.state;
          return(
            <div>
              <span>
                { 
                  <a disabled={editingKey !== "-1"} onClick={() => this.edit(record.key)}>Edit</a>
                   
                }
                <Divider type="vertical" />
                
                {
                  this.state.dataSource.length >= 1
                  ? (
                    <Popconfirm title="Sure to delete?" onConfirm={() => this.handleDelete(record.key)}>
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
      dataSource: [],
      count: 0,
      visible: false,
      onfirmLoading: false,
      editingKey: "-1" ,
    };
  }

  componentDidMount(){
    // TODO handleload()

  }
  handleLoad = () => {
     // TODO handleload()
  }


    
  showModal = () => {
    this.setState({ visible: true });
  };

  handleCancel = () => {
    this.setState({ visible: false, editingKey: "-1"});
  };

  handleCreate = () => {
    const form = this.formRef.props.form;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }

      console.log('Received values of form: ', values);

      form.resetFields();
      
      const {dataSource,editingKey} = this.state;

      const newData = {
        key: editingKey === '-1' ? this.state.count : parseInt(editingKey),
        date: moment(values.transdate).format('YYYY-MM-DD'),
        category: values.category,
        tag: values.tag||'',
        amount: values.amount,
        type: 'view'
      }
    
     if(editingKey !== '-1'){
       // edit
      let newd = dataSource.map(item => {
        if (item.key === parseInt(editingKey)) {
          item = newData;
        }
        return item;
      });
       // TODO update a transaction
      this.setState({dataSource: newd})
     } else {
         // TODO create new transaction
      this.setState({dataSource:[...dataSource,newData],count: this.state.count+1});
     }
     // 
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

  handleDelete = (key) => {
     // TODO delete a transaction
    const dataSource = [...this.state.dataSource];
    this.setState({ dataSource: dataSource.filter(item => item.key !== key) });
  }

  render() {
  
    const { dataSource, editingKey} = this.state;
    const item = (editingKey === '-1' ? {} : dataSource.find(item => item.key === editingKey));

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
        <h2>Transaction Log</h2>
        <Button type="primary" onClick={this.showModal}>
          New Transaction
        </Button>
        <TransFormTable 
          wrappedComponentRef={this.saveFormRef}
          visible={this.state.visible}
          onCancel={this.handleCancel}
          onCreate={this.handleCreate}
          item = {item}
        />
    
      <Table
          bordered
          dataSource={dataSource}
          columns={columns}
          rowClassName="editable-row"
          pagination={{
            onChange: this.cancel,
          }}
        />
 
      </div>
    );
  }
}

const EditableFormTable = Form.create()(EditableTable);
export default EditableFormTable;
    
    
              