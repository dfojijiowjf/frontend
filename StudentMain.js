import React, {
    useState, useEffect, useContext
} from 'react'
import { useNavigate } from 'react-router-dom'
import './StudentMain.css'
import { UserContext } from '../../../App'

const studentInfo = (access_token) => {
    return fetch('http://127.0.0.1:3001/home/student_info', {
        method: "GET",
        headers: {
            "Authorization": "Bearer " + access_token
        }
    }).then(resp => resp.json())
}

const submitPreferences = (access_token, subjectId,options, background) => {
    return fetch('http://127.0.0.1:3001/home/prefs', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + access_token
        },
        body: JSON.stringify({
            options: options,
            background: background,
            subjectId:subjectId
        })
    }).then(resp => resp.json())
}


const StudentMain = () => {
    const navigate = useNavigate()
    const { user } = useContext(UserContext)

    const [selectedSubject, setSelectedSubject] = useState("Subject")
    const [subjects, setSubjects] = useState(null)
    const [groups, setGroups] = useState(null)
    const [subjectIdToOptions, setSubjectIdToOptions] = useState(null)
    const [selectedSubjectOptions, setSelectedSubjectOptions] = useState([])
    const [background,setBackground] = useState("")
    const [selectedOptions,setSelectedOptions] = useState(null)
    const [refresh,setRefresh] = useState(false)
    const [enrolled,setEnrolled] = useState([])

    const handleSubmit = () => {
        var options = []
        const x = Object.keys(selectedOptions)
        for(var i=0;i<x.length;i++) {
            const key = x[i]
            if(selectedOptions[key] == 1 || selectedOptions[key] == true) {
                options.push(key)
            }
        }
        submitPreferences(user.access_token,selectedSubject,options,background).then(resp => {
            if (resp.msg == "success") {
                alert("Success")
                const newSubject = {subjectId:selectedSubject,subjectName:resp.subjectName}
                setEnrolled([newSubject,...enrolled])
                const newSubjects = subjects.filter(sub => {
                    if(sub.subjectId == selectedSubject) {
                        return false
                    } else {
                        return true
                    }
                })
                setSubjects(newSubjects)
                
                Object.keys(selectedOptions).forEach(key => {
                    selectedOptions[key] = false;
                  });
                setRefresh(!refresh)
            } else {
                alert("Error")
                console.log(resp)
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
            studentInfo(user.access_token).then(resp => {
                if (resp.msg == "success") {
                     if (resp.enrolled_subjects.length != 0) {
                        setEnrolled(resp.enrolled_subjects)
                    }
                    if (resp.subjects != 0) {
                        setSubjects(resp.subjects)
                        setSelectedSubjectOptions(JSON.parse((resp.subjects)[0].options))
                        setSelectedSubject((resp.subjects)[0].subjectId)
                        const opts = {}
                        const allOptions = new Set()
                        resp.subjects.map(sub => {
                            opts[sub.subjectId] = sub.options

                            const x = JSON.parse(sub.options)
                            for (var i = 0; i < x.length; i++) {
                                allOptions.add(x[i])
                            }
                        })
                        setSubjectIdToOptions(opts)

                        const opts2 = {}
                        for (const item of allOptions) {
                            opts2[item] = false
                        }

                        setSelectedOptions(opts2)
                    }
                    if (resp.groups != 0) {
                        setGroups(resp.groups)
                    }
                    if (resp.members != 0) {
                        setMembers(resp.members)
                    }
                } else {
                    alert("Error")
                    console.log(resp)
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
                    <div className='main-head'>
                        <h1>What are you interested in?</h1>
                        <input className="main-search" placeholder='Search...' />
                    </div>
                    <div className='main-topic'>
                        <div className='main-topic-choices'>
                            <h3>Select Subject:</h3>
                            <div className='main-choices'>
                                <select value={selectedSubject} onChange={(e) => {
                                    const sub = e.target.value
                                    setSelectedSubject(sub)
                                    setSelectedSubjectOptions(JSON.parse(subjectIdToOptions[sub]))

                                    Object.keys(selectedOptions).forEach(key => {
                                        selectedOptions[key] = false;
                                      });
                                    setRefresh(!refresh)
                                }}>
                                    {subjects == null || subjects.length == 0 ? null : subjects.map(sub => {
                                        return (
                                            <option key={sub.subjectId} value={sub.subjectId}>{sub.subjectName}</option>
                                        )
                                    })}
                                </select>
                            </div>
                        </div>
                        <div className='main-topic-choices'>
                            <h3>Choose your topic preference:</h3>
                            <div className='main-choices'>
                                {selectedSubjectOptions.map((s,index) => {
                                    return (
                                        <label key={index}>
                                            <input checked={selectedOptions[s]} onChange={() => {
                                                selectedOptions[s] = !selectedOptions[s]
                                                setRefresh(!refresh)
                                            }} type={'checkbox'} />
                                            {s}
                                        </label>
                                    )
                                })}
                            </div>
                        </div>
                        <div className='main-topic-choices'>
                            <h3>Enter your background:</h3>
                            <div className='main-choices'>
                                <label>
                                    <input type={'checkbox'} checked={background == "Civil" ? true : false} onChange={() => {
                                        setBackground(background == "Civil" ? "" : "Civil")
                                    }}/>
                                    Civil
                                </label>
                                <label>
                                    <input type={'checkbox'} checked={background == "Software" ? true : false} onChange={() => {
                                        setBackground(background == "Software" ? "" : "Software")
                                    }}/>
                                    Software
                                </label>
                                <label>
                                    <input type={'checkbox'} checked={background == "Mechanical" ? true : false} onChange={() => {
                                        setBackground(background == "Mechanical" ? "" : "Mechanical")
                                    }}/>
                                    Mechanical
                                </label>
                            </div>
                        </div>
                        <button className='submit' onClick={handleSubmit}>
                            <p className='submit-text'>Submit</p>
                        </button>
                    </div>
                    <div className='enrolled'>
                        <h1>Enrolled Subjects</h1>
                        <div className='enrolled-scroll'>
                            {enrolled.map(en => {
                                return (
                                    <div className='enrolled-subject' key={en.subjectId}>
                                        <p>{en.subjectName}</p>
                                    </div>
                                )
                            })}
                        </div>                        
                    </div>
                    <div>
                        <h1>Groups</h1>
                        {groups == null ? null : groups.map(group => {
                            const groupMembers = members[group.groupId]
                            return (
                                <div key={group.groupId} style={{ paddingBottom: '10px' }}>
                                    <div className={showStudents == group.groupId ? 'selected-group' : 'group'}>
                                        <button className='dropdown' onClick={(e) => {
                                            if (showStudents == group.groupId) {
                                                setShowStudents("")
                                            } else {
                                                setShowStudents(group.groupId)
                                            }
                                        }}>
                                            <MdArrowDropDown />
                                        </button>
                                        <p>{group.name}</p>
                                        <p>{group.numStudents} students</p>
                                    </div>
                                    {showStudents != group.groupId ? null :
                                        <div className='group-students'>
                                            {groupMembers == null
                                                ? null
                                                : groupMembers.map(member => {
                                                    return (
                                                        <div key={member.id}>
                                                            <p>{member.name}</p>
                                                        </div>
                                                    )
                                                })
                                            }
                                        </div>
                                    }
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </>
    )
}

export default StudentMain
