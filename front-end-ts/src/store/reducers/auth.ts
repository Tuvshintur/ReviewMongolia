import { Action, ActionTypes } from '../actions';

export interface AuthStoreState {
    userId: String;
    token: String;
    message: String;
    loading: Boolean;
}

const initState: AuthStoreState = {
    userId: '',
    token: '',
    message: '',
    loading: false,
};

const loginStart = (state: AuthStoreState, action: Action) => {
    return updateObject(state, { loading: true });
};

const loginSuccess = (state: AuthStoreState, action: Action) => {
    const { token, userId, message } = action.payload;

    return updateObject(state, {
        loading: false,
        token: token,
        userId: userId,
        message: message,
    });
};

const loginFailed = (state: AuthStoreState, action: Action) => {
    const { message } = action.payload;
    return updateObject(state, { loading: false, message: message });
};

const updateObject = (oldObject: AuthStoreState, updatedProperties: {}): AuthStoreState => {
    return {
        ...oldObject,
        ...updatedProperties,
    };
};

export const authReducer = (state: AuthStoreState = initState, action: Action): AuthStoreState => {
    switch (+action.type) {
        case ActionTypes.loginStart:
            return loginStart(state, action);
        case ActionTypes.loginSuccess:
            return loginSuccess(state, action);
        case ActionTypes.loginFailed:
            return loginFailed(state, action);
        default:
            return state;
    }
};
