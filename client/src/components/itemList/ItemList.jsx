import React from 'react'
import { ListGroup } from 'react-bootstrap';
import PropTypes from 'prop-types';

import './itemList.css';

export default function ItemList({ items, handleOnClick }) {
	const allItems = [...items];
	allItems.unshift({ _id: "0", name: "All" });

	return (
		<ListGroup>
			{allItems.map(item =>
				<ListGroup.Item key={item._id} onClick={() => handleOnClick(item)}>
					{item.name}
				</ListGroup.Item>)
			}
		</ListGroup>
	)
}

ItemList.propTypes = {
	items: PropTypes.array,
	handleOnClick: PropTypes.func
}
