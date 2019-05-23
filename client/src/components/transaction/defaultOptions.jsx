import React, { Component } from "react";

const options = [
  {
    value: "Food and Groceries",
    label: "Food and Groceries",
    children: [
      {
        value: "Food",
        label: "Food"
      },
      {
        value: "Dining Out",
        label: "Dining Out"
      },
      {
        value: "Beverage",
        label: "Beverage"
      },
      {
        value: "Groceries",
        label: "Groceries"
      }
    ]
  },
  {
    value: "Home Service",
    label: "Home Service",
    children: [
      {
        value: "Electricity",
        label: "Electricity"
      },
      {
        value: "Water",
        label: "Water"
      }
    ]
  }
];

export default options;
