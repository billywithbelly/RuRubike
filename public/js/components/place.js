'use strict'

import React, { Component,PropTypes } from 'react'

export default class Place extends Component {
	constructor (props) {
	    super(props);
	    this.onClickHendler = this.onClickHendler.bind(this);
	}

	onClickHendler(){
		placeBtnHendler(this.props.data.lat,this.props.data.lng);
	}

	render(){
		return (
		    <button className="waves-effect waves-light btn" onClick={this.onClickHendler}>{this.props.data.name}</button>
		);
	}
}
