import React from 'react'
import {
	Container,
	Title,
	Card,
	Text,
	Group,
	Stack,
	Alert,
	Button,
} from '@mantine/core'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { usePosts } from '../hooks/usePosts'
import { CreateCollectionButton } from './CreateCollectionButton'

export function BlogList() {
	const { collectionName } = useParams()
	const navigate = useNavigate()
	const { posts, loading, error } = usePosts(collectionName)

	if (loading) {
		return (
			<Container>
				<Text>Loading posts...</Text>
			</Container>
		)
	}

	if (error) {
		return (
			<Container>
				<Alert color='red' title='Error'>
					{error.message}
				</Alert>
			</Container>
		)
	}

	return (
		<Container>
			<Group justify='space-between' mb={30}>
				<Title order={1} mb={30}>
					{collectionName} Posts
				</Title>
				<Button
					onClick={() =>
						navigate(`/collection/${collectionName}/create`)
					}
					variant='filled'
				>
					Create New Post
				</Button>
			</Group>
			<Stack>
				{posts.map((post) => (
					<Card
						key={post._id}
						shadow='sm'
						p='lg'
						component={Link}
						to={`/${collectionName}/post/${post.file_name}`}
					>
						<Group justify='space-between' mb={5}>
							<Text fw={500}>{post.title}</Text>
							<Text size='sm' c='dimmed'>
								{new Date(post.createdAt).toLocaleDateString()}
							</Text>
						</Group>
						<Text size='sm' c='dimmed' lineClamp={2}>
							{post.content}
						</Text>
					</Card>
				))}
			</Stack>
		</Container>
	)
}
