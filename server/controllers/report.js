var mongoose = require("mongoose");
var Report = mongoose.model("report");
var Budget = mongoose.model("budget");
var oneCategory = function(req, res) {
    // get distinct values of transaction
    var currMonth = new Date();
    var currYear = currMonth.getFullYear();
    currMonth = currMonth.getMonth();
    // lowerBound = last year's previous 2 months, e.g. 2018/03/31.
    var lowerBound = new Date(currYear - 1, currMonth - 1);
    // upperBound = this month's last date, e.g. 2019/05/30.
    var upperBound = new Date(currYear, currMonth + 1);
    Budget.aggregate([
        //get matching user ID
        { $match: { user: req.user._id, ignored: false, name: req.body.name } },
        //populate with reportID
        {
            $lookup: {
                from: "reports",
                localField: "reportID",
                foreignField: "_id",
                as: "data"
            }
        },
        //flatten data
        {
            $unwind: "$data"
        },
        {
            $match: {
                "data.month": {
                    $gt: lowerBound,
                    $lte: upperBound
                }
            }
        },
        {
            $project: {
                amount: "$data.amountPerMonth",
                month: {
                    $dateToString: {
                        date: "$data.month",
                        format: "%Y-%m"
                    }
                }
            }
        },
        {
            $sort: { month: 1 }
        }
    ]).then(doc => {
        res.send(doc);
    });
};

var dailyTransaction = function(req, res) {
    // get distinct values of transaction
    var currMonth = new Date();
    var currYear = currMonth.getFullYear();
    currMonth = currMonth.getMonth();
    // lowerBound = last month's last date, e.g. 31st March.
    var lowerBound = new Date(currYear, currMonth);
    // upperBound = this month's last date, e.g. 30th April.
    var upperBound = new Date(currYear, currMonth + 1);
    //return the day to day transactions (ascending).
    Budget.aggregate([
        { $match: { user: req.user._id, ignored: false } },
        {
            $lookup: {
                from: "transactions",
                localField: "transactionID",
                foreignField: "_id",
                as: "data"
            }
        },
        {
            $unwind: "$data"
        },
        {
            $match: {
                "data.date": {
                    $gt: lowerBound,
                    $lte: upperBound
                }
            }
        },
        {
            $group: {
                _id: {
                    date: {
                        $dateToString: {
                            date: "$data.date",
                            format: "%Y-%m-%d"
                        }
                    },
                    income: "$isIncome"
                },
                totalAmount: {
                    $sum: "$data.realAmount"
                }
            }
        },
        {
            $project: {
                date: "$_id.date",
                amount: "$totalAmount",
                isIncome: "$_id.income"
            }
        },
        {
            $sort: { date: 1 }
        }
    ]).then(doc => {
        res.send(doc);
    });
};
// aggregates each income & expense category, then put it into report.

