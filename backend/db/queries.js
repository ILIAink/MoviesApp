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

// // ---------
// // Users
// const createUser = async (user_name, password, user_age) => {
//   const client = await pool.connect();
//   try {
//     await client.query("BEGIN");
//     const result = await client.query(
//       `
//       INSERT INTO Users (user_name, password, user_age)
//       VALUES ($1, $2, $3) RETURNING *`,
//       [user_name, password, user_age]
//     );
//     await client.query("COMMIT");
//     return result.rows[0];
//   } catch (error) {
//     console.log("Could not add user\n", error);
//     await client.query("ROLLBACK");
//     throw error;
//   } finally {
//     client.release();
//   }
// };

// const getUser = async (user_name) => {
//   try {
//     const result = await pool.query(
//       "SELECT * FROM Users WHERE LOWER(user_name) = LOWER($1)",
//       [user_name]
//     );

//     return result.rows[0];
//   } catch (error) {
//     console.log("Could not get user\n", error);
//     throw error;
//   }
// };

// ---------

// Insert a new movie with transactions
const createMovie = async (
  movie_id,
  movie_title,
  duration,
  release_date,
  genre
) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    // RETURNING * just gives us back the newly created movie to see if everything worked as expected
    const result = await client.query(
      "INSERT INTO movie (movie_id, movie_title, duration, release_date, genre) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [movie_id, movie_title, duration, release_date, genre]
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

// Create new user with username, password, & age
const registerUser = async (username, hashedPassword, age) => {
  const result = await pool.query(
    `INSERT INTO users (user_name, password, user_age)
     VALUES ($1, $2, $3)
     RETURNING user_id, user_name, user_age`,
    [username, hashedPassword, age]
  );
  return result.rows[0];
};

// Find user by username
const findUserByUsername = async (username) => {
  const result = await pool.query(`SELECT * FROM users WHERE user_name = $1`, [
    username,
  ]);
  return result.rows[0];
};

//Create a show
const createShow = async (Show_id, Show_name, Season_count, Genre) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    // RETURNING * just gives us back the newly created Show to see if everything worked as expected
    const result = await client.query(
      "INSERT INTO Show (Show_id, Show_name, Season_count, Genre) VALUES ($1, $2, $3, $4) RETURNING *",
      [Show_id, Show_name, Season_count, Genre]
    );
    
    // insert season entries, with episodes set to 0 as default - update later?
    for (let i = 1; i <= Season_count; i++) {
      await client.query(
        "INSERT INTO Season (Show_id, Season_number, Episode_count) VALUES ($1, $2, $3)",
        [Show_id, i, 0]
      );
    }
 
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
const createSeason = async (Show_id, Season_number, Episode_count) => {
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
const createService = async (Service_id, Service_name, Price_monthly, Price_yearly) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    // RETURNING * just gives us back the newly created Services to see if everything worked as expected
    const result = await client.query(
      "INSERT INTO Streaming_Services (Service_id, Service_name, Price_monthly, Price_yearly) VALUES ($1, $2, $3, $4) RETURNING *",
      [Service_id, Service_name, Price_monthly, Price_yearly]
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
const Subscribe_User = async (User_id, Service_id) => {
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
const Like_movie = async (User_id, Movie_id, Watched) => {
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

//User likes a show
const Like_Show = async (User_id, Show_id, Watched) => {
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
      "INSERT INTO Service_Movies (Service_id, Movie_id, Region, Rent_price, Buy_price, Removal_Date) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
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
      "INSERT INTO Service_Seasons (Service, Show_id, Region, Rent_price, Buy_price, Removal_Date) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
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
const getLikedMovies = async (user_id) => {
  const result = await pool.query(
    "SELECT * FROM Movie WHERE Movie_id IN (SELECT Movie_id FROM Likes_Movie WHERE User_id = $1)",
    [user_id]
  );
  return result.rows;
};

//get a users liked shows
const getLikedShow = async (user_id) => {
  const result = await pool.query(
    "SELECT * FROM Show WHERE Show_id IN (SELECT Show_id FROM Likes_Show WHERE Users_id = $1)",
    [user_id]
  );
  return result.rows;
};

//Get the seasons of a show
const getShowSeason = async (show_id) => {
  const result = await pool.query("SELECT * FROM Season WHERE show_id = $1", [
    show_id,
  ]);
  return result.rows;
};

//Get the episodes of a season
const getSeasonEpisodes = async (show_id, season_number) => {
  const result = await pool.query(
    "SELECT * FROM Episode WHERE show_id = $1 and season_number = $2",
    [show_id, season_number]
  );
  return result.rows;
};

//Get all episodes of a show
const getShowEpisodes = async (show_id) => {
  const result = await pool.query("SELECT * FROM Episode WHERE show_id = $1", [
    show_id,
  ]);
  return result.rows;
};

//Get all the services a User subscibes to

const getUserServices = async (user_id) => {
  const result = await pool.query(
    "SELECT * FROM Streaming_Services WHERE Service_id IN (SELECT Service_id FROM User_Service WHERE User_id = $1)",
    [user_id]
  );
  return result.rows;
};

const getUserMovieDetails = async (user_id) => {
  const result = await pool.query(
    "SELECT * FROM Movies JOIN Service_Movies WHERE Service_id IN (SELECT * FROM Streaming_Services WHERE Service_id IN (SELECT Service_id FROM User_Service WHERE User_id = $1)",
    [user_id]
  );
  return result.rows;
};

const getUserSeasonDetails = async (user_id) => {
  const result = await pool.query(
    "SELECT * FROM Season JOIN Service_Seasons WHERE Service_id IN (SELECT * FROM Streaming_Services WHERE Service_id IN (SELECT Service_id FROM User_Service WHERE User_id = $1)",
    [user_id]
  );
  return result.rows;
};

const getUserShowDetails = async (user_id) => {
  const result = await pool.query(
    `
    SELECT DISTINCT Show.Show_id, Show.Show_name, Show.Genre
    FROM User_Service
    JOIN Service_Seasons ON User_Service.Service_id = Service_Seasons.Service_id
    JOIN Season ON Service_Seasons.Show_id = Season.Show_id AND Service_Seasons.Season_number = Season.Season_number
    JOIN Show ON Season.Show_id = Show.Show_id
    WHERE User_Service.User_id = $1
    `,
    [user_id]
  );

  return result.rows;
};

const searchAllMovies = async (name) => {
  const result = await pool.query(
    "SELECT * FROM Movie WHERE Movie_id = $1 + '%'",
    [name]
  );
  return result.rows;
};

const searchAllShows = async (name) => {
  const result = await pool.query(
    "SELECT * FROM Show WHERE Show_name = $1 + '%'",
    [name]
  );
  return result.rows;
};

const searchUserMovies = async (name) => {
  const x = getUserMovieDetails();
  const result = await pool.query(
    "SELECT * FROM Movie WHERE Movie_id = $1 + '%' AND IN $2",
    [name, x]
  );
  return result.rows;
};

const searchUserShows = async (name) => {
  const x = getUserShowDetails();
  const result = await pool.query(
    "SELECT * FROM Show WHERE Show_id = $1 + '%' AND IN $2",
    [name, x]
  );
  return result.rows;
};

//If this works I'll be jumping on rooftops
const getBestBundle = async (user_id) => {
  const result = await pool.query(
    `
    WITH UserLikedUnownedMovies AS (
        SELECT lm.Movie_id
        FROM Likes_Movie lm
        JOIN Movie m ON lm.Movie_id = m.Movie_id
        WHERE lm.User_id = $1
          AND lm.Watched = FALSE
          AND lm.Movie_id NOT IN (
              SELECT sm.Movie_id
              FROM User_Service us
              JOIN Service_Movies sm ON us.Service_id = sm.Service_id
              WHERE us.User_id = $1
          )
    ),
    UserLikedUnownedSeasons AS (
        SELECT ls.Show_id, s.Season_number
        FROM Likes_Show ls
        JOIN Season s ON ls.Show_id = s.Show_id
        WHERE ls.User_id = $1
          AND ls.Watched = FALSE
          AND (ls.Show_id, s.Season_number) NOT IN (
              SELECT ss.Show_id, ss.Season_number
              FROM User_Service us
              JOIN Service_Seasons ss ON us.Service_id = ss.Service_id
              WHERE us.User_id = $1
          )
    ),
    BundleContent AS (
        SELECT sb.Service1, sb.Service2, sb.Service3, sb.Service4, sb.Service5,
               sm.Movie_id, NULL::INT AS Show_id, NULL::INT AS Season_number
        FROM Service_Bundle sb
        JOIN Service_Movies sm ON sm.Service_id IN (sb.Service1, sb.Service2, sb.Service3, sb.Service4, sb.Service5)

        UNION

        SELECT sb.Service1, sb.Service2, sb.Service3, sb.Service4, sb.Service5,
               NULL::INT AS Movie_id, ss.Show_id, ss.Season_number
        FROM Service_Bundle sb
        JOIN Service_Seasons ss ON ss.Service_id IN (sb.Service1, sb.Service2, sb.Service3, sb.Service4, sb.Service5)
    ),
    RelevantBundles AS (
        SELECT bc.Service1, bc.Service2, bc.Service3, bc.Service4, bc.Service5,
               COUNT(DISTINCT bc.Movie_id) FILTER (
                   WHERE bc.Movie_id IS NOT NULL AND bc.Movie_id IN (
                       SELECT Movie_id FROM UserLikedUnownedMovies
                   )
               ) +
               COUNT(DISTINCT bc.Show_id || '-' || bc.Season_number) FILTER (
                   WHERE bc.Show_id IS NOT NULL AND (bc.Show_id, bc.Season_number) IN (
                       SELECT Show_id, Season_number FROM UserLikedUnownedSeasons
                   )
               ) AS match_count
        FROM BundleContent bc
        GROUP BY bc.Service1, bc.Service2, bc.Service3, bc.Service4, bc.Service5
    ),
    BestBundles AS (
        SELECT *
        FROM RelevantBundles
        WHERE match_count = (
            SELECT MAX(match_count)
            FROM RelevantBundles
        )
    )
    SELECT *
    FROM BestBundles
    WHERE match_count > 0;
  `,
    [user_id]
  );

  return result.rows;
};

const getShowbyID = async (show_id) => {
  const result = await pool.query("SELECT * FROM Show WHERE Show_id = $1", [show_id]);
  return result.rows;
}

const searchShowByColumn = async (
    Column_name,
    search
) => {
  const result = await pool.query("SELECT * FROM Show JOIN Season JOIN Service_Seasons JOIN Streaming_Services WHERE $1 = $2", [Column_name, search]);
  return result.rows;
};

const searchShowByTwoColumn = async (
    Column_name1,
    Column_name2,
    search1,
    search2
) => {
  const result = await pool.query("SELECT * FROM Show JOIN Season JOIN Service_Seasons JOIN Streaming_Services WHERE $1 = $2 AND $3 = $4", [Column_name1, search1, Column_name2, search2]);
  return result.rows;
};

const searchShowByThreeColumn = async (
    Column_name1,
    Column_name2,
    Column_name3,
    search1,
    search2,
    search3
) => {
  const result = await pool.query("SELECT * FROM Show JOIN Season JOIN Service_Seasons JOIN Streaming_Services WHERE $1 = $2 AND $3 = $4 AND $5 = $6", [Column_name1, search1, Column_name2, search2, Column_name3, search3]);
  return result.rows;
};

const searchMovieByColumn = async (
    Column_name,
    search
) => {
  const result = await pool.query("SELECT * FROM Movie JOIN Service_Movies JOIN Streaming_Services WHERE $1 = $2", [Column_name, search]);
  return result.rows;
};

const searchMovieByTwoColumn = async (
    Column_name1,
    Column_name2,
    search1,
    search2
) => {
  const result = await pool.query("SELECT * FROM Movie JOIN Service_Movies JOIN Streaming_Services WHERE $1 = $2 AND $3 = $4", [Column_name1, search1, Column_name2, search2]);
  return result.rows;
};

const searchMovieByThreeColumn = async (
    Column_name1,
    Column_name2,
    Column_name3,
    search1,
    search2,
    search3
) => {
  const result = await pool.query("SELECT * FROM Movie JOIN Service_Movies JOIN Streaming_Services WHERE $1 = $2 AND $3 = $4 AND $5 = $6", [Column_name1, search1, Column_name2, search2, Column_name3, search3]);
  return result.rows;
};

const SelectRandShowFromGivenList = async (
    list
) => {
  const result = await pool.query("SELECT * FROM Show WHERE IN $1 ORDER BY RANDOM() LIMIT 1", [list]);
  return result.rows;
};

const SelectRandMovieFromGivenList = async (
    list
) => {
  const result = await pool.query("SELECT * FROM Movie WHERE IN $1 ORDER BY RANDOM() LIMIT 1", [list]);
  return result.rows;
};

const GetPriceOfSeason = async (
    ShowName,
    Season_num
) => {
  const result = await pool.query("SELECT Show_name, Rent_price, Buy_price FROM Show JOIN Season JOIN Service_Seasons WHERE Show_name = $1 AND Season_number = $2", [Show_name, Season_num]);
  return result.rows;
};

const GetPriceOfMovie = async (
    Movie_name
) => {
  const result = await pool.query("SELECT Movie_title, Rent_price, Buy_price FROM Movie JOIN Service_Movies WHERE Movie_title = $1", [Movie_name]);
  return result.rows;
};



const GetLeavingAlert = async (user_id) => {
  const result = await pool.query(`
    SELECT 'Movie' AS Type, m.Movie_title AS Title, sm.Removal_Date
    FROM User_Service us
           JOIN Service_Movies sm ON us.Service_id = sm.Service_id
           JOIN Movie m ON sm.Movie_id = m.Movie_id
    WHERE us.User_id = :user_id
      AND sm.Removal_Date IS NOT NULL
      AND sm.Removal_Date <= CURRENT_DATE + INTERVAL '1 month'

    UNION

    SELECT 'Show' AS Type, s.Show_name AS Title, ss.Removal_Date
    FROM User_Service us
           JOIN Service_Seasons ss ON us.Service_id = ss.Service_id
           JOIN Show s ON ss.Show_id = s.Show_id
    WHERE us.User_id = :user_id
      AND ss.Removal_Date IS NOT NULL
      AND ss.Removal_Date <= CURRENT_DATE + INTERVAL '1 month';
  `, [user_id]);

  return result.rows;
};

const GetLikedLeavingAlert = async (user_id) => {
  const result = await pool.query(`
    SELECT 'Movie' AS Type, m.Movie_title AS Title, sm.Removal_Date
    FROM Likes_Movie lm
           JOIN User_Service us ON lm.User_id = us.User_id
           JOIN Service_Movies sm ON lm.Movie_id = sm.Movie_id AND us.Service_id = sm.Service_id
           JOIN Movie m ON lm.Movie_id = m.Movie_id
    WHERE lm.User_id = :user_id
      AND sm.Removal_Date IS NOT NULL
      AND sm.Removal_Date <= CURRENT_DATE + INTERVAL '1 month'

    UNION

    SELECT 'Show' AS Type, s.Show_name AS Title, ss.Removal_Date
    FROM Likes_Show ls
           JOIN User_Service us ON ls.User_id = us.User_id
           JOIN Service_Seasons ss ON ls.Show_id = ss.Show_id AND us.Service_id = ss.Service_id
           JOIN Show s ON ls.Show_id = s.Show_id
    WHERE ls.User_id = :user_id
      AND ss.Removal_Date IS NOT NULL
      AND ss.Removal_Date <= CURRENT_DATE + INTERVAL '1 month';
  `, [user_id]);

  return result.rows;
};


// Export functions for movies in ES Module syntax
export {
  createMovie,
  getLikedMovies,
  getLikedShow,
  createShow,
  createSeason,
  createEpisode,
  getAllShow,
  getShowSeason,
  getSeasonEpisodes,
  getShowEpisodes,
  getUserServices,
  createService,
  Subscribe_User,
  Like_movie,
  Like_Show,
  Bundle_Services,
  Service_Has_Season,
  Service_Has_Movie,
  getUserShowDetails,
  getUserSeasonDetails,
  getUserMovieDetails,
  searchAllMovies,
  searchAllShows,
  searchUserMovies,
  searchUserShows,
  getBestBundle,
  getAllMovies,
  registerUser,
  findUserByUsername,
  searchShowByColumn, 
  searchShowByTwoColumn, 
  searchShowByThreeColumn, 
  searchMovieByColumn, 
  searchMovieByTwoColumn, 
  searchMovieByThreeColumn, 
  GetLikedLeavingAlert, 
  GetPriceOfMovie, 
  GetLeavingAlert, 
  GetPriceOfSeason, 
  SelectRandMovieFromGivenList, 
  SelectRandShowFromGivenList
};


