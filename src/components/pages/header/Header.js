import React,{useEffect, useState} from 'react'
import { Link } from 'react-router-dom'
import './Header.css'

function Header() {
  const [loggedIn,setLoggedIn] = useState(false)
  const {user,setUser} = useContext(UserContext)

  useEffect(() => {
    if(user != null) {
      setLoggedIn(true)
    } else {
      setLoggedIn(false)
    }
  },[user])

  const handleLogout = (e) => {
    e.preventDefault()
    localStorage.removeItem("access_token")
    localStorage.removeItem("type")
    setUser(null)
  }

  return (
    <>
      <div className='header'>
        <div className='header inner'>
          <h1 id="logoText">UTS</h1>
          {loggedIn == true ? <button className='logout' onClick={handleLogout}>Logout</button> : null}
        </div>
      </div>
    </>
  )
}

export default Header
