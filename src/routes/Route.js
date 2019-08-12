// em vez de utilizar o Route do react-router-dom, criaremos o proprio
// componente Route

import React from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';

// importação dos layouts para serem utilizados em cada página específica
import AuthLayout from '~/pages/_layouts/auth';
import DefaultLayout from '~/pages/_layouts/default';

import store from '~/store';

// destructuring das props passadas pelo Route no index.js:
// -> component renomeado para Component, pois com o C maiusculo pode ser
// rendereizado como um componente e não como tag jsx
// -> isPrivate para definir se rota será privada
// -> ...rest pega todas as outras propriedades (ex path, exact)
export default function RouteWrapper({
    component: Component,
    isPrivate,
    ...rest
}) {
    // pega o auth.signed do redux
    const { signed } = store.getState().auth;

    // usuário nao estiver logado e rota for privada, redireciona home
    if (!signed && isPrivate) {
        return <Redirect to="/" />;
    }
    // usuário estiver logado e quiser acessar rota pública não faz sentido
    // então redireciona pra dashboard
    if (signed && !isPrivate) {
        return <Redirect to="/dashboard" />;
    }

    // define quando aplicar cada layout
    const Layout = signed ? DefaultLayout : AuthLayout;

    // caso esteja logado e queira ir pra uma rota privada retorna o próprio
    // route do react-router-dom, com as propriedades que já vieram (...rest)
    // e essa rota já renderiza o componente passado por parâmetro aplicando
    // o estilo definido previamente em cada Layout (Default e Auth Layout)
    return (
        <Route
            {...rest}
            render={props => (
                <Layout>
                    <Component {...props} />
                </Layout>
            )}
        />
    );
}

RouteWrapper.propTypes = {
    isPrivate: PropTypes.bool,
    // como o componente pode ser class ou func, passamos oneOfType
    component: PropTypes.oneOfType([PropTypes.element, PropTypes.func])
        .isRequired,
};

// as que não são obrigatórias vem pro default
RouteWrapper.defaultProps = {
    isPrivate: false,
};
