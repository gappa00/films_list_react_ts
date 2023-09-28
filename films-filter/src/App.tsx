import React, { useState, useEffect } from 'react';
import { Filmslist } from './components/Filmslist/Filmslist';
import { IFilm } from './models';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { FormData } from './models';
import { Filter } from './components/Filter/Filter';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ChakraProvider, Flex } from '@chakra-ui/react'

const queryClient = new QueryClient();

function App() {
	const [filmsList, setFilms] = useState<IFilm[]>([])
	const [formData, setFormData] = React.useState<FormData>({ title: '', rate: 0, year: 0, genre: 0 });

	function sendFormData(formData: FormData) {
		setFormData(formData)
	}

	function sendFilmsList(filmsList: IFilm[]) {
		setFilms(filmsList)
	}
	
	return (
		<ChakraProvider resetCSS={true}>
			<QueryClientProvider client={queryClient}>
				<BrowserRouter>
					<Routes>
						<Route path="" element={
							<Filter
								sendFilmsList={sendFilmsList}
								sendFormData={sendFormData}
								// formData={formData}
								search={true}/>
						} />
						<Route path="two" element={
							<>
								<Flex 
									bg="white"
									zIndex={1}
									pos='fixed'
									w='100%'
									borderBottom='1px solid var(--chakra-colors-blue-600)'
								>
									<Filter
										sendFilmsList={sendFilmsList}
										sendFormData={sendFormData}
										formData={formData}
										search={false}/>
								</Flex>
								
								<Flex justify='center'>
									<Filmslist list={filmsList}/>
								</Flex>
							</>
						} />
					</Routes>
				</BrowserRouter>
			</QueryClientProvider>
		</ChakraProvider>
	);
}

export default App;
