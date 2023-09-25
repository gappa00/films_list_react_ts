import React from "react";
import { films } from "../../data/films";
import { Film } from "../Film/Film";
import { IFilm } from "../../models";



export function List() {
    return (
        <div>
            { films.map(filmItem => <Film film={filmItem} key={filmItem.id} />) }
        </div>
    )
}