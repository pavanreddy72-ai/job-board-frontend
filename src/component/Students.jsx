import React, { useEffect, useState } from 'react'
import API from '../api/axios';
const Student = () => {
 const [studentsData,setStudentData] = useState([]);
 useEffect(()=>{
 API.get('students/').then((res)=>{
 setStudentData(res.data);
 console.log(res.data);
 }).catch(error=>console.log(error));
 },[]);
 return (
 <div>
 <h2>Students</h2>
 <ul>
 {studentsData.map(s => (
 <li key={s.id}>{s.name} - {s.email}</li>
 ))}
 </ul>
 </div>
 )
}
export default Student