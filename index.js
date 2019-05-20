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

//##################Stream Messages POST###################
var qs = require('qs');
var http = require('http');

// App
const app = express();

// parse application/json
app.use(bodyParser.json())


//##############################  JSON DB #################################
app.put('/changeStatus', async (req, res) => {
    //Payload to call at "config.jsondb.update
    let orderid = req.body.orderid
    let status  = req.body.status
    if(req.body['orderId'] == null || req.body['orderId'] == ""){
        console.log("Error: CHANGE STATUS ERROR - No orderID");
        res.send("{'error':'no orderid sended!'}");  
      }
      else if(req.body['status'] == null || req.body['status'] == "") {
        console.log("Error: CHANGE STATUS ERROR - No status");
        res.send("{'error':'no status sended!'}");
      }
      else {
        console.log("Info: orderid:" + orderid + " new status: " + status);
        adapters.use(config.jsondb.update, req.body).then((resJSONDB) => {
            res.send({ "resJSONDB": resJSONDB});
        }).catch((err) => {
            console.log("Error: " + err)
        })
    }
});

app.post('/getOrder', async (req, res) => {
    adapters.use(config.jsondb.query, req.body).then((resDB) => {
        res.send(resDB);
    }).catch((err) => {
        console.log("Error: " + err);
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
                        console.log("Error: " + err)
                    })

                }).catch((err) => {
                    console.log("Error: " + err)
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
                        console.log("Error: " + err)
                    })

                }).catch((err) => {
                    console.log("Error: " + err)
                })


        } 
    });


});
//##############################  End - JSON DB #################################

app.listen(config.PORT, config.HOST);
console.log(`Running on http://${config.HOST}:${config.PORT}`);
//############################## internal Functions #############################
function postToStream(codestring) {
  // Build the post string from an object
  var post_data = qs.stringify({
     "messages":
          [
                {
                      "key": "MADRID,EVENTTYPE",
                      "value": "microservice_orchestrator"
                },
                {
                      "key": "MADRID,EVENTTYPE",
                      "value": "task: " + codestring
                }
          ]
  });
 
  //https://soa.wedoteam.io',
  // An object of options to indicate where to post to
  var post_options = {
      host: 'streams',
      port: '443',
      path: '/wedodevops/publish/madrid/devops',
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(post_data)
      }
  };
 
  // Set up the request
  var post_req = http.request(post_options, function(res) {
      try{
          res.setEncoding('utf8');
          res.on('data', function (chunk) {
              console.log('Response: ' + chunk);
          });
      } 
      catch (e){
          console.log("ERROR STREAM:" + e);
      }
  });
 
  // post the data
  post_req.write(post_data);
  post_req.end();
}
