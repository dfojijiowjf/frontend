import React, {
    useState, useEffect, useContext
} from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import './Subject.css'
import { UserContext } from '../../../App'
import { MdArrowDropDown } from 'react-icons/md'

const subjectInfo = (access_token, subjectId) => {
    return fetch('http://127.0.0.1:3001/home/subject_info/' + subjectId, {
        method: "GET",
        headers: {
            "Authorization": "Bearer " + access_token
        }
    }).then(resp => resp.json())
}

const automaticAssign = (access_token, subjectId) => {
    return fetch('http://127.0.0.1:3001/home/automaticAssign/' + subjectId, {
        method: "GET",
        headers: {
            "Authorization": "Bearer " + access_token
        }
    }).then(resp => resp.json())
}

const manualAssign = (access_token, subjectId, studentId, groupId, groupName) => {
    return fetch('http://127.0.0.1:3001/home/manualAssign', {
        method: "POST",
        headers: {
            "Authorization": "Bearer " + access_token,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            subjectId: subjectId,
            studentId: studentId,
            groupId: groupId,
            groupName: groupName
        })
    }).then(resp => resp.json())
}

const addGroup = (access_token, subjectId, groupName) => {
    return fetch(`http://127.0.0.1:3001/home/addGroup/${subjectId}/${groupName}`, {
        method: "GET",
        headers: {
            "Authorization": "Bearer " + access_token,
        }
    }).then(resp => resp.json())
}

