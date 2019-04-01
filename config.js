module.exports = {
//################## Web server Config ##########################
    PORT = 4000,
    HOST = 'localhost',

//############### JSON DB CONFIG ########################
    jsondb: {
        insert: {
            host: "localhost",
            port: 8080,
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
