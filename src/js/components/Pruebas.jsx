import React, {useState} from "react";
 
const Pruebas = () => {

    function cargarTareas() {
        console.log('cargarTareas')
        fetch('https://playground.4geeks.com/todo/users/alejandro99')
        .then( (response) => response.json())
        .then( (data) => console.log(data.todos))
    }

    function agregarTareas() {
        console.log('agregarTareas')
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                "label": "tarea desde react",
                "is_done": false
              })
        };
        fetch('https://playground.4geeks.com/todo/todos/alejandro99', requestOptions)
        .then( (response) => response.json())
        .then( (data) => console.log(data))
    }

    function eliminarTarea() {
        console.log('eliminarTarea')
        const requestOptions = {
            method: "DELETE",
            redirect: "follow"
          };
          
          fetch("https://playground.4geeks.com/todo/todos/30", requestOptions)
            .then((response) => response.text())
            .then((result) => console.log(result))
    }

    return (
        <>
            <h1>pruebas</h1>
            <button onClick={cargarTareas}>Cargar Tareas</button>
            <button onClick={agregarTareas}>Agregar Tarera</button>
            <button onClick={eliminarTarea}>Eliminar Tarea</button>
        </>
    )
 }


 export default Pruebas;