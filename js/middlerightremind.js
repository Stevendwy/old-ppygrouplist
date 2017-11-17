import React, {Component} from 'react'

export default class MiddleRightRemind extends Component {
//	<span><span className="MiddleRightRemindBlue">蓝色字体：</span>多个零件数据</span>
//	<span><span className="MiddleRightRemindYellow">黄色字体：</span>非完全匹配数据</span>
	render() {
		let _wordshow = vinChange==1?"none":"inline-block"//vin 过滤是否显示
		let _wordright = vinChange==1?"80px":"0px"//vin 过滤是否显示
		return (
			<div className="MiddleRightRemindContainer">
				<div className="MiddleRightRemind" style={{paddingLeft:_wordright}}>
					说明:
					<span style={{display:_wordshow}}><span className="MiddleRightRemindRed">红色字体：</span>非此车架号数据</span>
					<span><span>R：</span>含替换件</span>
					<span><span>S：</span>含组件</span>
				</div>
			</div>
		)
	}
}