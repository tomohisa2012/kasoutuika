let price = 100;
let history = [];
let cash = 10000;
let coin = 0;

const priceEl = document.getElementById("price");
const cashEl = document.getElementById("cash");
const coinEl = document.getElementById("coin");
const totalEl = document.getElementById("total");

function updateUI(){
  priceEl.innerText = price.toFixed(2);
  cashEl.innerText = cash.toFixed(0);
  coinEl.innerText = coin.toFixed(2);
  totalEl.innerText = (cash + coin * price).toFixed(0);
}

function updatePrice(){
  let change = (Math.random() - 0.5) * 10;

  // トレンド追加
  if(Math.random() < 0.1) change += 20;
  if(Math.random() < 0.1) change -= 20;

  price += change;
  if(price < 1) price = 1;

  history.push(price);
  if(history.length > 50) history.shift();

  drawChart();
  updateUI();
}

function buy(){
  let amt = parseFloat(document.getElementById("amount").value);
  if(!amt) return;

  let cost = amt * price;
  if(cost > cash) return;

  cash -= cost;
  coin += amt;
  updateUI();
}

function sell(){
  let amt = parseFloat(document.getElementById("amount").value);
  if(!amt) return;
  if(amt > coin) return;

  cash += amt * price;
  coin -= amt;
  updateUI();
}

function drawChart(){
  let canvas = document.getElementById("chart");
  let ctx = canvas.getContext("2d");

  ctx.clearRect(0,0,300,150);

  ctx.beginPath();
  for(let i=0;i<history.length;i++){
    let x = i * 6;
    let y = 150 - history[i];
    ctx.lineTo(x,y);
  }
  ctx.stroke();
}

// ランキング
function saveScore(){
  let total = cash + coin * price;
  let data = JSON.parse(localStorage.getItem("ranking") || "[]");

  data.push({
    score: total,
    date: Date.now()
  });

  // 1週間以内
  let week = 7 * 24 * 60 * 60 * 1000;
  data = data.filter(d => Date.now() - d.date < week);

  data.sort((a,b)=>b.score-a.score);
  data = data.slice(0,5);

  localStorage.setItem("ranking", JSON.stringify(data));
}

function loadRanking(){
  let data = JSON.parse(localStorage.getItem("ranking") || "[]");
  let list = document.getElementById("ranking");
  list.innerHTML = "";

  data.forEach(d=>{
    let li = document.createElement("li");
    li.innerText = Math.floor(d.score);
    list.appendChild(li);
  });
}

// 自動更新
setInterval(updatePrice, 1000);

// 30秒ごとに記録
setInterval(()=>{
  saveScore();
  loadRanking();
},30000);

updateUI();
loadRanking();
