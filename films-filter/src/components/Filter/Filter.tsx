import React, {useState, useEffect, DOMElement} from "react"
import { useNavigate } from "react-router-dom"
import { Genre, IFilm } from "../../models"
import { FormData } from "../../models"

interface FilterProps {
    sendFormData: (formData: FormData) => any
    search: boolean
    sendFilmsList: (filmsList: IFilm[]) => any;
} 

const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxZTFiYWFkODgxN2MwZDk1NzI3MjlhNjVhMWE0MDM3YiIsInN1YiI6IjY0ZjZjYTRkNWYyYjhkMDBlMTJkMjY4NyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.fyVCGdjguVwYOK6LuNcmtsRReAx3HDt3vUjpmO3ht6Q'
    }
}

export const Filter: React.FC<FilterProps> = (props) => {
    const minRate = 0
    const maxRate = 10
    const minYear = 0
    const today = new Date()
    const getTodayYear = today.toLocaleString("default", { year: "numeric" })
    const navigate = useNavigate()
  
    const [genres, setGenres] = useState<Genre[]>([])
    const [innerFormData, setInnerFormData] = React.useState<FormData>({ title: '', rate: 0, year: 0, genre: 0 })

    useEffect(() => {
    
        fetch('https://api.themoviedb.org/3/genre/movie/list', options)
        .then(response => response.json())
        .then(response => setGenres(response.genres))
        .catch(err => console.error(err))
    
    }, [])
    
      
    function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
        const name = event.target.name
        let value: string | number = event.target.value
    
        if ((name === "rate")) {
          if (isNaN(Number(value))){
            value = 0
          } else {
            value = Math.max(minRate, Math.min(maxRate, Number(value)))
          }
        }
    
        if ((name === "year")) {
          if (isNaN(Number(value))){
            value = 0
          } else {
            value = Math.max(minYear, Math.min(Number(getTodayYear), Number(value)))
          }
        }
    
        console.log(name)
        console.log(value)

        setInnerFormData({ ...innerFormData, [name]: value })
        props.sendFormData({ ...innerFormData, [name]: value })
    }
    
    function handleSelectChange(event: React.ChangeEvent<HTMLSelectElement>) {
        event.preventDefault()
        console.log(event.target.value)
        setInnerFormData({ ...innerFormData, ['genre']: Number(event.target.value) })
        props.sendFormData({ ...innerFormData, ['genre']: Number(event.target.value) })
    }

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
    
        console.log(innerFormData)
        
        let fileteredFilms: IFilm[] = []
    
        if (innerFormData.title !== '') {
          const filteredByNameResponse = await fetch(
            'https://api.themoviedb.org/3/search/movie?'
            +'&query='+String(innerFormData.title)
            +((innerFormData.year !== 0) ? '&year='+String(innerFormData.year) : '')
            +'&page=1'
            +((innerFormData.year !== 0) ? '&primary_release_year='+String(innerFormData.year) : ''),
            options
          )
          const findedMovies: any = await filteredByNameResponse.json()
          fileteredFilms.push(...findedMovies.results)
          if (innerFormData.rate !== 0) {
            fileteredFilms = fileteredFilms.filter((film) => {
              if ((film.vote_average >= innerFormData.rate) && (film.vote_average < innerFormData.rate + 1)) {
                console.log('passed by rate')
                return true
              }
              return false
            })
          }
          if (innerFormData.genre !== 0) {
            fileteredFilms = fileteredFilms.filter((film) => {
              if (film.genre_ids.includes(innerFormData.genre)) {
                console.log('passed by henre')
                return true
              }
              return false
            })
          }
          props.sendFilmsList(fileteredFilms)
          return
        } else {
          const filteredByYearOrRateResponse = await fetch(
            'https://api.themoviedb.org/3/discover/movie?&page=1'
            +((innerFormData.year === 0) ? '&release_date.lte='+getTodayYear : '')
            +'&sort_by=primary_release_date.desc'
            +((innerFormData.year !== 0) ? '&year='+String(innerFormData.year) : '')
            +((innerFormData.genre !== 0) ? '&with_genres='+String(innerFormData.genre) : '')
            +((innerFormData.rate !== 0) ? '&vote_average.gte='+String(innerFormData.rate)+'&vote_average.lte='+String(innerFormData.rate+1) : ''),
            options
          )
          const findedMovies: any = await filteredByYearOrRateResponse.json()
          fileteredFilms.push(...findedMovies.results)
          props.sendFilmsList(fileteredFilms)
          return
        }
    
    }

    return (
        <form onSubmit={handleSubmit}>
            <input name="title" placeholder="Film name" onChange={handleInputChange} value={innerFormData.title}/>
            <select name="genre" onChange={handleSelectChange} value={innerFormData.genre}>
                <option value='0' disabled>
                Choose one
                </option>
                {genres.map(genre => <option value={genre.id} key={genre.id}>{genre.name}</option>) }
            </select>
            <div>
                Rating
                <input name="rate" type='text' onChange={handleInputChange} value={innerFormData.rate}/>
            </div>
            <div>
                Year
                <input name="year" type='text' onChange={handleInputChange} value={innerFormData.year}/>
            </div>
            {props.search
                ? <button onClick={() => navigate('two', { replace: false })} type="submit">Search</button>
                : <button type="submit">Search</button>
            }
        </form>
    )
}