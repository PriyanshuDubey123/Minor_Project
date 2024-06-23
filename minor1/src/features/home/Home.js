import React from 'react'
import Sidebar from '../sidebar/Sidebar'
import CourseList from '../course-list/components/CourseList'

function Home() {
  return (
    <Sidebar>
      <CourseList/>
    </Sidebar>
  )
}

export default Home