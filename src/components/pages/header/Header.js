import React,{useEffect, useState} from 'react'
import { Link } from 'react-router-dom'
import './Header.css'

function Header() {

  return (
    <>
      <div className='header'>
        <div className='header inner'>
          <h1 id="logoText">UTS</h1>
        </div>
      </div>
    </>
  )
}

export default Header