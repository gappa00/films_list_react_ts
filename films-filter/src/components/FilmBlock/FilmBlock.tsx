import React from "react";
import { IFilm } from "../../models";

interface FilmBlockProps {
    filmBlock: IFilm[]
}

export const FilmBlock: React.FC<FilmBlockProps> = (props) => {
    return (
        <div className="b-film-details__wrap">
          { props.filmBlock.map(filmItem => 
            <div
              className='b-film-details__item'
              key={filmItem.id}
            >
              <div className="b-film-details__title">{filmItem.title}</div>
              <img
                alt='test'
                src={"https://image.tmdb.org/t/p/w500" + filmItem.poster_path}
                className="b-film-details__poster_path"
              />
              
              <div className="b-film-details__genre_ids">
                { filmItem.genre_ids.map(genre_id => <div>{genre_id}</div> )}
              </div>
              <div className="b-film-details__overview">{filmItem.overview}</div>
              <div className="b-film-details__backdrop_path">{filmItem.backdrop_path}</div>
              <div className="b-film-details__release_date">{filmItem.release_date}</div>
              <div className="b-film-details__video">{filmItem.video}</div>
              <div className="b-film-details__vote_average">{filmItem.vote_average}</div>
            </div>
          )}
        </div>
    )
}