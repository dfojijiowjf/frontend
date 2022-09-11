import './App.css';
import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Header from './components/pages/header/Header';
import Admin from './components/pages/login/Admin';
import Student from './components/pages/login/Student';
import Home from './components/pages/home/Home';
import Footer from './components/pages/footer/Footer';
import StudentMain from './components/pages/main/StudentMain';
import NoMatch from './components/NoMatch';
import AdminMain from './components/pages/main/AdminMain';
import Teacher from './components/pages/login/Teacher';
import TeacherMain from './components/pages/main/TeacherMain';
import Subject from './components/pages/subject/Subject';

const loading = (access_token,type) => {
  const url = type == 'student' ? 'loading_student' : type == 'admin' ? 'loading_admin' : 'loading_teacher'
  return fetch(`http://127.0.0.1:3001/authentication/${url}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization":"Bearer " + access_token
    }
  }).then(resp => resp.json())
}

export const UserContext = React.createContext()
const App = () => {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const access_token = localStorage.getItem("access_token")
    const type = localStorage.getItem("type")

    if(access_token != null) {
      loading(access_token,type).then(resp => {
        if (resp.msg == "success") {
          localStorage.setItem("access_token", resp.access_token)
          setUser({access_token:resp.access_token,type:resp.type,name:resp.name})
        } 
      }).catch(error => {
        alert("Error")
        console.log(error)
      })
    }
  }, [])

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path='/' exact element={<Home />} />
          <Route path='/admin' exact element={<Admin />} />
          <Route path='/student' exact element={<Student />} />
          <Route path='/teacher' exact element={<Teacher/>} />
          <Route path='/student_home' exact element={<StudentMain />} />
          <Route path='/admin_home' exact element={<AdminMain />} />
          <Route path='/teacher_home' exact element={<TeacherMain />} />
          <Route path='/teacher_home/subject' exact element={<Subject />} />
          <Route path="*" exact element={<NoMatch />}/>
        </Routes>
        <Footer />
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
