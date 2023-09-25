import React, { useState, useEffect } from 'react';
// import { Filter } from './components/Filter/Filter';
// import { List } from './components/List/List';
// import { IFilm } from './models';
import { films } from './data/films';
import { IFilm } from './models';
import { Genre } from './models';

const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxZTFiYWFkODgxN2MwZDk1NzI3MjlhNjVhMWE0MDM3YiIsInN1YiI6IjY0ZjZjYTRkNWYyYjhkMDBlMTJkMjY4NyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.fyVCGdjguVwYOK6LuNcmtsRReAx3HDt3vUjpmO3ht6Q'
  }
};

interface FormProps {
  onSubmit: (data: FormData) => void;
}

interface FormData {
  title: string
  rate: number
  year: number
  genre: number
}

function App(/*{ onSubmit }: FormProps*/) {
  const minRate = 0
  const maxRate = 10
  const minYear = 0
  const today = new Date()
  const getTodayYear = today.toLocaleString("default", { year: "numeric" })

  const [formData, setFormData] = React.useState<FormData>({ title: '', rate: 0, year: 0, genre: 0 });
  const [filmsList, setFilms] = useState<IFilm[]>([])
  const [filmBlock, setFilmBlock] = useState<IFilm[]>()
  const [genres, setGenres] = useState<Genre[]>([])

  useEffect(() => {
    
    fetch('https://api.themoviedb.org/3/genre/movie/list', options)
    .then(response => response.json())
    .then(response => setGenres(response.genres))
    .catch(err => console.error(err));

  }, []);

  
  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const name = event.target.name;
    let value: string | number = event.target.value;

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
  
    setFormData({ ...formData, [name]: value })
  }

  function handleSelectChange(event: React.ChangeEvent<HTMLSelectElement>) {
    event.preventDefault()
    console.log(event.target.value)
    setFormData({ ...formData, ['genre']: Number(event.target.value) })
  }
  
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    console.log(formData);
    
    let fileteredFilms: IFilm[] = []

    if (formData.title !== '') {
      const filteredByNameResponse = await fetch(
        'https://api.themoviedb.org/3/search/movie?'
        +'&query='+String(formData.title)
        +((formData.year !== 0) ? '&year='+String(formData.year) : '')
        +'&page=1'
        +((formData.year !== 0) ? '&primary_release_year='+String(formData.year) : ''),
        options
      );
      const findedMovies: any = await filteredByNameResponse.json()
      fileteredFilms.push(...findedMovies.results)
      if (formData.rate !== 0) {
        fileteredFilms = fileteredFilms.filter((film) => {
          if ((film.vote_average >= formData.rate) && (film.vote_average < formData.rate + 1)) {
            console.log('passed by rate')
            return true
          }
          return false
        })
      }
      if (formData.genre !== 0) {
        fileteredFilms = fileteredFilms.filter((film) => {
          if (film.genre_ids.includes(formData.genre)) {
            console.log('passed by henre')
            return true
          }
          return false
        })
      }
      setFilms(fileteredFilms)
      return
    } else {
      const filteredByYearOrRateResponse = await fetch(
        'https://api.themoviedb.org/3/discover/movie?&page=1'
        +((formData.year === 0) ? '&release_date.lte='+getTodayYear : '')
        +'&sort_by=primary_release_date.desc'
        +((formData.year !== 0) ? '&year='+String(formData.year) : '')
        +((formData.genre !== 0) ? '&with_genres='+String(formData.genre) : '')
        +((formData.rate !== 0) ? '&vote_average.gte='+String(formData.rate)+'&vote_average.lte='+String(formData.rate+1) : ''),
        options
      );
      const findedMovies: any = await filteredByYearOrRateResponse.json()
      fileteredFilms.push(...findedMovies.results)
      setFilms(fileteredFilms)
      return
    }
  }

  function handleFilmClick(event: React.MouseEvent<HTMLElement>) {
    console.log(event.currentTarget.id)
    const filmToShow = filmsList.filter((film)=>{
      if (film.id == event.currentTarget.id) {
        return true
      }
      return false
    })

    setFilmBlock(filmToShow)
  }

  function handleClear() {
    setFilms([])
  }

  // const genres: Genre[] = [
  //   {
  //       "name" : "test",
  //       "id" : 1
  //   }
  // ]

  return (
    <>
      {/* <Filter/>
      <List/> */}
      {filmBlock && 
        <div className="b-film-details__wrap">
          { filmBlock.map(filmItem => 
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
      }
      <form onSubmit={handleSubmit}>
        <input name="title" placeholder="Film name" onChange={handleInputChange} value={formData.title}/>
        <select name="genre" onChange={handleSelectChange} value={formData.genre}>
            <option value='0' disabled>
              Choose one
            </option>
            {genres.map(genre => <option value={genre.id} key={genre.id}>{genre.name}</option>) }
        </select>
        <div>
            Rating
            <input name="rate" /* placeholder="From" */ type='text' onChange={handleInputChange} value={formData.rate}/>
            {/* <input name="rateTo" placeholder="To" type='text' onChange={handleInputChange} value={formData.rateTo}/> */}
        </div>
        <div>
            Year
            <input name="year" /* placeholder="From" */ type='text' onChange={handleInputChange} value={formData.year}/>
            {/* <input name="yearTo" placeholder="To" type='text' onChange={handleInputChange} value={formData.yearTo}/> */}
        </div>
        <button type="submit">Search</button>
      </form>
      <button onClick={handleClear}>Clear results</button>
      <div className="b-film-items">
          { filmsList.map(function(filmItem,index) {
            return(
              <div
                className="b-film-item"
                onClick={handleFilmClick}
                key={index}
                id={String(filmItem.id)}
              >
                <div className="b-film-item__title">{filmItem.title}</div><br/>
                <div className="b-film-item__description">{filmItem.overview}</div><br/>
                <div className="b-film-item__vote-average">{filmItem.vote_average}</div><br/>
                <div className="b-film-item__release-date">{filmItem.release_date}</div>
              </div>
            )})
          }
      </div>
      {/* <div>
        <div>
            { filmsList.map(filmItem => 
              <div
                key={filmItem.id}
              >
                <div className="name">{filmItem.title}</div>
                <div className="name">{filmItem.title}</div>
              </div>
            )}
        </div>
      </div> */}
    </>
  );
}

export default App;
