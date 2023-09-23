module.exports = {
    HOST: "sql.freedb.tech",
    USER: "freedb_node_user",
    PASSWORD: "2xAej!D4SB#ydyZ",
    DB: "freedb_db_wallet",
    dialect: "mysql",
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    dialectOptions: {
      useUTC: false, //for reading from database
      dateStrings: true,
      typeCast: true
    },
    timezone: "+05:30"
  };