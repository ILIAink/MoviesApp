// map Watchmode response to DB schema
export const parseWatchmode = (watchmodeData) => {
    return {
      movie_title: watchmodeData.title,
      duration: watchmodeData.runtime,
      release_date: watchmodeData.release_date,
      genre: watchmodeData.genre,
      age_rating: watchmodeData.age_rating,
    };
  };
  