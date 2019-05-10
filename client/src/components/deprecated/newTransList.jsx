import React from "react";

import "./newTransactionList.css";
import "antd/dist/antd.css";

import CategoryOptions from "./defaultOptions";
import moment from "moment";

import {
  Table,
  Input,
  Divider,
  Button,
  notification,
  Form,
  DatePicker,
  Cascader,
  InputNumber,
  Popconfirm,
  Modal
} from "antd";

class TransList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isRowOpen: false,

      dataSource: [
        {
          key: "0",
          date: { dateValue: "2019-05-01", display: moment("2019-05-01") }, // "dateValue" is to display on the table as a string, "display" is to display on the selector as defaultValue
          amount: 120,
          category: {
            cateValue: "Home Service / Water",
            display: ["Home Service", "Water"]
          },
          tag: "September",
          type: "view" // each transaction has 3 type: new(when u add it), edit(when u edit), view(display on the table)
        }
      ],
      count: 0, // for key

      editCacheData: [] // when u edit(including create a new row), the changing data will be saved here
    };

    // table columns
    // each columns has it render for different input type
    this.columns = [
      // date - inputType: datePicker(moment)
      // defaultValue: either the date u select(edit trans) or the current day(add a new trans)
      // disabled: the future date (tmrw and beyond)
      // onChange: collect the change data pass to editCacheData
      {
        title: "Date",
        key: "date",
        dataIndex: "date",
        render: (date, record) => {
          return record.type !== "view" ? (
            <DatePicker
              format="YYYY-MM-DD"
              defaultValue={record.date.display || moment(new Date())}
              onChange={e => this.dateChange(e, record)}
              disabledDate={current => {
                return current.isAfter(new Date());
              }}
              dateRender={current => {
                return (
                  <div className="ant-calendar-date">{current.date()}</div>
                );
              }}
            />
          ) : (
            record.date.dateValue
          );
        }
      },

      // category - inputType: cascader (Array)
      // defaultValue: the category u select(edit trans) or empty
      // onChange: collect the change data pass to editCacheData
      {
        title: "Category",
        key: "category",
        dataIndex: "category",
        render: (category, record) => {
          return record.type !== "view" ? (
            <Cascader
              defaultValue={record.category.display}
              options={CategoryOptions}
              placeholder="Please select a Category"
              onChange={e => this.categoryChange(e, record)}
            />
          ) : (
            record.category.cateValue
          );
        }
      },

      // tag - inputType: string
      // defaultValue: the Tag u enter(edit trans) or empty
      // onChange: collect the change data pass to editCacheData
      // optional
      {
        title: "Tag",
        width: "25%",
        key: "tag",
        render: record => {
          return record.type !== "view" ? (
            <Input
              placeholder="More details of this transaction (optional) "
              defaultValue={record.tag}
              onChange={e => this.tagChange(e, record)}
            />
          ) : (
            record.tag
          );
        }
      },

      // amount - inputType: number
      // defaultValue: the amount u enter(edit trans) or 1 (add a new trans)
      // onChange: collect the change data pass to editCacheData
      {
        title: "Amount",
        key: "amount",
        render: record => {
          return record.type !== "view" ? (
            <InputNumber
              defaultValue={record.amount}
              onChange={e => this.amountChange(e, record)}
              min={1}
              formatter={value =>
                `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={value => value.replace(/\$\s?|(,*)/g, "")}
              style={{ width: "110px" }}
            />
          ) : (
            record.amount
          );
        }
      },

      // the operation option for different record type is different
      {
        title: "Operation",
        key: "operation",
        render: record => (
          <span>
            {record.type === "new" && (
              <span>
                <a href="javascript:;" onClick={e => this.addSubmit(record)}>
                  Add
                </a>
                <Divider type="vertical" />
                <a href="javascript:;" onClick={e => this.cancelAdd(record)}>
                  Cancel
                </a>
              </span>
            )}
            {record.type === "edit" && (
              <span>
                <a href="javascript:;" onClick={e => this.editSubmit(record)}>
                  Save
                </a>
                <Divider type="vertical" />
                <a href="javascript:;" onClick={e => this.cancelEdit(record)}>
                  Cancel
                </a>
              </span>
            )}
            {record.type === "view" && (
              <span>
                <a href="javascript:;" onClick={e => this.edit(record)}>
                  Edit
                </a>
                <Divider type="vertical" />
                {this.state.dataSource.length >= 1 ? (
                  <Popconfirm
                    title="Sure to delete?"
                    onConfirm={() => this.delete(record)}
                  >
                    <a href={"javascript:;"}>Delete</a>
                  </Popconfirm>
                ) : null}
              </span>
            )}
          </span>
        )
      }
    ];
  }

  /* not import, can delete
   * init the first item in dataSource
   */
  componentDidMount() {
    this.initRowType(this.state.dataSource);
  }
  initRowType(data) {
    for (let item of data) {
      item["type"] = "view";
    }
    this.updateDataSource(data);
  }
  // -------------------------------------- Receive Data Changing on the table for each coloumn -----------------------------------------------

  // if date is null, give a warning message
  // otherwise, pass the data to editCacheData
  dateChange(e, record) {
    if (e === null) {
      Modal.warning({
        title: "This is a warning message",
        content: "Your Date is empty"
      });

      // remove the record data
      let newState = Object.assign({}, this.state);
      newState.editCacheData.date = {};
      this.setState(newState);
    } else {
      const dateValue = e.format("YYYY-MM-DD");
      const display = moment(dateValue);
      this.updateEditCacheData(record, { date: { dateValue, display } });
    }
  }

  // if category is null, give a warning message
  // otherwise, pass the data to editCacheData
  categoryChange(e, record) {
    if (e.length === 0) {
      Modal.warning({
        title: "This is a warning message",
        content: "Your Category is empty"
      });
      // remove the record data
      let newState = Object.assign({}, this.state);
      newState.editCacheData.category = {};
      this.setState(newState);
    } else {
      const cateValue = `${e[e.length - 2]} / ${e[e.length - 1]}`;
      const display = e;
      this.updateEditCacheData(record, { category: { cateValue, display } });
    }
  }

  tagChange(e, record) {
    this.updateEditCacheData(record, { tag: e.target.value });
  }

  amountChange(e, record) {
    this.updateEditCacheData(record, { amount: e });
  }
  // ---------------------------------------------- updata EditCacheData and Datasource -----------------------------------------------

  // record: each row, obj: the changing data of columns
  updateEditCacheData(record, obj) {
    let { editCacheData } = this.state;

    // change that data only and keep the rest
    let cacheData =
      record.key === editCacheData.key
        ? { ...editCacheData, ...obj }
        : { ...record, ...obj };

    this.setState({ editCacheData: cacheData });
  }

  // update the data to dataSource
  // each time can only open one row
  // when add a new transaction, the '+ Add' button disable
  updateDataSource(newData, isAddDisabled) {
    let isRowOpen =
      typeof isAddDisabled == "boolean"
        ? isAddDisabled
        : newData.some(item => item.type === "new" || item.type === "edit");

    this.setState({
      isRowOpen,
      dataSource: newData
    });
  }

  // ---------------------------------------------- Operation -----------------------------------------------

  // validation of date and category
  isValid() {
    let { dataSource, editCacheData } = this.state;

    const dateValid = editCacheData.date;
    const cateValid = editCacheData.category;

    if (cateValid === undefined || Object.keys(cateValid).length === 0) {
      Modal.error({
        title: "This is an error message",
        content: "Please select a Category"
      });

      return false;
    }

    if (dateValid === undefined || Object.keys(dateValid).length === 0) {
      Modal.error({
        title: "This is an error message",
        content: "Please select a Date"
      });
      return false;
    }

    return true;
  }

  // when add a row, check if the Date and Category is valid.
  // If yes, pass the data to dataSource
  addSubmit(record) {
    let { dataSource, editCacheData } = this.state;

    if (this.isValid() === true) {
      setTimeout(res => {
        editCacheData.type = "view";
        let index = dataSource.findIndex(item => item.key === record.key);
        dataSource.splice(index, 1);
        let i = this.checkDate();
        //dataSource.pop();
        //dataSource.push(editCacheData);
        if (i === undefined) {
          i = dataSource.length;
        }
        dataSource.splice(i, 0, editCacheData);

        this.updateDataSource(dataSource);
        this.setState({ editCacheData: [] });

        notification["success"]({ message: "Add Success！", duration: 1 });
      }, 500);
    }
  }

  // sorting date when add or edit
  checkDate(editCacheDate) {
    let { dataSource, editCacheData } = this.state;
    const dateNow = editCacheData.date.display;
    for (let i = 0; i < dataSource.length; i++) {
      const dateBef = dataSource[i].date.display;
      console.log(dateNow - dateBef);
      if (dateNow - dateBef > 0) {
        return i;
      }
    }
  }

  cancelAdd(record) {
    let { dataSource } = this.state;
    dataSource.pop();

    this.updateDataSource(dataSource);
  }

  // when edit a row, check if the Date and Category is valid.
  // If yes, pass the data to dataSource
  editSubmit(record) {
    let { dataSource, editCacheData } = this.state;

    if (this.isValid() === true) {
      setTimeout(res => {
        let index = dataSource.findIndex(item => item.key === record.key);
        dataSource.splice(index, 1);
        let i = this.checkDate();
        //dataSource.pop();
        //dataSource.push(editCacheData);
        if (i === undefined) {
          i = dataSource.length;
        }
        dataSource.splice(i, 0, editCacheData);

        let newData = dataSource.map(item => {
          if (item.key === editCacheData.key) {
            item = Object.assign({}, editCacheData);
            item.type = "view";
          }
          return item;
        });

        console.log(record);

        this.updateDataSource(newData);

        notification["success"]({ message: "Edit Success！", duration: 1 });
      }, 500);
    }
  }

  cancelEdit(record) {
    let { dataSource } = this.state;

    let editRow = dataSource.find(item => item.key === record.key);
    editRow.type = "view";

    this.updateDataSource(dataSource);
  }

  // delete a record
  delete(record) {
    let { dataSource } = this.state;
    setTimeout(res => {
      let index = dataSource.findIndex(item => item.key === record.key);
      dataSource.splice(index, 1);

      this.updateDataSource(dataSource);

      notification["success"]({ message: "Delet Success！", duration: 1 });
    }, 500);
  }

  // change the type to "edit", to change operation opation
  edit(record) {
    let { dataSource } = this.state;

    // find the record in dataSource
    let newData = dataSource.filter(item => {
      if (item.key === record.key) {
        item.type = "edit";
        return item;
      } else if (item.type !== "new") {
        item.type = "view";
        return item;
      }
    });

    this.updateDataSource(newData, true);
  }
  // ---------------------------------------------- Add Row -----------------------------------------------

  // func for "+ Add a New Transaction" button
  addRow = () => {
    let { dataSource, count } = this.state;

    let currDate = moment(new Date());
    let newRecord = {
      key: (count + 1).toString(),
      date: { dateValue: currDate.format("YYYY-MM-DD"), display: currDate },
      amount: 1,
      category: {},
      tag: "",
      type: "new"
    };
    this.setState({ count: this.state.count + 1 });

    dataSource.push(newRecord);
    this.updateDataSource(dataSource);
  };

  // ---------------------------------------------- Render -----------------------------------------------
  render() {
    const { dataSource, isRowOpen } = this.state;

    return (
      <div className="trans">
        <div className="transWrap">
          <Button
            style={{ marginBottom: "10px" }}
            disabled={isRowOpen}
            onClick={this.addRow}
          >
            + Add a New Transaction
          </Button>
          <Table
            bordered
            rowKey={record => record.key}
            size={"middle"}
            columns={this.columns}
            rowClassName="editable-row"
            dataSource={dataSource}
            pagination={false}
          />
        </div>
      </div>
    );
  }
}

const EditableFormTable = Form.create()(TransList);
export default EditableFormTable;
