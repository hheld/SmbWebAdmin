import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './style.css';

import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux';

import { changeSmbPwd } from './smbPwdChangeActions';

export class SmbPwdChange extends Component {
    constructor(props) {
        super(props);

        this.changePassword = this.changePassword.bind(this);

        this.state = {
            userName: '',
            currentPwd: '',
            newPwd: '',
            newPwdConfirm: ''
        };
    }

    onChange(prop, value) {
        let p = {};
        p[prop] = value;

        this.setState(p);
    }

    changePassword() {
        const { changePwd } = this.props;
        const { userName, currentPwd, newPwd } = this.state;

        changePwd(userName, currentPwd, newPwd);
    }

    render() {
        const { userName, currentPwd, newPwd, newPwdConfirm } = this.state;
        const pwdsMatch = newPwd===newPwdConfirm;
        const { err, success } = this.props;

        const pwdMismatchWarning = pwdsMatch
        ? null
        : <p className="text-danger">Passwords don't match!!</p>
        ;

        const chgPwdBtn = userName!=='' && pwdsMatch && currentPwd!=='' && newPwd!==''
        ? <button type="button" className="btn btn-primary" onClick={this.changePassword}>Change password</button>
        : null
        ;

        const errMsg = err && !success
        ? <h3 className="text-danger">{err}</h3>
        : err && success 
        ? <h3 className="text-success">{err}</h3>
        : null
        ;

        return (
            <div className="formContainer container-fluid well">
                <h3>Change your Samba server password here</h3>
                <form>
                    <div className="form-group">
                        <label>User name</label>
                        <input type="text" className="form-control" placeholder="User name" value={userName} onChange={(e) => {this.onChange('userName', e.target.value);} } />
                    </div>
                    <div className="form-group">
                        <label>Current password</label>
                        <input type="password" className="form-control" placeholder="Current password" value={currentPwd} onChange={(e) => {this.onChange('currentPwd', e.target.value);} } />
                    </div>
                    <div className="form-group">
                        <label>New password</label>
                        <input type="password" className="form-control" placeholder="New password" value={newPwd} onChange={(e) => {this.onChange('newPwd', e.target.value);} } />
                    </div>
                    <div className="form-group">
                        <label>Retype new password</label>
                        <input type="password" className="form-control" placeholder="Retype new password" value={newPwdConfirm} onChange={(e) => {this.onChange('newPwdConfirm', e.target.value);} } />
                    </div>
                    {chgPwdBtn}
                    {pwdMismatchWarning}
                    {errMsg}
                </form>
            </div>
        );
    }
}

SmbPwdChange.propTypes = {
    err: PropTypes.string,
    success: PropTypes.bool,
    changePwd: PropTypes.func.isRequired
};

// container part #####################################################################################################
function mapStateToProps(state) {
    return {
        err: state.smbPwdChange.msg,
        success: state.smbPwdChange.success
    };
}

function mapDispatchToProps(dispatch) {
    return {
        changePwd: (userName, currentPwd, newPwd) => { dispatch(changeSmbPwd(userName, currentPwd, newPwd)); }
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(SmbPwdChange);
