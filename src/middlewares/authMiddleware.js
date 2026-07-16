/**
 * on va pas supprimer le support de x-api-key et juste rajouter un
 * support JWT en plus . un middleware retrocompatible peut en premier 
 * accepter la cle API des appareils comme demander dans la phase1
 * et lorsquelle est abscente, essayer un token autho pour tous les 
 * usagers connetees.
 */


const Device = require("../models/Device");
const jwt = require("jsonwebtoken");

const protect = async (req, res, next) => {
  try {
    const apiKey = req.header("x-api-key"); // verification ici avec APIkey
    const authHeader = req.header("authorization");

   /* if (!apiKey) {
      return res.status(401).json({
        success: false,
        message: "Clé API absente",
      });
    }
    on ne garde pas puique ca empeche le fallback jwt si un user
    se connecte  il ne pourra jamais passer si la cle API nest pas presente   
    */
    if (apiKey){
    const device = await Device.findOne({ apiKey });

    if (!device) {
      return res.status(403).json({
        success: false,
        message: "Clé API invalide",
      });
    }

    req.device = device;
    req.authType = "device";
    return next();
  }


  //sinon on verifie jwt si contient autho bearer sinon on refuse avec 401
 
    if(authHeader && authHeader.startWith("Bearer ")){  
      const token = authHeader.split("")[1];    // on split la chaine en deux pour recuperer le vrai token JWT
      // on verifi le token en cas ou il est expire ou signe avec une mauvaise cle

      try{
        const decoded= jwt.verify(token, process.env.JWT_SECRET); //validation et verificaiton 
        req.user=decoded;                                         // decoded contient les infos qui etaient dans le token lors du login
        req.authType="user";  //pour distinguer phase 1 et 2 
        return next();
      }//sinon si erreur avec le token 
      catch (error){
        return res.status(401).json({ 
          success: false,
          message: "le token est expire ou invalide"
        });
      }


    }



    return res.status(401).json({   // si aucun mecanisme est fourni 
        success: false,
        message:"Une authentification est requise"
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = protect;