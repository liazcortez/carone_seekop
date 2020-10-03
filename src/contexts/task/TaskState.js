import React, { useReducer } from 'react';
import TaskContext from './taskContext';
import TaskReducer from './taskReducer';
import api from '../../api/api';
import { 
  GET_TASKS, 
  CREATE_TASK, 
  GET_TASK, 
  DELETE_TASK, 
  UPDATE_TASK, 
  SET_ERROR,
  CLEAR_STATE,
  SET_LOADING
 } from '../types';

const TaskState = props => {
  const initialState = {
    tasks: [],
    task: {},
    loading: false,
    error: null
  };

  const [state, dispatch] = useReducer(TaskReducer, initialState);

  //Get Tasks
  const getTasks = async () => {
    setLoading();
    try {
      const res = await api.get(`/tasks`);
      dispatch({ type: GET_TASKS, payload: res.data.data });
    } catch (err) {
      dispatch({ type: SET_ERROR, payload: err.response.data})

    }
  };

   //Get Task
   const getTask = async (taskId) => {
    clearState();
    setLoading();
    try {
      const res = await api.get(`/tasks/${taskId}`);
      dispatch({ type: GET_TASK, payload: res.data.data });
    } catch (err) {
      dispatch({ type: SET_ERROR, payload: err.response.data})
    }
  };

  //Create Task
  const createTask = async (task) => {

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    };
    setLoading();
    try {
      const res = await api.post(`/tasks`, { ...task }, config);
      dispatch({ type: CREATE_TASK, payload: res.data.data });
    } catch (err) {
      dispatch({ type: SET_ERROR, payload: err.response.data})

    }
  }

   //Delete Task
   const deleteTask = async (taskId) => {
    const config =  {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    };
    clearState();
    setLoading();
    try {
      
      const res = await api.delete(`/tasks/${taskId}`, config);
      dispatch({ type: DELETE_TASK, payload: res.data.data })
    } catch (err) {
      dispatch({ type: SET_ERROR, payload: err.response.data})

    }
  };

  //Update Task
  const updateTask = async (task, taskId) => {
    const config =  {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    };
    setLoading();
    try {
      const res = await api.put(`/tasks/${taskId}`, {...task} ,config);
      dispatch({ type: UPDATE_TASK, payload: res.data.data })
    } catch (err) {
      dispatch({ type: SET_ERROR, payload: err.response.data})

    }
  };

  //Clear State
  const clearState = () => dispatch({ type: CLEAR_STATE });

  //Set Loading
  const setLoading = () => dispatch({ type: SET_LOADING });

  return (
    <TaskContext.Provider
      value={{
        loading: state.loading,
        tasks: state.tasks,
        task: state.task,
        error: state.error,
        getTasks,
        getTask,
        createTask,
        deleteTask,
        updateTask,
        clearState,
        setLoading
      }}
    >
      {props.children}
    </TaskContext.Provider>
  );
};

export default TaskState;
