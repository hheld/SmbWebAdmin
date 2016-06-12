import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux';
import { goBack } from 'react-router-redux';

import { changePwd } from './changePwdActions';

// component part ######################################################################################################
export class ChangePwd extends Component {
    constructor(props) {
        super(props);

        this.changePwd = this.changePwd.bind(this);

        this.state = {
            pwd: '',
            newPwd: '',
            newPwdConfirmed: ''
        };
    }

    changePwd() {
        this.props.changePwd(this.props.userName, this.state.pwd, this.state.newPwd);
    }

    render() {
        const { newPwd, newPwdConfirmed, pwd } = this.state;
        const { waiting, err, goBack } = this.props;

        let errDisplay = null;
        if (err) {
            errDisplay = <p className="text-danger">There was an error: {err}.</p>;
        }

        let waitingNotice = null;
        if (waiting) {
            waitingNotice = <p className="text-info">Waiting for server to change the password ...</p>;
        }

        const pwdsMatch = newPwd === newPwdConfirmed;

        const pwdMismatchWarning = pwdsMatch || (newPwd === '' && newPwdConfirmed === '')
            ? null
            : <p className="text-danger">Passwords do not match</p>
            ;

        const changePwdBtn = !pwdsMatch || pwd === '' || (newPwd === '' && newPwdConfirmed === '') ? null : (
            <div className="btn-group">
                <button className="btn btn-danger" type="button" onClick={this.changePwd}>Change password</button>
            </div>
        );

        return (
            <div className="container-fluid well" style={{ width: 400 }}>
                <h3>Change password for user {this.props.userName}</h3>
                <form>
                    {errDisplay}
                    {waitingNotice}
                    <div className="form-group">
                        <label>Current password</label>
                        <input type="password" className="form-control" value={pwd} onChange={(e) => { this.setState({ pwd: e.target.value }); } } />
                    </div>
                    <div className="form-group">
                        <label>New password</label>
                        <input type="password" className="form-control" value={newPwd} onChange={(e) => { this.setState({ newPwd: e.target.value }); } } />
                    </div>
                    <div className="form-group">
                        <label>Confirm new password</label>
                        <input type="password" className="form-control" value={newPwdConfirmed} onChange={(e) => { this.setState({ newPwdConfirmed: e.target.value }); } } />
                    </div>
                    {pwdMismatchWarning}
                    {changePwdBtn}
                    <button className="btn btn-primary" type="button" onClick={goBack}>Go back</button>
                </form>
            </div>
        );
    }
}

ChangePwd.propTypes = {
    userName: PropTypes.string.isRequired,
    changePwd: PropTypes.func.isRequired,
    waiting: PropTypes.bool.isRequired,
    err: PropTypes.string,
    goBack: PropTypes.func.isRequired
};

// container part ######################################################################################################
function mapStateToProps(state) {
    return {
        userName: state.user.currentUser.UserName,
        waiting: state.pwdChange.waiting,
        err: state.pwdChange.err
    };
}

function mapDispatchToProps(dispatch) {
    return {
        changePwd: (userName, currentPwd, newPwd) => { dispatch(changePwd(userName, currentPwd, newPwd)); },
        goBack: () => { dispatch(goBack()); }
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ChangePwd);
