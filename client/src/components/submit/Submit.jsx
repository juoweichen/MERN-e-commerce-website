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

async function handleSubmit(e, state, schema, doSubmit) {
	e.preventDefault();
	const invalidError = validate(state.data, schema);
	if (invalidError) return state.setError({ ...invalidError });
	doSubmit();	// call api service here
}

export function submitWrapper(text, state, schema, doSubmit) {
	return <Submit
		text={text}
		onClickHandler={e => handleSubmit(e, state, schema, doSubmit)}
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
