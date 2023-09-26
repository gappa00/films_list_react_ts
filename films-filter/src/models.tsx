export interface IFilm {
    adult: boolean
    backdrop_path: string
    genre_ids: Array<number>
    id: number|string
    original_language: string
    original_title: string
    overview: string
    popularity: number
    poster_path: string
    release_date: string
    title: string
    video: boolean
    vote_average: number
    vote_count: number
}

export interface Genre {
    id: number
    name: string
} 

export interface FormData {
    title: string
    rate: number
    year: number
    genre: number
  }
  