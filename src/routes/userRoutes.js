const express = require("express");
const {registerUser, loginUser}= require("../controllers/userController");

const router = express.Router();// cree un routeur separe pour ce groupe de routes
router.post("/register", registerUser); // creer une ressource: creer un utilisateur 
router.post("/login", loginUser); // verifier les identifiants et crrer un token


module.exports= router;