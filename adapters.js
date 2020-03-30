"use strict";
const http = require('http');
const https = require('https');

function use(config, data) {
    var type = "http"

    console.log("USE#config ", config);
    console.log("USE#port ", config.port);
    if (config.port == "443"){
        type = "https"
    }
    console.log("USE#type ", type);

    let result = new Promise(function (resolve, reject) {
        let body = data
        // request option
        let options = config
        // http or https request object
        if (type == "http"){
            let req = http.request(options, function (res) {
                let result = '';

                res.on('data', function (chunk) {
                    result += chunk;
                });

                res.on('end', function () {
                    var response = JSON.parse(result);
                    resolve(response)
                });

                res.on('error', function (err) {
                    console.log("Error calling: " + config.path);
                    reject(err)
                })
            });

            req.on('error', function (err) {
                console.log("Error calling: " + config.path);
                reject(err)
            });

            //send request
            console.log("USE#INFO http Method: ", options.method);
            if (options.method != "GET"){
                console.log("INFO body: ", JSON.stringify(body));
                req.write(JSON.stringify(body));
            }
            req.end();
        }
        else{
            let req = https.request(options, function (res) {
                let result = '';

                res.on('data', function (chunk) {
                    result += chunk;
                });

                res.on('end', function () {
                    var response = JSON.parse(result);
                    resolve(response)
                });

                res.on('error', function (err) {
                    console.log("Error calling: " + config.path);
                    reject(err)
                })
            });

            req.on('error', function (err) {
                console.log("Error calling: " + config.path);
                reject(err)
            });

            //send request
            console.log("USE#INFO https Method: ", options.method);
            if (options.method != "GET"){
                console.log("INFO body: ", body);
                req.write(body);
            }
            req.end();
        }
    });

    return result
}

module.exports.use = use;
