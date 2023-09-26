import React, {useState} from "react";
import { Film } from "../Film/Film";
import { IFilm } from "../../models";
import { FilmBlock } from "../FilmBlock/FilmBlock";

interface FilmsListProps {
    list: IFilm[]
}

export const Filmslist: React.FC<FilmsListProps> = (props) => {
    const [filmBlock, setFilmBlock] = useState<IFilm[]>([])

    function handleFilmClick(event: React.MouseEvent<HTMLElement>) {
        console.log(event.currentTarget)
        const filmToShow = props.list.filter((film)=>{
          if (film.id == event.currentTarget.id) {
            return true
          }
          return false
        })
    
        setFilmBlock(filmToShow)
    }

    return (
        <>
            {filmBlock && 
                <FilmBlock filmBlock={filmBlock}/>
            }
            {props.list &&
                <div className="b-film-items">
                    { props.list.map(function(filmItem, index) {
                        return(
                            <Film film={filmItem} key={index} handleFilmClick={handleFilmClick}/>
                        )})
                    }
                </div>
            }
      </>
    )
}