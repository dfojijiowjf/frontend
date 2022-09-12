import React, {
    useState,useContext,useEffect
} from 'react'
import './Admin.css'
import { UserContext } from '../../../App'
import { useNavigate } from 'react-router-dom'
const login = (username,password) => {
    return fetch('http://127.0.0.1:3001/authentication/admin_login',{
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

function Admin() {
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
                    setUser({access_token:resp.access_token,type:"admin"})
                    localStorage.setItem("access_token",resp.access_token)
                    localStorage.setItem("type","admin")
                    navigate('/admin_home')
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
        if(user != null && user.type == "admin") {
            navigate("/admin_home")
        }
    },[user])


    return (
        <>
            <div className={'home__hero-section'}>
                <div className='container'>
                    <div className='login-holder'>
                        <h2>Admin Login</h2>
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

export default Admin