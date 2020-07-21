import axios from '../../utils/axios';
import { Dispatch } from 'redux';
import { ActionTypes, LoginInput } from '../actions';
import { AuthState } from '../reducers/auth';

export interface LoginStartAction {
    type: ActionTypes.loginStart;
    payload: AuthState;
}

export interface LoginSuccessAction {
    type: ActionTypes.loginSuccess;
    payload: AuthState;
}

export interface LoginFailedAction {
    type: ActionTypes.loginFailed;
    payload: AuthState;
}

export const LoginUser = (loginInput: LoginInput) => {
    return async (dispatch: Dispatch) => {
        const response = await axios.post<AuthState>('', loginInput, {
            headers: {
                'Content-type': 'application/json',
            },
        });

        dispatch<LoginSuccessAction>({
            type: ActionTypes.loginSuccess,
            payload: response.data,
        });
    };
};
