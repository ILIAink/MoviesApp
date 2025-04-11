// map Watchmode response to DB schema
export const parseWatchmode = (watchmodeData) => {
    return {
      movie_title: watchmodeData.title, // Assuming Watchmode has a 'title' field
      duration: watchmodeData.runtime, // Assuming Watchmode has a 'runtime' field
      release_date: watchmodeData.release_date, // Assuming 'release_date' exists
      genre: watchmodeData.genre, // Assuming 'genre' exists
      age_rating: watchmodeData.age_rating, // Assuming 'age_rating' exists
    };
  };
  