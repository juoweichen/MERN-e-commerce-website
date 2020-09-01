import React from 'react'
import { Container, Col, Navbar } from 'react-bootstrap';

import './Footer.css';

export default function Footer() {
	return (
		<div className='footer'>
			<Navbar bg="light" expand="lg" fixed="bottom">
				<Container>
					<Col>
						© 2020 Copyright: Juo Wei, Chen
					</Col>
				</Container>
			</Navbar>
		</div>
	)
}
