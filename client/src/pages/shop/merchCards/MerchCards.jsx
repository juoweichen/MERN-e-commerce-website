import React from 'react'
import { Container, Row } from 'react-bootstrap';

import ImageCard from '../../../components/imageCard/ImageCard';
import { getImageByMerchId } from '../../../services/image';

export default function MerchCards({ merchs }) {
	return (
		<Container>
			<Row xs={1} sm={3} xl={5}>
				{merchs.map(merch =>
					<ImageCard
						key={merch._id}
						link={`/merch/${merch._id}`}
						title={merch.name}
						imageService={(source) => getImageByMerchId(merch._id, source)}
						text={`$${merch.price}`}
					/>)}
			</Row>
		</Container>
	)
}
