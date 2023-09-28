import React from "react";
import { IFilm } from "../../models";
import { Slide } from "@chakra-ui/react";

interface FilmBlockProps {
    filmBlock: IFilm[]
    isOpen: boolean
}

export const FilmBlock: React.FC<FilmBlockProps> = (props) => {
    return (
      <Slide direction='right' in={props.isOpen} style={{ zIndex: 10 }}>
          { props.filmBlock.map(filmItem => 
            <div
              key={filmItem.id}
            >
              <div>{filmItem.title}</div>
              <img
                alt='test'
                src={"https://image.tmdb.org/t/p/w500" + filmItem.poster_path}
              />
              
              <div>
                { filmItem.genre_ids.map(genre_id => <div>{genre_id}</div> )}
              </div>
              <div>{filmItem.overview}</div>
              <div>{filmItem.backdrop_path}</div>
              <div>{filmItem.release_date}</div>
              <div>{filmItem.video}</div>
              <div>{filmItem.vote_average}</div>
            </div>
          )}
        </Slide>
    )
}