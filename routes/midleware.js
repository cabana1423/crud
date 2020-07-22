var JWT=require("jsonwebtoken");
var USER=require("../database/user");
const map=require("map");
var midleware=async(req,res, next)=>{
    var token=req.headers["authorization"];
    //console.log(token);
    if(token==null){
        res.status(403).json({error: "no tiee acceso a este lugar token nulo"});
        return;
    }
    var decoded =JWT.verify(token, 'seminariosecretlab4');
    console.log(decoded);
    if(decoded==null){
        res.status(403).json({error: "no tiee acceso a este lugar token falso"});
        return;
    }
    var iduser=decoded.data;
    //console.log(iduser);  
    var docs =await USER.model.findOne({_id: iduser});
    console.log(docs);
    if(docs==null){
        res.status(403).json({error: " no tiene acceso a este lugar usuario no existe"});
        return;
    }
    /*var roles=docs.roles.map(item =>{
        return item;
    });*/

    //console.log("estos son los "+roles);
    var services =req.originalUrl.substr(1, 100);
    if(services.lastIndexOf("?")> -1){
        services=services.substring(0, services.lastIndexOf("?"));  
    }
    var METHOD =req.method;
    var url =services;


    next();

}
module.exports=midleware;