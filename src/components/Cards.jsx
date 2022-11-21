import React from 'react'
import { Card } from './Card'

export const Cards = ({todos}) => {
  return (todos.map((todo)=>(
    <Card key={todo.ID} todo={todo}/>
  ))
  )
}
