const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.sendFile(__dirname + "/../views/index.html");
    // res.status(200).json({ message: "home route" });
});
router.post("/", (req, res) => {
    res.sendFile(__dirname + "/../views/index.html");
    // res.status(200).json({ message: "home route" });
});
module.exports = router;