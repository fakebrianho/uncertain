const express = require('express')
const cors = require('cors')
const { MongoClient, ObjectId } = require('mongodb')
require('dotenv').config()

const app = express()
const port = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

const uri = process.env.MONGODB_URI
const client = new MongoClient(uri)

async function connectDB() {
	try {
		await client.connect()
		console.log('Connected to MongoDB')
	} catch (error) {
		console.error('MongoDB connection error:', error)
		process.exit(1)
	}
}

connectDB()

const db = client.db('blog-app')
const posts = db.collection('posts')

function getCollection(collectionName) {
	return db.collection(collectionName)
}

// Get all posts from a specified collection
app.get('/api/:collectionName/posts', async (req, res) => {
	// console.log(req.params.collectionName)
	const collectionName = req.params.collectionName
	const collection = getCollection(collectionName)
	try {
		const allPosts = await collection
			.find()
			.sort({ createdAt: -1 })
			.toArray()
		res.json(allPosts)
	} catch (error) {
		res.status(500).json({ error: error.message })
	}
})

// Get a specific post by title from a specified collection
app.get('/api/:collectionName/posts/:title', async (req, res) => {
	const collectionName = req.params.collectionName
	const collection = getCollection(collectionName)
	try {
		const post = await collection.findOne({ file_name: req.params.title })
		if (!post) {
			return res.status(404).json({ error: 'Post not found' })
		}
		res.json(post)
	} catch (error) {
		res.status(500).json({ error: error.message })
	}
})

// Create a post in a specified collection
app.post('/api/:collectionName/posts', async (req, res) => {
	const collectionName = req.params.collectionName
	const collection = getCollection(collectionName)
	try {
		const newPost = {
			...req.body,
			createdAt: new Date(),
			updatedAt: new Date(),
		}
		const result = await collection.insertOne(newPost)
		res.status(201).json({ ...newPost, _id: result.insertedId })
	} catch (error) {
		res.status(500).json({ error: error.message })
	}
})

// Update a post by title in a specified collection
app.patch('/api/:collectionName/posts/title/:title', async (req, res) => {
	const collectionName = req.params.collectionName
	const collection = getCollection(collectionName)
	try {
		console.log('New child to add:', req.body.children)
		const currentDoc = await collection.findOne({
			file_name: req.params.title,
		})
		if (!currentDoc) {
			return res.status(404).json({ error: 'Post not found' })
		}

		let updateOperation = {}
		if (req.body.children) {
			const currentChildren = currentDoc.children
				? currentDoc.children.filter((child) => child !== null)
				: []
			const newChild = req.body.children
			if (!currentChildren.includes(newChild)) {
				currentChildren.push(newChild)
			}
			updateOperation = {
				children: currentChildren,
				num_child_nodes: currentChildren.length,
			}
		} else if (req.body.next) {
			updateOperation = {
				next: req.body.next,
			}
		} else {
			updateOperation = req.body
		}

		console.log('Update operation:', updateOperation)

		const result = await collection.findOneAndUpdate(
			{ file_name: req.params.title },
			{ $set: updateOperation }, // This was the key fix
			{
				returnDocument: 'after',
				new: true,
			}
		)

		console.log('Updated result:', result)
		res.json(result)
	} catch (error) {
		console.error('Server Error:', error)
		res.status(500).json({ error: error.message })
	}
})

// Create a new collection
app.post('/api/collections', async (req, res) => {
	console.log('Received request to create collection')
	console.log('Request body:', req.body)

	const collectionName = req.body.name
	console.log('Collection name:', collectionName)

	if (!collectionName) {
		return res.status(400).json({ error: 'Collection name is required' })
	}

	try {
		// Explicitly create the collection
		await db.createCollection(collectionName)
		console.log('Collection created successfully:', collectionName)

		res.status(201).json({
			message: `Collection ${collectionName} created successfully`,
			collectionName: collectionName,
		})
	} catch (error) {
		console.error('Error creating collection:', error)
		res.status(500).json({
			error: error.message,
			details: 'Failed to create collection',
		})
	}
})

app.listen(port, () => {
	console.log(`Server running on port ${port}`)
})

app.get('/api/collections', async (req, res) => {
	try {
		const collections = await db.listCollections().toArray()
		res.json(collections.map((col) => col.name))
	} catch (error) {
		console.error('Error fetching collections:', error)
		res.status(500).json({ error: error.message })
	}
})
