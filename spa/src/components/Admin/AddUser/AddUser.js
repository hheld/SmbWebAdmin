import React, {Component} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import {addUser} from './addUserActions';
import {checkIfUserNameIsTaken} from '../../../utils/apiHelpers';

// component part #####################################################################################################
export class AddUser extends Component {
    constructor(props) {
        super(props);

        this.addUser = this.addUser.bind(this);
        this.checkUserNameAvailability = this.checkUserNameAvailability.bind(this);

        this.state = {
            pwd: '',
            pwd_verify: '',
            nameAvailable: true,
            userName: ''
        };
    }

    addUser() {
        const {userName} = this.state;

        const {
            firstName: {value: firstName},
            lastName: {value: lastName},
            email: {value: email},
            roles: {value: roles}
        } = this.refs;

        this.props.addUser({
            UserName: userName,
            FirstName: firstName,
            LastName: lastName,
            Email: email,
            Roles: roles.split(',').map((r) => {
                return r.trim();
            })
        }, this.state.pwd);
    }

    checkUserNameAvailability(e) {
        const userName = e.target.value;

        this.setState({
            userName: userName
        });

        this.props.checkIfUserNameIsTaken(userName)
            .then((taken) => {
                this.setState({nameAvailable: !taken});
            })
            .catch(() => {
                this.setState({nameAvailable: true});
            });
    }

    render() {
        const {pwd, pwd_verify, nameAvailable, userName} = this.state;
        const pwdsMatch = pwd === pwd_verify;

        const pwdMismatchWarning = pwdsMatch
            ? null
            : <p className="text-danger">Passwords don't match</p>
        ;

        const addBtn = !pwdMismatchWarning && pwd !== '' && nameAvailable && userName !== ''
            ? <button className="btn btn-warning" type="button" onClick={this.addUser}>Add user</button>
            : null
        ;

        const nameTakenWarning = nameAvailable
            ? null
            : <p className="text-danger">User name is already taken</p>
        ;

        return (
            <div>
                <h3>New user information</h3>
                <form>
                    {nameTakenWarning}
                    <div className="form-group">
                        <label>User name</label>
                        <input type="text" className="form-control" value={userName}
                               onChange={this.checkUserNameAvailability}/>
                    </div>
                    <div className="form-group">
                        <label>First name</label>
                        <input type="text" className="form-control" ref="firstName"/>
                    </div>
                    <div className="form-group">
                        <label>Last name</label>
                        <input type="text" className="form-control" ref="lastName"/>
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input type="email" className="form-control" ref="email"/>
                    </div>
                    <div className="form-group">
                        <label>Roles</label>
                        <input type="text" className="form-control" ref="roles"/>
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input type="password" className="form-control" value={pwd} onChange={(e) => {
                            this.setState({pwd: e.target.value});
                        }}/>
                    </div>
                    <div className="form-group">
                        <label>Type password again</label>
                        <input type="password" className="form-control" value={pwd_verify} onChange={(e) => {
                            this.setState({pwd_verify: e.target.value});
                        }}/>
                    </div>
                    {addBtn}
                    {pwdMismatchWarning}
                </form>
            </div>
        );
    }
}

AddUser.propTypes = {
    addUser: PropTypes.func.isRequired,
    checkIfUserNameIsTaken: PropTypes.func.isRequired
};

// container part #####################################################################################################
function mapStateToProps(state) {
    return {};
}

function mapDispatchToProps(dispatch) {
    return {
        addUser: (user) => {
            dispatch(addUser(user));
        },
        checkIfUserNameIsTaken: (userName) => {
            return checkIfUserNameIsTaken(userName)
                .then((res) => {
                    const user = JSON.parse(res.text);
                    return user.UserName === userName;
                });
        }
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(AddUser);
