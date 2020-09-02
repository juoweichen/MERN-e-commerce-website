import React from 'react'
import { Container, Row, Col, Nav, Navbar, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGlobeAsia, faCartArrowDown, faTools } from '@fortawesome/free-solid-svg-icons'

import { useAuth } from "../../contexts/auth";
import './Header.css';

export default function Header() {
	const { user } = useAuth();

	return (
		<header className='header' data-testid='component-header'>
			<Navbar bg="light" expand="lg">
				<Container>
					{/* Admin Panel*/}
					<Col>
						{user && user.isAdmin &&
							<Nav.Link href="/admin" data-testid='link-admin'>
								<FontAwesomeIcon id='icon-admin' icon={faTools} />
									ADMIN
								</Nav.Link>
						}
					</Col>
					{/* Brand*/}
					<Col xs='auto'>
						<Navbar.Brand href="/" data-testid='link-brand'>
							Clique
								<FontAwesomeIcon id='icon-globalAsia' icon={faGlobeAsia} />
								WorldWide
							</Navbar.Brand>
					</Col>
					{/* user panel */}
					<Col>
						<Row>
							<Col></Col>
							{user ?
								<Col xs='auto'>
									<p id='username'>Welcome, {user.username}</p>
								</Col> :
								<Col></Col>
							}
							{user &&
								<Col>
									<Button variant="primary" data-testid='button-logout' href='/logout'>
										logout
										</Button>
								</Col>
							}
							{!user &&
								<Col>
									<Button variant="primary" data-testid='button-login' href='/login'>
										login
      							</Button>
								</Col>
							}
							{/* Cart */}
							<Col>
								<Nav.Link href={user ? `/cart/${user.cartid}` : `/cart/no-user`} data-testid='link-cart'>
									<FontAwesomeIcon id='icon-cart' icon={faCartArrowDown} />
								</Nav.Link>
							</Col>
						</Row>
					</Col>
				</Container>
			</Navbar>
		</header>
	)
}
