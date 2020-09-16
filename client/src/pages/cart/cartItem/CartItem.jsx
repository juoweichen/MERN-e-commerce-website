import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Row, Col, Button } from 'react-bootstrap';

import Selector from '../../../components/selector/Selector';
import { getSequenceNumberArray } from '../../../utils/selector';

function CartItem({ item, updateItem, handleDelete }) {
	const [curItem, setCurItem] = useState(item);

	function handleChange({ currentTarget: input }) {
		const newAmount = parseInt(input.value);
		const newItem = {
			...curItem,
			amount: newAmount,
			subTotalPrice: newAmount * curItem.price,
		}
		setCurItem(newItem);
		updateItem(newItem);
	}

	return (
		<Row className='cart-item align-items-center'>
			<Col>{curItem.name}</Col>
			<Col>{curItem.price}</Col>
			<Col>
				<Selector
					label="select amount: "
					value={curItem.amount}
					handleChange={handleChange}
					options={getSequenceNumberArray(10)}
				/>
			</Col>
			<Col>Total: {curItem.subTotalPrice}</Col>
			<Col md={1}>
				<Button
					variant='danger'
					onClick={e => handleDelete(e, curItem)}>
					Delete
				</Button>
			</Col>
		</Row>
	)
}

CartItem.propTypes = {
	item: PropTypes.object.isRequired,
	updateItem: PropTypes.func.isRequired,
	handleDelete: PropTypes.func.isRequired
}

export default CartItem

