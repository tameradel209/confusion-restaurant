import {createStore, combineReducers, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import { dishes } from './Dishes';
import { comments } from './Comments';
import { promotions } from './Promotions';
import { leaders } from './Leaders';
import { favorites } from './Favorites';
import { user } from './user';
import { persistStore, persistCombineReducers } from 'redux-persist'
import storage from 'redux-persist/es/storage'

const config = {
    key: 'root',
    storage,
    debug: true,
}

export const ConfigureStore = () => {
    const store = createStore(
        persistCombineReducers(config, {
            dishes,
            comments,
            promotions,
            leaders,
            favorites,
            user
        }),
        applyMiddleware(thunk)
    );
    
    const persistor = persistStore(store)

    return { persistor, store};
}