import React, {
    useState, useEffect, useContext
} from 'react'
import { useNavigate } from 'react-router-dom'
import './AdminMain.css'
import { UserContext } from '../../../App'

const adminInfo = (access_token) => {
    return fetch('http://127.0.0.1:3001/home/admin_info', {
        method: "GET",
        headers: {
            "Authorization": "Bearer " + access_token
        }
    }).then(resp => resp.json())
}

const setupSubject = (access_token, name, perGroup, options) => {
    return fetch('http://127.0.0.1:3001/home/setupSubject', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + access_token
        },
        body: JSON.stringify({
            subjectName: name,
            perGroup: perGroup,
            options: options
        })
    }).then(resp => resp.json())
}


const AdminMain = () => {
    const navigate = useNavigate()
    const { user } = useContext(UserContext)
    const [subjectName, setSubjectName] = useState("")
    const [subjects,setSubjects] = useState([])
    const [perGroup, setPerGroup] = useState("")
    const [options, setOptions] = useState({})
    const [groups,setGroups] = useState([])
    const optionsArr = ['Option1', 'Option2','Option3','Option4','Option5']

    const handleSetup = () => {
        var subjectOptions = []
        const keys = Object.keys(options)
        for(var i=0;i<keys.length;i++) {
            const k = keys[i]
            if(options[k] == 1 || options[k] == true) {
                subjectOptions.push(k)
            }
        }

        setupSubject(user.access_token, subjectName, perGroup, subjectOptions).then(resp => {
            if (resp.msg == "success") {
                const newSubject = {subjectName:subjectName,studentsPerGroup:perGroup,options:JSON.stringify(subjectOptions)}
                setSubjects([newSubject,...subjects])
            } else {
                alert("Error")
            }
        }).catch(error => {
            alert("Error")
            console.log(error)
        })
    }

    useEffect(() => {
        if (user == null) {
            navigate('/')
        } else {
            adminInfo(user.access_token).then(resp => {
                if (resp.msg == "success") {
                    setSubjects(resp.subjects)
                } else {
                    alert("Error")
                }
              }).catch(error => {
                alert("Error")
                console.log(error)
              })
        }
    }, [])

    return (
        <>
            <div className='main-section'>
                <div className='main-container'>
                    <div className='admin-subjects-holder'>
                        <h1>Subjects</h1>
                        <div className='subject-scroll' >
                            {subjects.map((subject,index) => {
                                const options = JSON.parse(subject.options)
                                return (
                                    <div key={index} className="individual-subjects">
                                        <h3>Subject: {subject.subjectName} - {subject.studentsPerGroup} students per group</h3>
                                    </div>
                                )
                            })}
                        </div> 
                    </div>
                    <div className='main-section-holder'>
                        <div className='main-head'>
                            <h1>Subject Setup</h1>
                        </div>
                        <div className='main-topic'>
                            <div className='main-input'>
                                <p>Subject Name: </p>
                                <input value={subjectName} onChange={(e) => setSubjectName(e.target.value)} />
                            </div>
                            <div className='main-input'>
                                <p>Topic Options: </p>
                                <div className='admin-options'>
                                    {optionsArr.map(opt => {
                                        return (
                                            <label key={opt}>
                                                <input type={'checkbox'} onChange={() => {
                                                    if (options[opt] == null) {
                                                        options[opt] = 1
                                                    } else {
                                                        options[opt] = !options[opt]
                                                    }
                                                }} />
                                                {opt}
                                            </label>
                                        )
                                    })}
                                </div>
                            </div>
                            <div className='main-input'>
                                <p>Students per group: </p>
                                <input value={perGroup} onChange={(e) => setPerGroup(e.target.value)} />
                            </div>
                            <button className='submit' onClick={handleSetup}>
                                <p className='submit-text'>Submit</p>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AdminMain