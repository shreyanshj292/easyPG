const {Client} = require("pg")

module.exports = {
    createDB: () => {
        const client = new Client({
            host: "localhost",
            user: "postgres",
            port: 5432,
            password: "knockknock",
            database: "easyPG"
        })
        
        client.connect();

        return client;
    }
}