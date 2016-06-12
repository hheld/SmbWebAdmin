import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './style.css';

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import { loginUser } from '../../auth/authActions';

// component part #####################################################################################################
export class LoginComponent extends React.Component {
    constructor(props) {
        super(props);
        
        this.login = this.login.bind(this);
    }
    
    login() {
        const userName = this.refs.userNameInput.value;
        const pwd = this.refs.pwdInput.value;

        this.props.login(userName, pwd);
    }

    render() {
        const { authenticating, currentUser } = this.props;
        const isLoggedIn = currentUser ? true : false;

        if (isLoggedIn) {
            return null;
        }

        if (authenticating) {
            return (
                <p>Getting user information ...</p>
            );
        }

        return (
            <div className="formContainer container-fluid well">
                <form>
                    <div className="form-group">
                        <label>User name</label>
                        <input type="text" className="form-control" placeholder="User name" ref="userNameInput" />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input type="password" className="form-control" placeholder="Password" ref="pwdInput" />
                    </div>
                    <button type="button" className="btn btn-default" onClick={this.login}>Login</button>
                </form>
            </div>
        );
    }
}

LoginComponent.propTypes = {
    login: PropTypes.func.isRequired,
    authenticating: PropTypes.bool.isRequired,
    currentUser: PropTypes.object
};

// container part #####################################################################################################

function mapStateToProps(state) {
    return {
        currentUser: state.user.currentUser || null,
        authenticating: state.user.authenticating
    };
}

function mapDispatchToProps(dispatch) {
    return {
        login: (userName, pwd) => { dispatch(loginUser(userName, pwd)); }
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginComponent);
