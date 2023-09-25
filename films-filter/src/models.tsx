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
    // release_date: number
    release_date: string
    title: string
    video: boolean
    vote_average: number
    vote_count: number
}