import React from "react";
import { IFilm } from "../../models";

interface FilmsProps {
    film: IFilm
}

export function Film(props: FilmsProps) {
    console.log(props)
    return (
        <div
            key={props.film.id}
            data-popularity={props.film.popularity}
            data-release-date={props.film.release_date}
            data-genre-ids={props.film.genre_ids}
        >
            {props.film.title}
        </div>
    )
}