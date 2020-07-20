var express = require('express');
var router = express.Router();
var USER=require("../database/user");
var valid = require('../utils/valid');


router.post('/user', async(req, res) => {
var params = req.body;
params["registerdate"] = new Date();

if (!valid.checkParams(USER.schema, params)){
    res.status(300).json({mns:"error al ingresar los datos"});
    return;
}
//pass valid
if (!valid.checkPassword(params.password)){
    res.status(300).json({mns:"el pasword debe tener mas de 6 caracteres empesar con mayuscula y tener almenos un caracter especial y un numero"});
    return;
}
//email valid
if (!valid.checkEmail(params.email)){
    res.status(300).json({mns:"ingrese un email valido"});
    return;
}

var users = new USER.model(params);
var result = await users.save();
res.status(200).json(result);
});
//creacion servicio get
router.get("/user", (req, res) => {
    var params = req.query;
    console.log(params);
    var limit = 100;
    if (params.limit != null) {
        limit = parseInt(params.limit);
    }
    var order = -1;
    if (params.order != null) {
     if (params.order == "desc") {
        order = -1;
    } else if (params.order == "asc") {
        order = 1;
      }
    }
    var skip = 10;
    if (params.skip != null) {
        skip = parseInt(params.skip);
    }
    USER.find({}).limit(limit).sort({_id: order}).skip(skip).exec((err, docs) => {
     res.status(200).json(docs);
    });
});
router.patch("/user", (req, res) => {
    if (req.query.id == null) {
        res.status(300).json({
        msn: "no existe id"
    });
    return;
    }
    var id = req.query.id;
    var params = req.body;
    USER.findOneAndUpdate({_id: id}, params, (err, docs) => {
        res.status(200).json(docs);
    });
});
router.delete("/user", async(req, res) => {
    if (req.query.id == null) {
    res.status(300).json({
     msn: "no existe id"
    });
    return;
    }
    var r = await USER.remove({_id: req.query.id});
    res.status(300).json(r);
    });

    
module.exports = router;