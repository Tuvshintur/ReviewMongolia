import { combineReducers } from 'redux';
import { authReducer, AuthState } from './auth';

export interface StoreState {
    auth: AuthState;
}

export const reducers = combineReducers<StoreState>({ auth: authReducer });
