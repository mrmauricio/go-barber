import { takeLatest, call, put, all } from 'redux-saga/effects';
import { toast } from 'react-toastify';

import api from '~/services/api';

import { updateProfileFailure, updateProfileSuccess } from './actions';

export function* updateProfile({ payload }) {
    try {
        const { name, email, ...rest } = payload.data;

        // object assign serve para unir dois objetos. no caso, verificamos se
        // o usuário preencheu o oldPassword, e caso sim, une o nome e email com
        // as informações de senha (old, pass, new). caso não, pois talvez ele
        // não queira alterar a senha, une com um objeto vazio, continuando igual
        const profile = Object.assign(
            { name, email },
            rest.oldPassword ? rest : {}
        );

        const response = yield call(api.put, 'users', profile);

        toast.success('Perfil atualizado com sucesso!');

        // chama a action SUCCESS passando os novos dados atualizados, que vieram
        // de resposta do PUT. então, esses setão atualizados no front-end
        yield put(updateProfileSuccess(response.data));
    } catch (err) {
        toast.error('Erro ao atualizar perfil, confira seus dados!');
        yield put(updateProfileFailure());
    }
}

export default all([takeLatest('@user/UPDATE_PROFILE_REQUEST', updateProfile)]);
