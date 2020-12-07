import '../../../../node_modules/bootstrap/dist/css/bootstrap.min.css';

import React, {Component} from 'react';
import PropTypes from 'prop-types';

class Menu extends Component {
    constructor(props) {
        super(props);
    }

    redirect(path) {
        this.props.redirect(path);
    }

    render() {
        const {items, activePath} = this.props;

        const menu = items.map((item) => {
            const classes = activePath === item.path ? 'active' : null;

            return <li key={item.menuItem} role="presentation" className={classes}><a
                onClick={() => this.redirect(item.path)}>{item.menuItem}</a></li>;
        });

        return (
            <div>
                <ul className="nav nav-pills nav-stacked">
                    {menu}
                </ul>
            </div>
        );
    }
}

Menu.propTypes = {
    items: PropTypes.arrayOf(PropTypes.shape({
        menuItem: PropTypes.string.isRequired,
        path: PropTypes.string.isRequired
    })).isRequired,
    redirect: PropTypes.func.isRequired,
    activePath: PropTypes.string.isRequired
};

export default Menu;
