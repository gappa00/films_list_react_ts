import React, {useState, useEffect, DOMElement} from "react"
import { useQuery, useMutation } from 'react-query';
import { useNavigate } from "react-router-dom"
import { Genre, IFilm } from "../../models"
import { FormData } from "../../models"

interface FilterProps {
    sendFormData: (formData: FormData) => any
    search: boolean
    sendFilmsList: (filmsList: IFilm[]) => any;
} 

interface searchByNameFilmsEntryVariables {
    searchByNameFilmsName: string
    searchByNameFilmsYear: number
}

interface searchByDateOrRateFilmsEntryVariables {
    searchByDateOrRateFilmsYear: number
    searchByDateOrRateFilmsRate: number
    searchByDateOrRateFilmsGenre: number
}

const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxZTFiYWFkODgxN2MwZDk1NzI3MjlhNjVhMWE0MDM3YiIsInN1YiI6IjY0ZjZjYTRkNWYyYjhkMDBlMTJkMjY4NyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.fyVCGdjguVwYOK6LuNcmtsRReAx3HDt3vUjpmO3ht6Q'
    }
}

function useGenres() {
    return useQuery(
        ['genres'],
        async () => {
        const res = await fetch('https://api.themoviedb.org/3/genre/movie/list', options)
        return res.json()
        }
    )
}

const searchByNameFilms = async ({searchByNameFilmsName, searchByNameFilmsYear}: searchByNameFilmsEntryVariables) => {
    const response = await fetch(
        'https://api.themoviedb.org/3/search/movie?'
        +'&query='+String(searchByNameFilmsName)
        +((searchByNameFilmsYear !== 0) ? '&year='+String(searchByNameFilmsYear) : '')
        +'&page=1'
        +((searchByNameFilmsYear !== 0) ? '&primary_release_year='+String(searchByNameFilmsYear) : ''),
        options
    )
    return response.json()
}

const today = new Date()
const getTodayYear = today.toLocaleString("default", { year: "numeric" })

const searchByDateOrRateFilms = async ({searchByDateOrRateFilmsYear, searchByDateOrRateFilmsRate, searchByDateOrRateFilmsGenre}: searchByDateOrRateFilmsEntryVariables) => {
    const response = await fetch(
        'https://api.themoviedb.org/3/discover/movie?&page=1'
        +((searchByDateOrRateFilmsYear === 0) ? '&release_date.lte='+getTodayYear : '')
        +'&sort_by=primary_release_date.desc'
        +((searchByDateOrRateFilmsYear !== 0) ? '&year='+String(searchByDateOrRateFilmsYear) : '')
        +((searchByDateOrRateFilmsGenre !== 0) ? '&with_genres='+String(searchByDateOrRateFilmsGenre) : '')
        +((searchByDateOrRateFilmsRate !== 0) ? '&vote_average.gte='+String(searchByDateOrRateFilmsRate)+'&vote_average.lte='+String(searchByDateOrRateFilmsRate+1) : ''),
        options
    )
    return response.json()
}

export const Filter: React.FC<FilterProps> = (props) => {
    const minRate = 0
    const maxRate = 10
    const minYear = 0

    const navigate = useNavigate()
  
    const [genres, setGenres] = useState<Genre[]>([])
    const [innerFormData, setInnerFormData] = React.useState<FormData>({ title: '', rate: 0, year: 0, genre: 0 })

    const { data: genresData } = useGenres()
    const { mutateAsync: mutateSearchByName } = useMutation(searchByNameFilms);
    const { mutateAsync: mutateSearchByRateOrDate } = useMutation(searchByDateOrRateFilms);


    useEffect(() => {
        console.log(genresData)
        if(genresData) {
            setGenres(genresData.genres);
        }
    }, [genresData])
    
      
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
            const filmsByNameData = await mutateSearchByName({searchByNameFilmsName: innerFormData.title, searchByNameFilmsYear: innerFormData.year})
            fileteredFilms.push(...filmsByNameData.results)
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
            const filteredByYearOrRateData = await mutateSearchByRateOrDate({searchByDateOrRateFilmsYear: innerFormData.year, searchByDateOrRateFilmsRate: innerFormData.rate, searchByDateOrRateFilmsGenre: innerFormData.genre})
            fileteredFilms.push(...filteredByYearOrRateData.results)
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