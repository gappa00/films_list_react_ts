import React, {useState} from "react";
import { Film } from "../Film/Film";
import { IFilm } from "../../models";
import { FilmBlock } from "../FilmBlock/FilmBlock";
import { Center, VStack, useDisclosure } from "@chakra-ui/react";

interface FilmsListProps {
    list: IFilm[]
}

export const Filmslist: React.FC<FilmsListProps> = (props) => {
    const [filmBlock, setFilmBlock] = useState<IFilm[]>([])
    const { isOpen, onToggle } = useDisclosure()

    function handleFilmClick(event: React.MouseEvent<HTMLElement>) {
        console.log(event.currentTarget)
        const filmToShow = props.list.filter((film)=>{
          if (film.id == event.currentTarget.id) {
            return true
          }
          return false
        })

        onToggle()
        setFilmBlock(filmToShow)
    }

    return (
        <VStack>
            {filmBlock && 
                <FilmBlock filmBlock={filmBlock} isOpen={isOpen}/>
            }
            {props.list &&
            <Center maxWidth={1100} w='100%' pt='384px'>
                <div className="b-film-items">
                    { props.list.map(function(filmItem, index) {
                        return(
                            <Film film={filmItem} key={index} handleFilmClick={handleFilmClick} />
                        )})
                    }
                </div>
            </Center>
            }
        </VStack>
    )
}