import React, {
	Component
} from 'react'
import Pagegroup from './grouppage.js'
import Littlegroup from './grouplittle.js'
import Maingroup from './groupmain.js'
import {
	groupLittleData
} from "./datas"
import {
	sendEvent,
	catchEvent,
	middleEvents
} from './eventmodel'

export default class Typegroup extends Component {
	constructor() {
		super()
		this.state = {
			larr: [],
			index: 0,
			colorIndex: 1,
			resultCount: 0,
			canChangeP: false,
			resultShow: false,
			value: "",
			hide: false,
			isFrist: false,
			isLast: false,
			windowWidth: document.body.clientWidth
		}
		this.larr = []
		this.timer = null
	}
	componentDidMount() {
		catchEvent(middleEvents.mainGroupClick, e => {
			this.setState({
				colorIndex: 1
					//				isFrist:true
			})

		})
	}

	indexchange(newIndex) {
		//  		console.log(newIndex)
		this.setState({
			index: newIndex,
			canChangeP: true,
			isFrist: newIndex == 0 ? true : false,
			isLast: newIndex == this.state.larr.length - 1 ? true : false
		})
	}

	changepage(count) {
		//  		if(this.state.canChangeP){
		//  			
		//	        if(this.state.index == 0 && count < 0 || this.state.larr.length - 1 == this.state.index && count > 0){
		//	           this.setState({
		//	               colorIndex: this.state.index == 0 ? 1 : 2
		//	           })
		//	            		return
		//
		//	        }
		//	        this.setState({
		//	            index: this.state.index + count,
		//	            colorIndex: 3
		//	        })
		////	        console.log("be"+this.state.index);
		//			if(this.state.index == 1&&count <0){
		//			   this.setState({
		//	               colorIndex: 1
		//	           })
		//			}
		//			if(this.state.index == this.state.larr.length-2&&count >0){
		//			   this.setState({
		//	               colorIndex: 2
		//	           })
		//			}
		//			
		if (count == 1 && this.state.index == this.state.larr.length - 1 || count == -1 && this.state.index == 0) {
			return;
		}
		//请求列表数据
		let _index = this.state.index + count
		let _auth = this.state.larr[_index].auth
		let _title = this.state.larr[_index].subgroupname
		let _uid = this.state.larr[_index].uid
		if (_index == this.state.larr.length - 1) {
			this.setState({
				isLast: true
			})
		} else {
			this.setState({
				isLast: false
			})
		}

		if (_index == 0) {
			this.setState({
				isFrist: true
			})
		} else {
			this.setState({
				isFrist: false
			})
		}

		this.setState({
			index: this.state.index + count
		})
		clearTimeout(this.timer)
		this.timer = setTimeout(() => {
			//				this.listClick(this.state.marr[index],index)
			sendEvent(middleEvents.subGroupClick, {
				auth: _auth,
				title: _title,
				index: _index,
				uid: _uid,
			})
		}, 500)

		//     }
	}

	arrChange(e) {
		this.setState({
			larr: this.larr
		})
		var arr = JSON.parse(JSON.stringify(this.larr));
		var larrs = []
		var value = e.target.value
		for (var i = 0; i < arr.length; i++) {
			if (arr[i].subgroupname.indexOf(value) !== -1 && value !== "") {
				arr[i].subgroupname = arr[i].subgroupname.replace(value, "<span>" + value + "</span>")
				larrs.push(arr[i])
			}
		}
		if (larrs.length !== 0) {
			this.setState({
				larr: larrs,
				resultCount: larrs.length,
				resultShow: true,
				index: 0,
				windowWidth: document.body.clientWidth

			})
		} else if (larrs.length == 1) {
			this.setState({
				isLast: true
			})
		} else {
			this.setState({
				resultCount: 0,
				resultShow: true
			})
		}
		if (value == "") {
			this.setState({
				larr: this.larr,
				resultCount: 0,
				resultShow: false
			})
		}

	}

	mainListClick(auth) {
		//请求数据修改分组值
		let _url = "/ppycars/subgroup"
		if (isParts) _url = "/ppypart/subgroup"
		else if (isVIN) _url = "/ppyvin/subgroup"
		let _obj = { //车型基本，没有p和vin
			auth: auth,
			code: params.code
		}
		this.setState({
			colorIndex: 1
		})
		if (isParts) _obj.p = params.p
		else if (isVIN) _obj.vin = params.vin
		if (PeipeiYun) {
			//  			console.log("mainListClick")
			$(".subGroupLoadingContainer").show();
			getAjax(_url, _obj, response => {
				//			console.log('groupTypeRequest')
				$(".subGroupLoadingContainer").hide();
				sendEvent(middleEvents.subGroupResponse, {
						response: response
					})
					//			console.log(response)
				let _index = 0
				if (response.sets) {
					let _datas = response.data
					let _setAuth = response.sets.auth
					for (var i = 0; i < _datas.length; i++) {
						let _data = _datas[i]
						if (_data.auth == _setAuth) {
							_index = i
							break
						}
					}
				}

				if (response.data.length == 1) {
					this.setState({
						isLast: true
					})
				}
				this.setState({
					larr: response.data,
					index: _index,
					isFrist: _index == 0 ? true : false,
					isLast: _index == response.data.length - 1 ? true : false,
					canChangeP: true
				})
				this.larr = response.data
				sendEvent(middleEvents.subGroupClick, {
					auth: response.data[_index].auth,
					title: response.data[_index].subgroupname,
					uid: response.data[_index].uid,
					subGroupData: response,
					index: _index
				})
			})
		} else {
			this.setState({
				larr: groupLittleData.data,
				index: 0,
				canChangeP: true
			})
			this.larr = groupLittleData.data
			this.larr = JSON.parse(JSON.stringify(groupLittleData.data));
		}
	}
	restoreArr() {
		sendEvent(middleEvents.subTitleClick, {

		})
		this.setState({
			larr: this.larr,
			resultShow: false
		})
	}
	render() {

		let _isFrist = this.state.isFrist
		let _isLast = this.state.isLast

		return (
			<div className="Typegroup">
                <Maingroup 
                width={this.state.windowWidth}
                listClick={this.mainListClick.bind(this)}/>
                <Littlegroup
                		restoreArr={this.restoreArr.bind(this)}
                    width={this.state.windowWidth}
                		resultShow = {this.state.resultShow}
                		results = {this.state.resultCount}
                		arrChange={this.arrChange.bind(this)}
                		arr={this.state.larr}
                		indexchange={this.indexchange.bind(this)}
                		where={this.state.index}/>
                <Pagegroup 
                		index={this.state.index} 
                		color={this.state.colorIndex} 
                		change={this.changepage.bind(this)}
                		isFrist= {_isFrist} 
                		isLast = {_isLast}
                	/>
            </div>
		)
	}
}