import { pool } from "./index.js";

// Fetch all movies
const getAllMovies = async () => {
  const result = await pool.query("SELECT * FROM movie");
  return result.rows;
};

//Fetch All shows
const getAllShow = async () => {
  const result = await pool.query("SELECT * FROM Show");
  return result.rows;
};




// Insert a new movie with transactions
const createMovie = async (
  movie_title,
  duration,
  release_date,
  genre,
  age_rating
) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    // RETURNING * just gives us back the newly created movie to see if everything worked as expected
    const result = await client.query(
      "INSERT INTO movie (movie_title, duration, release_date, genre, age_rating) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [movie_title, duration, release_date, genre, age_rating]
    );
    await client.query("COMMIT");
    return result.rows[0];
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

//Create a show
const createShow = async (
    Show_name,
    Season_count,
    Genre,
    Age_rating
) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    // RETURNING * just gives us back the newly created Show to see if everything worked as expected
    const result = await client.query(
        "INSERT INTO Show (Show_name, Season_count, Genre, Age_rating) VALUES ($1, $2, $3, $4) RETURNING *",
        [Show_name, Season_count, Genre, Age_rating]
    );
    await client.query("COMMIT");
    return result.rows[0];
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

//Create a new season
const createSeason = async (
    Show_id,
    Season_number,
    Episode_count
) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    // RETURNING * just gives us back the newly created Season to see if everything worked as expected
    const result = await client.query(
        "INSERT INTO Season (Show_id, Season_number, Episode_count) VALUES ($1, $2, $3) RETURNING *",
        [Show_id, Season_number, Episode_count]
    );
    await client.query("COMMIT");
    return result.rows[0];
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

//Create a episode
const createEpisode = async (
    Show_id,
    Season_number,
    Episode_number,
    Episode_name,
    Duration
) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    // RETURNING * just gives us back the newly created Season to see if everything worked as expected
    const result = await client.query(
        "INSERT INTO Episode (Show_id, Season_number, Episode_number, Episode_name, Duration) VALUES ($1, $2, $3, $4, $5) RETURNING *",
        [Show_id, Season_number, Episode_number, Episode_name, Duration]
    );
    await client.query("COMMIT");
    return result.rows[0];
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

//Create a Service
const createService = async (
    Service_name,
    Price_monthly,
    Price_yearly
) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    // RETURNING * just gives us back the newly created Services to see if everything worked as expected
    const result = await client.query(
        "INSERT INTO Streaming_Services (Service_name, Price_monthly, Price_yearly) VALUES ($1, $2, $3) RETURNING *",
        [Service_name, Price_monthly, Price_yearly]
    );
    await client.query("COMMIT");
    return result.rows[0];
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

//User Subscribes to a platform
const Subscribe_User = async (
    User_id,
    Service_id
) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    // RETURNING * just gives us back the newly created Services to see if everything worked as expected
    const result = await client.query(
        "INSERT INTO User_Service (User_id, Service_id) VALUES ($1, $2) RETURNING *",
        [User_id, Service_id]
    );
    await client.query("COMMIT");
    return result.rows[0];
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

//User likes a movie
const Like_movie = async (
    User_id,
    Movie_id,
    Watched
) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    // RETURNING * just gives us back the newly created Services to see if everything worked as expected
    const result = await client.query(
        "INSERT INTO Likes_movie (User_id, Movie_id, Watched) VALUES ($1, $2, $3) RETURNING *",
        [User_id, Movie_id, Watched]
    );
    await client.query("COMMIT");
    return result.rows[0];
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

//User likes a movie
const Like_Show = async (
    User_id,
    Show_id,
    Watched
) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    // RETURNING * just gives us back the newly created Services to see if everything worked as expected
    const result = await client.query(
        "INSERT INTO Likes_show (User_id, Show_id, Watched) VALUES ($1, $2, $3) RETURNING *",
        [User_id, Show_id, Watched]
    );
    await client.query("COMMIT");
    return result.rows[0];
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

//User Service has a movie
const Service_Has_Movie = async (
    Service_id,
    Movie_id,
    Region,
    Rent_price,
    Buy_price,
    Removal_Date
) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    // RETURNING * just gives us back the newly created Services to see if everything worked as expected
    const result = await client.query(
        "INSERT INTO Service_Movies (User_id, Movie_id, Region, Rent_price, Buy_price, Removal_Date) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
        [Service_id, Movie_id, Region, Rent_price, Buy_price, Removal_Date]
    );
    await client.query("COMMIT");
    return result.rows[0];
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

//User Service has a movie
const Service_Has_Season = async (
    Service_id,
    Show_id,
    Region,
    Rent_price,
    Buy_price,
    Removal_Date
) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    // RETURNING * just gives us back the newly created Services to see if everything worked as expected
    const result = await client.query(
        "INSERT INTO Service_Seasons (User_id, Show_id, Region, Rent_price, Buy_price, Removal_Date) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
        [Service_id, Show_id, Region, Rent_price, Buy_price, Removal_Date]
    );
    await client.query("COMMIT");
    return result.rows[0];
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

// Create Bundle
const Bundle_Services = async (
    Service1,
    Service2,
    Service3 = null,
    Service4 = null,
    Service5 = null
) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const result = await client.query(
        "INSERT INTO Service_Bundle (Service1, Service2, Service3, Service4, Service5) VALUES ($1, $2, $3, $4, $5) RETURNING *",
        [Service1, Service2, Service3, Service4, Service5]
    );

    await client.query("COMMIT");
    return result.rows[0];
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};













//Get a user's liked movies
const getLikedMovies = async (
    user_id
) => {
  const result = await pool.query(
      "SELECT * FROM Movie WHERE Movie_id IN (SELECT Movie_id FROM Likes_Movie WHERE Users_id = $1)",
      [user_id]
  );
  return result.rows;
};


//get a users liked shows
const getLikedShow = async (
    user_id
) => {
  const result = await pool.query(
      "SELECT * FROM Show WHERE Show_id IN (SELECT Show_id FROM Likes_Show WHERE Users_id = $1)",
      [user_id]
  );
  return result.rows;
};


const getShowSeason = async (
    show_id
) => {
  const result = await pool.query("SELECT * FROM Season WHERE show_id = $1", [show_id]);
  return result.rows;
};

const getSeasonEpisodes = async (
    show_id,
    season_number
) => {
  const result = await pool.query("SELECT * FROM Episode WHERE show_id = $1 and season_number = $2", [show_id, season_number]);
  return result.rows;
};

const getShowEpisodes = async (
    show_id) => {
  const result = await pool.query("SELECT * FROM Episode WHERE show_id = $1", [show_id]);
  return result.rows;
};


const getUserServices = async (
    user_id
    ) => {
  const result = await pool.query("SELECT * FROM Streaming_Services WHERE Service_id IN (SELECT Service_id FROM User_Service WHERE User_id = $1)", [user_id]);
  return result.rows;
};

// Export functions for movies in ES Module syntax
export { getAllMovies, createMovie, getLikedMovies, getLikedShow, createShow, createSeason, createEpisode, getAllShow, getShowSeason, getSeasonEpisodes, getShowEpisodes, getUserServices, createService, Subscribe_User, Like_movie, Like_Show, Bundle_Services, Service_Has_Season, Service_Has_Movie};
