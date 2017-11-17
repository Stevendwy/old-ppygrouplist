import React, {Component} from 'react'
import MiddleSubGroupPreviewItem from './middlesubgrouppreviewitem'
import {sendEvent, catchEvent, removeEvent, middleEvents} from './eventmodel'

export default class MiddleSubGroupPreview extends Component {
	
	constructor() {
		super()
		this.state = {
			firstshow:false,
			showSubGroupPreview: false,
			subGroupList: [],
			selectedItemIndex: -1,
			loadingview:"/ppy/img/loadingview.gif",
			imgshow:"block",
			subgroupname: "",
			show: "none",
			left: 0
		}
		this._handleSubGroupData = this.handleSubGroupData.bind(this)
		this._showSubGroupPreview = this.showSubGroupPreview.bind(this)
	}
	
	componentDidMount() {
		catchEvent(middleEvents.fenzuShows, this._showSubGroupPreview)//由showimageview 发送过来
		catchEvent(middleEvents.subGroupClick, this._handleSubGroupData)
		catchEvent(middleEvents.floatwindowSubGroupClickYulan,this._showSubGroupPreview)//由middlesubgviewitem 发送过来
		
		catchEvent(middleEvents.fenzuShowNo, e=>{
				this.setState({
					showSubGroupPreview:false,
					show: "none"
				},()=>{
					sendEvent(middleEvents.showSubGroupPreview, {//3.0.9时候这个消息是由MiddleLeftContent和MiddleRightContent接的
						showSubGroupPreview: this.state.showSubGroupPreview
					})
				})
			})//由showimageview 发送过来
	}
	
	controlBubble(show, subgroupname, left) {
		this.setState({
			show:show,
			subgroupname: subgroupname,
			left: left - 10
		})
	}
	
	handleSubGroupData(e) {
		let _subGroupData = e.info.subGroupData
		if (_subGroupData) {
//			if(this.state.showSubGroupPreview == false) this.showSubGroupPreview() //是否需要初始化定位
			this.setState({
				subGroupList: _subGroupData.data
			}, () => {this.selectedItem(e.info.index)})
		}else {
			this.selectedItem(e.info.index, e.info.stopScroll)
		}
	}
	
	selectedItem(index, stopScroll = false) {
		this.setState({
			selectedItemIndex: index
		}, () => {
			//处理显示位置
			if(!stopScroll) $(this.refs.middlesubgrouppreview).scrollLeft(index * 172 + 4 - (document.body.offsetWidth - 80) / 2 + 86)
		})
	}
	
	showSubGroupPreview(e) {
		let _show = e.info==true?"block":"none"
		this.setState({
			showSubGroupPreview: !this.state.showSubGroupPreview
		}, () => {
			sendEvent(middleEvents.showSubGroupPreview, {//3.0.9时候这个消息是由MiddleLeftContent和MiddleRightContent接的
				showSubGroupPreview: this.state.showSubGroupPreview
			})
		})
	}
	//发送状态给middle 处理父级显示floatwindowSubGroupClickFenzu	
	settomiddle(){
		sendEvent(middleEvents.floatwindowSubGroupClickFenzuClose, false)
	}
	handleImageLoaded() {
	    this.setState({ 
	    		imgshow: 'none' 
	    });
	}
	componentWillMount(){
		let _height = this.state.showSubGroupPreview ? "192px" : "40px"
		let _middlesubgrouppreview = this.refs.middlesubgrouppreview
		$(_middlesubgrouppreview).animate({
			height: _height
		},"slow")
		if (this.state.firstshow==false) {
			this.setState({
				firstshow:true
			})
		}
	}
	render() {
		let _subGroupList = this.state.subGroupList
		let _selectedItemIndex = this.state.selectedItemIndex
		let _width = _subGroupList.length * 172 + 4 + "px" //+ 4处理hover和选中
		let _opacity = this.state.showSubGroupPreview ? 1 : 0
		let _opactiyshow = _opacity==1?"block":"none"
//		let _height = this.state.showSubGroupPreview ? "192px" : "40px"
		let _movename="MiddleSubGroupPreview"
		if (this.state.firstshow) {
			_movename = _opacity==1?"animated slideInDown MiddleSubGroupPreview":"animated fadeOutUp MiddleSubGroupPreview"	
		}
//		let _top = this.state.showSubGroupPreview ? "44px" : "0"
		let _top = this.state.showSubGroupPreview ? "44px" : "44px"
		
		let _shows = this.state.show
		let _loadingview = this.state.loadingview
		let _imgsShow = this.state.imgshow
		let _handleImageLoaded = this.handleImageLoaded.bind(this)
		let _controlBubble = this.controlBubble.bind(this)
		let _imgs = _subGroupList.map((item, index) => {
			let _className = "MiddleSubGroupPreviewImgContainer"
			if(index == _selectedItemIndex) _className = "MiddleSubGroupPreviewImgContainerSelected"
			return (
				<MiddleSubGroupPreviewItem key={index}
					showClassName={_className}
					src={_loadingview}
					item={item}
					index={index}
					controlBubble={_controlBubble}
					/>
			)
		})
		let _src = this.state.showSubGroupPreview ? "/ppy/img/icon_xianshinormal.png" : "/ppy/img/icon_yincangnormal.png"
		let _remind = this.state.showSubGroupPreview ? "分组预览" : "分组预览"
		let _subgroupname = this.state.subgroupname
		let _left = this.state.left
		let _lefts =_left+80+"px" 
		
		return (
			<div className="MiddleSubGroupPreviewContainer" ref="selfzindex"
				onMouseEnter={()=>this.refs.selfzindex.style.zIndex = 1000}
				onMouseLeave={() => {this.refs.FloatWindowSubGroupItemBubbleOne.style.display = "none";
									this.refs.selfzindex.style.zIndex = 777
				}}
				onClick = {()=>this.refs.selfzindex.style.zIndex = 777}
			>
				<div ref="middlesubgrouppreview" className={_movename}
					style={{display: "block", top: _top}}>
					<div className="MiddleSubGroupPreviewBox"
						style={{width: _width}}>
						{_imgs}
					</div>
					<div className="middlesubgrouppreviewclose" 
						style={{width: _width}}
						onClick={this.settomiddle.bind(this)}>
						<div className="middlesubgrouppreviewcloseimg" style={{left:"50%",position: "absolute"}}></div>
					</div>
				</div>
				{/*onMouseOver={() => this.refs.FloatWindowSubGroupItemBubbleOne.style.display = "block"}
				  * 	<div className="MiddleSubGroupPreviewSwitch"
					onClick={this.showSubGroupPreview.bind(this)}>
					<img src={_src} alt="缩略图"/>
					<span>{_remind}</span>
				</div>*/}
				<div className="FloatWindowSubGroupItemBubble" ref="FloatWindowSubGroupItemBubbleOne" style={{display:_shows,left: _left}}>
					<div>{_subgroupname}</div>
				</div>
			</div>
		)
	}
}