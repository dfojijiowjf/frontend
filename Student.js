import React, {
    useState,useContext, useEffect
} from 'react'
import { useNavigate } from 'react-router-dom'
import './Student.css'
import { UserContext } from '../../../App'

const login = (student_id,password) => {
    return fetch('http://127.0.0.1:3001/authentication/student_login',{
        method:"POST",
        headers: {
            "Content-Type":"application/json"
        },
        body:JSON.stringify({
            student_id:student_id,
            password:password
        })
    }).then(resp => resp.json())
}

const Student = () => {
    const navigate = useNavigate()
    const {user,setUser} = useContext(UserContext)
    const [username,setUsername] = useState("")
    const [password,setPassword] = useState("")

    const handleClick = () => {
        if(username.trim() == "") {
            alert("Missing Student ID")
        } else if(password.trim() == "") {
            alert("Missing password")
        } else {
            login(username,password).then(resp => {
                if(resp.msg == "success") {
                    setUser({access_token:resp.access_token,type:"student"})
                    localStorage.setItem("access_token",resp.access_token)
                    localStorage.setItem("type","student")
                    navigate('/student_home')
                } else {
                    alert("Incorrect StudentID/Password")
                }
            }).catch(error => {
                alert("Error")
                console.log(error)
            })
        }
    }

    useEffect(() => {
        console.log(user)
        if(user != null && user.type == "student") {
            navigate("/student_home")
        }
    },[user])

    return (
        <>
            <div className={'home__hero-section'}>
                <div className='container'>
                    <div className='login-holder'>
                        <h2>Student Login</h2>
                        <div className='input-holder'>
                            <p>Student ID</p>
                            <input placeholder="Student ID" className="input" type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
                        </div>
                        <div className='input-holder'>
                            <p>Password</p>
                            <input placeholder="Password" className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                        </div>
                    
                        <div className='login-btn-holder'>
                            <button className='login-btn' onClick={handleClick}>
                                <p>Login</p>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Student