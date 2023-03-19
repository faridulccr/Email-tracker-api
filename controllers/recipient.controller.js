const nodemailer = require("nodemailer");
const { v4: uuidv4 } = require("uuid");
const Recipient = require("../models/recipient.model");

const transporter = nodemailer.createTransport({
    port: 465,
    secure: true,
    service: "gmail",
    auth: {
        user: process.env.ADMIN_EMAIL,
        pass: process.env.ADMIN_PASS,
    },
});

// to send email to user
const sentEmailAndCreateRecipient = async (req, res) => {
    try {
        const { adminEmail, to, cc, bcc, subject, message } = req.body;
        const recipientId = uuidv4();
        const trackingUrl = `${process.env.HOSTING_URL}/recipient/is-open/${recipientId}`;
        const html = `<p>${message}</p><img src=${trackingUrl} width="1px" height="1px"/>`;
        const mailOptions = { from: adminEmail, to, cc, bcc, subject, html };
        await transporter.sendMail(mailOptions);

        // create an recipient
        const newRecipient = new Recipient({
            id: recipientId,
            status: "Sent",
            statusTime: new Date(),
            sentTime: new Date(),
            recipient: `${to}${cc && ", " + cc.split(",").join(", ")}${
                bcc && ", " + bcc.split(",").join(", ")
            }`,
            subject,
            message,
        });
        // to store newUser in mongoDB
        await newRecipient.save();
        // sending a response to front-end
        res.status(201).json(newRecipient);
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ error: "There is an error" });
    }
};

// to check email has been opened or not by img tracking
const isOpen = async (req, res) => {
    try {
        const recipient = await Recipient.findOne({ id: req.params.id });
        recipient.status = "Opened";
        recipient.statusTime = new Date();
        // to restore the user to mongoDB
        await recipient.save();
        // console.log(recipient);

        const mailOptions = {
            from: process.env.ADMIN_EMAIL,
            to: process.env.ADMIN_EMAIL,
            subject: `Your Email is Opened.`,
            html: `<div><p><strong>${
                recipient.recipient?.split(",").length === 1
                    ? recipient.recipient?.split(",")[0]
                    : recipient.recipient?.split(",")[0] +
                      "," +
                      recipient.recipient?.split(",")[1] +
                      ",...."
            }</strong> has opened your email.</p>
                        <p><strong> Subject:</strong> ${recipient.subject}</p>
                        <p><strong> Message:</strong> ${recipient.message}</p>
                    </div>`,
        };
        await transporter.sendMail(mailOptions);
        res.status(200).send({ message: "update" });
    } catch (error) {
        console.log(error.message);
        res.status(500).send({
            error: "error",
        });
    }
};

// get all recipients
const getAllRecipients = async (req, res) => {
    try {
        const recipients = await Recipient.find();
        res.status(200).json(recipients);
    } catch (error) {
        console.log(error.message);
        res.status(500).send({
            error: "there is an error",
        });
    }
};

// delete recipient
const deleteRecipient = async (req, res) => {
    try {
        await Recipient.deleteOne({ id: req.params.id });

        res.status(200).json({
            message: "successfully deleted",
        });
    } catch (error) {
        res.status(500).send(error.message);
    }
};

module.exports = {
    sentEmailAndCreateRecipient,
    isOpen,
    getAllRecipients,
    deleteRecipient,
};
