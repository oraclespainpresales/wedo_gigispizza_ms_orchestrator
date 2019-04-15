module.exports = {
//################## Web server Config ##########################
    PORT : process.env.ORCH_PORT || 4000,
    HOST : process.env.ORCH_HOST || 'localhost',

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
            host: "localhost",
            port: 8080,
            method: 'post',
            path: '/queryTable',
            headers: {
                'Content-Type': 'application/json'
            }
        }
    },

    //###############  End - JSON DB CONFIG ########################

    //TODO Other DB configs
    other1db: {},
    other2db: {}
}
