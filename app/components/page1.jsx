
import React from 'react';
import { Link, Route } from 'react-router-dom';

export default class PageOne extends React.Component {
    constructor() {
        super();
    }
    render() {
        return (<div>
        No cunt for you today because you are a {this.props.sex}
            </div>)
    }
}


