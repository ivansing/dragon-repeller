// js/functions.js

import { weapons, monsters, locations } from './data.js';
import { state } from './state.js';
import { dom } from './dom.js';

// Define all game functions

export function goTown() {
  update(locations[0]);
}

export function goStore() {
  update(locations[1]);
}

export function goCave() {
  update(locations[2]);
}

export function buyHealth() {
  if (state.gold >= 10) {
    state.gold -= 10;
    state.health += 10;
    dom.goldText.innerText = state.gold;
    dom.healthText.innerText = state.health;
  } else {
    dom.text.innerText = 'You do not have enough gold to buy health.';
  }
}

export function buyWeapon() {
  if (state.currentWeaponIndex < weapons.length - 1) {
    if (state.gold >= 30) {
      state.gold -= 30;
      state.currentWeaponIndex++;
      dom.goldText.innerText = state.gold;
      const newWeapon = weapons[state.currentWeaponIndex].name;
      dom.text.innerText = 'You now have a ' + newWeapon + '.';
      state.inventory.push(newWeapon);
      dom.text.innerText += ' In your inventory you have: ' + state.inventory.join(', ');
    } else {
      dom.text.innerText = 'You do not have enough gold to buy a weapon.';
    }
  } else {
    dom.text.innerText = 'You already have the most powerful weapon!';
    dom.button2.innerText = 'Sell weapon for 15 gold';
    dom.button2.onclick = sellWeapon;
  }
}

export function sellWeapon() {
  if (state.inventory.length > 1) {
    state.gold += 15;
    dom.goldText.innerText = state.gold;
    const soldWeapon = state.inventory.shift();
    dom.text.innerText = 'You sold a ' + soldWeapon + '.';
    dom.text.innerText += ' In your inventory you have: ' + state.inventory.join(', ');
  } else {
    dom.text.innerText = "Don't sell your only weapon!";
  }
}

export function fightSlime() {
  state.fighting = 0;
  goFight();
}

export function fightBeast() {
  state.fighting = 1;
  goFight();
}

export function fightDragon() {
  state.fighting = 2;
  goFight();
}

export function goFight() {
  update(locations[3]);
  state.monsterHealth = monsters[state.fighting].health;
  dom.monsterStats.style.display = 'block';
  dom.monsterName.innerText = monsters[state.fighting].name;
  dom.monsterHealthText.innerText = state.monsterHealth;
}

export function attack() {
  dom.text.innerText =
    'The ' +
    monsters[state.fighting].name +
    ' attacks. You attack it with your ' +
    weapons[state.currentWeaponIndex].name +
    '.';
  state.health -= getMonsterAttackValue(monsters[state.fighting].level);

  if (isMonsterHit()) {
    state.monsterHealth -=
      weapons[state.currentWeaponIndex].power + Math.floor(Math.random() * state.xp) + 1;
  } else {
    dom.text.innerText += ' You miss.';
  }

  dom.healthText.innerText = state.health;
  dom.monsterHealthText.innerText = state.monsterHealth;

  if (state.health <= 0) {
    lose();
  } else if (state.monsterHealth <= 0) {
    if (state.fighting === 2) {
      winGame();
    } else {
      defeatMonster();
    }
  }

  if (Math.random() <= 0.1 && state.inventory.length > 1) {
    const brokenWeapon = state.inventory.pop();
    dom.text.innerText += ' Your ' + brokenWeapon + ' breaks.';
    state.currentWeaponIndex--;
  }
}

export function getMonsterAttackValue(level) {
  const hit = level * 5 - Math.floor(Math.random() * state.xp);
  return hit > 0 ? hit : 0;
}

export function isMonsterHit() {
  return Math.random() > 0.2 || state.health < 20;
}

export function dodge() {
  dom.text.innerText =
    'You dodge the attack from the ' + monsters[state.fighting].name + '.';
}

export function defeatMonster() {
  state.gold += Math.floor(monsters[state.fighting].level * 6.7);
  state.xp += monsters[state.fighting].level;
  dom.goldText.innerText = state.gold;
  dom.xpText.innerText = state.xp;
  update(locations[4]);
}

export function lose() {
  update(locations[5]);
}

export function winGame() {
  update(locations[6]);
}

export function restart() {
  state.xp = 0;
  state.health = 100;
  state.gold = 50;
  state.currentWeaponIndex = 0;
  state.inventory = ['stick'];
  dom.goldText.innerText = state.gold;
  dom.healthText.innerText = state.health;
  dom.xpText.innerText = state.xp;
  goTown();
}

export function easterEgg() {
  update(locations[7]);
}

export function pickTwo() {
  pick(2);
}

export function pickEight() {
  pick(8);
}

export function pick(guess) {
  const numbers = [];
  while (numbers.length < 10) {
    numbers.push(Math.floor(Math.random() * 11));
  }
  dom.text.innerText =
    'You picked ' + guess + '. Here are the random numbers:\n' + numbers.join(', ');

  if (numbers.includes(guess)) {
    dom.text.innerText += '\nRight! You win 20 gold!';
    state.gold += 20;
    dom.goldText.innerText = state.gold;
  } else {
    dom.text.innerText += '\nWrong! You lose 10 health!';
    state.health -= 10;
    dom.healthText.innerText = state.health;
    if (state.health <= 0) {
      lose();
    }
  }
}

// Map function names to actual functions
const functionMap = {
  goTown,
  goStore,
  goCave,
  buyHealth,
  buyWeapon,
  sellWeapon,
  fightSlime,
  fightBeast,
  fightDragon,
  attack,
  dodge,
  restart,
  easterEgg,
  pickTwo,
  pickEight,
};

// Update function that uses functionMap
export function update(location) {
  dom.monsterStats.style.display = 'none';
  for (let i = 0; i < 3; i++) {
    dom['button' + (i + 1)].innerHTML = location['button text'][i];
    const functionName = location['button functions'][i];
    dom['button' + (i + 1)].onclick = functionMap[functionName];
  }
  dom.text.innerHTML = location.text;
}
