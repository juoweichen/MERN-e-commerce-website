import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Form, Button } from 'react-bootstrap';

function ImageUpload({ label, upload }) {
	const [image, setImage] = useState({});

	function handleOnChange(e) {
		setImage(e.target.files[0]);
	}

	function onUpload(e) {
		e.preventDefault();
		const formData = new FormData();
		formData.append('image', image);
		upload(formData);
	}

	return (
		<Form>
			<Form.Group>
				<Form.File
					id="image-upload"
					name="image"
					label={label}
					onChange={handleOnChange}
				/>
			</Form.Group>
			<Button
				variant='primary'
				type='submit'
				onClick={onUpload}>
				Upload
			</Button>
		</Form>
	)
}

ImageUpload.propTypes = {
	label: PropTypes.string,
	upload: PropTypes.func.isRequired,
}

export default ImageUpload

