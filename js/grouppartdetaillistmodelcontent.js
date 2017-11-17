import React, { Component } from 'react'
import { sendEvent, catchEvent, removeEvent, middleEvents } from './eventmodel'
//import {headData,mainGroupData} from './datas'
//import 'rc-tree/assets/index.less';
//import './contextmenu.less';
import ReactDOM from 'react-dom';
import Tree, { TreeNode } from 'rc-tree';
import assign from 'object-assign';
import Tooltip from 'rc-tooltip';

function contains(root, n) {
  let node = n;
  while (node) {
    if (node === root) {
      return true;
    }
    node = node.parentNode;
  }
  return false;
}

export default class GroupPartDetailListModelContentContent extends Component {
	propTypes: {}
	constructor(props) {
		super(props)
		this.state = {
			gotmes: { "data": [] },
			whitchIs: "",
			cursors: "auto"
		}
	}
	
	

	  componentWillUnmount() {
	    if (this.cmContainer) {
	      ReactDOM.unmountComponentAtNode(this.cmContainer);
	      document.body.removeChild(this.cmContainer);
	      this.cmContainer = null;
	    }
	  }
	  onSelect(info) {
	    console.log('selected', info);
	  }
	  onRightClick(info) {
	    console.log('right click', info);
	    this.renderCm(info);
	  }
	  onMouseEnter(info) {
	    console.log('enter', info);
	    this.renderCm(info);
	  }
	  onMouseLeave(info) {
	    console.log('leave', info);
	  }
	  getContainer() {
	    if (!this.cmContainer) {
	      this.cmContainer = document.createElement('div');
	      document.body.appendChild(this.cmContainer);
	    }
	    return this.cmContainer;
	  }
	  renderCm(info) {
	    if (this.toolTip) {
	      ReactDOM.unmountComponentAtNode(this.cmContainer);
	      this.toolTip = null;
	    }
	    this.toolTip = (
	      <Tooltip
	        trigger="click" placement="bottomRight" prefixCls="rc-tree-contextmenu"
	        defaultVisible overlay={<h4>{info.node.props.title}</h4>}
	      >
	        <span></span>
	      </Tooltip>
	    );
	
	    const container = this.getContainer();
	    assign(this.cmContainer.style, {
	      position: 'absolute',
	      left: `${info.event.pageX}px`,
	      top: `${info.event.pageY}px`,
	    });
	
	    ReactDOM.render(this.toolTip, container);
	  }
	
	
	
	
	
	
	componentDidMount() {
		this.getContainer();
    // console.log(ReactDOM.findDOMNode(this), this.cmContainer);
    console.log(contains(ReactDOM.findDOMNode(this), this.cmContainer));
		this.setState({
			gotmes: this.props.nexmess,
			whitchIs: this.props.whitchIs
		})
	}
	componentWillReceiveProps(props) {
		this.setState({
			gotmes: props.nexmess,
			whitchIs: props.whitchIs
		})
	}
	newFloatwindow(item, e) {
		if(this.state.whitchIs != "0") {
			let _chancenum = item.replace("替换为：", "")
			sendEvent(middleEvents.addfloatwindow, _chancenum)
		} else {
			console.log("kong")
		}
		e.stopPropagation()
	}
	handleMouseEnter(item, e) {
		if(this.state.whitchIs != "0") {
			this.setState({
				cursors: "pointer"
			})
		}
		e.stopPropagation()
	}
	handleMouseLeave(item, e) {
		this.setState({
			cursors: "auto"
		})
		e.stopPropagation()
	}

	render() {
		let _cursor = this.state.cursors
		let _mes = this.props.nexmess
		
		let _head = this.state.whitchIs == "0" ? this.state.gotmes.data[1].showmessage[0] : this.state.gotmes.data
		let _lihead= this.state.whitchIs == "0" ? "":"替换为："
		let _li = _head.map((item, index) => {
			let _item =this.state.whitchIs == "0" ?item:item.replace("替换为：", "")
			return(
				<div key={index} style={{cursor:_cursor}}
					className="GroupPartDetailListModelContentcontentLi">
					<span>{_lihead}</span>
					<span 
					onClick={this.newFloatwindow.bind(this,item)}
					onMouseEnter={this.handleMouseEnter.bind(this,item)}
					onMouseLeave={this.handleMouseLeave.bind(this,item)}
					>{_item}</span>
				</div>
			)
		})
		return(
			<div className="GroupPartDetailListModelContentcontentExc">
				<Tree onSelect={this.onSelect}
			          defaultSelectedKeys={['0-1', '0-1-1']}
			          multiple defaultExpandAll showLine showIcon={false}
			        >
		          <TreeNode title="parent1 leaf1 leaf1 leaf1" key="0-1">
		            <TreeNode title="parent parent parent parent" key="0-1-1">
		              <TreeNode title="leaf0 leaf0 leaf0 leaf0" isLeaf />
		              <TreeNode title="leaf1 leaf1 leaf1 leaf1" isLeaf />
		              <TreeNode title="leaf2 leaf1 leaf1 leaf1" isLeaf />
		            </TreeNode>
		            <TreeNode title="parent parent parent parent">
		              <TreeNode title="leaf leaf leaf leaf" isLeaf />
		            </TreeNode>
		            <TreeNode title="parent parent parent parent" key="0-1-2">
		              <TreeNode title="leaf0 leaf0 leaf0 leaf0" isLeaf />
		              <TreeNode title="leaf1 leaf1 leaf1 leaf1" isLeaf />
		              <TreeNode title="parent parent parent parent" key="0-2-1">
			              <TreeNode title="leaf0 leaf0 leaf0 leaf0" isLeaf />
			              <TreeNode title="leaf1 leaf1 leaf1 leaf1" isLeaf />
			            </TreeNode>
			            
		            </TreeNode>
		            <TreeNode title="parent parent parent parent" key="0-1-3">
		            </TreeNode>
		            <TreeNode title="leaf1 leaf1 leaf1 leaf1" isLeaf />
		          </TreeNode>
		        </Tree>	
			</div>
		)
	}
}
