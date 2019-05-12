import axios from "axios"
import browserstore from "browser-session-store"

var UserProfile = (function() {
   axios.defaults.baseURL = "/api";
   

  var getName = function() {
    var token;
    var res = [null,null];

    browserstore.get("ezLife", function (err,val){
      //console.log(err);
      if(err || (val == null)){
        console.log("run");
        console.log(res);
        return res;
      }
      token = val;
      console.log("token", token);

      axios.defaults.headers.common["Authorization"] = token; 
      res = [axios, "found"];
      
      return "found";    // Or pull this from cookie/localStorage
    })
    
    

    
  };

  var setName = function(token) {
    // Also set this in cookie/localStorage
    browserstore.put("ezLife", token);
    
  };

  return {
    getName: getName,
    setName: setName
  }

})();

export default UserProfile;