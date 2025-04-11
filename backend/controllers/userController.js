import { createUser as addUser, getUser as fetchUser } from "../db/queries.js";

const getUser = async (req, res) => {
  try {
    const { user_name } = req.body;
    const user = await fetchUser(user_name);

    if (!user || user.length === 0) {
      throw new Error(`User '${user_name}' not found.`);
    }

    res.status(200).json(user);
    console.log(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createUser = async (req, res) => {
  const { user_name, password, user_age } = req.body;
  console.log(user_name, password, user_age);

  try {
    const newUser = await addUser(user_name, password, user_age);
    res.status(201).json(newUser);
  } catch (error) {
    if (error.code === "23514" && error.constraint === "check_age") {
      return res.status(400).json({
        error: "The age is too low, you can not sign up.",
      });
    }
    if (error.code === "23505") {
      // Check for PostgreSQL unique constraint violation (duplicate key)
      return res.status(400).json({
        error: "Username already exists. Please choose another one.",
      });
    }
    res.status(500).json({ error: error.message });
  }
};

export { getUser, createUser };
