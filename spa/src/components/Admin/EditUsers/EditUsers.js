import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux';

import { getAllUsers, updateUser, deleteUser } from './editUserActions';

import AllUsersTable from './AllUsersTable';
import UserEditor from './UserEditor';

// component part #####################################################################################################
export class EditUsers extends Component {
    constructor(props) {
        super(props);
        
        this.getAllUsers = this.props.getAllUsers.bind(this);
        this.getAllUsers();
        
        this.userClicked = this.userClicked.bind(this);
        this.deleteUser = this.deleteUser.bind(this);
        
        this.state = {
            currentUser: null
        };
    }
    
    userClicked(user) {
        this.setState({
            currentUser: user
        });
    }
    
    deleteUser(userName) {
        this.props.deleteUser(userName);
        
        this.setState({
            currentUser: null
        });
    }
    
    render() {
        const usersTable = this.props.allUsers ? <AllUsersTable users={this.props.allUsers} onRowClicked={this.userClicked} /> : null;
        const userEditor = this.state.currentUser ? <UserEditor user={this.state.currentUser} updateUser={this.props.updateUser} deleteUser={this.deleteUser} /> : null;
        
        return (
            <div>
                <button className="btn btn-default" onClick={this.getAllUsers} >Refresh user information</button>
                {usersTable}
                {userEditor}
            </div>
        );
    }
}

EditUsers.propTypes = {
    getAllUsers: PropTypes.func.isRequired,
    allUsers: PropTypes.array,
    updateUser: PropTypes.func.isRequired,
    deleteUser: PropTypes.func.isRequired
};

// container part #####################################################################################################
function mapStateToProps(state) {
    return {
        allUsers: state.editUser.allUsers
    };
}

function mapDispatchToProps(dispatch) {
    return {
        getAllUsers: () => { dispatch(getAllUsers()); },
        updateUser: (oldInfo, newInfo) => { dispatch(updateUser(oldInfo, newInfo)); },
        deleteUser: (userName) => { dispatch(deleteUser(userName)); }
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(EditUsers);
