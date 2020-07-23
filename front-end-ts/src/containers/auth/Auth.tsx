import React, { Component } from 'react';
import { connect } from 'react-redux';
import { StoreState } from '../../store/reducers';
import { LoginUser, LoginInput } from '../../store/actions';

interface AuthProps {
    userId: String;
    token: String;
    loading: Boolean;
    message: String;
    LoginUser?: (loginInput: LoginInput) => Promise<void>;
}

interface AuthState {}

class Auth extends Component<AuthProps, AuthState> {
    onClickHandler = () => {
        if (this.props.LoginUser) {
            this.props.LoginUser({ username: 'test@test.com', password: '12345678' });
        }
    };

    render() {
        return (
            <div>
                {this.props.userId} {this.props.token}
                <button onClick={this.onClickHandler}>Login</button>
            </div>
        );
    }
}

const mapStateToProps = ({ auth }: StoreState): AuthProps => {
    return {
        userId: auth.userId,
        token: auth.token,
        loading: auth.loading,
        message: auth.message,
    };
};

const mapDispatchToProps = { LoginUser };

export default connect(mapStateToProps, mapDispatchToProps)(Auth);
