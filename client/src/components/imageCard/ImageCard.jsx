import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Card from 'react-bootstrap/Card';

import http from '../../services/http';
import './ImageCard.css';

function ImageCard({ title, text, link, imageService }) {
	const [imageUrl, setImageUrl] = useState('');
	const [isImageLoading, setIsImageLoading] = useState(true);
	const source = http.getCancelSource();

	useEffect(() => {
		async function fetchImageUrl() {
			try {
				const imageRes = await imageService(source);
				const imageBuffer = imageRes.data.image.data;
				setImageUrl(`data:image/png; base64,${Buffer.from(imageBuffer, "base64").toString("base64")}`);
				setIsImageLoading(false);
			}
			catch (ex) {
				if (!http.isCancel(ex)) {
					throw ex // handle error
				}
			}
		}
		fetchImageUrl();
		return () => {
			source.cancel('Request canceled by user');
		}
	}, [imageService, source])

	return (
		<Card>
			<Link to={link} id='merch-page-link'>
				{isImageLoading ?
					<p>Image Loading...</p> :
					<Card.Img
						variant="top"
						src={imageUrl}
						alt={title}
						data-testid='card-image' />}
				<Card.Body>
					<Card.Title>{title}</Card.Title>
					{text}
				</Card.Body>
			</Link>
		</Card>
	)
}

ImageCard.propTypes = {
	imgSrc: PropTypes.string,
	title: PropTypes.string.isRequired,
	text: PropTypes.object.isRequired,
	link: PropTypes.string.isRequired
}

export default ImageCard;