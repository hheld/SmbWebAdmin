import React, {Component, PropTypes} from 'react';

class SmbShare extends Component {
    constructor(props) {
        super(props);

        this.shareChanged = this.shareChanged.bind(this);
        this.setShare = this.setShare.bind(this);

        this.state = {
            share: props.share
        };
    }

    shareChanged(e) {
        this.setState({
            share: e.target.value
        });
    }

    setShare() {
        const { share } = this.state;

        this.props.setShare(share);
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.share!==this.state.share) {
            this.setState({
                share: nextProps.share
            });
        }
    }

    render() {
        const { share } = this.state;

        const btnSetShare = share
        ? <button type="button" className="btn btn-default" onClick={this.setShare}>Set share</button>
        : null
        ;

        return (
            <div>
                <form>
                    <div className="form-group">
                        <label>Share to use for password verification</label>
                        <input type="text" className="form-control" value={share} onChange={this.shareChanged} />
                    </div>
                    {btnSetShare}
                </form>
            </div>
        );
    }
}

SmbShare.propTypes = {
    share: PropTypes.string.isRequired,
    setShare: PropTypes.func.isRequired
};

export default SmbShare;