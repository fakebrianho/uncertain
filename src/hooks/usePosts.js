import { useState, useEffect } from 'react'
import { fetchPosts, fetchPost } from '../api/posts'

export function usePosts(collectionName) {
	const [posts, setPosts] = useState([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)
	console.log(collectionName)

	useEffect(() => {
		async function loadPosts() {
			try {
				const data = await fetchPosts(collectionName)
				setPosts(data)
			} catch (err) {
				setError(
					err instanceof Error
						? err
						: new Error('Failed to fetch posts')
				)
			} finally {
				setLoading(false)
			}
		}

		if (collectionName) {
			loadPosts()
		}
	}, [collectionName])

	return { posts, loading, error }
}

export function usePost(collectionName, id) {
	const [post, setPost] = useState(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)
	console.log('coll naem', `/api/${collectionName}/posts/${id}`)
	useEffect(() => {
		async function loadPost() {
			try {
				const response = await fetchPost(collectionName, id)
				console.log('res', response)
				setPost(response)
			} catch (err) {
				setError(
					err instanceof Error
						? err
						: new Error('Failed to fetch post')
				)
			} finally {
				setLoading(false)
			}
		}

		if (collectionName && id) {
			loadPost()
		}
	}, [collectionName, id])

	return { post, loading, error }
}