const Subject = () => {
    const navigate = useNavigate()
    const [searchParams, setSearchParams] = useSearchParams()
    const [subjectId, setSubjectId] = useState(searchParams.get("subjectId"))
    const [subjectName, setSubjectName] = useState(searchParams.get("subjectName"))
    const { user } = useContext(UserContext)
    const [students, setStudents] = useState(null)
    const [groups, setGroups] = useState(null)
    const [selectedTab, setSelectedTab] = useState("first")
    const [groupName, setGroupName] = useState("")
    const [showAdd, setShowAdd] = useState(false)
    const [showStudents, setShowStudents] = useState("")
    const [selectedAssignedGroup, setSelectedAssignedGroup] = useState("")
    const [showAssign, setShowAssign] = useState("")
    const [showAssignName, setShowAssignName] = useState("")
    const [idToName, setIdToName] = useState(null)
    const [members, setMembers] = useState(null)

    useEffect(() => {
        if (user == null) {
            navigate('/')
        } else if (subjectId != null) {
            subjectInfo(user.access_token, subjectId).then(resp => {
                if (resp.msg == "success") {
                    const grps = resp.groups
                    setStudents(resp.students)
                    setGroups(grps)
                    setMembers(resp.members)
                    var x = {}
                    for (var i = 0; i < grps.length; i++) {
                        const group = grps[i]
                        x[group.groupId] = group.name
                    }
                    setIdToName(x)
                    console.log(resp.members)
                } else {
                    alert("Error")
                }
            }).catch(error => {
                alert("Error")
                console.log(error)
            })
        }
    }, [user, subjectId])

    const handleAssign = (e) => {
        e.preventDefault()
        automaticAssign(user.access_token, subjectId, groupName).then(resp => {
            if (resp.msg == "success") {
                console.log(resp)
            } else {
                alert("Error")
            }
        }).catch(error => {
            alert("Error")
            console.log(error)
        })
    }

    const handleAssignManual = (e) => {
        e.preventDefault()
        const groupName = idToName[selectedAssignedGroup]
        manualAssign(user.access_token, subjectId, showAssign, selectedAssignedGroup, groupName).then(resp => {
            if (resp.msg == "success") {
                const newStudents = students.map(student => {
                    if(student.studentId == showAssign) {
                        student.groupName = groupName
                    }
                    return student
                })
                setStudents(newStudents)
                const val = members[selectedAssignedGroup]
                const stuVal = {id:showAssign,name:showAssignName}
                const newMembers = JSON.parse(JSON.stringify(members))
                if(val == null) {
                    newMembers[selectedAssignedGroup] = [stuVal] 
                }  else {
                    newMembers[selectedAssignedGroup] = [stuVal,...val] 
                }
                setMembers(null)
                setMembers(newMembers)

                const newGroups = groups.map(group => {
                    if(selectedAssignedGroup == group.groupId) {
                        group.numStudents += 1
                    }
                    return group
                })
                setGroups(newGroups)
            } else {
                alert("Error")
            }
        }).catch(error => {
            alert("Error")
            console.log(error)
        })
    }

    const handleAdd = (e) => {
        e.preventDefault()
        if (groupName == "") {
            alert("Must enter group name")
        } else {
            addGroup(user.access_token, subjectId, groupName).then(resp => {
                if (resp.msg == "success") {
                    const newGroup = { name: groupName, groupId: resp.groupId, numStudents: 0 }
                    setShowAdd(false)
                    setGroups([newGroup, ...groups])
                    idToName[resp.groupId] = groupName
                } else {
                    alert("Error")
                }
            }).catch(error => {
                alert("Error")
                console.log(error)
            })
        }
    }

    return (
        <>
            <div className='main-section'>
                <div className='main-container'>
                    <div className='admin-subjects-holder'>
                        <h1>{subjectName}</h1>
                    </div>
                    <div className='tabs'>
                        <div style={{ display: 'flex' }}>
                            <li onClick={() => setSelectedTab("first")} className={selectedTab == "first" ? "tab-selected" : "tab"}>
                                Students
                            </li>
                            <li onClick={() => setSelectedTab("second")} className={selectedTab == "second" ? "tab-selected" : "tab"}>
                                Groups
                            </li>
                        </div>
                        <div>
                            <button onClick={handleAssign} className='add-group'>Automatically Assign Students</button>
                            <button onClick={() => {
                                setShowAdd(!showAdd)
                            }} className='add-group'>+ Group</button>
                        </div>
                    </div>
                    {selectedTab != "first" ? null :
                        <div className='students'>
                            <div className='students-header'>
                                <p className='t'></p>
                                <p className='t'>Name</p>
                                <p className='t'>StudentID</p>
                                <p className='t'>Background</p>
                                <p className='t'>Group</p>
                            </div>
                            {students == null ? null : students.map(student => {
                                return (
                                    <div className='student' key={student.studentId}>
                                        {student.groupName != null ?
                                            <div className='t' />
                                            :
                                            <div className='t'>
                                                <button onClick={(e) => {
                                                    e.preventDefault()
                                                    setShowAssign(student.studentId)
                                                    setShowAssignName(student.name)
                                                    setSelectedAssignedGroup(groups[0].groupId)
                                                }} className='t'>Assign Group</button>
                                                {showAssign != student.studentId ? null :
                                                    <div>
                                                        <div className='main-choices'>
                                                            <select value={selectedAssignedGroup} onChange={(e) => {
                                                                setSelectedAssignedGroup(e.target.value)
                                                            }}>
                                                                {groups == null || groups.length == 0 ? null : groups.map(group => {
                                                                    return (
                                                                        <option key={group.groupId} value={group.groupId}>{group.name}</option>
                                                                    )
                                                                })}
                                                            </select>
                                                        </div>
                                                        <button onClick={handleAssignManual}>Assign</button>
                                                    </div>
                                                }
                                            </div>
                                        }
                                        <p className='t'>{student.name}</p>
                                        <p className='t'>{student.studentId}</p>
                                        <p className='t'>{student.background}</p>
                                        <p className='t'>{student.groupName == null ? "N/A" : student.groupName}</p>
                                    </div>
                                )
                            })}
                        </div>
                    }
                    {selectedTab != "second" ? null :
                        <div className='students'>
                            {showAdd == false ? false :
                                <div className='add-group-in'>
                                    <input placeholder='Group Name' value={groupName} onChange={(e) => setGroupName(e.target.value)} />
                                    <button className='submit-group' onClick={handleAdd}>Submit</button>
                                </div>
                            }
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
                    }
                </div>
            </div>
        </>
    )
}

export default Subject