import { createUser as addUser, getUser as fetchUser } from "../db/queries.js";

const getUser = async (req, res) => {
  try {
    const { user_name } = req.query;
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
  try {
    const newUser = await addUser(user_name, password, user_age);
    res.status(201).json(newUser);
  } catch (error) {
    // Check for PostgreSQL unique constraint violation (duplicate key)
    if (error.code === "23505") {
      return res
        .status(400)
        .json({ error: "Username already exists. Please choose another one." });
    }
    res.status(500).json({ error: error.message });
  }
};

export { getUser, createUser };
