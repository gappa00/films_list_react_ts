import React from "react";
import { Interface } from "readline";
import { films } from "../../data/films";

interface Ganre {
    name: string,
    id: number
} 

export function Filter() {
    const ganres: Ganre[] = [
        {
            "name" : "test",
            "id" : 1
        }
    ]
    return (
        <form>
            <input id="name" placeholder="Film name"/>
            <select>
                {ganres.map(ganre => <option key={ganre.id}>{ganre.name}</option>) }
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