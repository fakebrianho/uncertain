const API_BASE_URL = 'http://localhost:3000/api'

export const updatePost = async (collectionName, title, updateData) => {
	const encodedTitle = encodeURIComponent(title)
	const url = `${API_BASE_URL}/${collectionName}/posts/title/${encodedTitle}`
	console.log('Making PATCH request to:', url)
	console.log('With headers:', {
		'Content-Type': 'application/json',
	})
	console.log('With body:', updateData)

	try {
		const response = await fetch(url, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(updateData),
		})

		console.log('Response status:', response.status)

		if (!response.ok) {
			const errorData = await response.json()
			console.log('Error response data:', errorData)
			throw new Error(
				errorData.error || `Failed to update post: ${response.status}`
			)
		}

		const data = await response.json()
		console.log('Success response data:', data)
		return data
	} catch (error) {
		console.error('Error updating post:', error)
		throw error
	}
}

export const updateParentPost = async (
	collectionName,
	parentTitle,
	childTitle
) => {
	const encodedTitle = encodeURIComponent(parentTitle)
	const url = `${API_BASE_URL}/${collectionName}/posts/title/${encodedTitle}`

	try {
		const response = await fetch(url, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ children: childTitle }),
		})

		if (!response.ok) {
			const errorData = await response.json()
			throw new Error(
				errorData.error ||
					`Failed to update parent post: ${response.status}`
			)
		}

		return response.json()
	} catch (error) {
		console.error('Error updating parent post:', error)
		throw error
	}
}
export async function fetchPosts(collectionName) {
	console.log('is it working?')
	const response = await fetch(`${API_BASE_URL}/${collectionName}/posts`)
	if (!response.ok) {
		throw new Error('Failed to fetch posts')
	}
	return response.json()
}

export async function fetchPost(collectionName, id) {
	console.log(`${API_BASE_URL}/posts/${id}`)
	const response = await fetch(
		`${API_BASE_URL}/${collectionName}/posts/${id}`
	)
	if (!response.ok) {
		throw new Error('Failed to fetch post')
	}
	return response.json()
}

export const createPost = async (collectionName, post) => {
	const response = await fetch(`${API_BASE_URL}/${collectionName}/posts`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ ...post, children: post.children || [] }),
	})
	if (!response.ok) {
		throw new Error('Failed to create post')
	}
	return response.json()
}
