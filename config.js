module.exports = {
    //################## Web server Config ##########################
    PORT: process.env.ORCH_PORT || 4000,
    HOST: process.env.ORCH_HOST || 'localhost',

    //############### JSON DB CONFIG ########################
    jsondb: {
        insert: {
            //host: process.env.JSON_DB_HOST || "130.61.57.83",
            host: process.env.JSON_DB_HOST || "10.96.23.222",
            //port: process.env.JSON_DB_PORT || 31506,
            port: process.env.JSON_DB_PORT || 8080,
            method: 'POST',
            path: '/insertValue',
            headers: {
                'Content-Type': 'application/json'
            }
        },
        update: {
            host: process.env.JSON_DB_HOST || "10.96.23.222",
            port: process.env.JSON_DB_PORT || 8080,
            method: 'PUT',
            path: '/updateValue',
            headers: {
                'Content-Type': 'application/json'
            }
        },
        queryOrderId: {
            host: process.env.JSON_DB_HOST || "10.96.23.222",
            port: process.env.JSON_DB_PORT || 8080,
            method: 'POST',
            path: '/queryTableOrderId',
            headers: {
                'Content-Type': 'application/json'
            }
        },
        queryWhere: {
            host: process.env.JSON_DB_HOST || "10.96.23.222",
            port: process.env.JSON_DB_PORT || 8080,
            method: 'POST',
            path: '/queryTable',
            headers: {
                'Content-Type': 'application/json'
            }
        },
        queryAll: {
            host: process.env.JSON_DB_HOST || "10.96.23.222",
            port: process.env.JSON_DB_PORT || 8080,
            method: 'GET',
            path: '/getAll',
            headers: {
                'Content-Type': 'application/json'
            }
        }
    },

    jsondbLocal: {
        insert: {
            host: process.env.JSON_DB_HOST || "localhost",
            port: process.env.JSON_DB_PORT || 8080,
            method: 'POST',
            path: '/insertValue',
            headers: {
                'Content-Type': 'application/json'
            }
        },
        update: {
            host: process.env.JSON_DB_HOST || "localhost",
            port: process.env.JSON_DB_PORT || 8080,
            method: 'PUT',
            path: '/updateValue',
            headers: {
                'Content-Type': 'application/json'
            }
        },
        queryOrderId: {
            host: process.env.JSON_DB_HOST || "localhost",
            port: process.env.JSON_DB_PORT || 8080,
            method: 'POST',
            path: '/queryTableOrderId',
            headers: {
                'Content-Type': 'application/json'
            }
        },
        queryWhere: {
            host: process.env.JSON_DB_HOST || "localhost",
            port: process.env.JSON_DB_PORT || 8080,
            method: 'POST',
            path: '/queryTable',
            headers: {
                'Content-Type': 'application/json'
            }
        },
        queryAll: {
            host: process.env.JSON_DB_HOST || "localhost",
            port: process.env.JSON_DB_PORT || 8080,
            method: 'GET',
            path: '/getAll',
            headers: {
                'Content-Type': 'application/json'
            }
        }
    },

    //###############  End - JSON DB CONFIG ########################

    //TODO Other DB configs
    sqldb: {
        insert: {
            //host: process.env.SQL_DB_HOST || "130.61.83.91",
            //port: process.env.SQL_DB_PORT || 31323,
            host: process.env.SQL_DB_HOST || "10.96.79.232",
            port: process.env.SQL_DB_PORT || 9002,
            method: 'POST',
            path: '/helidon/payment',
            headers: {
                'Content-Type': 'application/json'
            }
        },
        query: {
            host: process.env.SQL_DB_HOST || "10.96.79.232",
            port: process.env.SQL_DB_PORT || 9002,
            method: 'POST',
            path: '/helidon/selectpayment',
            headers: {
                'Content-Type': 'application/json'
            }
        }
    },
    //TODO Other DB configs
    graphdb: {
        insert: {
            host: process.env.SQL_DB_HOST || "130.61.83.91",
            port: process.env.SQL_DB_PORT || 31323,
            method: 'POST',
            path: '/helidon/payment',
            headers: {
                'Content-Type': 'application/json'
            }
        },
        query: {
            host: process.env.SQL_DB_HOST || "130.61.83.91",
            port: process.env.SQL_DB_PORT || 31323,
            method: 'GET',
            path: '/helidon/payment',
            headers: {
                'Content-Type': 'application/json'
            }
        }
    },
}
