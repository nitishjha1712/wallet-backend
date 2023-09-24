const { Transaction } = require("./transaction.model");
const { wallet } = require("./wallet.model");

module.exports = () => {
    const walletTransactionAssoc = 
        wallet.hasMany(Transaction, { as: "transactions", foreignKey : 'walletId' });
        Transaction.belongsTo(Wallet, {
                foreignKey: "walletId",
                as: "wallet",
            });
    return walletTransactionAssoc;
}