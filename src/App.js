import React from 'react';
import { ToastContainer } from 'react-toastify';
// o PersistGate recebe como parâmetro o persistor, e executa assim que o
// store for carregado para buscar as informações no localStorage
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';

import './config/ReactotronConfig';

import Routes from './routes';
import history from './services/history';

// esse deve vir após a importação do reactotron para ter acesso
import { store, persistor } from './store';

import GlobalStyle from './styles/global';

function App() {
    return (
        <Provider store={store}>
            <PersistGate persistor={persistor}>
                <Router history={history}>
                    <Routes />
                    <GlobalStyle />
                    <ToastContainer autoclose={3000} />
                </Router>
            </PersistGate>
        </Provider>
    );
}

export default App;
