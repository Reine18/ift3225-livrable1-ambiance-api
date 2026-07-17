const express = require("express");
const {registerUser, longinUser}= require("../controllers/userController");

const router = express.Router();// cree un routeur separe pour ce groupe de routes
router.post("/register", registerUser); // creer une ressource: creer un utilisateur 
router.post("/login", longinUser); // verifier les identifiants et crrer un token


module.exports= router;