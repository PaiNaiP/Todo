import React from 'react'
import { useState } from 'react';
import { useEffect } from 'react';
import {AiFillFile, AiFillEdit, AiFillDelete} from 'react-icons/ai'
import { collection, query, where, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { ref, deleteObject  } from 'firebase/storage'
import { db, storage } from '../config/firebase';
import { useNavigate } from 'react-router-dom';
import dayjs from "dayjs";


export const Card = ({todo}) => {
  const navigate = useNavigate()
  const [files, setFiles] = useState('')
  const [idTodos, setIdTodos] = useState('')
  const [checked, setChecked] = useState(false)
  const [date, setDate] = useState('')

  /**
   * Выводит имя из ссылки storage, передаёт статус заметки и сегоднюшнюю дата
   */
  useEffect(() => {
    var b = todo.file.split('token=')[1];
    setFiles(b)
    handleIdTodo()
    setChecked(!todo.check)
    const now = dayjs(new Date()).format('YYYY-MM-DD')
    setDate(now)
  }, [])

  /**
   * Находит id по имени, чтобы потом передать на страницу изменения
   */
  const handleIdTodo = async()=>{
    const q = query(collection(db, "todos"), where("title", "==", todo.title));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      setIdTodos(doc.id)
    });
  }
  /**
   * Перенаправляет на страницу изменения
   */
  const handleEdit = async() =>{
    navigate(`/edit/${idTodos}`);
  }
  /**
   * Здесь происходит удаление файлов, если есть какие-то вложения,
   * то они также удаляются, если вложения уже удалены, а ссылка осталась,
   * то файл всё равно удалиться
   */
  const handleDelete = async()=>{
    if(todo.file){
      const desertRef = ref(storage, todo.file);
      deleteObject(desertRef).then(async() => {    
        handleDel()
      }).catch(() => {
        handleDel()
      });
    }
    else{
      handleDel()
    }
  }
/**
 * Сама функция удаления, выписанная ниже, дабы не повторять код 
 */
  const handleDel = async()=>{
    await deleteDoc(doc(db, "todos", idTodos)).then(()=>{
      window.location.reload()
    })
  }

  /**
   * Обновляет документ, добавляя, что задача выполнена 
   * или находиться в процессе
   */
  const handleCheck = async()=>{
    setChecked(!checked)
    console.log(checked)
    const todoRef = doc(db, "todos", idTodos);
    await updateDoc(todoRef, {
      title: todo.title,
      description: todo.description,
      dateOfEnd: todo.dateOfEnd,
      file:todo.file,
      check:checked
  })
}

  return (
    <>
    {!checked&&date>todo.dateOfEnd&&(
      <div className='card-red'>
      <h1>{todo.title}</h1>
      <hr/>
      <p>{todo.description}</p>
      <div><input type="checkbox" onChange={handleCheck}/>Закрыть задачу</div>
      <p>{todo.dateOfEnd}</p>
      {todo.file&&(
        <div>
          <AiFillFile/>
          <a href={todo.file}>{files}</a>
        </div>
      )}
      <hr/>
      <div className='btn-cont'>
        <button className='edit-btn' onClick={handleEdit}><AiFillEdit/></button>
        <button className='delete-btn' onClick={handleDelete}><AiFillDelete/></button>
      </div>
    </div>
    )}
    {!checked&&date<todo.dateOfEnd&&(
      <div className='card'>
      <h1>{todo.title}</h1>
      <hr/>
      <p>{todo.description}</p>
      <div><input type="checkbox" onChange={handleCheck}/>Закрыть задачу</div>
      <p>{todo.dateOfEnd}</p>
      {todo.file&&(
        <div>
          <AiFillFile/>
          <a href={todo.file}>{files}</a>
        </div>
      )}
      <hr/>
      <div className='btn-cont'>
        <button className='edit-btn' onClick={handleEdit}><AiFillEdit/></button>
        <button className='delete-btn' onClick={handleDelete}><AiFillDelete/></button>
      </div>
    </div>
    )}
    {checked&&(
      <div className='card-green'>
      <h1>{todo.title}</h1>
      <hr/>
      <p>{todo.description}</p>
      <div style={{textDecoration:'line-through'}}><input type="checkbox" checked onChange={handleCheck}/>Задача закрыта</div>
      <p>{todo.dateOfEnd}</p>
      {todo.file&&(
        <div>
          <AiFillFile/>
          <a href={todo.file}>{files}</a>
        </div>
      )}
      <hr/>
      <div className='btn-cont'>
        <button className='edit-btn' onClick={handleEdit}><AiFillEdit/></button>
        <button className='delete-btn' onClick={handleDelete}><AiFillDelete/></button>
      </div>
    </div>
    )}
    </>
  )
}
