var express = require('express');
var router = express.Router();
var USER=require("../database/user");
router.post('/user', async(req, res) => {
var params = req.body;
params["registerdate"] = new Date();
var users = new USER(params);
var result = await users.save();
res.status(200).json(result);
});
module.exports = router;