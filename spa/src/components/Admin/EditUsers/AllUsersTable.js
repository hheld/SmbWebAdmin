import '../../../../node_modules/bootstrap/dist/css/bootstrap.min.css';

import React, {Component, PropTypes} from 'react';

class AllUsersTable extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedUser: null
        };
    }

    componentWillReceiveProps(nextProps) {
        if(this.state.selectedUser && this.props.users!==nextProps.users) {
            for(let i=0, len=nextProps.users.length; i<len; ++i) {
                if(nextProps.users[i].UserName===this.state.selectedUser.UserName) {
                    this.setState({
                        selectedUser: nextProps.users[i]
                    });
                    
                    break;
                }
            }
        }
    }

    onRowclicked(user) {
        const toggleStateUser = user===this.state.selectedUser ? null : user;
        
        this.props.onRowClicked(toggleStateUser);
        
        this.setState({
            selectedUser: toggleStateUser
        });
    }

    render() {
        const { users } = this.props;

        const tableData = users.map((user) => {
            const rowClass = this.state.selectedUser===user ? 'info' : null;
            
            return (
                <tr key={user.UserName} onClick={ () => this.onRowclicked(user) } className={rowClass} >
                    <td>{user.UserName}</td>
                    <td>{user.FirstName}</td>
                    <td>{user.LastName}</td>
                    <td>{user.Email}</td>
                    <td>{user.Roles.join(', ')}</td>
                </tr>
            );
        });

        return (
            <div className="table-responsive">
                <table className="table table-striped table-hover table-condensed">
                    <thead>
                        <tr>
                            <th>User name</th>
                            <th>First name</th>
                            <th>Last name</th>
                            <th>Email</th>
                            <th>Roles</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tableData}
                    </tbody>
                </table>
            </div>
        );
    }
}

AllUsersTable.propTypes = {
    users: PropTypes.array.isRequired,
    onRowClicked: PropTypes.func.isRequired
};

export default AllUsersTable;
