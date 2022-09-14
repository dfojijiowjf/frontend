import React from 'react'
import './Home.css'
import background from '../../background-home.jpg'
import { Link } from 'react-router-dom'

const divStyle = {
    width: '100%',
    height: '90vh',
    backgroundImage: `url(${background})`,
    // backgroundRepeat:'no-repeat',
    // backgroundSize:'cover',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
}

const btnStyle = {
    backgroundColor:'#fff',padding:'15px',borderRadius:'5px',textDecoration:'none',color:'black'
}

const Home = () => {
    return (
        <div style={divStyle}>
            <div className='home-inner'>
                <h1>UTS Class Manager</h1>
                <div className='home-btn-holder'>
                    <Link style={btnStyle} to='/student' >
                        Student
                    </Link>
                </div>
                <div className='home-btn-holder'>
                    <Link style={btnStyle} to='/admin' >
                        <p>Admin</p>
                    </Link>
                </div>
                <div className='home-btn-holder'>
                    <Link style={btnStyle} to='/teacher' >
                        <p>Teacher</p>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default Home