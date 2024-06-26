import useLocalStorageState from 'use-local-storage-state'

type ContentAreaProps = {
	itemList: Product[]
}

type Product = {
	id: number
	name: string
	price: number
	category: string
	quantity: number
	rating: number
	image_link: string
}

export interface CartProps {
	[productId: string]: Product
}

const [cart, setCart] = useLocalStorageState<CartProps>('cart', {})
const addToCart = (product: Product):void => {
    product.quantity = 1

    setCart((prevCart) => ({
      ...prevCart,
      [product.id]: product,
    }))
  }

  const isInCart = (productId: number):boolean => Object.keys(cart || {}).includes(productId.toString())


export const ProductList = (props: ContentAreaProps) => {
	return (
		<div id="productList">
			{props.itemList.map((item) => {
				return (
					<div key={item.name} className="product">	
						<div className="product-top-bar">
							<h2>{item.name}</h2>
							<p> £{item.price.toFixed(2)} ({item.rating}/5)</p>
						</div>
						<img src={"./src/Assets/Product_Images/" + item.image_link}></img>
						<button value={item.id}>Add to basket</button>
					</div>
				)
			})}
		</div>
	)
}