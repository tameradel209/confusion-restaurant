import * as ActionTypes from './ActionTypes';

export const user = (state = { isLoading: false,
                                 errMess: null,
                                 user:null}, action) => {
    switch (action.type) {
        case ActionTypes.LOGOUT:
            return {...state, user:null, errMess:null};

        case ActionTypes.USER:
            return {...state, isLoading: false, errMess: null, user: action.payload}

        case ActionTypes.USER_FAILED:
            return {...state, isLoading: false, errMess: action.payload};

        default:
          return state;
      }
};