var express = require('express');
var sha1 =require("sha1");
var JWT=require("jsonwebtoken");
var router = express.Router();
var USER=require("../database/user");
var valid = require('../utils/valid');


var midleware=require("./midleware");
router.post('/user', async(req, res) => {
var params = req.body;
params["registerdate"] = new Date();

console.log(params);
if (!valid.checkParams(USER.schema, params)){
    res.status(300).json({mns:"error al ingresar los datos"});
    return;
}
//pass valid
if (!valid.checkPassword(params.password)){
    res.status(300).json({mns:"el pasword debe tener mas de 6 caracteres empesar con mayuscula y tener almenos un caracter especial y un numero"});
    return;
}
params.password=sha1(params.password);
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
router.get("/user",midleware, (req, res) => {
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
    USER.model.find({}).limit(limit).sort({_id: order}).skip(skip).exec((err, docs) => {
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

    //servicio de logueo
    router.post("/login",async(req,res)=>{
        var body=req.body;
        console.log(body);
        if (body.email==null){
            res.status(300).json({msn: "el email es necesario"});
            return;
        }
        if (body.password==null){
            res.status(300).json({msn: "el password es necesario"});
            return;
        }
        var results =await USER.model.find({email: body.email, password: sha1(body.password)});
        if(results.length==1){
            var token =JWT.sign({
                exp:Math.floor(Date.now()/1000)+(60*60),
                data:results.id
            }, 'seminariolab4');
            res.status(200).json({msn: "bienvenido "+body.email+" disfruta el sistema", token:token});
            return;
        }
        res.status(200).json({msn: "credenciales incorrectas"});
    });
    
module.exports = router;