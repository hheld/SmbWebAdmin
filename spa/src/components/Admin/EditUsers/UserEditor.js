import '../../../../node_modules/bootstrap/dist/css/bootstrap.min.css';

import React, {Component} from 'react';
import PropTypes from 'prop-types';

class UserEditor extends Component {
    constructor(props) {
        super(props);

        this.updateUser = this.updateUser.bind(this);
        this.deleteUser = this.deleteUser.bind(this);

        this.state = {
            user: this.props.user
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            user: nextProps.user
        });
    }


    onUserPropChanged(e, userProp) {
        let updatedValue = {};
        updatedValue[userProp] = userProp !== 'Roles' ? e.target.value : e.target.value.split(',').map((r) => {
            return r.trim();
        });

        this.setState({
            user: Object.assign({}, this.state.user, updatedValue)
        });
    }

    updateUser() {
        if (this.props.user !== this.state.user) {
            this.props.updateUser(this.props.user, this.state.user);
        }
    }

    deleteUser() {
        this.props.deleteUser(this.props.user.UserName);
    }

    render() {
        const {user} = this.state;

        return (
            <div>
                <h3>Edit user information</h3>
                <form>
                    <div className="form-group">
                        <label>User name</label>
                        <input type="text" className="form-control" value={user.UserName} readOnly/>
                    </div>
                    <div className="form-group">
                        <label>First name</label>
                        <input type="text" className="form-control" value={user.FirstName} onChange={(e) => {
                            this.onUserPropChanged(e, 'FirstName');
                        }}/>
                    </div>
                    <div className="form-group">
                        <label>Last name</label>
                        <input type="text" className="form-control" value={user.LastName} onChange={(e) => {
                            this.onUserPropChanged(e, 'LastName');
                        }}/>
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input type="email" className="form-control" value={user.Email} onChange={(e) => {
                            this.onUserPropChanged(e, 'Email');
                        }}/>
                    </div>
                    <div className="form-group">
                        <label>Roles</label>
                        <input type="text" className="form-control" value={user.Roles.join(',')} onChange={(e) => {
                            this.onUserPropChanged(e, 'Roles');
                        }}/>
                    </div>
                    <div className="btn-toolbar">
                        <div className="btn-group">
                            <button className="btn btn-warning" type="button" onClick={this.updateUser}>Update user
                            </button>
                        </div>
                        <div className="btn-group">
                            <button className="btn btn-danger" type="button" onClick={this.deleteUser}>Delete user
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        );
    }
}

UserEditor.propTypes = {
    user: PropTypes.shape({
        UserName: PropTypes.string.isRequired,
        FirstName: PropTypes.string.isRequired,
        LastName: PropTypes.string.isRequired,
        Email: PropTypes.string.isRequired,
        Roles: PropTypes.arrayOf(PropTypes.string).isRequired
    }).isRequired,
    updateUser: PropTypes.func.isRequired,
    deleteUser: PropTypes.func.isRequired
};

export default UserEditor;