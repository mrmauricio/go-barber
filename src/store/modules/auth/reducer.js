import produce from 'immer';

const INITIAL_STATE = {
    token: null,
    signed: false,
    loading: false,
};

export default function auth(state = INITIAL_STATE, action) {
    return produce(state, draft => {
        switch (action.type) {
            // no momento que a request é feita, o saga começa a processar a
            // parte async enquanto aqui no reducer o loading passa a ser true
            case '@auth/SIGN_IN_REQUEST': {
                draft.loading = true;
                break;
            }
            case '@auth/SIGN_IN_SUCCESS': {
                draft.token = action.payload.token;
                draft.signed = true;
                draft.loading = false;
                break;
            }
            case '@auth/SIGN_UP_REQUEST': {
                draft.loading = true;
                break;
            }
            case '@auth/SIGN_UP_SUCCESS': {
                draft.loading = false;
                break;
            }
            case '@auth/SIGN_FAILURE': {
                draft.loading = false;
                break;
            }
            default:
        }
    });
}
