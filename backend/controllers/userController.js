import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { registerUser, findUserByUsername } from "../db/queries.js";

const SECRET = process.env.JWT_SECRET || "dev_secret_key";

// POST /api/user/register
const register = async (req, res) => {
  const { username, password, age } = req.body;

  try {
    if (age < 13) {
      return res.status(400).json({ message: "You must be at least 13 years old to register." });
    }

    const existingUser = await findUserByUsername(username);
    if (existingUser) return res.status(400).json({ message: "Username already taken." });

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Register new user
    const user = await registerUser(username, hashedPassword, age);

    res.status(201).json({ user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/user/login
const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await findUserByUsername(username);
    if (!user) return res.status(400).json({ message: "Invalid credentials." });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid credentials." });

    // Generate a JWT token
    const token = jwt.sign({ id: user.user_id, username: user.user_name }, SECRET, { expiresIn: "1h" });

    res.status(200).json({ token, user: { id: user.user_id, username: user.user_name, age: user.user_age }, });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export { register, login };
