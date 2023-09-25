
# Wallet Service

A brief description of what this project does and who it's for


## Tech Stack

**Server:** Node, Express

**Databae:** Mysql

*** used this for hosting mysql DB http://freedb.tech/dashboard/index.php


## Installation

Install my-project with npm

```bash
//on local
git clone https://github.com/nitishjha1712/wallet-backend
cd wallet-backend
npm install
npm start
```
    
## API Endpoints

| Methods     | Urls             |Description            | Params            | Response            |  
| ----------- | -----------      | -----------        |-----------        |-----------        |
| POST         | /setup    |Create a new wallet          | {"balance" :"10". "name" : "wallet Name"}    | {"id":1,"balance":"10.0000","transactionId":1,"name":"Wallet Name","date":"Mon Sep 25 2023 07:46:41 GMT+0000 (Coordinated Universal Time)"}           | 
| POST         | /transact/{walletId}    |Create a new transaction          | {"amount" : "10", "description" : "second credit","transactionType" : "credit"}   | {"id":1,"balance":"10.0000","transactionId":1,"name":"Wallet Name","date":"Mon Sep 25 2023 07:46:41 GMT+0000 (Coordinated Universal Time)"}           | 
| GET         | /wallet/{walletId}   |Get a wallet by Id |          | {"id":14,"balance":"664.1234","name":"wallet65","date":"2023-09-24T19:54:01.000Z"}           | 
| GET         | /transactions?walletId=walletId&skip=0&limit=10  |Get all transaction of a wallet|          | {"count":24,"data":[{"id":22,"walletId":14,"amount":"54.0000","balance":"54.0000","description":"wallet setup","date":"2023-09-24T19:54:01.000Z","transactionType":"credit"}]}           | 


## 🔗 API Collection link
[Postman Collection] (https://api.postman.com/collections/16183338-9bf3edbd-2653-48a4-bcf3-339ca8340498?access_key=PMAT-01HB5PQM3NXQ560X1GG4MCVBTV)
