const express = require("express");
const router = express.Router();

const { createMessage, getMessages } = require("../controllers/contactController");

router.route("/")
  .post(createMessage)
  .get(getMessages);

module.exports = router;