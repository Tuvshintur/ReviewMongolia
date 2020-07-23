import axios from '../../utils/axios';
import { Dispatch } from 'redux';
import { ActionTypes, LoginInput } from '../actions';
import { AuthStoreState } from '../reducers/auth';

export interface LoginStartAction {
    type: ActionTypes.loginStart;
    payload: AuthStoreState;
}

export interface LoginSuccessAction {
    type: ActionTypes.loginSuccess;
    payload: AuthStoreState;
}

export interface LoginFailedAction {
    type: ActionTypes.loginFailed;
    payload: AuthStoreState;
}

interface loginResponse {
    data: {
        login: AuthStoreState;
    };
}

export const LoginUser = (loginInput: LoginInput) => {
    return async (dispatch: Dispatch) => {
        dispatch<LoginStartAction>({
            type: ActionTypes.loginStart,
            payload: {
                userId: '',
                token: '',
                message: '',
                loading: true,
            },
        });
        try {
            const graphqlQuery = JSON.stringify({
                query: `{
                    login(email:"${loginInput.username}", password:"${loginInput.password}") {
                        token
                        userId
                    }
                }`,
            });
            const response = await axios.post<loginResponse>('', graphqlQuery, {
                headers: {
                    'Content-type': 'application/json',
                },
            });

            dispatch<LoginSuccessAction>({
                type: ActionTypes.loginSuccess,
                payload: response.data.data.login,
            });
        } catch (err) {
            dispatch<LoginFailedAction>({
                type: ActionTypes.loginFailed,
                payload: {
                    userId: '',
                    token: '',
                    message: err.message,
                    loading: false,
                },
            });
        }
    };
};
