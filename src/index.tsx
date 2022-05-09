import ReactDOM from 'react-dom/client';
import MyRouter from './router';
import reportWebVitals from './reportWebVitals';
import 'antd/dist/antd.less';
import {Provider} from 'react-redux';
import {PersistGate} from "redux-persist/integration/react";
import {persistor} from "./store";
import store from "./store";

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(
    // <Provider store={store}>
    //     <PersistGate loading={null} persistor={persistor}>
    //         <MyRouter />
    //     </PersistGate>
    // </Provider>
    <MyRouter/>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
