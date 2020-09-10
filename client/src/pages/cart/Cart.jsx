import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Container, Row, Col, Button } from 'react-bootstrap';

import { getCartById, updateCart } from '../../services/cart';
import user from '../../services/user';
import Spinner from '../../components/spinner/MySpinner';

import CartItem from './cartItem/CartItem';

export default function Cart({ match }) {
	const cartid = match.params.cartid;
	const [cart, setCart] = useState({});
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		async function fetchCartById() {
			// check local storage for user jwt
			const jwt = user.getJwt();
			if (!jwt) return alert("user token not found");
			// fetch cart from service
			const cartRes = await getCartById(cartid, jwt);
			if (cartRes.status !== 200) return alert(cartRes.data);
			setCart(cartRes.data);
			setIsLoading(false);
		}
		fetchCartById();
	}, [cartid])

	/**
	 * Update items and calculate total before actually update the db
	 * Increase the render speed at front end
	 * @param {*} newItem - updated item
	 */
	function updateItem(newItem) {
		// check local storage for user jwt
		const jwt = user.getJwt();
		if (!jwt) return alert("user token not found");
		// update items
		const cartItems = [...cart.items];
		for (let i = 0; i < cartItems.length; i++) {
			if (cartItems[i].merchid === newItem.merchid)
				cartItems[i] = { ...newItem }
		}
		const newCart = calculateTotal(cartItems);
		// update cart at db
		updateCart(cartid, newCart, jwt)
			.then(res => {
				if (res.status === 200) {
					setCart(newCart);
					return alert('update item success :)')
				}
			})
			.catch(err => {
				console.log(err)
				return alert('update item error :(');
			});
	}

	function deleteItem(e, targetItem) {
		e.preventDefault();
		// check local storage for user jwt
		const jwt = user.getJwt();
		if (!jwt) return alert("user token not found");
		// update items
		let cartItems = [...cart.items];
		cartItems = cartItems.filter(item => targetItem.merchid !== item.merchid)
		const newCart = calculateTotal(cartItems);
		// update cart at db
		updateCart(cartid, newCart, jwt)
			.then(res => {
				if (res.status === 200) {
					setCart(newCart);
					return alert('delete item success :)')
				}
			})
			.catch(err => {
				console.log(err)
				return alert('delete item error :(');
			});
	}

	function calculateTotal(cartItems) {
		let totalAmount = cartItems.reduce((accum, item) =>
			accum + item.amount, 0);
		let totalPrice = cartItems.reduce((accum, item) =>
			accum + item.subTotalPrice, 0);
		return {
			totalAmount,
			totalPrice,
			items: cartItems
		}
	}

	return (
		<div>
			{isLoading ? <Spinner /> :
				<Container data-testid='page-cart'>
					<Row>
						<Col>Total amount: {cart.totalAmount}</Col>
						<Col>Total price: {cart.totalPrice}</Col>
					</Row>
					{cart.items.map(item =>
						<CartItem
							key={item.merchid}
							item={item}
							updateItem={updateItem}
							handleDelete={deleteItem} />
					)}
					<Row>
						<Button href='/'>Check out</Button>
					</Row>
				</Container>
			}
		</div>
	)
}

Cart.propTypes = {
	match: PropTypes.object.isRequired
}
