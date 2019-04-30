module.exports = {
    //################## Web server Config ##########################
    PORT: process.env.ORCH_PORT || 4000,
    HOST: process.env.ORCH_HOST || 'localhost',

    //############### JSON DB CONFIG ########################
    jsondb: {
        insert: {
            host: process.env.JSON_DB_HOST || "130.61.57.83",
            port: process.env.JSON_DB_PORT || 31506,
            method: 'POST',
            path: '/insertValue',
            headers: {
                'Content-Type': 'application/json'
            }
        },
        query: {
            host: process.env.JSON_DB_HOST || "130.61.57.83",
            port: process.env.JSON_DB_PORT || 31506,
            method: 'POST',
            path: '/queryTable',
            headers: {
                'Content-Type': 'application/json'
            }
        }
    },

    //###############  End - JSON DB CONFIG ########################

    //TODO Other DB configs
    sqldb: {
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
            host: process.env.SQL_DB_HOST || "130.61.57.83",
            port: process.env.SQL_DB_PORT || 31420,
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
