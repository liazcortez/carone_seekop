import React, { useReducer } from 'react';
import CommentContext from './commentContext';
import CommentReducer from './commentReducer';
import api from '../../api/api';
import { GET_COMMENTS_BY_LEAD, CREATE_COMMENT, SET_ERROR, GET_COMMENTS_BY_OMSGLOBAL, CLEAR_STATE, GET_COMMENTS_BY_QUESTLEAD } from '../types';

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

  //Get Comments
  const getCommentsByOmsGlobal = async (omsGlobalId) => {
    try {
      const res = await api.get(`/omsGlobals/${omsGlobalId}/comments?sort=-createdAt`);
      dispatch({ type: GET_COMMENTS_BY_OMSGLOBAL, payload: res.data.data });
    } catch (err) {
      dispatch({ type: SET_ERROR, payload: err.response.data})

    }
  };

  //Get Comments
  const getCommentsByQuestLead = async (questLeadId) => {
    try {
      const res = await api.get(`/questLeads/${questLeadId}/comments?sort=-createdAt`);
      dispatch({ type: GET_COMMENTS_BY_QUESTLEAD, payload: res.data.data });
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
      let res;
      if(comment.type === 'lead'){
        res = await api.post(`/leads/${leadId}/comments`, { comment: comment.comment, action: actiones, lead: leadId, type: comment.type }, config);
      }else if(comment.type === 'global'){
        res = await api.post(`/omsGlobals/${leadId}/comments`, { comment: comment.comment, action: actiones, global: leadId, type: comment.type }, config);
      }else{
        res = await api.post(`/questLeads/${leadId}/comments`, { comment: comment.comment, action: actiones, quest: leadId, type: comment.type }, config);

      }
      dispatch({ type: CREATE_COMMENT, payload: res.data.data });
    } catch (err) {
      dispatch({ type: SET_ERROR, payload: err.response.data})

    }
  }

  //Clear State
  const clearState = () => dispatch({ type: CLEAR_STATE });

  return (
    <CommentContext.Provider
      value={{
        loading: state.loading,
        comments: state.comments,
        error: state.error,
        getCommentsByLead,
        createComment,
        getCommentsByOmsGlobal,
        clearState,
        getCommentsByQuestLead
      }}
    >
      {props.children}
    </CommentContext.Provider>
  );
};

export default CommentState;
