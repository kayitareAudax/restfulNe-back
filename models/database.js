const {
    Client
} = require('pg');
let client = "";
client = new Client({
    host: `${process.env.PG_HOST}`,
    password: `${process.env.PG_PASSWORD}`,
    user: `${process.env.PG_USER}`,
    port: 5432,
    database: `${process.env.PG_DATABASE}`
})
const connect = client.connect();
if (connect) {
    console.log("database connected");
}
module.exports.client = client;