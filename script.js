let price = 5000;
let prevPrice = price;
let history = [];

let cash = 100000;
let coin = 0;

const priceEl = document.getElementById("price");
const changeEl = document.getElementById("change");

function updateUI(){
  let change = ((price - prevPrice)/prevPrice)*100;

  priceEl.innerText = price.toFixed(0) + " 円";
  changeEl.innerText = change.toFixed(2) + "%";

  changeEl.className = "change " + (change >= 0 ? "up" : "down");

  document.getElementById("cash").innerText = cash.toFixed(0);
  document.getElementById("coin").innerText = coin.toFixed(4);
  document.getElementById("total").innerText = (cash + coin * price).toFixed(0);
}

function updatePrice(){
  prevPrice = price;

  let change = (Math.random()-0.5)*200;

  // トレンド
  if(Math.random() < 0.05) change += 800;
  if(Math.random() < 0.05) change -= 800;

  price += change;
  if(price < 100) price = 100;

  history.push(price);
  if(history.length > 80) history.shift();

  drawChart();
  updateUI();
}

function drawChart(){
  let canvas = document.getElementById("chart");
  let ctx = canvas.getContext("2d");

  ctx.clearRect(0,0,500,250);

  ctx.beginPath();

  for(let i=0;i<history.length;i++){
    let x = i * 6;
    let y = 250 - (history[i]/50);
    ctx.lineTo(x,y);
  }

  ctx.strokeStyle = "#3b82f6";
  ctx.stroke();
}

// 取引
function buyAll(){
  let amt = cash / price;
  coin += amt;
  cash = 0;
}

function buyHalf(){
  let amt = (cash/2) / price;
  coin += amt;
  cash /= 2;
}

function sellHalf(){
  let amt = coin/2;
  cash += amt * price;
  coin /= 2;
}

function sellAll(){
  cash += coin * price;
  coin = 0;
}

// ニュース
function randomNews(){
  const newsList = [
    "📈 大企業が参入 → 爆上げ",
    "💥 ハッキング事件 → 暴落",
    "🏦 規制強化 → 下落",
    "🚀 バブル発生 → 上昇中",
    "😐 特に何もなし"
  ];

  let text = newsList[Math.floor(Math.random()*newsList.length)];
  document.getElementById("news").innerText = text;
}

// ランキング
function saveScore(){
  let total = cash + coin * price;
  let data = JSON.parse(localStorage.getItem("ranking") || "[]");

  data.push({score: total, date: Date.now()});

  let week = 7*24*60*60*1000;
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
    li.innerText = Math.floor(d.score) + " 円";
    list.appendChild(li);
  });
}

// ループ
setInterval(updatePrice, 1000);
setInterval(randomNews, 5000);
setInterval(()=>{
  saveScore();
  loadRanking();
},30000);

updateUI();
loadRanking();
