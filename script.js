

{/* <h2 id="itemNameEl">Milk</h2>
        <p id="fleaMarketPriceLabel">Fleamarket price: <span id="fleaMarketPriceEl"></span></p>
        <p id="traderPriceLabel">Trader price: <span id="traderPriceEl"></span> by <span id="traderEl"></span></p>
    </div>     */}

let taskIDs = [];
const itemNameElement = document.getElementById("itemNameEl");
const fleaMarketPriceElement = document.getElementById("fleaMarketPriceEl");
const traderPriceElement = document.getElementById("traderPriceEl");
const traderElement = document.getElementById("traderEl");
const fleaMarketPriceLabelElement = document.getElementById("fleaMarketPriceLabel");
const highLowElement = document.getElementById("highLow");
const traderPriceLabelElement = document.getElementById("traderPriceLabel");

const taskTotal= document.getElementById("taskTotal");
const tasksTitle = document.getElementById("tasksTitleEl");
const taskBoardElement = document.getElementById("taskBoardEl");



// add "Enter" eventlistener
var input = document.getElementById("itemName");
input.addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    document.getElementById("fetchBtn").click();
  }
})

function numberWithSpaces(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

function clearTasks(){
 if(taskIDs.length > 0) {
  taskIDs.forEach(task => {
    document.getElementById(task).remove()
      
  });

}

}


function displayData(itemsArray){
  let items;
  let fleaPrice;
  let highest = 0;
  let highestTrader = {};
  let lowValue = numberWithSpaces(itemsArray[0].low24hPrice);
  let highValue = numberWithSpaces(itemsArray[0].high24hPrice);

  
  // console.log(itemsArray[0].name);
  // console.log(itemsArray[0].sellFor);

  const sellForArray = itemsArray[0].sellFor;
  const fleaMarketPrice = sellForArray.filter(fleaMarketPriceGetter)[0].price;
  const traderPrices = sellForArray.filter(traderPricesGetter);
  
  
  
  // console.log(`the fleamarket price is ${fleaMarketPrice}`)
  console.log(traderPrices[0].price);
  console.log(fleaMarketPrice)

  const highTrader = traderPrices.forEach(traderPrices => {
    
    if (traderPrices.price > highest) {
      highest = traderPrices.price
      highestTrader = { trader: `${traderPrices.source}`,
                        price: `${numberWithSpaces(traderPrices.price)}`}
    } 
  });

          function traderPricesGetter(sellFor){
            return sellFor.source !== "fleaMarket"
          }
  
  
          function fleaMarketPriceGetter(sellFor){
                return sellFor.source === "fleaMarket";
          }

 
   itemsArray[0].usedInTasks.forEach(task => {
        addTask = document.createElement("p");
        console.log(addTask);
        addTask.setAttribute("class", "task");
        addTask.setAttribute("id", task.id);
        addTask.textContent = task.name;
        taskBoardElement.appendChild(addTask);
        taskTotal.hidden = false;
        taskIDs.push(task.id);
});  

console.log(taskBoardElement)





// DOM manipulation
itemNameElement.textContent = itemsArray[0].name;
fleaMarketPriceElement.textContent = `${numberWithSpaces(fleaMarketPrice)} ₽ average`;
traderPriceElement.textContent =  `${highestTrader.price} ₽`;
traderElement.textContent = highestTrader.trader;
highLowElement.textContent = `24 hour low / high  (${lowValue} ₽ - ${highValue} ₽)`;


itemNameElement.hidden = false;
fleaMarketPriceLabelElement.hidden  = false;
traderPriceLabelElement.hidden = false;
highLowElement.hidden = false;



}





// function getHighest(traderPrices){
  
//   if (traderPrices.price > highest) {
//     highest = traderPrices.price
//     highestTrader = { trader: `${traderPrices.source}`,
//                       price: `${traderPrices.price}`}
//   } return 

// }

// API CALL TO TARKOV.DEV

async function fetchData(){
    
  try {
  const itemName = document.getElementById("itemName").value.toLowerCase();
  clearTasks()
  const response = await  
  fetch('https://api.tarkov.dev/graphql',{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({query: `{
        items(name: "${itemName}") {
            id
            name
            shortName
            avg24hPrice
            low24hPrice
    				high24hPrice
            sellFor {
              price
              currency
              priceRUB
              source
            }
            usedInTasks {
              name
              } 
        }
    }`})
    });

    if(!response.ok) {
      throw new Error("Status code not in 200 range")
    }
    const data = await response.json();
    console.log(data)
    items = data.data.items;
    displayData(items)


  }
  catch(error){
    console.error(error)
    itemNameElement.hidden = false;
    itemNameElement.textContent = `item not found`;
    traderPriceLabelElement.hidden = true;
    fleaMarketPriceLabelElement.hidden = true;
    taskTotal.hidden = true;
    taskIDs = [];
    highLowElement.hidden = true;
    
  }
    
}

