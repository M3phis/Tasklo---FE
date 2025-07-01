import React from 'react'
import { Routes, Route, Navigate } from 'react-router'

import { userService } from './services/user'
import { HomePage } from './pages/HomePage'
import { AboutUs, AboutTeam, AboutVision } from './pages/AboutUs'
import { BoardIndex } from './pages/BoardIndex.jsx'
import { BoardDetails } from './pages/BoardDetails.jsx'
import { ReviewIndex } from './pages/ReviewIndex.jsx'
import { TaskDetails } from './cmps/TaskDetails.jsx'
import { AdminIndex } from './pages/AdminIndex.jsx'

import { UserDetails } from './pages/UserDetails'

import { AppHeader } from './cmps/AppHeader'
import { AppFooter } from './cmps/AppFooter'
import { UserMsg } from './cmps/UserMsg.jsx'
import { LoginSignup } from './pages/LoginSignup.jsx'
import { AuthForm } from './pages/AuthForm.jsx'
import { SignupDetails } from './pages/SignupDetails.jsx'

export function RootCmp() {
  return (
    <div className="main-container">
      <AppHeader />
      <UserMsg />

      <main>
        <Routes>
          <Route path="" element={<HomePage />} />
          <Route path="about" element={<AboutUs />}>
            <Route path="team" element={<AboutTeam />} />
            <Route path="vision" element={<AboutVision />} />
          </Route>

          <Route path="board" element={<BoardIndex />} />
          <Route path="/board/:boardId" element={<BoardDetails />}>
            <Route index element={null} />
            <Route path=":groupId/:taskId" element={<TaskDetails />} />
          </Route>
          <Route path="user/:id" element={<UserDetails />} />
          <Route path="review" element={<ReviewIndex />} />
          <Route
            path="admin"
            element={
              <AuthGuard checkAdmin={true}>
                <AdminIndex />
              </AuthGuard>
            }
          />
          <Route path="login" element={<AuthForm mode="login" />}></Route>
          <Route path="signup" element={<AuthForm mode="signup" />}></Route>
          <Route path="/signup/details" element={<SignupDetails />} />
        </Routes>
      </main>
      <AppFooter />
    </div>
  )
}

function AuthGuard({ children, checkAdmin = false }) {
  const user = userService.getLoggedinUser()
  const isNotAllowed = !user || (checkAdmin && !user.isAdmin)
  if (isNotAllowed) {
    console.log('Not Authenticated!')
    return <Navigate to="/" />
  }
  return children
}
