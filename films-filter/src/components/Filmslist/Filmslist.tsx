import React, {useState, useRef} from "react";
import { Film } from "../Film/Film";
import { IFilm, Genre } from "../../models";
import { FilmBlock } from "../FilmBlock/FilmBlock";
import { Center, VStack, useDisclosure, Box } from "@chakra-ui/react";
import {
    Drawer,
    DrawerBody,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
  } from '@chakra-ui/react'

interface FilmsListProps {
    list: IFilm[]
    genres: Genre[]
}

export const Filmslist: React.FC<FilmsListProps> = (props) => {
    const [filmBlock, setFilmBlock] = useState<IFilm[]>([])
    const { isOpen, onOpen, onClose } = useDisclosure()

    function handleFilmClick(event: React.MouseEvent<HTMLElement>) {
        const filmToShow = props.list.filter((film)=>{
          if (film.id == event.currentTarget.id) {
            return true
          }
          return false
        })

        onOpen()
        setFilmBlock(filmToShow)
    }

    return (
        <VStack paddingLeft={'calc(100vw - 100%)'}>
            {filmBlock && 
                <Drawer
                    isOpen={isOpen}
                    placement='right'
                    onClose={onClose}
                    blockScrollOnMount={true}
                    closeOnEsc={true}
                    closeOnOverlayClick={true}
                    isFullHeight={true}
                    size="lg"
                >
                    <DrawerOverlay />
                    <DrawerContent>
                        <DrawerCloseButton />
                        <DrawerBody>
                            <FilmBlock filmBlock={filmBlock} genres={props.genres}/>
                        </DrawerBody>
                    </DrawerContent>
                </Drawer>
            }
            {props.list &&
            <Center maxWidth={1100} w='100%' pt='384px'>
                <Box>
                    { props.list.map(function(filmItem, index) {
                        return(
                            <Film film={filmItem} key={index} handleFilmClick={handleFilmClick} />
                        )})
                    }
                </Box>
            </Center>
            }
        </VStack>
    )
}