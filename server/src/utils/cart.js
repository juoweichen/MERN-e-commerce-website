/**
 * Count amount and sub total price from cart items
 * @param {*} items 
 */
module.exports = function calculateTotal(items) {
	let amount = 0, price = 0;

	items.map(item => {
		amount += item.amount;
		price += item.subTotalPrice;
	})
	return { amount, price };
}