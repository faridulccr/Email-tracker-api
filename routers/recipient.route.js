const express = require("express");
const {
    sentEmailAndCreateRecipient,
    isOpen,
    getAllRecipients,
    deleteRecipient
} = require("../controllers/recipient.controller");
const router = express.Router();

router.get("/", getAllRecipients);
router.post("/send-email", sentEmailAndCreateRecipient);
router.get("/is-open/:id", isOpen);
router.delete("/delete-email/:id", deleteRecipient);
module.exports = router;
