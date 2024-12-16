import React from 'react'
import { MantineProvider } from '@mantine/core'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AppShell } from './components/AppShell'
import { BlogList } from './components/BlogList'
import { CreatePost } from './components/CreatePost'
import { ViewPost } from './components/ViewPost'
import { CollectionsList } from './components/CollectionsList'
import '@mantine/core/styles.css'

export default function App() {
	return (
		<MantineProvider>
			<Router>
				<AppShell>
					<Routes>
						<Route path='/' element={<CollectionsList />} />
						<Route
							path='/collection/:collectionName'
							element={<BlogList />}
						/>
						<Route
							path='/collection/:collectionName/create'
							element={<CreatePost />}
						/>
						<Route
							path='/:collectionName/post/:id'
							element={<ViewPost />}
						/>
					</Routes>
				</AppShell>
			</Router>
		</MantineProvider>
	)
}
