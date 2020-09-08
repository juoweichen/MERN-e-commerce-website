import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types'
import { Image, Container, Row, Col } from 'react-bootstrap';

import { getMerchById } from '../../services/merch';
import { getImageByMerchId } from '../../services/image';
import { addItemToCart } from '../../services/cart';
import user from '../../services/user';
import http from '../../services/http';
import AmountControl from './amountControl/AmountControl';
import Spinner from '../../components/spinner/MySpinner';

function Merch({ match }) {
	const merchid = match.params.merchid;
	const [merch, setMerch] = useState({});
	const [imageUrl, setImageUrl] = useState('');
	const [isLoading, setIsLoading] = useState(true);
	const [isImageLoading, setIsImageLoading] = useState(true);
	const source = http.getCancelSource();

	useEffect(() => {
		async function fetchMerchById() {
			try {
				const merchRes = await getMerchById(merchid);
				setMerch(merchRes.data);
				setIsLoading(false);
			}
			catch (ex) {
				throw ex
			}
		}
		fetchMerchById();
	}, [merchid])

	useEffect(() => {
		async function fetchImageUrlById() {
			try {
				const imageRes = await getImageByMerchId(merchid, source);
				const imageBuffer = imageRes.data.image.data;
				setImageUrl(`data:image/png; base64,${Buffer.from(imageBuffer, "base64").toString("base64")}`);
				setIsImageLoading(false);
			}
			catch (ex) {
				if (!http.isCancel(ex)) {
					throw ex
				}
			}
		}
		fetchImageUrlById();
		return () => {
			source.cancel('Request canceled by user');
		}
	}, [merchid])

	function addToCart(amount) {
		const curUser = user.getCurrent();
		if (!curUser) return alert('You need to login before add merch to cart :)')
		// NOTE: if item already exist in cart, update amount to it
		// NOTE: limit customer can't purchase more then 10 items per cart 
		addItemToCart(
			curUser.cartid,
			{
				merchid: merch._id,
				name: merch.name,
				amount: amount,
				price: merch.price,
				subTotalPrice: merch.price * amount,
			},
			user.getJwt()
		)
			.then(res => {
				if (res.status === 200)
					return alert('Add to Cart success :)')
			})
			.catch(err => {
				console.log(err)
				return alert('add to cart error :(');
			});
	}

	return (
		<Container>
			{isLoading ?
				<p data-testid='loading-text'>Loading...</p> :
				<Row>
					{isImageLoading ? <Spinner /> : imageCol(imageUrl)}
					{infoCol(merch, addToCart)}
				</Row>
			}
		</Container >
	)
}

Merch.propTypes = {
	match: PropTypes.object.isRequired
}

function imageCol(imgSrcUrl) {
	return (
		<Col id="image-col" xs={10} md={4} >
			<Image alt='merch-image' src={imgSrcUrl} thumbnail />
		</Col>
	)
}

function infoCol(merch, addToCart) {
	return (
		<Col id="info-col" xs={12} md={8} >
			<Row>
				<Col>
					<h3>{merch.name}</h3>
				</Col>
				<Col>
					<h3>${merch.price}</h3>
				</Col>
			</Row>
			<Row>
				<Col>
					<p>{merch.description}</p>
				</Col>
			</Row>
			<Row>
				<Col>
					<AmountControl addToCart={addToCart} />
				</Col>
			</Row>
		</Col>
	)
}

export default Merch;
