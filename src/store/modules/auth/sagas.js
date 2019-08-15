import { takeLatest, call, put, all } from 'redux-saga/effects';
import { toast } from 'react-toastify';

import history from '~/services/history';
import api from '~/services/api';

import { signInSuccess, signUpSuccess, signFailure } from './actions';

// funções são exportadas para facilitar os testes
export function* signIn({ payload }) {
    try {
        const { email, password } = payload;

        // call pois está executando um método que retorna promise, assíncrono
        // primeiro parâmetro é a url que queremos chamar (sessions), e o segundo
        // são os parametros passados
        const response = yield call(api.post, 'sessions', {
            email,
            password,
        });

        // essa rota retornará o user e o token, caso dados passados batam
        const { token, user } = response.data;

        if (!user.provider) {
            toast.error('Usuário nao é prestador');
            return;
        }

        // chama a action de sucesso passando o token e o usuário
        yield put(signInSuccess(token, user));

        // redireciona o usuário logado para a dashboard
        history.push('/dashboard');
    } catch (err) {
        toast.error('Falha na autenticação, verifique seus dados');
        yield put(signFailure());
    }
}

export function* signUp({ payload }) {
    try {
        const { name, email, password } = payload;

        yield call(api.post, 'users', {
            name,
            email,
            password,
            provider: true,
        });

        yield put(signUpSuccess());

        history.push('/');
    } catch (err) {
        toast.error('Falha no cadastro, verifique seus dados!');

        yield put(signFailure());
    }
}

// sempre que houver o dispatch da action em questão, o takeLatest pega a
// ultima chamada (caso clique 2x, só a 2ª vai) e executa o saga signIn
export default all([
    takeLatest('@auth/SIGN_IN_REQUEST', signIn),
    takeLatest('@auth/SIGN_UP_REQUEST', signUp),
]);
