"use strict";
const http = require('http');

function use(config, data) {
    let result = new Promise(function (resolve, reject) {
        let body = data
        // request option
        let options = config
        // request object
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
                console.log("Error calling: " + config.path )
                reject(err)
            })
        });

        req.on('error', function (err) {
            console.log("Error calling: " + config.path + " -> " + err);
            reject(err)
        });

        //send request
        console.log("INFO (before stringify): " + JSON.stringify(body));
        req.write(JSON.stringify(body));
        req.end();
    });

    return result
}

module.exports.use = use;
