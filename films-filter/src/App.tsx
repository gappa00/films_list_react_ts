import React, { useState, useEffect } from 'react';
// import { Filter } from './components/Filter/Filter';
// import { List } from './components/List/List';
// import { IFilm } from './models';
import { films } from './data/films';
import { IFilm } from './models';


const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxZTFiYWFkODgxN2MwZDk1NzI3MjlhNjVhMWE0MDM3YiIsInN1YiI6IjY0ZjZjYTRkNWYyYjhkMDBlMTJkMjY4NyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.fyVCGdjguVwYOK6LuNcmtsRReAx3HDt3vUjpmO3ht6Q'
  }
};

interface Ganre {
  name: string,
  id: number
} 

interface FormProps {
  onSubmit: (data: FormData) => void;
}

interface FormData {
  title: string
  rate: number
  rateTo: number
  year: number
  yearTo: number
}

function App(/*{ onSubmit }: FormProps*/) {
  const minRate = 0;
  const maxRate = 10;
  const minYear = 0;
  const today = new Date();
  const maxYear = today.getFullYear();

  const [formData, setFormData] = React.useState<FormData>({ title: '', rate: 0, rateTo: 0, year: 0, yearTo: 0 });
  const [filmsList, setFilms] = useState<IFilm[]>([])
  const [filmBlock, setFilmBlock] = useState<IFilm[]>()

  useEffect(() => {
    // fetch('https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=10&primary_release_year=2022&sort_by=primary_release_date.desc', options)
    // .then(response => response.json())
    // .then(response => setFilms(response.results))
    // .catch(err => console.error(err));
    
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
        value = Math.max(minYear, Math.min(maxYear, Number(value)))
      }
    }

    console.log(name)
    console.log(value)
  
    setFormData({ ...formData, [name]: value })
  }
  
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    
    const responseForPages = await fetch('https://api.themoviedb.org/3/discover/movie?sort_by=primary_release_date.desc', options);
    const jsonResponseForPages: any = await responseForPages.json()
    const pages: number = jsonResponseForPages.total_pages
    console.log(pages)

    // let filmsPerPage: IFilm[] = []
    // let filteredFilmsPerPage: IFilm[] = []

    // for (let i = 1; i <= pages - 40040; i++) 
    // {
    //   const response = await fetch('https://api.themoviedb.org/3/discover/movie?sort_by=primary_release_date.desc&page='+i, options);
    //   const findedMovies: any = await response.json()
    //   filmsPerPage = findedMovies.results

    //   const filteredFilmsByName: IFilm[] = filmsPerPage.filter((film) => {
    //     if (
    //       (formData.title === '') ||
    //       (film.title.includes(formData.title))
    //       ) {
    //       console.log('passed by name')
    //       return true
    //     }
    //     return false
    //   })

    //   filteredFilmsPerPage.push(...filteredFilmsByName)
    // }
    // setFilms(filteredFilmsPerPage)

    let allFilms: IFilm[] = []

    console.log("searching...")
    console.log('https://api.themoviedb.org/3/discover/movie?sort_by=primary_release_date.desc'
    +((formData.year !== 0) ? '&year='+String(formData.year) : '')
    +((formData.rate !== 0) ? '&vote_average.gte='+formData.rate : ''))
    for (let i = 1; i <= pages - 40110; i++) 
    {
      const response = await fetch(
        'https://api.themoviedb.org/3/discover/movie?&page='+i+'&sort_by=primary_release_date.desc'
        +((formData.year !== 0) ? '&year='+String(formData.year) : '')
        +((formData.rate !== 0) ? '&vote_average.gte='+String(formData.rate) : ''),
        options
      );
      const findedMovies: any = await response.json()
      allFilms.push(...findedMovies.results)
    }
    const filteredFilmsByName = allFilms.filter((film) => {
      if (
        (formData.title === '') ||
        (film.title.includes(formData.title))
        ) {
        console.log('passed by name')
        return true
      }
      return false
    })
    console.log("fourth color!")

    setFilms(filteredFilmsByName)

      

    // let filmsBlob = await (await fetch('https://api.themoviedb.org/3/discover/movie?sort_by=primary_release_date.desc', options)).blob()
    
    // const response = await fetch('https://api.themoviedb.org/3/discover/movie?sort_by=primary_release_date.desc', options);
    // const findedMovies: any = await response.json()
    // console.log(findedMovies.results);
    // let movies: IFilm = findedMovies.result
    
    // console.log(filmsBlob)
    // fetch('https://api.themoviedb.org/3/discover/movie?sort_by=primary_release_date.desc', options)
    //   .then(response => response.json())
    //   .then(response => setFilms(response.results))
    //   .then(response => console.log(response))
      // .then(() => {
      //   const filteredFilmsByName = filmsList.filter((film) => {
      //     if (
      //       (formData.title === '') ||
      //       (film.title.includes(formData.title))
      //      ) {
      //       console.log('passed by name')
      //       return true
      //     }
      //     return false
      //   })

      //   setFilms(filteredFilmsByName)
      // }
      // )
      // .catch(err => console.error(err));

    // const filteredFilmsByName = filmsList.filter((film) => {
    //   if (
    //     (formData.title === '') ||
    //     (film.title.includes(formData.title))
    //    ) {
    //     console.log('passed by name')
    //     return true
    //   }
    //   return false
    // })

    // const filteredFilmsByRate = filteredFilmsByName.filter((film) => {
    //   if (
    //     ((formData.rateTo === 0) && (formData.rateFrom === 0)) ||
    //     ((film.vote_average <= formData.rateTo) && (film.vote_average >= formData.rateFrom))
    //   ) {
    //     console.log('passed by rate')
    //     return true
    //   }
    //   return false
    // })

    
    // const filteredFilms = filteredFilmsByRate.filter((film) => {
    //   const filmDate = new Date(film.release_date);
    //   if (
    //     ((formData.yearTo === 0) && (formData.yearFrom === 0)) ||
    //     ((Number(filmDate.getFullYear()) <= formData.yearTo) && (Number(filmDate.getFullYear()) >= formData.yearFrom))
    //   ) {
    //     console.log('passed by year')
    //     return true
    //   }
    //   return false
    // })

    // setFilms(filteredFilmsByName)
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
    // console.log(films)
    setFilms([])
    // console.log(filmsList);
  }

  // const ganres: Ganre[] = [
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
        {/* <select>
            {ganres.map(ganre => <option key={ganre.id}>{ganre.name}</option>) }
        </select> */}
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
