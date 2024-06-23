import React from 'react'
import Sidebar from '../features/sidebar/Sidebar'
import UserProfile from '../features/user/components/UserProfile'
import Navbar from '../features/navbar/Navbar'

function UserProfilePage() {
  return (
    <Navbar>
    <Sidebar>
        <UserProfile/>
    </Sidebar>
</Navbar>
  )
}

export default UserProfilePage