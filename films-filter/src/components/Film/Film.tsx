import React from "react"
import { IFilm } from "../../models"
import { Card, CardBody, Text, Heading, Stack, StackDivider, Box } from '@chakra-ui/react'

interface FilmProps {
    film: IFilm
    handleFilmClick: (params: any) => any
}

export const Film: React.FC<FilmProps> = (props) => {
    return (
        <Card
            className="b-film-item"
            onClick={props.handleFilmClick}
            id={String(props.film.id)}
            _hover={{
                opacity: 0.7,
                cursor: 'pointer',
              }}
            mb='20px'
        >
            <CardBody>
                <Stack divider={<StackDivider />} spacing='10px'>
                    <Box>
                        <Heading>
                            {props.film.title}
                        </Heading>
                    </Box>
                    <Box>
                        <Text>
                            {props.film.overview}
                        </Text>
                    </Box>
                    <Box>
                        <Text color='blue.600' fontSize='2xl'>
                            Rating: {props.film.vote_average}
                        </Text>
                    </Box>
                    <Box>
                        <div>
                            Release date: {props.film.release_date}
                        </div>
                    </Box>
                </Stack>
            </CardBody>
        </Card>
    )
}