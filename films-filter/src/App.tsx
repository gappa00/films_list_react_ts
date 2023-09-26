import React, { useState, useEffect } from 'react';
import { Filmslist } from './components/Filmslist/Filmslist';
import { IFilm } from './models';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { FormData } from './models';
import { Filter } from './components/Filter/Filter';

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
		<>
		<BrowserRouter>
			<Routes>
			<Route path="" element={
				<Filter sendFilmsList={sendFilmsList} sendFormData={sendFormData} search={true}/>
			} />
			<Route path="two" element={
				<>
				<Filter sendFilmsList={sendFilmsList} sendFormData={sendFormData} search={false}/>
				<Filmslist list={filmsList}/>
				</>
			} />
			</Routes>
		</BrowserRouter>
		</>
	);
}

export default App;
