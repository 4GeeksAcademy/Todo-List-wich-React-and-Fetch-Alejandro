import React, { useState, useEffect } from "react";

const Todolist = () => {
    const [tareas, setTareas] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [hoveredIndex, setHoveredIndex] = useState(-1);

    const USER_API_URL = 'https://playground.4geeks.com/todo/users/alejandro99'
    const TODOS_API_URL = 'https://playground.4geeks.com/todo/todos/alejandro99'

    // Cargar tareas iniciales desde la API
    useEffect(() => {
        fetch(USER_API_URL)
            .then(response => response.json())
            .then(data => setTareas(data.todos || []))
            .catch(error => console.error('Error al cargar tareas:', error));
    }, []);

    // Agregar una nueva tarea
    const agregarTarea = () => {
        if (inputValue.trim() !== '') {
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    label: inputValue,
                    is_done: false
                })
            };
            fetch(TODOS_API_URL, requestOptions)
                .then(response => response.json())
                .then(data => {
                    setTareas(prevTareas => [...prevTareas, data]);
                    setInputValue('');
                })
                .catch(error => console.error('Error al agregar tarea:', error));
        }
    };

    // Eliminar una tarea específica
    const eliminarTarea = (id) => {
        const requestOptions = {
            method: "DELETE",
            redirect: "follow"
        };
        fetch(`https://playground.4geeks.com/todo/todos/${id}`, requestOptions)
            .then(response => {
                if (response.ok) {
                    setTareas(prevTareas => prevTareas.filter(tarea => tarea.id !== id));
                } else {
                    console.error('Error al eliminar tarea');
                }
            })
            .catch(error => console.error('Error al eliminar tarea:', error));
    };

    // Eliminar todas las tareas
    const eliminarTodasLasTareas = () => {
        const requestOptions = {
            method: "DELETE",
            redirect: "follow"
        };
        Promise.all(tareas.map(tarea =>
            fetch(`https://playground.4geeks.com/todo/todos/${tarea.id}`, requestOptions)
        ))
            .then(() => setTareas([]))
            .catch(error => console.error('Error al eliminar todas las tareas:', error));
    };

    return (
        <>
            <p className="h1 text-center">Tareas pendientes:</p>
            <div className="container">
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") { agregarTarea(); }
                    }}
                    placeholder="¿Qué harás hoy?"
                />
                <div className="list-group mt-3">
                    {tareas.length > 0 ? tareas.map((tarea, index) => (
                        <li
                            key={tarea.id}
                            className="list-group-item"
                            onMouseEnter={() => setHoveredIndex(index)}
                            onMouseLeave={() => setHoveredIndex(-1)}
                        >
                            <div className="relative-container">
                                {tarea.label}
                                {hoveredIndex === index &&
                                    <span
                                        className="absolute-close"
                                        onClick={() => eliminarTarea(tarea.id)}
                                    >
                                        X
                                    </span>
                                }
                            </div>
                        </li>
                    )) :
                        <li className="list-group-item">No hay tareas</li>
                    }
                </div>
                <p className="container paper mt-3">Total de tareas: {tareas.length}</p>
                <div className="text-center my-3">
                    <button onClick={eliminarTodasLasTareas} className="btn btn-danger mt-2">
                        Eliminar todas las tareas
                    </button>
                </div>
            </div>
        </>
    );
};

export default Todolist;