import { Link } from 'react-router'
import React from 'react'
import { Outlet } from 'react-router'

const Error = () => {
  return (
    <div>
        <h1>Oops! Something went wrong.</h1>
        <h3>Go to the <Link to="/login">Login</Link></h3>
        <Outlet/>
    </div>
  )
}

export default Error