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
app.get('/getAllOrders', async (req, res) => {
    adapters.use(config.jsondb.queryAll, req.body).then((resDB) => {
        res.send(resDB);
    }).catch((err) => {
        console.error("Error: getAllOrders-> ", err);
        res.send({"error":err.toString()});
    })
});

app.put('/changeStatus', async (req, res) => {
    //Payload to call at "config.jsondb.update
    let orderid = req.body.orderId
    let status  = req.body.status
    if(orderid == null || orderid == ""){
        console.log("Error: CHANGE STATUS ERROR - No orderID");
        res.send("{'error':'no orderid sended!'}");  
      }
      else if(status == null || status == "") {
        console.log("Error: CHANGE STATUS ERROR - No status");
        res.send("{'error':'no status sended!'}");
      }
      else {
        console.log("Info: orderid:" + orderid + " new status: " + status);
        adapters.use(config.jsondb.update, req.body).then((resJSONDB) => {
            res.send({ "resJSONDB": resJSONDB});
        }).catch((err) => {
            console.error("Error: changeStatus-> ", err);
            res.send({"error":err.toString()});
        })
    }
});

app.post('/getOrder', async (req, res) => {
    let configOrderCall = config.jsondb.queryAll;
    console.log("Info: Param Received -> ", JSON.stringify(req.body));
    if(req.body.orderId == null || req.body.orderId == ""){
      console.log("Info: where request-> ", JSON.stringify(req.body.where));
      if(req.body.where == null || req.body.where == ""){
        configOrderCall = config.jsondb.queryAll;
      }    
      else{
        configOrderCall = config.jsondb.queryWhere            
      }        
    }
    else{
        //to keep compatibility with last version.
        configOrderCall = config.jsondb.queryOrderId
    }
              
    adapters.use(configOrderCall, req.body).then((resDB) => {
        res.send(resDB);
    }).catch((err) => {
        console.error("Error: getOrder-> ", err);
        res.send({"error":err.toString()});
    })
});

app.post('/getPayment', async (req, res) => {
    adapters.use(config.sqldb.query, req.body).then((resDB) => {
        res.send(resDB);
    }).catch((err) => {
        console.error("Error: getPayment-> ", err);
        res.send({"error":err.toString()});
    })
});

app.post('/createOrder', async (req, res) => {

    //Payload to call at "config.jsondb.insert"
    let order = req.body.order

    let payment = req.body.payment

    let paymentMethod = req.body.payment.paymentMethod;
    let totalPayed = req.body.payment.totalPayed;

    //var fnInvokeEndpoint = "https://kfd4yc7wzsq.us-phoenix-1.functions.oci.oraclecloud.com/20181201/functions/ocid1.fnfunc.oc1.phx.aaaaaaaaabbnp3n4nvk4hxmldnxhkj2ptt62hhucrsqocaryfu6lut5ytyma/actions/invoke";
    var fnInvokeEndpoint = "https://ylcnth7j6ya.us-phoenix-1.functions.oci.oraclecloud.com/20181201/functions/ocid1.fnfunc.oc1.phx.aaaaaaaaad4c3a23nxkjtnwfoaushbenpqaj3emrpgt5r7sqs25tivsktn6q/actions/invoke";
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
                        console.error("Error: createOrder-paymentMethod-> ", err);
                        res.send({"error":err.toString()});
                    })

                }).catch((err) => {
                    console.error("Error: createOrder-paymentMethod-> ", err);
                        res.send({"error":err.toString()});
                })

                console.log("Total to pay after discount applied :" + payment.totalPayed + "$");
                console.log("Total to pay after discount applied :" + payment.totalPayed + "$");
            })
        } else{
            console.log("Not eligible to discount");
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
                        console.error("Error: createOrder-paymentMethod AMEX-> ", err);
                        res.send({"error":err.toString()});
                    })

                }).catch((err) => {
                    console.error("Error: createOrder-paymentMethod AMEX-> ", err);
                    res.send({"error":err.toString()});
                })


        } 
    });


});
//##############################  End - JSON DB #################################
console.log("MICROSERVICE_ORDER_SERVICE  -> %s:%s", config.jsondb.insert.host, config.jsondb.insert.port)
console.log("MICROSERVICE_PAYMENT_SERVICE-> %s:%s", config.sqldb.insert.host , config.sqldb.insert.port)
app.listen(config.PORT, config.HOST);
console.log(`Running on http://${config.HOST}:${config.PORT}`);