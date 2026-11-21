import React from 'react';
import { createRoot } from 'react-dom/client';
import App from '../App';
import '../styles.css';
import './main';

createRoot(document.getElementById('config-chrome')).render(<App configurator/>);
