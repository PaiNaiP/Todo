import React from 'react'
import { useState } from 'react'
import { collection, addDoc, query, where, getDocs } from "firebase/firestore"; 
import { db, storage } from '../config/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useNavigate } from 'react-router-dom';

export const Add = () => {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [dateOfEnd, setDateOfEnd] = useState('')
    const [file, setFile] = useState('')
    const [error, setError] = useState('')
    
    const navigate = useNavigate();
/**
 * Добавляет файл, проверяет заполнены ли заголовок и дата окончания задачи.
 * Проверяет есть ли такие же заголовки в базе и заполнены ли вложения.
 * Если есть вложения, то они добавляются в хранилище, после всех проверок они добавляются в бд.
 */
  const handleAdd = async() =>{
    let duplicat = []
    if(dateOfEnd===""||title==="")
        setError('Заполните обязательные поля')
    else{
        const q = query(collection(db, "todos"), where("title", "==", title));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            duplicat.push(doc.id)
        });
        if(duplicat.length===0){
            if(file){
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
                    await addDoc(collection(db, "todos"), {
                    title: title,
                    description: description,
                    dateOfEnd: dateOfEnd,
                    file:downloadURL,
                    check:true
                    }).then((docRef)=>{
                    console.log("Document written with ID: ", docRef.id);
                    navigate('/')
                    }).catch((e)=>{
                    console.error("Error adding document: ", e);
                    })
                });
                
                }
            );
            }
            else{
                await addDoc(collection(db, "todos"), {
                    title: title,
                    description: description,
                    dateOfEnd: dateOfEnd,
                    file:file,
                    check:true
                    }).then((docRef)=>{
                    console.log("Document written with ID: ", docRef.id);
                    navigate('/')
                    }).catch((e)=>{
                    console.error("Error adding document: ", e);
                })
            
            }
        }
        else
        setError('Такой заголовок уже есть')
        
    }
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
        <div>
            <p>Добавьте файл</p>
            <input type="file" placeholder='Файл' onChange={(e)=>{setFile(e.target.files[0])}} accept=".jpg, .jpeg, .png .txt"/>  
        </div>
        {error&&(
            <div className='error-cont'>
                <p>{error}</p>
            </div>
        )}
        <button onClick={handleAdd} className='add-todo-btn'>Добавить заметку</button>
    </div>
    </div>
  )
}
