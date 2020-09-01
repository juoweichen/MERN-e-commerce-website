import React from 'react'
import PropTypes from 'prop-types'
import Form from 'react-bootstrap/Form';

function Selector({ label, value, handleChange, options }) {
	return (
		<Form.Group controlId="number-select">
			<Form.Label>{label}</Form.Label>
			<Form.Control as="select"
				value={value}
				onChange={handleChange}
				data-testid='select-single'>
				{options.map(option =>
					<option
						key={option.value}
						value={option.value}
						data-testid={`val-${option.value}`}>
						{option.label}
					</option>
				)}
			</Form.Control>
		</Form.Group>
	)
}

Selector.propTypes = {
	label: PropTypes.string,
	value: PropTypes.any.isRequired,
	handleChange: PropTypes.func.isRequired,
	options: PropTypes.array.isRequired,
}

export default Selector

