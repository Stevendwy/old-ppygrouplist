import React, {Component} from 'react'
import PropTypes from "prop-types"

export default class Top extends Component {
	constructor(props) {
		super(props)
		this.state = {
			showLogout: "none",
			showNumber: "--"
		}
		
		this.vinType = "vin"
		this.carType = "car"
		this.partType = "part"
		this.chooseType = "vin" //记录上次点击记录，防止多次点击相同清空内容
	}
	
	componentDidMount() {
		getAjax("/usersinfos", {}, response => {
			this.setState({
				showNumber: response.data.users
			})
		})
	}
	
	showLogout(e) {
		let _showLogout = "none"
		if (e.type == "mouseover") {
			_showLogout = "initial"
		}
		if (e.type=="click") {
			let _stateshowLogout=this.state.showLogout=="initial"?"none":"initial"
			_showLogout = _stateshowLogout
		}
		this.setState({
			showLogout: _showLogout
		})
	}
	
	chooseInquire(inquireType = "vin") {
		this.chooseType = inquireType
		let _url = "/ppy?type="
		let _type
		let _binds="&binds=group"
		switch (this.chooseType){
			case this.vinType: _type = "vin"
				break;
			case this.carType: _type = "car"
				break;
			case this.partType: _type = "part"
				break;
			default:
				break;
		}
		location.href = _url + _type+_binds
	}
	
	render() {
		let _chooseInquire = this.chooseInquire.bind(this)
		return (
			<div className='TopContainer'>
				<div className="TopBackground"></div>
				<div className="TopRightContainer">
					<div className="TopRightSelectersContainer">
						<img className="TopLogo" src='/ppy/img/p_logo.png' onClick={() => location.href = "/"}/>
						<span className="TopRightSelector" onClick={() => _chooseInquire(this.vinType)}>车架号查询</span>
						<span className="TopRightSelector" onClick={() => _chooseInquire(this.carType)}>车型查询</span>
						<span className="TopRightSelector" onClick={() => _chooseInquire(this.partType)}>零件号查询</span>
					</div>
					<div className="TopRightAccountContainer"
						onClick={this.showLogout.bind(this)}
						onMouseOver={this.showLogout.bind(this)}
						onMouseLeave={this.showLogout.bind(this)}>
						<span className="TopRightAccount">{this.state.showNumber}</span>
						<span><img src="/ppy/img/icon_xiala.png" /></span>
						<div className="Logout" style={{display: this.state.showLogout}} >
							<div onClick={() => location.href = "/user/profile?binds=group"}>
								<img src="/ppy/img/user_icon.png"/>
									个人中心
							</div>
							<div onClick={() => location.href = "/logout"}>
								<img src="/ppy/img/icon_exit.png"/>
									退出
							</div>
						</div>
					</div>
				</div>
			</div>
		)
	}
}