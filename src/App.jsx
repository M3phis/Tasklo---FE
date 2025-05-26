import { useEffect, useState } from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom'
import { AppHeader } from './cmps/AppHeader'
import { AppFooter } from './cmps/AppFooter'
import { HomePage } from './pages/HomePage'
import { AboutPage } from './pages/AboutPage'
import { CarIndex } from './pages/CarIndex'
import { CarDetails } from './pages/CarDetails'
import { CarEdit } from './pages/CarEdit'
import { BoardIndex } from './pages/BoardIndex'
import { BoardDetails } from './pages/BoardDetails'
import { BoardEdit } from './pages/BoardEdit'
import { store } from './store/store'
import { Provider } from 'react-redux'
import './assets/styles/main.css'
import './assets/styles/board.css'

export function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="app">
          <AppHeader />
          <main className="container">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/car" element={<CarIndex />} />
              <Route path="/car/:carId" element={<CarDetails />} />
              <Route path="/car/edit/:carId" element={<CarEdit />} />
              <Route path="/board" element={<BoardIndex />} />
              <Route path="/board/:boardId" element={<BoardDetails />} />
              <Route path="/board/edit/:boardId" element={<BoardEdit />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
          <AppFooter />
        </div>
      </Router>
    </Provider>
  )
}
