import React from 'react';
import PropTypes from 'prop-types';

import { Wrapper } from './styles';

// a prop children carrega todos os componentes que estiverem dentro do
// componente em questão, ex: <AuthLayout> <Teste> </AuthLayout>
export default function AuthLayout({ children }) {
    return <Wrapper>{children}</Wrapper>;
}

// se passa o componente assim: <AuthLayout/>, ele é um element. no caso
// das rotas privadas que recebiam o componente asim {AuthLayout}, este
// era passado em seu formato original, ou seja, função ou classe
AuthLayout.propTypes = {
    children: PropTypes.element.isRequired,
};
