import React, {
	Component
} from 'react'
import FloatWindowSubGroupItem from './floatwindowsubgroupitem'
import {
	sendEvent,
	catchEvent,
	middleEvents
} from './eventmodel'

export default class FloatWindowSubGroup extends Component {
	constructor(props) {
		super(props)
		this.state = {
			subGroupList: [],
			selectedIndex: 0,
			offsetLeft: 0

		}
		this.mainAuth = ""
	}

	componentDidMount() {
		//浮窗主组点击，回到选中第一个状态
		catchEvent(middleEvents.floatwindowMainGroupClick, () => {
			this.setState({
				selectedIndex: 0
			})
		})

		//下层的分组点击，选中对应位置，由于数据太深，没有与下面同步处理
		catchEvent(middleEvents.subGroupClick, e => {
			this.setState({
				selectedIndex: e.info.index
			})
		})

		//下层分组拿到数据传过来
		catchEvent(middleEvents.subGroupResponse, e => {
			var response = e.info.response
			this.setState({
				subGroupList: response.data,
			}, () => {
				let _changebackground = this.props.changebackground
				if (response.data.length > 0) _changebackground(true)
				else _changebackground(false)
			})
		})
		let trueWidth = this.refs.FloatWindowMainGroupList.offsetWidth
		let _offsetLeft = (trueWidth % 171) / 2 + 10 + "px"
		this.setState({
			offsetLeft: _offsetLeft
		})
	}

	componentWillReceiveProps(props) {
		//		console.log("floatsub componentWillReceiveProps")
		let trueWidth = this.refs.FloatWindowMainGroupList.offsetWidth
		let _offsetLeft = (trueWidth % 171) / 2 + 10 + "px"
		this.setState({
			offsetLeft: _offsetLeft
		})
	}

	itemClick(item, index) {
		let _obj = {
			index: index,
			auth: item.auth,
			uid: item.uid,
		}
		if (this.state.selectedIndex == index) _obj.isSame = true
		sendEvent(middleEvents.floatwindowSubGroupClick, _obj)
		sendEvent(middleEvents.floatwindowSubGroupClickFenzu, false) //发给middle
		this.setState({
			selectedIndex: index
		})
	}

	render() {
		let _selectedIndex = this.state.selectedIndex
		let _offsetLeft = this.state.offsetLeft
		let _subGroupList = this.state.subGroupList.map((item, index) => {
			let _className = "FloatWindowSubGroupItem"
			if (index == _selectedIndex) _className = "FloatWindowSubGroupItem FloatWindowSubGroupItemSelected"
			return (
				<FloatWindowSubGroupItem key={index}
					itemClick={this.itemClick.bind(this)}
					item={item}
					index={index}
					showClassName={_className}/>
			)
		})
		return (
			<div className="FloatWindowSubGroupContainer">
				<div className="FloatWindowSubGroup">
					<div className="FloatWindowSubGroupTitle">
						<div>选择分组:</div>
					</div>
					<div className="FloatWindowSubGroupList" ref="FloatWindowMainGroupList" style={{left:_offsetLeft}}>
						{_subGroupList}
					</div>
					<div className="subGroupLoadingContainer"></div>
				</div>
			</div>
		)
	}
}