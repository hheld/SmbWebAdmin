import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

export default function requiresAuth(Component, options) {
    class AuthenticatedComponent extends React.Component {
        componentDidMount() {
            this._checkAndRedirect();
        }

        componentDidUpdate() {
            this._checkAndRedirect();
        }

        _checkAndRedirect() {
            const { redirect, user, isAuthenticating } = this.props;
            const { redirectTo }  = options;

            if (!user && !isAuthenticating && redirectTo) {
                redirect(redirectTo);
            }
        }

        render() {
            const { user, isAuthenticating } = this.props;
            const { role } = options;
            const userHasRequiredRole = user && user.Roles.indexOf(role)!==-1;
            
            return (
                <div className="authenticated">
                    { user && !isAuthenticating && userHasRequiredRole ? <Component {...this.props} /> : null }
                </div>
            );
        }
    }

    AuthenticatedComponent.propTypes = {
        user: PropTypes.object,
        isAuthenticating: PropTypes.bool.isRequired,
        redirect: PropTypes.func.isRequired
    };

    const mapStateToProps = (state) => {
        return {
            user: state.user.currentUser,
            isAuthenticating: state.user.authenticating
        };
    };
    
    const mapDispatchToProps = (dispatch) => {
        return {
            redirect: (path) => { dispatch(push(path || '/login')); }
        };
    };

    return connect(mapStateToProps, mapDispatchToProps)(AuthenticatedComponent);
}
