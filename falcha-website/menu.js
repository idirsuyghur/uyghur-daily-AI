/* menu.js — Falcha Menu Engine */

const MENU = {
  "Non‑Veg Starters": [
    ["Pangra Fry", "$12.99"],
    ["Chicken Choila", "$13.99"],
    ["Khasi ko Bhutan", "$15.99"],
    ["Buff Sukuti Fried", "$15.99"],
    ["Buff Sukuti Sadheko", "$11.99"],
    ["Buff Choila", "$15.99"],
    ["Buff Chilly", "$14.99"],
    ["Pork Chilly", "$13.99"],
    ["Chicken Sausage Fry", "$5.99"],
    ["Bhura Machha Fry", "$13.99"]
  ],
  "Veg Starters": [
    ["Pani Puri", "$9.99"],
    ["Dahi Puri", "$9.99"],
    ["Chatpatey", "$9.99"],
    ["Wai Wai Sadeko", "$9.99"],
    ["Aloo Chop", "$9.99"],
    ["Peanuts Sadeko", "$9.99"],
    ["Alu Sadeko", "$9.99"],
    ["Bhatmas Sadeko", "$9.99"],
    ["Laphing", "$9.99"],
    ["Plain Bara", "$9.99"],
    ["Mushroom Choila", "$12.99"]
  ],
  "Momos": [
    ["Chicken Steam Momo", "$13.99"],
    ["Chicken Kothey Momo", "$13.99"],
    ["Chicken Jhol Momo", "$14.99"],
    ["Buff Steam Momo", "$15.99"],
    ["Buff Jhol Momo", "$16.99"],
    ["Veg Steam Momo", "$12.99"],
    ["Veg Jhol Momo", "$13.99"]
  ],
  "Bowls & Noodles": [
    ["Aloo Tama", "$9.99"],
    ["Veg Thukpa", "$12.99"],
    ["Chicken Thukpa", "$13.99"],
    ["Veg Chowmein", "$13.99"],
    ["Chicken Chowmein", "$14.99"],
    ["Buff Chowmein", "$15.99"]
  ],
  "Set Meals": [
    ["Samaya Baji Set", "$18.99"],
    ["Newari Khaja Set", "$19.99"],
    ["Yomari (2 pcs)", "$9.99"],
    ["Yomari (4 pcs)", "$15.99"],
    ["Aalu Taama", "$13.99"]
  ],
  "Drinks": [
    ["Salt Lassi", "$4.99"],
    ["Sweet Lassi", "$4.99"],
    ["Masala Tea", "$2.99"],
    ["Soft Drinks", "$2.49"],
    ["Water", "$1.50"]
  ]
};

// Items to tag as bestsellers
const BESTSELLERS = new Set([
  "Buff Jhol Momo", "Newari Khaja Set", "Chicken Choila",
  "Samaya Baji Set", "Buff Sukuti Sadheko", "Yomari (4 pcs)"
]);

const tabsEl = document.getElementById('tabs');
const gridEl = document.getElementById('menuGrid');
const keys = Object.keys(MENU);
let active = keys[0];

function renderTabs() {
  tabsEl.innerHTML = '';
  keys.forEach(k => {
    const btn = document.createElement('button');
    btn.textContent = k;
    btn.className = 'tab-btn' + (k === active ? ' active' : '');
    btn.setAttribute('role', 'tab');
    btn.setAttribute('aria-selected', k === active);
    btn.setAttribute('aria-controls', 'menuGrid');
    btn.addEventListener('click', () => {
      active = k;
      renderTabs();
      renderItems();
      // Scroll tabs to keep active tab visible
      btn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    });
    tabsEl.appendChild(btn);
  });
}

function renderItems() {
  gridEl.innerHTML = '';
  MENU[active].forEach(([name, price]) => {
    const item = document.createElement('div');
    item.className = 'menu-item';
    item.setAttribute('role', 'listitem');

    const isBest = BESTSELLERS.has(name);
    item.innerHTML = `
      <div>
        <div class="item-name">${name}</div>
        ${isBest ? '<span class="item-badge">⭐ Best Seller</span>' : ''}
      </div>
      <div class="item-price">${price}</div>
    `;
    gridEl.appendChild(item);
  });
}

// Init
renderTabs();
renderItems();