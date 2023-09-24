const dbConfig = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: false,

  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.wallet = require("./wallet.model.js")(sequelize, Sequelize);
db.transaction = require("./transaction.model.js")(sequelize, Sequelize);

db.wallet.hasMany(db.transaction, {
  as: "transactions",
  foreignKey : 'walletId',
  sourceKey : 'id'
});

db.transaction.belongsTo(db.wallet, {
  foreignKey: "walletId",
  as: "wallet",
  targetKey : "id"
});

module.exports = db;