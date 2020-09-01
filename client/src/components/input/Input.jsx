import React from 'react'
import { Form, Alert } from 'react-bootstrap';
import _ from 'lodash';

function handleChange({ currentTarget: input }, { data, setData }) {
	const curData = { ...data };
	curData[input.name] = input.value;
	setData(curData);
}

/**
 * Create input field
 * @param {string} type - input type
 * @param {string} name - input field name
 * @param {string} label - input label
 * @param {object} state - include {data, setData, error, setError}
 */
export function inputWrapper(type, name, label, state) {
	return <Input
		type={type}
		name={name}
		value={_.get(state.data, name)}
		label={label}
		error={_.get(state.error, name)}
		onChangeHandler={e => handleChange(e, state)}
	/>
}

export default function Input({ type, name, value, label, error, onChangeHandler }) {
	return (
		<Form.Group controlId={name}>
			<Form.Label>{label}</Form.Label>
			<Form.Control
				name={name}
				value={value}
				onChange={onChangeHandler}
				type={type}
				placeholder={'Enter ' + label} />
			{error &&
				<Alert variant='danger' data-testid={'error-' + name}>
					{error}
				</Alert>
			}
		</Form.Group>
	)
}
