import { Action, ActionTypes } from '../actions';

export interface AuthState {
    userId: String;
    token: String;
    message: String;
    loading: Boolean;
}

const initState: AuthState = {
    userId: '',
    token: '',
    message: '',
    loading: false,
};

const loginStart = (state: AuthState, action: Action) => {
    return updateObject(state, { loading: true });
};

const loginSuccess = (state: AuthState, action: Action) => {
    const { token, userId, message } = action.payload;

    return updateObject(state, {
        loading: false,
        token: token,
        userId: userId,
        message: message,
    });
};

const loginFailed = (state: AuthState, action: Action) => {
    const { message } = action.payload;
    return updateObject(state, { loading: false, message: message });
};

const updateObject = (oldObject: AuthState, updatedProperties: {}): AuthState => {
    return {
        ...oldObject,
        ...updatedProperties,
    };
};

export const authReducer = (state: AuthState = initState, action: Action): AuthState => {
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
