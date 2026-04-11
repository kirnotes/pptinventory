const API_URL = "https://script.google.com/macros/s/AKfycbzB7CfHv8bZdPmGW9pAACQQZJIQTN-JrZ0qLh2ykCjPcW9UE_r7WaDd8nLDWc8sl7Rm/exec";

let products = [];
let transactions = [];

let cashTotal = 0;
let gcashTotal = 0;

/* LOAD */
async function load(){

const res = await fetch(API_URL,{
method:"POST",
headers:{"Content-Type":"application/json"},
body:JSON.stringify({type:"get"})
});

const data = await res.json();

products = data.slice(1).map(r=>({
name:r[1],
starting:Number(r[2]),
stock:Number(r[3]),
price:Number(r[4]),
sold:Number(r[5])
}));

render();
}

/* ADD PRODUCT */
function addProduct(){

fetch(API_URL,{
method:"POST",
headers:{"Content-Type":"application/json"},
body:JSON.stringify({
type:"add",
name:document.getElementById("name").value,
stock:Number(document.getElementById("stock").value),
price:Number(document.getElementById("price").value)
})
});

setTimeout(load,500);
}

/* SELL PRODUCT */
function sell(){

let i = document.getElementById("product").value;
let qty = Number(document.getElementById("qty").value);
let pay = document.getElementById("payment").value;

let p = products[i];

let total = qty * p.price;

fetch(API_URL,{
method:"POST",
headers:{"Content-Type":"application/json"},
body:JSON.stringify({
type:"sell",
id:"TX-"+Date.now(),
product:p.name,
qty,
payment:pay,
total
})
});

// local totals
if(pay === "cash") cashTotal += total;
if(pay === "gcash") gcashTotal += total;

setTimeout(load,500);
}

/* RENDER */
function render(){

let sel = document.getElementById("product");
sel.innerHTML = "";

let inv = document.getElementById("inv");
inv.innerHTML = "";

products.forEach((p,i)=>{

sel.innerHTML += `<option value="${i}">${p.name}</option>`;

let amount = p.sold * p.price;

inv.innerHTML += `
<tr>
<td>${p.name}</td>
<td>${p.starting}</td>
<td>${p.stock}</td>
<td>${p.price}</td>
<td>${p.sold}</td>
<td>${amount}</td>
</tr>
`;
});

/* TOTALS */
document.getElementById("cash").innerText = cashTotal;
document.getElementById("gcash").innerText = gcashTotal;
document.getElementById("total").innerText = cashTotal + gcashTotal;
}

load();