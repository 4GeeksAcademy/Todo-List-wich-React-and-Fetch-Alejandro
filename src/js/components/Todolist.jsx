import React, { useState, useEffect } from "react";

const Todolist = () => {
    const [tareas, setTareas] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [hoveredIndex, setHoveredIndex] = useState(-1);

    // URL de la API (reemplaza "usuario" con el nombre de usuario deseado)
    const API_URL = 'https://playground.4geeks.com/todo/users/alejandro99'

    // Cargar tareas del servidor al montar el componente
    useEffect(() => {
        fetch(API_URL, { method: "GET" })
            .then(resp => {
                if (!resp.ok) throw new Error('Error al cargar las tareas');
                return resp.json();
            })
            .then(data => {
                setTareas(data); // Actualiza el estado con las tareas del servidor
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }, []); // Dependencias vacías: solo se ejecuta al montar el componente

    // Función para sincronizar las tareas con el servidor
    const sincronizarTareas = (nuevasTareas) => {
        fetch(API_URL, {
            method: "PUT",
            body: JSON.stringify(nuevasTareas),
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(resp => {
                if (!resp.ok) throw new Error('Error al sincronizar las tareas');
                return resp.json();
            })
            .then(data => {
                console.log('Tareas sincronizadas:', data);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    };

    const agregarTarea = () => {
        if (inputValue.trim() !== '') {
            const nuevasTareas = [...tareas, inputValue];
            setTareas(nuevasTareas);
            setInputValue("");
            sincronizarTareas(nuevasTareas); // Sincroniza con el servidor
        }
    };

    const eliminarTarea = (index) => {
        const nuevasTareas = tareas.filter((_, i) => i !== index);
        setTareas(nuevasTareas);
        sincronizarTareas(nuevasTareas); // Sincroniza con el servidor
    };

    // Nueva función para limpiar todas las tareas
    const limpiarTareas = () => {
        fetch(API_URL, { method: "DELETE" })
            .then(resp => {
                if (!resp.ok) throw new Error('Error al eliminar las tareas');
                setTareas([]); // Vacía la lista en el frontend
            })
            .catch(error => {
                console.error('Error:', error);
            });
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
                <div className="list-group">
                    {tareas.length > 0 ? tareas.map((item, index) => (
                        <li
                            key={index}
                            className="list-group-item"
                            onMouseEnter={() => setHoveredIndex(index)}
                            onMouseLeave={() => setHoveredIndex(-1)}
                        >
                            <div className="relative-container">
                                {item}
                                {hoveredIndex === index &&
                                    <span
                                        className="absolute-close"
                                        onClick={() => eliminarTarea(index)}
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
                <p className="container paper">Total de tareas: {tareas.length}</p>
                {/* Botón para limpiar todas las tareas */}
                <button onClick={limpiarTareas} className="btn btn-danger mt-3">
                    Limpiar todas las tareas
                </button>
            </div>
        </>
    );
};

export default Todolist;