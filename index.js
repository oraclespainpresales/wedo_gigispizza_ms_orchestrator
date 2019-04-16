'use strict';

const express = require('express');
var bodyParser = require('body-parser')

const adapters = require("./adapters.js")
const config = require("./config.js")

// App
const app = express();

// parse application/json
app.use(bodyParser.json())


//##############################  JSON DB #################################


app.post('/getOrder', async (req, res) => {
    adapters.use(config.jsondb.query, req.body).then((resDB) => {
        res.send(resDB);
    }).catch((err) => {
        console.log("Error: " + err)
    })
});


app.post('/createOrder', async (req, res) => {

    //Payload to call at "config.jsondb.insert"
    let order = req.body.order

    let payment = req.body.payment

    //TODO OtherDBs payload
    //let customerAdress = req.body.customerAdress
    //Do not forget to put the metadata on nodeJS
    adapters.use(config.jsondb.insert, order).then((resJSONDB) => {

        adapters.use(config.sqldb.insert, payment).then((resSQLDB) => {

            //TO remove once you added the call to GraphDB
            res.send({"resJSONDB": resJSONDB, "resSQLDB": resSQLDB});
/*
            adapters.use(config.graphdb.insert, payment).then((resGraphDB) => {

                res.send({"resJSONDB": resJSONDB, "resSQLDB": resSQLDB, "resGraphDB" : resGraphDB});
        
            }).catch((err) => {
                console.log("Error: " + err)
            })
*/
        }).catch((err) => {
            console.log("Error: " + err)
        })

    }).catch((err) => {
        console.log("Error: " + err)
    })
});
//##############################  End - JSON DB #################################

app.listen(config.PORT, config.HOST);
console.log(`Running on http://${config.HOST}:${config.PORT}`);
