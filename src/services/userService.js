const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");


// exemple : throw createError("Email invalide.", 401);
//controller recupere ensuite error.statusCode et renvoie auto le bon code http
function createError(message, statusCode) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}
// cree le jwt apres inscription ou connexion 
function generateToken(user) {
  return jwt.sign(
    {
      email: user.email,
      role: user.role,
      name: user.name,
      id: user._id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1h",
    }
  );
}
// envoie les info au user sauf le mdp poir inviter de lexposer 
function formatUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
}

// verie que les trois champs sont presents 
async function registerUserService({ email, password, name } = {}) {
  if (!email || !password || !name) {
    throw createError(
      "Email, nom and mot de passe sont obligatoire.",
      400
    );
  }

  const normalizedEmail = email.trim().toLowerCase();
// verie si le compte existe deja 
  const existingUser = await User.findOne({
    email: normalizedEmail,
  });

  if (existingUser) {
    throw createError(
      "A user with this email already exists.",
      409
    );
  }
// hachage du mdp
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name: name.trim(),
    email: normalizedEmail,
    password: hashedPassword,
  });

  const token = generateToken(user);

  return {
    user: formatUser(user),
    token,
  };
}

async function loginUserService({ email, password } = {}) {
  if (!email || !password) {
    throw createError(
      "Email and password are required.",
      400
    );
  }

  const normalizedEmail = email.trim().toLowerCase();

  const user = await User.findOne({
    email: normalizedEmail,
  });

  if (!user) {
    throw createError("Email invalide.", 401);
  }

  const passwordIsMatch = await bcrypt.compare(
    password,
    user.password
  );

  if (!passwordIsMatch) {
    throw createError("Mot de passe invalide.", 401);
  }

  const token = generateToken(user);

  return {
    user: formatUser(user),
    token,
  };
}

module.exports = {
  formatUser,
  generateToken,
  registerUserService,
  loginUserService,
};