import React from 'react'
import { Container, Row, Col, Navbar, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGlobeAsia, faCartArrowDown, faTools } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom';

import { useAuth } from "../../contexts/auth";
import './Header.css';

export default function Header() {
	const auth = useAuth();

	return (
		<header className='header' data-testid='component-header'>
			<Navbar bg="light" expand="lg">
				<Container>
					{/* Admin Panel*/}
					<Col>
						{auth.isLogin && auth.user.isAdmin &&
							<Link to="/admin" data-testid='link-admin'>
								<FontAwesomeIcon id='icon-admin' icon={faTools} />
									ADMIN
								</Link>
						}
					</Col>
					{/* Brand*/}
					<Col xs='auto'>
						<Link to="/" id='brand-link' data-testid='link-brand'>
							Clique
								<FontAwesomeIcon id='icon-globalAsia' icon={faGlobeAsia} />
								WorldWide
						</Link>
					</Col>
					{/* user panel */}
					<Col>
						<Row>
							<Col></Col>
							{auth.isLogin ?
								<Col xs='auto'>
									<p id='welcome-user'>Welcome, {auth.user.username}</p>
								</Col> :
								<Col></Col>
							}
							{auth.isLogin &&
								<Col>
									<Button variant="primary" data-testid='button-logout' href='/logout'>
										logout
										</Button>
								</Col>
							}
							{!auth.isLogin &&
								<Col>
									<Button variant="primary" data-testid='button-login' href='/login'>
										login
      							</Button>
								</Col>
							}
							{/* Cart */}
							<Col>
								<Link data-testid='link-cart'
									to={auth.isLogin ? `/cart/${auth.user.cartid}` : `/cart/no-user`}>
									<FontAwesomeIcon id='icon-cart' icon={faCartArrowDown} />
								</Link>
							</Col>
						</Row>
					</Col>
				</Container>
			</Navbar>
		</header>
	)
}
