import React, { useState } from 'react'
import { Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import joi from 'joi';

import { inputWrapper } from '../../components/input/Input';
import { submitWrapper } from '../../components/submit/Submit';
import user from '../../services/user';
import { useAuth } from '../../contexts/auth';

export default function Login() {
	const { loginUser } = useAuth();
	const [account, setAccount] = useState({
		email: '',
		password: ''
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
		password: joi.string()
			.alphanum()
			.min(3)
			.max(1024)
			.required()
			.label('Password')
	})

	async function doSubmit() {
		try {
			const response = await user.login(account);
			loginUser(response);
			window.location = '/';
		}
		catch (ex) {
			if (ex.response) {
				const errors = { ...state.error, email: ex.response.data.error };
				state.setError(errors);
			}
		}
	}

	return (
		<Form className='container' data-testid='page-login'>
			{inputWrapper('email', 'email', 'Email', state)}
			{inputWrapper('password', 'password', 'Password', state)}
			<Link to="/register" className='register-link'>
				Not register yet?
			</Link>
			{submitWrapper('Login', state, schema, doSubmit)}
		</Form>
	)
}
