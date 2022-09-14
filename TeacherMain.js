import React, {
    useState, useEffect, useContext
} from 'react'
import { useNavigate } from 'react-router-dom'
import './TeacherMain.css'
import { UserContext } from '../../../App'

const teacherInfo = (access_token) => {
    return fetch('http://127.0.0.1:3001/home/teacher_info', {
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


const TeacherMain = () => {
    const navigate = useNavigate()
    const { user } = useContext(UserContext)
    const [subjectName, setSubjectName] = useState("")
    const [subjects,setSubjects] = useState([])
    const [perGroup, setPerGroup] = useState("")
    const [options, setOptions] = useState({})
    const [groups,setGroups] = useState([])
    const optionsArr = ['Option1', 'Option2','Option3','Option4','Option5']

    useEffect(() => {
        if (user == null) {
            navigate('/')
        } else {
            teacherInfo(user.access_token).then(resp => {
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
    }, [user])

    return (
        <>
            <div className='main-section'>
                <div className='main-container'>
                    <div className='admin-subjects-holder'>
                        <h1>Subjects</h1>
                        <div className='subject-scroll' >
                            {subjects.map((subject,index) => {
                                return (
                                    <button key={index} className="individual-subject-btn" onClick={() => {
                                        navigate(`/teacher_home/subject?subjectId=${subject.subjectId}&subjectName=${subject.subjectName}`)
                                    }}>
                                        <h3>Subject: {subject.subjectName} - {subject.studentsPerGroup} students per group</h3>
                                    </button>
                                )
                            })}
                        </div> 
                    </div>
                    <div className='main-section-holder'>
                        
                    </div>
                </div>
            </div>
        </>
    )
}

export default TeacherMain