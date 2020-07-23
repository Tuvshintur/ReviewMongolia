import { combineReducers } from 'redux';
import { authReducer, AuthStoreState } from './auth';

export interface StoreState {
    auth: AuthStoreState;
}

export const reducers = combineReducers<StoreState>({ auth: authReducer });
