var mongoose = require("./connect");
var imageSchema=mongoose.Schema({
    name: {
        type:String,
        required: [true,"el titulo es requerido" ],
    },
    size:{
        type:String
    },
    MimeType:{
        type:String
    },
    pathfile:{
        type:String,
        required:[true, "la ruta de la imagen es necesaria"]
    }
});
var IMAGE=mongoose.model("image", imageSchema);
module.exports=IMAGE;
