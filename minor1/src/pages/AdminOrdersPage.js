import React from 'react'
import Navbar from '../features/navbar/Navbar'
import AdminOrders from '../features/admin/components/AdminOrders'

function AdminOrdersPage() {
  return (
    <>
    <Navbar>
        <AdminOrders/>
    </Navbar>
    </>
  )
}

export default AdminOrdersPage