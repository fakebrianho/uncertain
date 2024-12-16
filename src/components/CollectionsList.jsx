import { useState, useEffect } from 'react'
import {
	Container,
	Title,
	Group,
	Button,
	Stack,
	Alert,
	Loader,
} from '@mantine/core'
import { useNavigate } from 'react-router-dom'
import { CreateCollectionButton } from './CreateCollectionButton'

export function CollectionsList() {
	const [collections, setCollections] = useState([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)
	const navigate = useNavigate()

	const fetchCollections = async () => {
		try {
			const response = await fetch(
				'http://localhost:3000/api/collections'
			)
			if (!response.ok) {
				throw new Error('Failed to fetch collections')
			}
			const data = await response.json()
			setCollections(data)
		} catch (err) {
			setError(err.message)
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		fetchCollections()
	}, [])

	const handleCollectionClick = (collectionName) => {
		navigate(`/collection/${collectionName}`)
	}

	if (loading) {
		return (
			<Container>
				<Loader />
			</Container>
		)
	}

	if (error) {
		return (
			<Container>
				<Alert color='red' title='Error'>
					{error}
				</Alert>
			</Container>
		)
	}

	return (
		<Container>
			<Group justify='space-between' mb={30}>
				<Title order={1}>Collections</Title>
				<CreateCollectionButton
					onCollectionCreate={(newCollection) => {
						fetchCollections() // Refresh the list when a new collection is created
					}}
				/>
			</Group>
			<Stack>
				{collections.map((collection) => (
					<Button
						key={collection}
						onClick={() => handleCollectionClick(collection)}
						variant='light'
						size='lg'
						fullWidth
					>
						{collection}
					</Button>
				))}
			</Stack>
		</Container>
	)
}
