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

export default (state, action) => {
  switch (action.type) {
    case GET_TASKS:
      return {
        ...state,
        tasks: action.payload,
        loading: false
      };
    case GET_TASK:
      return {
        ...state,
        task: action.payload,
        loading: false
      };
    case CREATE_TASK:
      return {
        ...state,
        tasks: [action.payload, ...state.tasks],
        loading: false
      };
    case DELETE_TASK:
      return {
        ...state,
        task: null,
        loading: false
      }
    case UPDATE_TASK:
      return {
        ...state,
        task: action.payload,
        loading: false
      }
    case SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false
      }
    case CLEAR_STATE:
      return {
        task: {},
        tasks: [],
        loading: false,
        error: null
      }
    case SET_LOADING:
      return {
        ...state,
        loading: true
        }
      default:
        return state;
  }
};
