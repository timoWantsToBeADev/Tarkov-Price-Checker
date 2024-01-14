

{/* <h2 id="itemNameEl">Milk</h2>
        <p id="fleaMarketPriceLabel">Fleamarket price: <span id="fleaMarketPriceEl"></span></p>
        <p id="traderPriceLabel">Trader price: <span id="traderPriceEl"></span> by <span id="traderEl"></span></p>
    </div>     */}

let itemNameElement = document.getElementById("itemNameEl");
let fleaMarketPriceElement = document.getElementById("fleaMarketPriceEl");
let traderPriceElement = document.getElementById("traderPriceEl");
let traderElement = document.getElementById("traderEl");
let fleaMarketPriceLabelElement = document.getElementById("fleaMarketPriceLabel");
let traderPriceLabelElement = document.getElementById("traderPriceLabel");


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




function displayData(itemsArray){

  let items;
  let fleaPrice;
  let highest = 0;
  let highestTrader = {};

  
  console.log(itemsArray[0].name);
  console.log(itemsArray[0].sellFor);

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

    
itemNameElement.textContent = itemsArray[0].name;
fleaMarketPriceElement.textContent = `${numberWithSpaces(fleaMarketPrice)} ₽`;
traderPriceElement.textContent =  `${highestTrader.price} ₽`;
traderElement.textContent = highestTrader.trader;

itemNameElement.hidden = false;
fleaMarketPriceLabelElement.hidden  = false;
traderPriceLabelElement.hidden = false;




}





// function getHighest(traderPrices){
  
//   if (traderPrices.price > highest) {
//     highest = traderPrices.price
//     highestTrader = { trader: `${traderPrices.source}`,
//                       price: `${traderPrices.price}`}
//   } return 

// }


async function fetchData(){
    
  try {
  const itemName = document.getElementById("itemName").value.toLowerCase();
  console.log(itemName)
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
    
  }
    
}

