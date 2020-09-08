import React, { useState, useEffect, Fragment } from 'react';
import { Container, Row, Col } from 'react-bootstrap';

import { getCategories } from '../../services/category';
import { getMerchs } from '../../services/merch';
import ItemList from '../../components/itemList/ItemList';
import MerchCards from './merchCards/MerchCards';
import ShopTron from './shopTron/ShopTron';

import './Shop.css';

export default function Shop() {
	const [categories, setCategories] = useState([]);
	const [merchs, setMerchs] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [curMerch, setCurMerch] = useState({});
	let curCategory = { _id: "0", name: "All" };

	useEffect(() => {
		async function initFetch() {
			try {
				// fetch categories
				const categoryRes = await getCategories();
				setCategories(categoryRes.data);
				// fetch merchs
				const merchRes = await getMerchs();
				setMerchs(merchRes.data);
				setCurMerch(merchRes.data);
				// set is loading to false :P
				setIsLoading(false);
			}
			catch (ex) {
				throw ex
			}
		}
		initFetch();
	}, [])

	function categoryOnClick(category) {
		curCategory = category;
		if (curCategory.name === "All") return setCurMerch(merchs);
		setCurMerch(merchs.filter(merch => merch.category._id === curCategory._id));
	}

	return (
		<Fragment>
			<ShopTron />
			<Container data-testid='page-shop'>
				{isLoading ? <p>Loading...</p> :
					<Row>
						<Col id='list-group' md={2}>
							<ItemList items={categories} handleOnClick={categoryOnClick} />
						</Col>
						<Col id='merchs' md={10}>
							<MerchCards merchs={curMerch} />
						</Col>
					</Row>
				}
			</Container>
		</Fragment>
	);
}