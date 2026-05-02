let candles = [];
let price = 30000;

let trend = 0; // -1 下げ / 0 横 / 1 上げ
let trendPower = 0;

let cash = 100000;
let coin = 0;

// 初期データ生成
for(let i=0;i<50;i++){
  generateCandle();
}

function generateCandle(){
  let open = price;

  // トレンド変化
  if(Math.random() < 0.05){
    trend = Math.floor(Math.random()*3) - 1;
    trendPower = Math.random()*200;
  }

  let move = (Math.random()-0.5)*200 + trend * trendPower;

  let close = open + move;
  let high = Math.max(open, close) + Math.random()*100;
  let low = Math.min(open, close) - Math.random()*100;

  price = close;

  candles.push({open, high, low, close});
  if(candles.length > 60) candles.shift();
}

// 移動平均
function getMA(period){
  let ma = [];
  for(let i=0;i<candles.length;i++){
    if(i < period) continue;

    let sum = 0;
    for(let j=0;j<period;j++){
      sum += candles[i-j].close;
    }
    ma.push(sum/period);
  }
  return ma;
}

function drawChart(){
  let canvas = document.getElementById("chart");
  let ctx = canvas.getContext("2d");

  ctx.clearRect(0,0,500,250);

  let candleWidth = 6;

  // ローソク足
  candles.forEach((c, i)=>{
    let x = i * 8;

    let openY = 250 - c.open/200;
    let closeY = 250 - c.close/200;
    let highY = 250 - c.high/200;
    let lowY = 250 - c.low/200;

    let color = c.close > c.open ? "#22c55e" : "#ef4444";

    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.moveTo(x, highY);
    ctx.lineTo(x, lowY);
    ctx.stroke();

    ctx.fillStyle = color;
    ctx.fillRect(
      x - candleWidth/2,
      Math.min(openY, closeY),
      candleWidth,
      Math.abs(openY - closeY) || 1
    );
  });

  // 移動平均（短期）
  let ma5 = getMA(5);
  ctx.beginPath();
  ctx.strokeStyle = "#22c55e";
  ma5.forEach((v,i)=>{
    let x = (i+5)*8;
    let y = 250 - v/200;
    ctx.lineTo(x,y);
  });
  ctx.stroke();

  // 移動平均（長期）
  let ma15 = getMA(15);
  ctx.beginPath();
  ctx.strokeStyle = "#ef4444";
  ma15.forEach((v,i)=>{
    let x = (i+15)*8;
    let y = 250 - v/200;
    ctx.lineTo(x,y);
  });
  ctx.stroke();
}

function updateUI(){
  document.getElementById("price").innerText =
    Math.floor(price) + " 円";

  document.getElementById("cash").innerText =
    Math.floor(cash);

  document.getElementById("coin").innerText =
    coin.toFixed(4);

  document.getElementById("total").innerText =
    Math.floor(cash + coin * price);
}

// 取引
function buyAll(){
  let amt = cash / price;
  coin += amt;
  cash = 0;
}

function sellAll(){
  cash += coin * price;
  coin = 0;
}

// ループ
setInterval(()=>{
  generateCandle();
  drawChart();
  updateUI();
}, 1000);
