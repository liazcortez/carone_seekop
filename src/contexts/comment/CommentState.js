import React, { useReducer } from 'react';
import CommentContext from './commentContext';
import CommentReducer from './commentReducer';
import api from '../../api/api';
import { GET_COMMENTS_BY_LEAD, CREATE_COMMENT, SET_ERROR } from '../types';

const CommentState = props => {
  const initialState = {
    comments: [],
    loading: false,
    error: null
  };

  const [state, dispatch] = useReducer(CommentReducer, initialState);

  //Get Comments
  const getCommentsByLead = async (leadId) => {
    try {
      const res = await api.get(`/leads/${leadId}/comments?sort=-createdAt`);
      dispatch({ type: GET_COMMENTS_BY_LEAD, payload: res.data.data });
    } catch (err) {
      dispatch({ type: SET_ERROR, payload: err.response.data})

    }
  };

  //Create Comment
  const createComment = async (comment, leadId) => {

    let actiones = [];
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    };

    try {
      if(comment.actions.mailing){
        actiones.push('mailing')
      }
      if(comment.actions.documentation){
        actiones.push('documentation')
      }
      if(comment.actions.information){
        actiones.push('information')
      }
      if(comment.actions.calling){
        actiones.push('calling')
      }
      const res = await api.post(`/leads/${leadId}/comments`, { comment: comment.comment, action: actiones, lead: leadId }, config);
      dispatch({ type: CREATE_COMMENT, payload: res.data.data });
    } catch (err) {
      dispatch({ type: SET_ERROR, payload: err.response.data})

    }
  }

  return (
    <CommentContext.Provider
      value={{
        loading: state.loading,
        comments: state.comments,
        error: state.error,
        getCommentsByLead,
        createComment
      }}
    >
      {props.children}
    </CommentContext.Provider>
  );
};

export default CommentState;
