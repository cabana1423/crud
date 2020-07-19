var valid = {
    checkParams: function(refobj, evalueobj) {
    if (Object.keys(refobj).sort().toString()==Object.keys(evalueobj).sort().toString()){
        return true;
    }
    return false;
    },  
    checkPassword: function (password) {
        if (password.match(/[\!\#\$\%\&\/\(\)\=\?\¡\+]+/)==null){
            return false;
        }
        if (password.match(/(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[a-zA-Z\d]{6,}/)==null){
            return false;
        }
        return true;

    },
    checkEmail: function(email) {

        if (email.match(/^[\w\.]+@[\w\.]+\.\w{3,3}$/g)==null){
            return false;
        }
        return true;
    }
    };
    module.exports = valid;