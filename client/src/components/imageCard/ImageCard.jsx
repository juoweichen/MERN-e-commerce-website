import React, { useState, useEffect, useMemo } from 'react'
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Card from 'react-bootstrap/Card';

import Spinner from '../../components/spinner/MySpinner';
import http from '../../services/http';
import './ImageCard.css';

function ImageCard({ title, text, link, imageService }) {
	const [imageUrl, setImageUrl] = useState('');
	const [isImageLoading, setIsImageLoading] = useState(true);
	const source = useMemo(() => http.getCancelSource(), []);

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
					<Spinner /> :
					<Card.Img
						variant="top"
						src={imageUrl}
						alt={title}
						data-testid='card-image' />}
				<Card.Body>
					<Card.Title>{title}</Card.Title>
					<Card.Text>{text}</Card.Text>
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