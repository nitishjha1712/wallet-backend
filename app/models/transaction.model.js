const { wallet } = require("./wallet.model");

module.exports = (sequelize, Sequelize) => {
    const Transaction = sequelize.define("transaction_summary", {
        transactionAmount: {
            type: Sequelize.DECIMAL(15, 6)
        },
        description: {
            type: Sequelize.STRING
        },
        transactionType : {
            type: Sequelize.STRING
        },
        walletBalance : {
            type: Sequelize.DECIMAL(15, 6)
        },
        amount: {
            type: Sequelize.VIRTUAL,
            get() {
              return Number(this.transactionAmount).toFixed(4);
            }
        },
        balance: {
            type: Sequelize.VIRTUAL,
            get() {
              return Number(this.walletBalance).toFixed(4);
            }
        },
        date: {
            type: Sequelize.VIRTUAL,
            get() {
                return this.createdAt;
            }
        }
    });
  
    return Transaction;
  };