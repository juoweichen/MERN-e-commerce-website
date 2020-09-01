import React from 'react'
import { Button } from 'react-bootstrap';

function validate(data, schema) {
	const errRes = {};
	const result = schema.validate(data, { abortEarly: false });

	if (!result.error) return null;
	for (let item of result.error.details)
		errRes[item.path[0]] = item.message;
	return errRes;
}

async function handleSubmit(e, state, schema, service) {
	e.preventDefault();
	const invalidError = validate(state.data, schema);
	if (invalidError) return state.setError({ ...invalidError });

	try {
		await service(state.data);	// Do submit to server
		window.location = '/';
	}
	catch (ex) {
		if (ex.response) {
			const errors = { ...state.error, email: ex.response.data.error };
			state.setError(errors);
		}
	}
}

export function submitWrapper(text, state, schema, service) {
	return <Submit
		text={text}
		onClickHandler={e => handleSubmit(e, state, schema, service)}
	/>
}

export default function Submit({ text, onClickHandler }) {
	return (
		<Button id='submitButton'
			variant="primary"
			type="submit"
			onClick={onClickHandler}>
			{text}
		</Button>
	)
}
