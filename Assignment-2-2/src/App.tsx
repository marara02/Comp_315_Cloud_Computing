import { useState, useEffect } from 'react'
import { ProductList } from './Components/ProductList'
import itemList from './Assets/random_products_175.json';
import './e-commerce-stylesheet.css'

type Product = {
  id: number
	name: string
  price: number
  category: string
  quantity: number
  rating: number
  image_link: string
}

function App() {
  
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchedProducts, setSearchedProducts] = useState<Product[]>(itemList);
  const [searchedResultNumber, setSearchedResultNumber] = useState<string>('');
  const [selectTerm, setSelectTerm] = useState<string>('AtoZ');
  const [checkInbox, setCheckInbox] = useState<boolean>(false);

  const [Products] = useState<Product[]>(itemList);
  const [basketItems, setBasketItems] = useState<Product[]>([]);
  

  // ===== Hooks =====
  useEffect(() => updateSearchedProducts(), [searchTerm, selectTerm, checkInbox]);

  // ===== Basket management =====
  function showBasket(){
    let areaObject = document.getElementById('shopping-area');
    if(areaObject !== null){
      areaObject.style.display='block';
    }
  }

  function hideBasket(){
    let areaObject = document.getElementById('shopping-area');
    if(areaObject !== null){
      areaObject.style.display='none';
    }
  }

// Function for adding products to basket
  const addToBasket = (productId: number) => {
    const productToAdd = Products.find(product => product.id === productId);
    if (!productToAdd) return;

    if (basketItems.some((cartItem) => cartItem.id === productId)) {
      // If the product is already in the basket, update its quantity
      setBasketItems((cart) =>
        cart.map((cartItem) =>
          cartItem.id === productId
            ? {
                ...cartItem,
                quantity: cartItem.quantity + 1
              }
            : cartItem
        )
      );
    } else {
      // If the product is not in the basket, quantity is 1
      setBasketItems(prevItems => [...prevItems, { ...productToAdd, quantity: 1 }]);
    }
  };

  // Function for calculating total amount of expenses
  const totalBasketCost = () => {
    return basketItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  }

  // ===== Search =====
  function updateSearchedProducts(){
    let holderList: Product[] = itemList.filter((product: Product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    
    if(selectTerm == 'AtoZ'){
      holderList.sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0));
    }
    if(selectTerm == 'ZtoA'){
      holderList.sort((a, b) => (a.name < b.name ? 1 : a.name > b.name ? -1 : 0));
    }
    if(selectTerm == '£LtoH'){
      holderList.sort((a, b) => (a.price < b.price ? -1 : a.price > b.price ? 1 : 0));
    }
    if(selectTerm == '£HtoL'){
      holderList.sort((a, b) => (a.price < b.price ? 1 : a.price > b.price ? -1 : 0));
    }
    if(selectTerm == '*LtoH'){
      holderList.sort((a, b) => (a.rating < b.rating ? -1 : a.rating > b.rating ? 1 : 0));
    }
    if(selectTerm == '*HtoL'){
      holderList.sort((a, b) => (a.rating < b.rating ? 1 : a.rating > b.rating ? -1 : 0));
    }

    if(checkInbox == true){
      holderList = holderList.filter(product => product.quantity > 0);
    }

    setSearchedProducts(holderList);
   
    if(searchTerm == ''){
      setSearchedResultNumber(`${holderList.length} Products`);
    }
    else if(searchTerm == '' && holderList.length == 1){
      setSearchedResultNumber(`1 Product`);
    }
    else if(holderList.length == 0 || holderList == null){
      setSearchedResultNumber('No search results found');
    }
    else if(holderList.length == 1){
      setSearchedResultNumber(`1 Result`);
    }
    else{
      setSearchedResultNumber(`${holderList.length} Results`);
    }
  }

  return (
    <div id="container"> 
      <div id="logo-bar">
        <div id="logo-area">
          <img src="./src/assets/logo.png"></img>
        </div>
        <div id="shopping-icon-area">
          <img id="shopping-icon" onClick={showBasket} src="./src/assets/shopping-basket.png"></img>
        </div>
        <div id="shopping-area">
          <div id="exit-area">
            <p id="exit-icon" onClick={hideBasket}>x</p>
          </div>
          {basketItems.length === 0 &&  <p>Your basket is empty</p>}
          <div className="shopping-information">
          <div className='product-row'>
            {basketItems.map((item, index) => (
            <div className="item" key={index}>
              <p>{item.name} £{item.price.toFixed(2)} - Q: {item.quantity}</p>
              <button className="remove-button" onClick={(e) => {
                setBasketItems((latestBasketProducts) => {
                  const updatedCart = latestBasketProducts.map((latestItem) =>
                    latestItem.id === item.id
                  ? { ...latestItem, quantity: Math.max(item.quantity - 1, 0) }
                  : latestItem).filter((basketItem) => basketItem.quantity > 0); 
                  return updatedCart;
                });
                }}>Remove Product</button>
            </div>
          ))}
          </div>
          <div className='checkOut'>
            <p>Total: £{totalBasketCost()}</p>
          </div>
          </div>
         
        </div>
      </div>
      <div id="search-bar">
        <input type="text" placeholder="Search..." onChange={changeEventObject => setSearchTerm(changeEventObject.target.value)}></input>
        <div id="control-area">
          <select onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectTerm(e.target.value)}>
            <option value="AtoZ">By name (A - Z)</option>
            <option value="ZtoA">By name (Z - A)</option>
            <option value="£LtoH">By price (low - high)</option>
            <option value="£HtoL">By price (high - low)</option>
            <option value="*LtoH">By rating (low - high)</option>
            <option value="*HtoL">By rating (high - low)</option>
          </select>
          <input id="inStock" type="checkbox" onChange={changeEventObject => setCheckInbox(changeEventObject.target.checked)}></input>
          <label htmlFor="inStock">In stock</label>
        </div>
      </div>
      <p id="results-indicator">{searchedResultNumber}</p>
      <ProductList itemList={searchedProducts} addToBasket={addToBasket}/>
    </div>
  )
}

export default App
