import { LoginStartAction, LoginSuccessAction, LoginFailedAction } from '../actions';

export interface LoginInput {
    username: String;
    password: String;
}

export interface User {
    userId: String;
    token: String;
}

export type Action = LoginStartAction | LoginFailedAction | LoginSuccessAction;

export enum ActionTypes {
    loginStart,
    loginSuccess,
    loginFailed,
    loginEnd,
}
