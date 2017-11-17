import React, {Component} from 'react'
import {sendEvent, catchEvent, removeEvent, middleEvents} from './eventmodel'

export default class Tree extends Component {
	
	constructor(props) {
		super(props)
		this.state = {
			nodes:[  
	            {id:1,pid:0,text:"顶级节点"},  
	            {id:2,pid:1,text:"一级节点1"},  
	            {id:4,pid:2,text:"1节点下的1"},  
	            {id:5,pid:2,text:"1节点下的2"},  
	            {id:6,pid:3,text:"2顶级节点1"},  
	            {id:3,pid:1,text:"一级节点2"},  
	            ]
		}
	}
	loadTree(pid,level){  
        //预先保存  
        var children = new Array();  
        //别名 nodes  
        var nodes = this.state.nodes;  
        var index = -1;  
        //console.log(nodes);  
        //递归添加孩子  
        for (var i = 0; i < nodes.length ; i++) {  
            //寻找本节点的索引  
            if(nodes[i].id==pid)  
            {  
                index=i;  
            }  
            //加载孩子  
            if(nodes[i].pid==pid)  
            {  
                children.push(this.loadTree(nodes[i].id,level+1));  
            }  
        }  
  
        var levelBlank="";  
        for (level--; level>= 0; level--) {  
            levelBlank+="-";  
        }  
  
          
        var thisContent = "";  
        if(index>=0)  
        {  
            thisContent=nodes[index].text;  
        }  
        var _self=<div id={"parent"+pid}>  
            {levelBlank}  
            {thisContent}  
            {children.length>0? children:""}  
            </div>;  
          
         
        return _self;  
  
    }
	render() {
		return (
			<div id="reactTree">{this.loadTree(1,0)}</div>
		)
	}
}
