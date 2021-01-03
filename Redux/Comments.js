import * as ActionTypes from './ActionTypes';

export const comments = (state = { errMess: null, comments:[]}, action) => {
  switch (action.type) {
    case ActionTypes.ADD_COMMENTS:
      return {...state, errMess: null, comments: action.payload};

    case ActionTypes.COMMENTS_FAILED:
      return {...state, errMess: action.payload};

    case ActionTypes.ADD_COMMENT:{
      const id= state.comments.length
      action.payload["id"]=id
      return { ...state, errMess: null, comments:[...state.comments, action.payload]};
    }

    default:
      return state;
  }
};