var monthlyTransaction = function(req, res) {
    // get distinct values of transaction
    var currMonth = new Date();
    var currYear = currMonth.getFullYear();
    currMonth = currMonth.getMonth();
    // lowerBound = last month's last date, e.g. 31st March.
    var lowerBound = new Date(currYear, currMonth);
    // upperBound = this month's last date, e.g. 30th April.
    var upperBound = new Date(currYear, currMonth + 1);

    //check if user already make report or nah:
    Report.find({
        user: req.user._id,
        month: {
            $gt: lowerBound,
            $lte: upperBound
        }
    }).then(doc => {
        if (doc.length > 0) {
            //send the report that's been created already.
            Budget.aggregate([
                { $match: { user: req.user._id, ignored: false } },
                {
                    $lookup: {
                        from: "reports",
                        localField: "reportID",
                        foreignField: "_id",
                        as: "data"
                    }
                },
                //flatten.. 
                {
                    $unwind: "$data"
                },
                //match this month: 
                {
                    $match: {
                        "data.month": {
                            $gt: lowerBound,
                            $lte: upperBound
                        }
                    }
                },
                //change field names: 
                {
                    $project: {
                        name: "$name",
                        totalAmount: "$data.amountPerMonth",
                        isIncome: "$isIncome",
                        preference: "$preference"
                    }
                }
            ]).then(doc => {
                res.send({ document: doc, found: true });
            });

            return;
        } else {
            //make this month's report for each category from the list of transactions:
            Budget.aggregate([
                { $match: { user: req.user._id, ignored: false } },
                //aggregate to transactions: 
                {
                    $lookup: {
                        from: "transactions",
                        localField: "transactionID",
                        foreignField: "_id",
                        as: "data"
                    }
                },
                //flatten
                {
                    $unwind: "$data"
                },
                //match this month: 
                {
                    $match: {
                        "data.date": {
                            $gt: lowerBound,
                            $lte: upperBound
                        }
                    }
                },
                //group for each category: 
                {
                    $group: {
                        _id: {
                            id: "$_id",
                            month: { $month: "$data.date" },
                            year: { $year: "$data.date" },
                            isIncome: "$isIncome",
                            name: "$name"
                        },
                        totalAmount: {
                            $sum: "$data.realAmount"
                        }
                    }
                }
            ]).then(doc => {
                // append each category's sum into report db.
                var sum = 0;
                var answer = [];
                for (let i = 0; i < doc.length; i++) {
                    //put into remort
                    var model = new Report({
                        user: req.user._id,
                        amountPerMonth: doc[i].totalAmount,
                        month: new Date(doc[i]._id.year, doc[i]._id.month)
                    });
                    model.save();
                    //add this to Budget:
                    Budget.updateOne(
                        {
                            user: req.user._id,
                            _id: doc[i]._id.id
                        },
                        //add associated reportID:
                        {
                            $push: { reportID: model._id }
                        },
                        
                        { new: true }
                    ).then(result => {});
                    //send to front:
                    answer.push({
                        name: doc[i]._id.name,
                        totalAmount: model.amountPerMonth,
                        isIncome: doc[i]._id.isIncome
                    });
                }

                res.send({ document: answer, found: false });
                return;
            });
        }
    });
};
//get yearly spending report for graph
var yearlyTransaction = function(req, res) {
    // get distinct values of transaction
    var currMonth = new Date();
    var currYear = currMonth.getFullYear();
    currMonth = currMonth.getMonth();
    // lowerBound = last year's previous 2 months, e.g. 2018/03/31.
    var lowerBound = new Date(currYear - 1, currMonth - 1);
    // upperBound = last month's last date, e.g. 2019/05/30.
    var upperBound = new Date(currYear, currMonth + 1);

    Budget.aggregate([
        //get matching user ID
        { $match: { user: req.user._id } },
        //populate with reportID
        {
            $lookup: {
                from: "reports",
                localField: "reportID",
                foreignField: "_id",
                as: "data"
            }
        },
        //flatten data
        {
            $unwind: "$data"
        },
        {
            $match: {
                "data.month": {
                    $gt: lowerBound,
                    $lte: upperBound
                }
            }
        },
        //group based on isIncome type for each month.
        {
            $group: {
                _id: {
                    month: {
                        $dateToString: {
                            date: "$data.month",
                            format: "%Y-%m"
                        }
                    },
                    income: "$isIncome"
                },
                totalAmount: {
                    $sum: "$data.amountPerMonth"
                }
            }
        },
        //make it friendlier for frontend
        {
            $project: {
                month: "$_id.month",
                label: "$_id.income",
                data: "$totalAmount"
            }
        },
        {
            $sort: { month: 1 }
        }
    ]).then(doc => {
        res.send(doc);
    });

    return;
};

module.exports.monthlyTransaction = monthlyTransaction;
module.exports.yearlyTransaction = yearlyTransaction;
module.exports.dailyTransaction = dailyTransaction;
module.exports.oneCategory = oneCategory;
