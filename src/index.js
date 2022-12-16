import Gameboard from './Gameboard.js';
import DOMController from './DOMController.js';
import Game from './Game.js';
import './style.css';

DOMController.suscribe();

Game();

// Dark theme switcher

const toggleSwitch = document.querySelector(
	'.theme-switch input[type="checkbox"]'
);

function switchTheme(e) {
	if (e.target.checked) {
		document.documentElement.setAttribute('data-theme', 'dark');
	} else {
		document.documentElement.setAttribute('data-theme', 'light');
	}
}

toggleSwitch.addEventListener('change', switchTheme, false);
