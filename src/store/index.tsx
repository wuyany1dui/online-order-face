// 引入createStore对象
import { createStore } from 'redux'

// 引入reducer
import reducer from './reducer'

const store = createStore(reducer);

export default store;