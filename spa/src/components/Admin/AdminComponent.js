import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css';

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

import { logoutUser } from '../../auth/authActions';
import { setVerificationShare, getVerificationShare } from './SmbAdmin/smbAdminActions';

import UserInfo from '../User/UserInfo';
import Menu from './Menu/Menu';
import SmbAdmin from './SmbAdmin/SmbAdmin';

// component part #####################################################################################################
export class AdminComponent extends React.Component {
    constructor(props) {
        super(props);

        this.props.getShare();
    }

    render() {
        const { user, logout, goToChangePwd, share, setShare } = this.props;

        return (
            <div className='row-fluid'>
                <div className='container-fluid col-md-2'>
                    <UserInfo userInfo={user} logout={logout} changePwd={goToChangePwd} />
                    <Menu items={[
                        { menuItem: 'Admin home', path: '/admin' },
                        { menuItem: 'Edit users', path: '/admin/editUsers' },
                        { menuItem: 'Add user', path: '/admin/addUser' }
                    ]} redirect={this.props.redirect} activePath={this.props.currentRoute} />
                </div>
                <div className='container-fluid col-md-10'>
                    {this.props.children || (
                        <SmbAdmin share={share} setShare={setShare} />
                    )}
                </div>
            </div>
        );
    }
}

AdminComponent.propTypes = {
    user: PropTypes.shape({
        UserName: PropTypes.string.isRequired,
        FirstName: PropTypes.string.isRequired,
        LastName: PropTypes.string.isRequired,
        Email: PropTypes.string.isRequired,
        Roles: PropTypes.array
    }),
    logout: PropTypes.func.isRequired,
    redirect: PropTypes.func.isRequired,
    currentRoute: PropTypes.string.isRequired,
    goToChangePwd: PropTypes.func.isRequired,
    share: PropTypes.string.isRequired,
    setShare: PropTypes.func.isRequired,
    getShare: PropTypes.func.isRequired,
    children: PropTypes.object
};

// container part #####################################################################################################
function mapStateToProps(state) {
    return {
        user: state.user.currentUser,
        currentRoute: state.routing.locationBeforeTransitions.pathname,
        share: state.smbAdmin.share
    };
}

function mapDispatchToProps(dispatch) {
    return {
        logout: () => { dispatch(logoutUser()); },
        redirect: (path) => { dispatch(push(path)); },
        goToChangePwd: () => { dispatch(push('/changePwd')); },
        setShare: (share) => { dispatch(setVerificationShare(share)); },
        getShare: () => { dispatch(getVerificationShare()); }
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(AdminComponent);
