import React, {useState, useEffect, useRef} from "react"
import { useQuery, useMutation } from 'react-query';
import { useNavigate } from "react-router-dom"
import { Genre, IFilm } from "../../models"
import { FormData } from "../../models"
import { Button, FormControl, FormLabel, Input, Select, Center, VStack } from "@chakra-ui/react";
import styled from "@emotion/styled";

const Form = styled.form`
  background: transparent;
  width: 100%;
  border-radius: 3px;
  margin: 0 1em;
  padding: 0.25em 1em;
  max-width: 1100px;
`

interface FilterProps {
    sendFormData: (formData: FormData) => any
    sendGenresGlobal: (genresData: Genre[]) => any
    formData?: FormData
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

    const formRef = useRef<HTMLFormElement>(null);
  
    const [genres, setGenres] = useState<Genre[]>([])
    const [innerFormData, setInnerFormData] = React.useState<FormData>({ title: '', rate: 0, year: 0, genre: 0 })

    const { data: genresData } = useGenres()
    const { mutateAsync: mutateSearchByName } = useMutation(searchByNameFilms);
    const { mutateAsync: mutateSearchByRateOrDate } = useMutation(searchByDateOrRateFilms);


    useEffect(() => {
        if(genresData) {
            setGenres(genresData.genres);
            props.sendGenresGlobal(genresData.genres)
        }
    }, [genresData])

    useEffect(() => {
        if(props.formData) {
            setInnerFormData(props.formData);
            const node = formRef.current
            node?.dispatchEvent(
                new Event("submit", { cancelable: true, bubbles: true })
            );
        }
    }, [props.formData])
      
    function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
        event.preventDefault()
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
    

        setInnerFormData({ ...innerFormData, [name]: value })
        props.sendFormData({ ...innerFormData, [name]: value })
    }
    
    function handleSelectChange(event: React.ChangeEvent<HTMLSelectElement>) {
        event.preventDefault()
        setInnerFormData({ ...innerFormData, ['genre']: Number(event.target.value) })
        props.sendFormData({ ...innerFormData, ['genre']: Number(event.target.value) })
    }

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        
        let fileteredFilms: IFilm[] = []
    
        if (innerFormData.title !== '') {
            const filmsByNameData = await mutateSearchByName({searchByNameFilmsName: innerFormData.title, searchByNameFilmsYear: innerFormData.year})
            fileteredFilms.push(...filmsByNameData.results)
            if (innerFormData.rate !== 0) {
                fileteredFilms = fileteredFilms.filter((film) => {
                  if ((film.vote_average >= innerFormData.rate) && (film.vote_average < innerFormData.rate + 1)) {
                    return true
                  }
                  return false
                })
            }
            if (innerFormData.genre !== 0) {
                fileteredFilms = fileteredFilms.filter((film) => {
                  if (film.genre_ids.includes(innerFormData.genre)) {
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
        <Center w='100%' paddingLeft={'calc(100vw - 100%)'}>
            <Form onSubmit={handleSubmit} ref={formRef}>
                <VStack spacing='12px'>
                    <FormControl>
                        <FormLabel>Film Title</FormLabel>
                        <Input name="title" placeholder="Film name" onChange={handleInputChange} value={innerFormData.title}/>
                    </FormControl>
                    <Select variant='filled' placeholder='Select genre' name="genre" onChange={handleSelectChange} value={innerFormData.genre}>
                        {genres.map(genre => <option value={genre.id} key={genre.id}>{genre.name}</option>) }
                    </Select>
                    <FormControl>
                        <FormLabel>Rating</FormLabel>
                        <Input name="rate" type='text' onChange={handleInputChange} value={innerFormData.rate}/>
                    </FormControl>
                    <FormControl>
                        <FormLabel>Year</FormLabel>
                        <Input name="year" type='text' onChange={handleInputChange} value={innerFormData.year}/>
                    </FormControl>
                    {props.search
                        ? <Button colorScheme='blue' onClick={() => navigate('two', { replace: false })} type="submit">
                            Search
                          </Button>
                        : <Button colorScheme='blue' type="submit">Search</Button>
                    }
                </VStack>
            </Form>
        </Center>
    )
}