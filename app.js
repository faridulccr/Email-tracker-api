// create an express server
const express = require("express");
const cors = require("cors");
require("./db");

const bodyParser = require("body-parser");
// routes
const recipientRouter = require("./routers/recipient.route");
const homeRouter = require("./routers/home.route");

// create express server
const app = express();
app.use(cors());
// app.use(
//     cors({
//         origin: "*",
//         credentials: false,
//     })
// );
// Add middleware to set the CORS headers
// app.use((req, res, next) => {
//     // Allow requests from the universal domain
//     res.setHeader("Access-Control-Allow-Origin", "*");
//     // Allow the GET and POST methods
//     res.setHeader("Access-Control-Allow-Methods", "GET, POST");
//     // Allow the Content-Type header
//     res.setHeader("Access-Control-Allow-Headers", "Content-Type");
//     next();
// });

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("views")); // for static file

app.use("/", homeRouter);
app.use("/recipient", recipientRouter);

// route not found error
app.use((req, res, next) => {
    res.status(404).json({
        message: "it is open for email tracking",
    });
});

// server error handling
app.use((err, req, res, next) => {
    console.log(err.stack);
    res.status(500).send("something broke");
});

module.exports = app;
