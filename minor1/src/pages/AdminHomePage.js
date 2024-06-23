import React from 'react'
import Navbar from '../features/navbar/Navbar'

import AdminCourseList from '../features/admin/components/AdminCourseList'
import Sidebar from '../features/sidebar/Sidebar'

function AdminHomePage() {
  return (
    <>
     <Navbar>
        <Sidebar>
        <AdminCourseList/>
        </Sidebar>
    </Navbar>
    </>
  )
}

export default AdminHomePage