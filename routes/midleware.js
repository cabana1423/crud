var JWT=require("jsonwebtoken");
var USER=require("../database/user");
const map=require("map");
var midleware=async(req,res, next)=>{
    var token=req.headers["authorization"];
    if(token==null){
        res.status(403).json({error: "no tiee acceso a este lugar token nulo"});
        return;
    }
    var decoded =JWT.verify(token, 'seminariolab4');
    console.log(decoded);
    if(decoded==null){
        res.status(403).json({error: "no tiee acceso a este lugar token falso"});
        return;
    }
    var iduser=decoded.id;
    var docs =await USER.model.findOne({id: iduser});
    console.log(docs);
    if(docs==null){
        res.status(403).json({error: " no tiene acceso a este lugar usuario no existe"});
        return;
    } 
    var roles=docs.roles.map(item =>{
        return item.tojson();
    });

    console.log("estos son los "+roles);
    var services =req.originalUrl.substr(1,100);
    if(services.lastIndexOf("?")>-1){
        services=services.substring(0, services.lastIndexOf("?"));  
    }
    console.log("pasando el sevicio" + services);

}
module.exports=midleware;