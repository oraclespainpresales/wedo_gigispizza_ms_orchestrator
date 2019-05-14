'use strict';

const express = require('express');
var bodyParser = require('body-parser')

const adapters = require("./adapters.js")
const config = require("./config.js")

const functions = require("./fn-node-invokebyendpoint/invokefunc.js")
const fs = require('fs')
const os = require('os')
const yaml = require('yamljs')
const URL = require('url').URL
const https = require('https')
const jsSHA = require('jssha')
const sshpk = require('sshpk')
const httpSignature = require('http-signature')

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

app.post('/getPayment', async (req, res) => {
    adapters.use(config.sqldb.query, req.body).then((resDB) => {
        res.send(resDB);
    }).catch((err) => {
        console.log("Error: " + err)
    })
});
app.post('/createOrder', async (req, res) => {

    //Payload to call at "config.jsondb.insert"
    let order = req.body.order

    let payment = req.body.payment

    let paymentMethod = req.body.payment.paymentMethod;
    let totalPayed = req.body.payment.totalPayed;

    var fnInvokeEndpoint = "https://kfd4yc7wzsq.us-phoenix-1.functions.oci.oraclecloud.com/20181201/functions/ocid1.fnfunc.oc1.phx.aaaaaaaaabbnp3n4nvk4hxmldnxhkj2ptt62hhucrsqocaryfu6lut5ytyma/actions/invoke";
    var context = yaml.load('fn-node-invokebyendpoint/config.yaml') // load OCI context values
    var keyPath = context.privateKeyPath
    if (keyPath.indexOf('~/') === 0) {
        keyPath = keyPath.replace('~', os.homedir())
    }

    // read the private key
    fs.readFile(keyPath, 'ascii', (err, data) => {
        if (err) {
            console.error("Can't read keyfile: " + keyPath)
            process.exit(-1)
        }
        context.privateKey = data

        if (paymentMethod == "AMEX") {
            functions.invokeFunction(context, fnInvokeEndpoint, totalPayed, function (response) {
                console.log("functionResponse :" + response)
                // Change the valueof payment.totalPayed
                payment.totalPayed = response;

                //TODO OtherDBs payload
                //let customerAdress = req.body.customerAdress
                //Do not forget to put the metadata on nodeJS
                adapters.use(config.jsondb.insert, order).then((resJSONDB) => {


                    console.log("Total to pay after discount applied (1***):" + payment.totalPayed + "$");
                    adapters.use(config.sqldb.insert, payment).then((resSQLDB) => {

                        //TO remove once you added the call to GraphDB
                        res.send({ "resJSONDB": resJSONDB, "resSQLDB": resSQLDB });
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

                console.log("Total to pay after discount applied :" + payment.totalPayed + "$");
                console.log("Total to pay after discount applied :" + payment.totalPayed + "$");
            })
        } else console.log("Not eligible to discount");
    });


});
//##############################  End - JSON DB #################################

app.listen(config.PORT, config.HOST);
console.log(`Running on http://${config.HOST}:${config.PORT}`);
