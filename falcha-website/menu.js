const MENU = {
  "Non‑Veg Appetizers": [["Pangra Fry","$12.99"],["Chicken Choila","$13.99"],["Khasi ko Bhutan","$15.99"],["Buff Sukuti Fried","$15.99"],["Buff Sukuti Sadheko","$11.99"],["Buff Choila","$15.99"],["Buff Chilly","$14.99"],["Pork Chilly","$13.99"],["Chicken Sausage Fry","$5.99"],["Bhura Machha Fry","$13.99"]],
  "Veg Appetizers": [["Pani Puri","$9.99"],["Dahi Puri","$9.99"],["Chatpatey","$9.99"],["Wai Wai Sadeko","$9.99"],["Aloo Chop","$9.99"],["Peanuts Sadeko","$9.99"],["Alu Sadeko","$9.99"],["Bhatmas Sadeko","$9.99"],["Laphing","$9.99"],["Plain Bara","$9.99"],["Mushroom Choila","$12.99"]],
  "Momo (Chicken/Buff/Veg)": [["Chicken Steam Momo","$13.99"],["Chicken Kothey Momo","$13.99"],["Chicken Jhol Momo","$14.99"],["Buff Steam Momo","$15.99"],["Buff Jhol Momo","$16.99"],["Veg Steam Momo","$12.99"],["Veg Jhol Momo","$13.99"]],
  "Warm Bowls & Noodles": [["Aloo Tama","$9.99"],["Veg Thukpa","$12.99"],["Chicken Thukpa","$13.99"],["Veg Chowmein","$13.99"],["Chicken Chowmein","$14.99"],["Buff Chowmein","$15.99"]],
  "Set Meals & Specials": [["Samaya Baji Set","$18.99"],["Newari Khaja Set","$19.99"],["Yomari (2 pcs)","$9.99"],["Yomari (4 pcs)","$15.99"],["Aalu Taama","$13.99"]],
  "Drinks": [["Salt Lassi","$4.99"],["Sweet Lassi","$4.99"],["Masala Tea","$2.99"],["Soft Drinks","$2.49"],["Water","$1.50"]]
};

const tabs = document.getElementById('tabs');
const grid = document.getElementById('menuGrid');
const keys = Object.keys(MENU);
let active = keys[0];

function renderTabs(){
  tabs.innerHTML='';
  keys.forEach(k=>{
    const b=document.createElement('button');
    b.textContent=k;
    b.className = k===active ? 'active' : '';
    b.onclick=()=>{active=k;renderTabs();renderItems();};
    tabs.appendChild(b);
  });
}

function renderItems(){
  grid.innerHTML='';
  MENU[active].forEach(([n,p])=>{
    const d=document.createElement('div');
    d.className='item';
    d.innerHTML=`<b>${n}</b><span>${p}</span>`;
    grid.appendChild(d);
  });
}

renderTabs();
renderItems();