const db = require("../models");
const createError = require('http-errors')
const Wallet = db.wallet;
const Transaction = db.transaction;
const Op = db.Sequelize.Op;

const setupWallet = async (req, res) => {
    const t1 = await db.sequelize.transaction(); //initialize transaction
    try{
        let reqData = req.body;
        requiredParamsValidate(reqData, ['name']);
        amountValidation(reqData.balance);

        let wallet = await createWallet(reqData, t1);
        let transaction = await insertTransaction(reqData.balance, wallet.id, 'credit', 'wallet setup', t1);

        await updateTransactionBalance(reqData.balance, transaction.id, t1);

        await t1.commit();

        return res.status(200).send({id : wallet.id, balance : wallet.balance, transactionId : transaction.id, name : wallet.name, date : wallet.date});
    } catch(error){
        console.log("Error", error)
        t1.rollback();
        let message = error.message ? error.message : error;
        let status = error.status ? error.status : 500;
        return res.status(status).send({error : message});
    }
}

const addTransaction = async (req, res) => {
    const t2 = await db.sequelize.transaction();
    try{
        let reqData = req.body;
        requiredParamsValidate(reqData, ['amount', 'description', 'transactionType']);
        amountValidation(reqData.amount);

        let wallet = await Wallet.findByPk(req.params.walletId);
    
        if(!wallet){
            throw createError(404, "Wallet not found");
        }

        let transaction = await insertTransaction(reqData.amount, req.params.walletId, reqData.transactionType, reqData.description, t2);
        
        checkSufficientBalance(reqData.transactionType, wallet.balance, reqData.amount);
        
        let balance = parseToFloat(wallet.balance) + parseToFloat(reqData.amount);

        await wallet.update({WalletBalance : balance}, { transaction : t2 });

        await updateTransactionBalance(balance, transaction.id, t2);

        await t2.commit();
        return res.status(200).send({balance : toFixedDecimal(balance, 4), transactionId : transaction.id});
    } catch(error){
        console.log("Error", error);
        await t2.rollback();
        let message = error.message ? error.message : error;
        let status = error.status ? error.status : 500;
        return res.status(status).send({error : message});
    }
}

const getTransactions = async(req, res) => {
    try{
        let walletId = req.query.walletId;
        let skip = parseInt(req.query.skip);
        let limit = parseInt(req.query.limit);

        let transaction = await Transaction.findAll({where : {walletId}, limit, offset : skip});
        if(!transaction){
            throw createError(404, "No Transaction found");
        }

        const totalCount = await Transaction.count({where : {walletId}});
        
        let responseJson = {count : totalCount};
        let responseJsonData = [];
        transaction.map((elem) => {
            let tmpResponse = {
                id : elem.id,
                walletId : elem.walletId,
                amount : elem.amount,
                balance : elem.balance,
                description : elem.description,
                date : elem.date,
                transactionType: elem.transactionType
            };
            responseJsonData.push(tmpResponse);
        })

        responseJson['data'] = responseJsonData;

        return res.status(200).send(responseJson);
    } catch(error){
        let message = error.message ? error.message : error;
        let status = error.status ? error.status : 500;
        return res.status(status).send({error : message});
    }
}

const getWallet = async(req, res) => {
    try{
        let walletId = req.params.walletId;
        let wallet = await Wallet.findByPk(walletId);
        if(!wallet){
            // throw "Wallet not found";
            throw createError(404, "Wallet not found");
        }
        return res.status(200).send({id : wallet.id, balance : wallet.balance, name : wallet.name, date : wallet.createdAt });
    }catch(error){
        let message = error.message ? error.message : error;
        let status = error.status ? error.status : 500;
        return res.status(status).send({error : message});
    }
}

const amountValidation = (amount) => {
    amount = Number(amount);
    let amountRegex = /^[+-]?[0-9]{1,9}(?:\.[0-9]{1,10})?$/;
    if(!amountRegex.test(amount)){
        throw createError(400, "Invalid amount");
    }
}

const requiredParamsValidate = async(data, paramsArr) => {
    let validationArr = [];
    paramsArr.forEach(element => {
        !(element in data) && validationArr.push(element);
    });
    if(validationArr.length > 0){
        throw createError(400, `Mandatory fields missing ${validationArr.toString()}`);
    }
}

const parseToFloat = (amount) => {
    return parseFloat(amount);
}

const toFixedDecimal = (amount, precision) => {
    amount = Number(amount);
    return amount.toFixed(precision);
}

const createWallet = async(data, transaction) => {
    let walletData = {
        name: data.name,
        WalletBalance: data.balance
    };

   return await Wallet.create(walletData, {include: ["transactions"]},{ transaction });
}

const insertTransaction = async (amount, walletId, transactionType, description, transaction) => {
    let transactionData = {
        transactionAmount : amount,
        description,
        walletId,
        transactionType
    };

    return await Transaction.create(transactionData, { transaction });
}

const updateTransactionBalance = async(amount, transactionId, transaction) => {
    return await db.transaction.update({walletBalance : amount}, {where : {id : transactionId}, transaction});
}

const checkSufficientBalance = (transactionType, balance, amount) => {
    if(transactionType.toLowerCase() == "debit" && (balance <= 0 || parseToFloat(balance) < parseToFloat(amount.slice(1)))){
        throw createError(400, "Insufficient balance for debit");
    }
}

module.exports = {
    setupWallet,
    addTransaction,
    getTransactions,
    getWallet
}