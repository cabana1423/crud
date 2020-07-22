var express=require('express');
var sha1 =require("sha1");
var router=express.Router();
var fileUpload = require("express-fileupload");
var IMAGE=require("../database/updateavatar");
const mongoose = require('../database/connect');
var midleware=require("./midleware");


router.use(fileUpload({
    fileSize:10*1024*1024
}));

router.post("/sendfile",midleware, (req, res)=>{
    console.log(req.files);
    var img =req.files.file;
    var path=__dirname.replace(/\/routes/g, "/img");
    var date =new Date();
    var sing=sha1(date.toString()).substr(1,5);
    var totalpath=path + "/"+sing + "_"+ img.name.replace(/\s/g, "_");
    img.mv(totalpath,async(err)=>{
        if(err){
            return res.status(300).send({msn: "error al escribir el archivo en el disco "});
        }
        //console.log (`este es el nombre: ${img.name}`);

        //revisar metadata
        var obj={};
        if(img.name!=null){
            obj["name"]=img.name;
        }
        if(img.size!=null){
            obj["size"]=img.size;
        }
        if(img.mimetype!=null){
            obj["MimeType"]=img.mimetype;
        }
        obj["pathfile"]=totalpath;
        var image=new IMAGE(obj);
        image.save((err,docs)=>{
            if(err){
                res.status(500).json({msn:"error"})
                return;
            }
        });
        res.status(200).json({name: img.name});    
    });
});
router.get("/getfile", midleware,async(req, res, next)=>{
    var params=req.query;
    if(params==null){
        res.status(300).json({msn: "error es necesario una ID"});
        return;
    }
    var idimg = params.id ;
    var imagen=await IMAGE.find({_id: idimg});
    if(imagen.length>0){
        var path=imagen[0].pathfile;
        res.sendFile(path);
        return;
    }
    res.status(300).json({msn: "error en la peticion"});
    return;
});

module.exports=router;
