import React, {Component} from 'react'
import MiddleRightRemind from './middlerightremind'

export default class MiddleRemind extends Component {
	
	render() {
		let _wordleft = vinChange==1?"80px":"0px"//vin 过滤是否显示
		return (
			<div className="MiddleRemindContainer">
				<div className="MiddleRemindBox">
					<MiddleRightRemind />
					<span className="MiddleRemind" style={{right:_wordleft}}>＊以上信息由零零汽提供，仅供参考</span>
				</div>
			</div>
		)
	}
}