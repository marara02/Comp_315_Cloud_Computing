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
      setSearchedResultNumber(`${holderList.length}Products`);
    }
    else if(searchTerm == '' && holderList.length == 1){
      setSearchedResultNumber(`1Product`);
    }
    else if(holderList.length == 0 || holderList == null){
      setSearchedResultNumber('Nosearchresults found');
    }
    else if(holderList.length == 1){
      setSearchedResultNumber(`1Result`);
    }
    else{
      setSearchedResultNumber(`${holderList.length}Results`);
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
          <p>Your basket is empty</p>
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
      <ProductList itemList={searchedProducts}/>
    </div>
  )
}

export default App
