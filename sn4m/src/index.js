import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.scss';
import {BrowserRouter} from "react-router-dom";

//Crea il root React legato all'elemento HTML con id 'root'
const root = ReactDOM.createRoot(document.getElementById('root'));
//Render dell'app nell'albero DOM
root.render(
    //BrowserRouter avvolge App per permettere l'utilizzo delle rotte di React Router
  <BrowserRouter>
      <App/>
  </BrowserRouter>
);