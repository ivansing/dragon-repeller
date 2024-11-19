import { dom } from './dom.js';
import * as funcs from './functions.js';

// Initialize Buttons
dom.button1.onclick = funcs.goStore;
dom.button2.onclick = funcs.goCave;
dom.button3.onclick = funcs.fightDragon;

// Start Game
funcs.goTown();

