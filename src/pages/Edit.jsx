import React from 'react'
import { useState } from 'react'
import { doc, getDoc, updateDoc } from "firebase/firestore"; 
import { db, storage } from '../config/firebase';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { AiFillFile, AiOutlineClose } from 'react-icons/ai'

export const Edit = () => {
    const navigate = useNavigate()
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [dateOfEnd, setDateOfEnd] = useState('')
    const [file, setFile] = useState('')
    const [error, setError] = useState('')
    const [files, setFiles] = useState('')
    const [idTodos, setIdTodos] = useState('')
    const [check, setCheck] = useState('')

    let { id } = useParams();
    useEffect(() => {
        setIdTodos(id)
        handleView()
    }, [])

    /**
     * Выводит данные из бд в поля для ввода
     */
    const handleView = async()=>{
        const docRef = doc(db, "todos", id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
            setTitle(docSnap.data().title)
            setDescription(docSnap.data().description)
            setDateOfEnd(docSnap.data().dateOfEnd)
            setFile(docSnap.data().file)
            setFiles(docSnap.data().file)
            setCheck(docSnap.data().check)
        } else {
            console.log("No such document!");
        }
    }

    /**
     * Обновляет данные в бд, если прикрепляется новый файл в процессе изменения
     * документа, то он добавляется в хранилище
     */
    const handleUpdate = async() =>{
        const todoRef = doc(db, "todos", idTodos);
        if(dateOfEnd===""||title==="")
            setError('Заполните обязательные поля')
        else{
            if(file&&!files){
            const storageRef = ref(storage, file.name);
            const uploadTask = uploadBytesResumable(storageRef, file);
            uploadTask.on('state_changed', 
            (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
            }, 
            (error) => {
            console.log(error)
            }, 
            () => {
            getDownloadURL(uploadTask.snapshot.ref).then(async(downloadURL) => {
                await updateDoc(todoRef, {
                    title: title,
                    description: description,
                    dateOfEnd: dateOfEnd,
                    file:downloadURL,
                    check:check
                }).then(()=>{
                navigate('/')
                }).catch((e)=>{
                console.error("Error adding document: ", e);
                })
            });
            }
        );
        }
        else{
            await updateDoc(todoRef, {
                title: title,
                description: description,
                dateOfEnd: dateOfEnd,
                file:file,
                check:check
            }).then(()=>{
                navigate('/')
                }).catch((e)=>{
                console.error("Error adding document: ", e);
            })
        
        }
    }
}

/**
 * Удаляет прикреплённый файл, при скрытии файла, он также удаляется
 * и из хранилища
 */

const handleDeleteFile = async()=>{
    const desertRef = ref(storage, file);
    deleteObject(desertRef).then(() => {
        setFile('')
        setFiles('')      
    }).catch((error) => {
        console.log(error)
        setFile('')
        setFiles('') 
    });

}


  return (
    <div className="cont">
    <div className='add-cont'>
        <div>
            <div className='cont-alert'>Введите заголовок<p className='alert'>*</p></div>
            <input type="text" placeholder='Заголовок' onChange={(e)=>{setTitle(e.target.value)}} value={title}/>
        </div>
        <div>
            <p>Введите описание</p>
            <input type="text" placeholder='Описание' onChange={(e)=>{setDescription(e.target.value)}} value={description}/>
        </div>
        <div>
            <div className='cont-alert'>Введите дату окончания<p className='alert'>*</p></div>
            <input type="date" placeholder='Дата окончания' onChange={(e)=>{setDateOfEnd(e.target.value)}} value={dateOfEnd}/>
        </div>
            {file&&(
                <div className='file-del'>
                <AiFillFile/>
                <a href={file}>Добавленный файл</a>
                <AiOutlineClose className='cross' onClick={handleDeleteFile}/>
                </div>
            )}
            {!file&&(
            <div>
            <p>Добавьте файл</p>
            <input type="file" placeholder='Файл' onChange={(e)=>{setFile(e.target.files[0])}} accept=".jpg, .jpeg, .png .txt"/>  
            </div>
            )}
        {error&&(
            <div className='error-cont'>
                <p>{error}</p>
            </div>
        )}
        <button onClick={handleUpdate} className='add-todo-btn'>Обновить заметку</button>
    </div>
    </div>
  )
}
