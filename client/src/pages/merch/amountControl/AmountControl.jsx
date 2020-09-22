import React, { useState } from 'react'
import { Button, Form } from 'react-bootstrap';
import PropTypes from 'prop-types'

import Selector from '../../../components/selector/Selector';
import { getSequenceNumberArray } from '../../../utils/selector';

function AmountControl({ addToCart }) {
	const [amount, setAmount] = useState("0");

	function handleChange(e) {
		setAmount(e.currentTarget.value);
	}

	return (
		<Form>
			<Selector
				label='Select amount: '
				value={amount}
				handleChange={handleChange}
				options={getSequenceNumberArray(10)}
			/>
			<Button variant="light" onClick={() => addToCart(parseInt(amount))}>Add to cart</Button>
		</Form>
	)
}

AmountControl.propTypes = {
	addToCart: PropTypes.func.isRequired,
}

export default AmountControl

