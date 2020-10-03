import { GET_COMMENTS_BY_LEAD, CREATE_COMMENT, SET_ERROR } from '../types';

export default (state, action) => {
  switch (action.type) {
    case GET_COMMENTS_BY_LEAD:
      return {
        ...state,
        comments: action.payload,
        loading: false
      };
    case CREATE_COMMENT:
      return {
        ...state,
        loading: false
      };
    case SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false
      }
    default:
      return state;
  }
};
