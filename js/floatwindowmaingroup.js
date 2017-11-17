import React, {
	Component
} from 'react'
import FloatWindowMainGroupItem from './floatwindowmaingroupitem'
import {
	sendEvent,
	catchEvent,
	middleEvents
} from './eventmodel'

export default class FloatWindowMainGroup extends Component {
	constructor(props) {
		super(props)
		this.state = {
			mainGroupList: [],
			selectedIndex: 0,
			selectedAuth: ""
		}
		this.hasSets = false //标记零件查询下第一次进入时候不要发出分组请求，由主组自己发出
	}

	componentDidMount() {
		catchEvent(middleEvents.mainGroupClick, e => {
			this.itemClick(e.info.item, e.info.index)
		})
		catchEvent(middleEvents.mainGroupResponse, e => {
			//			console.log('fwMainRequest')
			let _index = params.index
			let response = e.info.response
			if (response.sets) this.hasSets = true
			let _obj = {
				mainGroupList: response.data
			}
			if (_index) _obj.selectedIndex = parseInt(_index)
			this.setState(_obj, () => {
				this.itemClick(response.data[_index || 0], _index || 0)
			})
		})
	}

	itemClick(item, index) {
		sendEvent(middleEvents.floatwindowMainGroupClicks, {
			index: index,
			auth: item.auth,
			title: item.groupnum,
			headtitle: item.groupname
		})
		if (!this.hasSets) {
			sendEvent(middleEvents.floatwindowMainGroupClick, {
				index: index,
				auth: item.auth,
				title: item.groupnum,
				headtitle: item.groupname
			})
		} else {
			this.hasSets = false
		}
		this.setState({
			selectedIndex: index
		}, this.props.selectedMainItem(item.auth))
	}

	render() {
		//		console.dir(this.state.mainGroupList)

		let _itemClick = this.itemClick
		let _selectedIndex = this.state.selectedIndex
		let _mainGroupList = this.state.mainGroupList.map((item, index) => {
			let _className = "FloatWindowMainGroupItem"
			if (index == _selectedIndex) _className = "FloatWindowMainGroupItemSelected"
			return (
				<FloatWindowMainGroupItem key={index}
					itemClick={_itemClick.bind(this, item, index)}
					showClassName={_className}
					content={item.groupname}/>
			)
		})

		return (
			<div className="FloatWindowMainGroupContainer">
				<div className="FloatWindowMainGroup">
					<div className="FloatWindowMainGroupTitle">
						<div>选择主组:</div>
					</div>
					<div className="FloatWindowMainGroupList">
						{_mainGroupList}
					</div>
					<div className="mainGroupLoadingContainer"></div>
				</div>
			</div>
		)
	}
}