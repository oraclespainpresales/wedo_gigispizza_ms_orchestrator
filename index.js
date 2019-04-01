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

    //TODO OtherDBs payload
    let other1dbPayload = "payload"
    let other2dbPayload = "payload"
    adapters.use(config.jsondb.insert, order).then((resJSONDB) => {

        //TODO Call other DB if Json Response is 200
        adapters.use(config.other1db, other1dbPayload).then((resOther1DB) => {

            //TODO Call other DB if prevoius Response is 200
            adapters.use(config.other2db, other2dbPayload).then((resOther2DB) => {


                res.send("Order Created");


            }).catch((err) => {
                console.log("Error: " + err)
            })


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
