import {persistStore, persistReducer} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
// 引入createStore对象
import { createStore } from 'redux'
// 引入reducer
import reducer from './reducer'

const persistConfig = {
    key: 'root',
    storage: storage,
    blacklist: []
};

const myPersistReducer = persistReducer(persistConfig, reducer)

const store = createStore(reducer);

export const persistor = persistStore(store);
export default store;