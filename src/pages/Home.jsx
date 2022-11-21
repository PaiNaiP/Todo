import React from 'react'
import { useNavigate } from "react-router-dom";
import { Cards } from '../components/Cards';
import { collection, getDocs } from "firebase/firestore";
import { useEffect } from 'react';
import { db } from '../config/firebase';
import { useState } from 'react';


export const Home = () => {
    const [todoInfo, setTodoInfo] = useState([])

    const navigate = useNavigate();

    useEffect(() => {
        handleViewTodos()
    }, [])
    /**
     * Выводит все файлы из бд
     */
    const handleViewTodos = async()=>{
        const querySnapshot = await getDocs(collection(db, "todos"));
        const todos = [];
        querySnapshot.forEach((doc) => {
            todos.push(doc.data());
        });
        setTodoInfo(todos)
    }

    /**
     * Переносит на страницу добавления файла
     */
    const handleAddPage = ()=>{
        navigate("/Add");
    }

  return (
    <div className='cont-home'>
        <div className='wrapper'>
            <button onClick={handleAddPage} className='but-nav-add'>Добавить заметку</button>
            <div className='cards-info'>
                <Cards todos={todoInfo}/>
            </div>
        </div>
    </div>
  )
}
