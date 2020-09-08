import React from 'react'
import { Spinner } from 'react-bootstrap';

import './MySpinner.css';

export default function MySpinner() {
	return (
		<div className='my-spinner' data-testid='loading-spinner'>
			<Spinner animation="grow" />
		</div>
	)
}
