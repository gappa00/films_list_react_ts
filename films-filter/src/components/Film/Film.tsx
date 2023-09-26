import React from "react"
import { IFilm } from "../../models"

interface FilmProps {
    film: IFilm
    handleFilmClick: (params: any) => any
}

export const Film: React.FC<FilmProps> = (props) => {
    return (
        <div
            className="b-film-item"
            onClick={props.handleFilmClick}
            id={String(props.film.id)}
        >
            <div className="b-film-item__title">{props.film.title}</div><br/>
            <div className="b-film-item__description">{props.film.overview}</div><br/>
            <div className="b-film-item__vote-average">{props.film.vote_average}</div><br/>
            <div className="b-film-item__release-date">{props.film.release_date}</div>
        </div>
    )
}