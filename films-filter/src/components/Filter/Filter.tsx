import React from "react";
import { Interface } from "readline";
import { films } from "../../data/films";

interface Genre {
    name: string,
    id: number
} 

export function Filter() {
    const genres: Genre[] = [
        {
            "name" : "test",
            "id" : 1
        }
    ]
    return (
        <form>
            <input id="name" placeholder="Film name"/>
            <select>
                {genres.map(genre => <option key={genre.id}>{genre.name}</option>) }
            </select>
            <div>
                Rating
                <input id="rate-from" placeholder="From"/><input id="rate-to" placeholder="To"/>
            </div>
            <div>
                Year
                <input id="year-from" placeholder="From"/><input id="year-to" placeholder="To"/>
            </div>
            <button type="submit">Search</button>
        </form>
    )
}