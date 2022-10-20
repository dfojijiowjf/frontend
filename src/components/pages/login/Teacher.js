import React, {
    useState,useContext,useEffect
} from 'react'
import './Teacher.css'
import { UserContext } from '../../../App'
import { useNavigate } from 'react-router-dom'
const login = (username,password) => {
    return fetch('http://127.0.0.1:3001/authentication/teacher_login',{
        method:"POST",
        headers: {
            "Content-Type":"application/json"
        },
        body:JSON.stringify({
            username:username,
            password:password
        })
    }).then(resp => resp.json())
}

function Teacher() {
    const navigate = useNavigate()
    const {user,setUser} = useContext(UserContext)
    const [username,setUsername] = useState("")
    const [password,setPassword] = useState("")

    const handleClick = () => {
        if(username.trim() == "") {
            alert("Missing username")
        } else if(password.trim() == "") {
            alert("Missing password")
        } else {
            login(username,password).then(resp => {
                if(resp.msg == "success") {
                    setUser({access_token:resp.access_token,type:"teacher"})
                    localStorage.setItem("access_token",resp.access_token)
                    localStorage.setItem("type","teacher")
                    navigate('/teacher_home')
                } else {
                    alert("Incorrect Username/Password")
                }
            }).catch(error => {
                alert("Error")
                console.log(error)
            })
        }
    }


    useEffect(() => {
        console.log(user)
        if(user != null && user.type == "teacher") {
            navigate("/teacher_home")
        }
    },[user])


    return (
        <>
            <div className={'home__hero-section'}>
                <div className='container'>
                    <div className='login-holder'>
                        <h2>Teacher Login</h2>
                        <div className='input-holder'>
                            <p>Username</p>
                            <input placeholder="Username" className="input" type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
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

export default Teacher