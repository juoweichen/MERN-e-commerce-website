import React, { useState } from 'react'
import { Form } from 'react-bootstrap';
import joi from 'joi';

import { inputWrapper } from '../../components/input/Input';
import { submitWrapper } from '../../components/submit/Submit';
import user from '../../services/user';

export default function Register() {
	const [account, setAccount] = useState({
		email: '',
		username: '',
		password: '',
		password2: ''
	})
	const [error, setError] = useState({});
	const state = {
		data: account,
		setData: setAccount,
		error,
		setError
	}

	const schema = joi.object({
		email: joi.string()
			.email({
				minDomainSegments: 2,
				tlds: { allow: ['com', 'net'] }
			})
			.required()
			.label("Email"),
		username: joi.string()
			.min(1)
			.max(50)
			.required()
			.label('Name'),
		password: joi.string()
			.alphanum()
			.min(3)
			.max(1024)
			.required()
			.label('Password'),
		password2: joi.string()
			.valid(joi.ref('password'))
			.messages({ 'any.only': 'Confirm password must match password' })
			.required()
			.label('Confirm password')
	})

	return (
		<Form className='container' data-testid='page-register'>
			{inputWrapper('email', 'email', 'Email', state)}
			{inputWrapper('text', 'username', 'Username', state)}
			{inputWrapper('password', 'password', 'Password', state)}
			{inputWrapper('password', 'password2', 'Confirm password', state)}
			{submitWrapper('Register', state, schema, user.register)}
		</Form>
	)
}
