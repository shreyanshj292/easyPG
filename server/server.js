const express = require('express');
const router = require("./router/router") 
const app = express()

// Enabling CORS policy here
app.use( function (req, res, next) {
    res.header("Access-Control-Allow-Origin",  "*");
    res.header("Access-Control-Allow-Headers",  "Origin, X-Requested-With, Content-Type, Accept");
    next(); 
})
app.listen(5000, () => {
    console.log("Server is running: 5000")
})
app.use(express.json())

app.get("/check", (req, res) => {
    res.json({
        "msg": "server working just fine"
    })
})

app.use("/", router);
