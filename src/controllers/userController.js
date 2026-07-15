const bcrypt = require("bcryptjs");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

const generateToken = (user) => {
  return jwt.sign(
    {
      email: user.email,
      role: user.role,
      name: user.name,
      id: user._id, // un id est cree automatiquement par mangodb unique et stable
    },
    process.env.JWT_SECRET,// est la signture du token, la cle secrete du serveur
    { expiresIn: "1h" }      // est qui expire apres 1 heure
  );
};

const registerUser = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({    // sil oublie dentrer une information importante
        success: false,
        message: "Email, name and password are required.",
      });
    }

    const existingUser = await User.findOne({ email }); // pas trouver de email avec le user 

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "A user with this email already exists.",
      });
    }

    const user = await User.create({
      name,
      email,
      password,
    });

    const token = generateToken(user);

    return res.status(201).json({
      success: true,
      message: "L'utilisateur a été créé avec succès.",
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Erreur lors de l'inscription.",
      error: error.message,
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({
        success: false,
        message: "Email, password and full name are required.",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Email is invalide.",
      });
    }

    const passwordIsMatch = await bcrypt.compare(password, user.password);

    if (!passwordIsMatch) {
      return res.status(401).json({
        success: false,
        message: "Mot de passe invalide.",
      });
    }

    const token = generateToken(user);

    return res.status(200).json({
      success: true,
      message: "Connexion réussie.",
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Erreur lors de la connexion.",
      error: error.message,
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
};