import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import App from './App';
import initResize from './utils/resize';
import './index.scss';

initResize();

ReactDOM.render(
  /* <BrowserRouter>
			<App/>
		</BrowserRouter> */
		<MemoryRouter>
			<App/>
		</MemoryRouter>,
  document.getElementById('root')
);
