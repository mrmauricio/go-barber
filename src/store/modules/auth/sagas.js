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

        // axios adiciona por padrão o header em todas as requisições daqui
        // em diante, sempre que o usuário fizer login. caso ele já esteja
        // logado, esse token será adicionado ao header pelo saga que está
        // ligado ao REHYDRATE do redux-persist
        api.defaults.headers.Authorization = `Bearer ${token}`;

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

// redux-persist só deixa o conteúdo da aplicação ser exebido em tela depois
// de recuperar os dados (REHYDRATE), então o token sempre estará presente

// como esse saga não terá nada assíncrono, não precisa ser function*
export function setToken({ payload }) {
    // esse payload é o que tem as informações persistidas (auth, user). ele
    // será null a primeira vez que o usuário entrar no app. nas próximas, por
    // mais que ele não faça login, as informações já estarão no localStorage
    if (!payload) return;

    // caso o usuário já tenha logado anteriormente e está retornando, no
    // momento de REHYDRATE (buscar os dados persistidos no localStorage),
    // como o token de sessão existirá, então será adicionado ao header das
    // futuras requests.
    const { token } = payload.auth;

    if (token) {
        // axios adiciona por padrão o header em todas as requisições daqui
        // em diante: token jwt do usuário logado
        api.defaults.headers.Authorization = `Bearer ${token}`;
    }
}

// sempre que houver o dispatch da action em questão, o takeLatest pega a
// ultima chamada (caso clique 2x, só a 2ª vai) e executa o saga signIn
export default all([
    takeLatest('persist/REHYDRATE', setToken),
    takeLatest('@auth/SIGN_IN_REQUEST', signIn),
    takeLatest('@auth/SIGN_UP_REQUEST', signUp),
]);
