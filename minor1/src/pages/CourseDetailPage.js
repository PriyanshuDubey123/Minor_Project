import React from 'react'
import Navbar from '../features/navbar/Navbar'
import Sidebar from '../features/sidebar/Sidebar'
import CourseDetail from '../features/course-list/components/CourseDetail'

function CourseDetailPage() {
  return (
    <Navbar>
        <Sidebar>
            <CourseDetail/>
        </Sidebar>
    </Navbar>
  )
}

export default CourseDetailPage