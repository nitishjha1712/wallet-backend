const { Transaction } = require("./transaction.model");

module.exports = (sequelize, Sequelize) => {
    const Wallet = sequelize.define("wallet_summary", {
        name: {
        type: Sequelize.STRING
      },
      WalletBalance: {
        type: Sequelize.DECIMAL(15, 6)	
      },
      balance: {
        type: Sequelize.VIRTUAL,
        get() {
          return Number(this.WalletBalance).toFixed(4);
        }
      },
      date: {
        type: Sequelize.VIRTUAL,
        get() {
          return Date(this.createdAt);
        }
      }
    
    });
  
    return Wallet;
  };