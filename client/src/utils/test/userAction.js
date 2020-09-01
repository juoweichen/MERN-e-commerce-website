import userEvent from '@testing-library/user-event'
import { screen } from '@testing-library/react';

async function userType(labelText, inputValue) {
	const inputBox = screen.getByLabelText(labelText);
	await userEvent.type(inputBox, inputValue)
	return inputBox;
}

function userClick(buttonText) {
	const button = screen.getByRole('button', { name: buttonText });
	userEvent.click(button);
	return button;
}

function userClickByElement(elem) {
	userEvent.click(elem);
}

function userSelect(testId, selectValue) {
	const selectField = screen.getByTestId(testId);
	userEvent.selectOptions(selectField, selectValue);
	return selectField;
}

function userSelectByElement(elem, selectValue) {
	userEvent.selectOptions(elem, selectValue);
}

function userUpload(inputLabel, file) {
	const input = screen.getByLabelText(inputLabel)
	userEvent.upload(input, file)
	return input;
}

export default {
	type: userType,
	click: userClick,
	clickByElem: userClickByElement,
	select: userSelect,
	selectByElem: userSelectByElement,
	upload: userUpload,
}
