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
 
    if (authHeader && authHeader.startsWith("Bearer ")) {
  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;
    req.authType = "user";

    return next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Le token est expiré ou invalide",
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