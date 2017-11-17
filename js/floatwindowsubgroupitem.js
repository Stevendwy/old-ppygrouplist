import React, {Component} from 'react'

export default class FloatWindowSubGroupItem extends Component {
	constructor(props) {
		super(props)
		this.state = {
			show: "none",
			loadingview:"/ppy/img/loadingview.gif",
			imgshow:"block"
		}
	}
	
	mouseEvent(e) {
		let _show = "none"
		if(e.type == "mouseover") _show = "block"
		this.setState({
			show: _show		
		})
	}
	
	handleImageLoaded() {
	    this.setState({ 
	    		imgshow: 'none' 
	    });
	}
	
	render() {
		let _itemClick = this.props.itemClick
		let _item = this.props.item
		let _index = this.props.index
		let _className = this.props.showClassName
		let _show = this.state.show
		let _mouseEvent = this.mouseEvent.bind(this)
		return (
			<div className={_className}
				onClick={() => {_itemClick(_item, _index)}}
				onMouseOver={_mouseEvent}
				onMouseLeave={_mouseEvent}>
				<img src={this.state.loadingview} className="FloatWindowSubGroupItemRemindImg" style={{display:this.state.imgshow}} />
				<img src={_item.url} alt={_item.subgroupname} onLoad={this.handleImageLoaded.bind(this)}  />
				<div className="FloatWindowSubGroupItemRemind">{_item.mid}</div>
				<div className="FloatWindowSubGroupItemBubble" style={{display: _show}}>
					<div>{_item.subgroupname}</div>
				</div>
			</div>
		)
	}
}
