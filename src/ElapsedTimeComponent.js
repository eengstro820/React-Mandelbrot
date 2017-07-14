import React from 'react'

export default class ElapsedTimeComponent extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        let str = this.props.default
        let elapsedMs = this.props.end - this.props.start
        if (elapsedMs > 0) {
            str = `Time: ${elapsedMs} ms`
        }
        return (
            <p id={this.props.id} style={this.props.style}>
                {str}
            </p>
        );
    }
}