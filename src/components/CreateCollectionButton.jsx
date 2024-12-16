import { useState } from 'react'
import { Modal, Button, TextInput, Stack } from '@mantine/core'
import { IconPlus } from '@tabler/icons-react'

const API_BASE_URL = 'http://localhost:3000/api'  // Changed this line to include full URL

export function CreateCollectionButton({ onCollectionCreate }) {
	const [isOpen, setIsOpen] = useState(false)
	const [collectionName, setCollectionName] = useState('')

	const handleSubmit = async (e) => {
		e.preventDefault()
		try {
			const response = await fetch(`${API_BASE_URL}/collections`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ name: collectionName }),
			})

			if (!response.ok) {
				throw new Error('Failed to create collection')
			}

			onCollectionCreate?.(collectionName)
			setCollectionName('')
			setIsOpen(false)
		} catch (error) {
			console.error('Failed to create collection:', error)
		}
	}

	return (
		<>
			<Button
				onClick={() => setIsOpen(true)}
				leftSection={<IconPlus size={20} />}
			>
				New Collection
			</Button>

			<Modal
				opened={isOpen}
				onClose={() => setIsOpen(false)}
				title='Create New Collection'
			>
				<form onSubmit={handleSubmit}>
					<Stack>
						<TextInput
							label='Collection Name'
							placeholder='Enter collection name'
							value={collectionName}
							onChange={(e) => setCollectionName(e.target.value)}
							required
						/>
						<Button type='submit'>Create Collection</Button>
					</Stack>
				</form>
			</Modal>
		</>
	)
}
