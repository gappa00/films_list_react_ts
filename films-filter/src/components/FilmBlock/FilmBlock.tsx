import React from "react";
import { IFilm, Genre } from "../../models";
import { Box, Image, Heading, Stack, StackDivider, Text } from "@chakra-ui/react";

interface FilmBlockProps {
	filmBlock: IFilm[]
	genres: Genre[]
}

export const FilmBlock: React.FC<FilmBlockProps> = (props) => {

	return (
	<Box>
		{ props.filmBlock.map(filmItem => 
		<Stack
			divider={<StackDivider />}
			spacing='10px'
			key={filmItem.id}
		>
			<Heading>
				{filmItem.title}
			</Heading>
			{filmItem.poster_path &&
				<Image src={"https://image.tmdb.org/t/p/w500" + filmItem.poster_path} alt={filmItem.title} />
			}
			<Text fontSize='xl'>
				Genres:&nbsp;
				{ filmItem.genre_ids.map((genre_id, i) => {
					const singleGenre: any = props.genres.filter((genreGlobal) => {
						if (genreGlobal.id == genre_id) {
						  return true
						}
						return false
					  })
					return singleGenre.map((genre: { name: string; }) => genre.name) + (i < filmItem.genre_ids.length - 1 ? ', ' : '')
				})}
			</Text>
			{filmItem.overview &&
				<Text fontSize='md'>
					<Text fontSize='xl'>Overview</Text>
					{filmItem.overview}
				</Text>
			}
			{filmItem.backdrop_path &&
				<Image src={"https://image.tmdb.org/t/p/w500" + filmItem.backdrop_path} alt={filmItem.title} />
			}
			<Text fontSize='xl'>Release date: {filmItem.release_date}</Text>
			{filmItem.video &&
				<Text>Link to video: {filmItem.video}</Text>
			}
			<Text fontSize='xl'>Rating: {filmItem.vote_average}</Text>
		</Stack>
		)}
	</Box>
	)
}