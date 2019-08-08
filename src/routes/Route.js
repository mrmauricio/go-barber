// em vez de utilizar o Route do react-router-dom, criaremos o proprio
// componente Route
import React from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';

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
    const signed = false;

    // usuário nao estiver logado e rota for privada, redireciona home
    if (!signed && isPrivate) {
        return <Redirect to="/" />;
    }
    // usuário estiver logado e quiser acessar rota pública não faz sentido
    // então redireciona pra dashboard
    if (signed && !isPrivate) {
        return <Redirect to="/dashboard" />;
    }

    // caso esteja logado e queira ir pra uma rota privada retorna o próprio
    // route do react-router-dom
    return <Route {...rest} component={Component} />;
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
