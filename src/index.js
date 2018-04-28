import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';

import App from './App';
import './index.scss'

ReactDOM.render(
  /* <BrowserRouter>
			<App/>
		</BrowserRouter> */
		<MemoryRouter>
			<App/>
		</MemoryRouter>,
  document.getElementById('root')
);
