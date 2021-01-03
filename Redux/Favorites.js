import * as ActionTypes from './ActionTypes'

export const favorites = (state = [], action) => {
    switch (action.type) {
        case ActionTypes.ADD_FAVORITE:
            return  [...state, action.payload] 
        case ActionTypes.DELETE_FAVORITE:
            return state.filter(dishId => dishId !== action.payload)

        default:
            return state;
    }
};