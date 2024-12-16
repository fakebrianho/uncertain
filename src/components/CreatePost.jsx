import React from 'react'
import {
	Container,
	Title,
	TextInput,
	Textarea,
	Button,
	Stack,
	Alert,
	Checkbox,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { useNavigate, useParams } from 'react-router-dom'
import { createPost, updatePost, updateParentPost } from '../api/posts'
import { marked } from 'marked'

export function CreatePost() {
	const API_BASE_URL = 'http://localhost:3000/api'
	const navigate = useNavigate()
	const { collectionName } = useParams()
	const [error, setError] = React.useState(null)

	const form = useForm({
		initialValues: {
			title: '',
			file_name: '',
			content: '',
			prev: '',
			next: '',
			uuid: '',
			subtitle: '',
			layout: '',
			children: [],
			marginalia: [],
			num_child_nodes: 0,
			parent: '',
			isSectionHead: false,
		},
		validate: {
			title: (value) =>
				value.trim().length === 0 ? 'Title is required' : null,
			content: (value) =>
				value.trim().length === 0 ? 'Content is required' : null,
			uuid: (value) =>
				value.trim().length === 0 ? 'uuid is required' : null,
			layout: (value) =>
				value.trim().length === 0 ? 'layout is required' : null,
			parent: (value, values) => {
				if (values.isSectionHead) return null
				return value.trim().length === 0
					? 'Parent is required for non-section heads'
					: null
			},
			prev: (value, values) => {
				if (values.isSectionHead) return null
				return value.trim().length === 0
					? 'Previous post is required for non-section heads'
					: null
			},
		},
	})

	const handleSubmit = async (values) => {
		try {
			const fileName = values.title
				.toLowerCase()
				.replace(/[^a-z0-9]+/g, '-')
				.replace(/(^-|-$)+/g, '')

			const postData = {
				...values,
				file_name: fileName,
				content: marked(values.content),
			}

			console.log(
				`Creating new post in collection ${collectionName} with values:`,
				postData
			)

			const response = await fetch(
				`${API_BASE_URL}/${collectionName}/posts`,
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(postData),
				}
			)

			if (!response.ok) {
				throw new Error('Failed to create post')
			}

			if (values.prev && !values.isSectionHead) {
				await updatePost(collectionName, values.prev, {
					next: fileName,
				})
			}
			if (values.next && !values.isSectionHead) {
				await updatePost(collectionName, values.next, {
					prev: fileName,
				})
			}
			if (values.parent) {
				await updateParentPost(collectionName, values.parent, fileName)
			}

			navigate(`/collection/${collectionName}`)
		} catch (err) {
			console.error('Error in handleSubmit:', err)
			setError(
				err instanceof Error ? err.message : 'Failed to create post'
			)
		}
	}

	return (
		<Container>
			<Title order={1} mb={30}>
				Create New Post
			</Title>
			{error && (
				<Alert color='red' title='Error' mb={20}>
					{error}
				</Alert>
			)}
			<form onSubmit={form.onSubmit(handleSubmit)}>
				<Stack>
					<TextInput
						label='Title'
						placeholder='Enter post title'
						required
						{...form.getInputProps('title')}
					/>
					<Textarea
						label='Content'
						placeholder='Write your post content (Markdown supported)'
						minRows={10}
						required
						{...form.getInputProps('content')}
					/>
					<Textarea
						label='Subtitle'
						placeholder='Write your subtitle here'
						minRows={10}
						required
						{...form.getInputProps('subtitle')}
					/>
					<Textarea
						label='Layout'
						placeholder='Write your layout here'
						minRows={10}
						required
						{...form.getInputProps('layout')}
					/>
					<Textarea
						label='prev'
						placeholder='Write the name of the previous chronological post'
						required={!form.values.isSectionHead}
						{...form.getInputProps('prev')}
					/>
					<Textarea
						label='next'
						placeholder='Write the name of the next chronological post if there is one'
						{...form.getInputProps('next')}
					/>
					<Textarea
						label='uuid'
						placeholder='Write the uuid'
						required
						{...form.getInputProps('uuid')}
					/>
					<Textarea
						label='parent'
						placeholder='Write the parent post name'
						required={!form.values.isSectionHead}
						{...form.getInputProps('parent')}
					/>
					<Textarea
						label='children'
						placeholder='Write children post names'
						{...form.getInputProps('children')}
					/>
					<Checkbox
						label='Section Head'
						{...form.getInputProps('isSectionHead', {
							type: 'checkbox',
						})}
					/>
					<Button type='submit'>Create Post</Button>
				</Stack>
			</form>
		</Container>
	)
}
