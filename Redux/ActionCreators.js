import * as ActionTypes from './ActionTypes';
import {fetchData} from '../api'
import {comments, dishes, promos, leaders} from '../firebase'

export const login = (user) => async dispatch => {
    dispatch(userIn(user))
    console.log(user)
}

export const logout = () => async dispatch => {
    dispatch(userStateChange())
}

export const fetchComments = (dishId) => async dispatch => {
    dispatch(commentsLoading())
    
    try{
        const commentsData = await comments(dishId)
        dispatch(addComments(commentsData))        
    }catch(err){dispatch(commentsFailed(err.message))}
}

export const fetchDishes = () => async dispatch => {
    dispatch(dishesLoading())

    try{
        const dishesData = await dishes()
        dispatch(addDishes(dishesData))
    }catch(err){dispatch(dishesFailed(err.message))}
}

export const fetchPromos = () => async dispatch => {
    dispatch(promosLoading())

    try{
        const promosData = await promos()
        dispatch(addPromos(promosData))
    }catch(err){dispatch(promosFailed(err.message))}
}

export const fetchLeaders = () => async dispatch => {
    dispatch(leadersLoading())

    try{
        const leadersData = await leaders()
        dispatch(addLeaders(leadersData))
    }catch(err){dispatch(leadersFailed(err.message))}
}


export const userFailed = (err) => ({
    type: ActionTypes.USER_FAILED,
    payload: err
});
export const userIn = (user) => ({
    type: ActionTypes.USER,
    payload: user
});
export const userStateChange = () => ({
    type: ActionTypes.LOGOUT
});

export const commentsLoading = () => ({
    type: ActionTypes.COMMENTS_LOADING
});

export const commentsFailed = (errmess) => ({
    type: ActionTypes.COMMENTS_FAILED,
    payload: errmess
});

export const addComments = (comments) => ({
    type: ActionTypes.ADD_COMMENTS,
    payload: comments
});


export const dishesLoading = () => ({
    type: ActionTypes.DISHES_LOADING
});

export const dishesFailed = (errmess) => ({
    type: ActionTypes.DISHES_FAILED,
    payload: errmess
});

export const addDishes = (dishes) => ({
    type: ActionTypes.ADD_DISHES,
    payload: dishes
});


export const promosLoading = () => ({
    type: ActionTypes.PROMOS_LOADING
});

export const promosFailed = (errmess) => ({
    type: ActionTypes.PROMOS_FAILED,
    payload: errmess
});

export const addPromos = (promos) => ({
    type: ActionTypes.ADD_PROMOS,
    payload: promos
});


export const leadersLoading = () => ({
    type: ActionTypes.LEADERS_LOADING
});

export const leadersFailed = (errmess) => ({
    type: ActionTypes.LEADERS_FAILED,
    payload: errmess
});

export const addLeaders = (leaders) => ({
    type: ActionTypes.ADD_LEADERS,
    payload: leaders
});

export const addComment = (comment) => ({
    type:ActionTypes.ADD_COMMENT,
    payload: comment
})

export const postComment = (dishId, rating, comment, author ) => dispatch => {
    const date = new Date()
    const ISODate=date.toISOString()
    const Comment = { 
        "id": null,
        "dishId": dishId,
        "rating": rating, 
        "comment": comment, 
        "author": author, 
        "date": ISODate
    }
    setTimeout(dispatch(addComment(Comment)), 2000)
}

export const addFavorite = (favorite) => ({
    type: ActionTypes.ADD_FAVORITE,
    payload: favorite
})

export const postFavorite = (favorite) => dispatch => {
    dispatch(addFavorite(favorite))
}

export const deleteFavorite = (dishId) => dispatch => {
    dispatch({type: ActionTypes.DELETE_FAVORITE, payload: dishId})
}