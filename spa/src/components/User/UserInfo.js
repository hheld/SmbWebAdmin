import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css';

import React, { PropTypes } from 'react';
import md5 from 'md5';

class UserInfo extends React.Component {
    render() {
        const {UserName, FirstName, LastName, Email, Roles} = this.props.userInfo;
        const emailHash = md5(Email);
        const gravatarUrl = 'https://secure.gravatar.com/avatar/' + emailHash + '?d=mm';
        const logout = this.props.logout;
        const changePwd = this.props.changePwd;

        const roleLabels = Roles ? Roles.map((role) => {
            const labelClass = role === 'admin' ? 'label label-danger' : 'label label-info';
            return (<span key={role}><label className={labelClass} style={{ display: 'inline-block', marginLeft: 3 }}>{role}</label></span>);
        }) : null;

        return (
            <div className='container-fluid well well-sm'>
                <div className='row-fluid'>
                    <div className='col-xs-1 col-md-4'>
                        <img src={gravatarUrl} className='img-circle img-responsive' />
                        <button className='navbar-btn text-center btn btn-primary btn-xs' onClick={logout}>Logout</button>
                    </div>

                    <div className='col-md-8'>
                        <h6>{FirstName} {LastName} <small>({UserName}) </small></h6>
                        <h6><small>{Email}</small></h6>
                        {roleLabels}
                        <div><button className='navbar-btn btn btn-warning btn-xs' onClick={changePwd}><small>Chg.pwd.</small></button></div>
                    </div>
                </div>
            </div>
        );
    }
}

UserInfo.propTypes = {
    userInfo: PropTypes.shape({
        UserName: PropTypes.string.isRequired,
        FirstName: PropTypes.string.isRequired,
        LastName: PropTypes.string.isRequired,
        Email: PropTypes.string.isRequired,
        Roles: PropTypes.array
    }),
    logout: PropTypes.func.isRequired,
    changePwd: PropTypes.func.isRequired
};

export default UserInfo;
