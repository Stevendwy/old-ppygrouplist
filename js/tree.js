var React=require('react');  
var PropTypes=require('react').PropTypes;  
import Tree, { TreeNode } from 'rc-tree';  
//require('rc-tree/assets/index.css');  
import cssAnimation from 'css-animation';  
var Link= require('react-router').Link;  
var IndexLink=require('react-router').IndexLink;  
  
const STYLE = `  
		.collapse {  
		  overflow: hidden;  
		  display: block;  
		}  
		  
		.collapse-active {  
		  transition: height 0.3s ease-out;  
		}  
		`;  
  
function animate(node, show, done) {  
    let height = node.offsetHeight;  
    return cssAnimation(node, 'collapse', {  
        start() {  
            if (!show) {  
                node.style.height = `${node.offsetHeight}px`;  
            } else {  
                height = node.offsetHeight;  
                node.style.height = 0;  
            }  
        },  
        active() {  
            node.style.height = `${show ? height : 0}px`;  
        },  
        end() {  
            node.style.height = '';  
            done();  
        }  
    });  
}  
  
//动态树动态创建节点方法  
function createDynamicNode(treeData,eventKey){  
    treeData.forEach(function(item){  
        if(item.child!=null){  
            createDynamicNode(item.child,eventKey);  
        }else{  
            if(eventKey==item.key){  
                item.child=[  
                    {title: '子节点1', key: '0-0-1-0',level:2},  
                    {title: '子节点2', key: '0-0-1-1',level:2}  
                ]  
            }  
        }  
    });  
  
}  
  
var myTree = React.createClass({  
    //设置默认数据类型  
    propTypes: {  
        keys: PropTypes.array  
    },  
    //设置默认属性值  
    getDefaultProps() {  
        return {  
            keys: ['0-0']  
        };  
    },  
    getInitialState() {  
        const keys = this.props.keys;  
        return {  
            //defaultExpandedKeys: keys,   //默认展开 keys节点  
            //defaultSelectedKeys: keys,  //默认选中(高亮) keys节点  
            //defaultCheckedKeys: keys,  //默认Checked keys节点  
            defaultExpandedKeys: [],  
            defaultSelectedKeys: [],  
            defaultCheckedKeys: [],  
            expandedKeys: [],  
            selectedKeys: [],  
            checkedKeys: [],  
            switchIt: true,  
            treeData:[  
                {title: 'dynamic 1', key: '0-0-0' ,level:1},  
                {title: 'dynamic 2', key: '0-0-1' ,level:1}  
            ],  
            treeData2:[  
                {title: 'edit',  key: '0-0-0' ,level:1,child:[  
                    {title: '子节点1', key: '0-0-0-0',level:2,child:[  
                        {title: '子子节点1', key: '0-0-0-0-1',level:3},  
                    ]},  
                    {title: '子节点2', key: '0-0-0-1',level:2},  
                ]},  
                {title: '父节点', key: '0-0-1',level:1,child:[  
                    {title: '子节点1', key: '0-0-1-0',level:2},  
                    {title: '子节点2', key: '0-0-1-1',level:2}  
                ]}  
            ]  
        };  
    },  
    onExpand(expandedKeys) {  
        console.log('onExpand', expandedKeys, arguments);  
        this.setState({expandedKeys:expandedKeys});  
    },  
    onSelect(selectedKeys, info) {  
        console.log('selected', selectedKeys, info);  
        this.setState({selectedKeys:selectedKeys});  
  
        this.selKey = info.node.props.eventKey;  
    },  
    onCheck(checkedKeys, info) {  
        this.setState({checkedKeys:checkedKeys});  
        console.log('onCheck', checkedKeys, info);  
    },  
    onEdit() {  //用setTimeout异步阻塞线程，使onSelect先运行，得到当前选中的节点  
        setTimeout(() => {  
            console.log('current key: ', this.selKey);  
            alert(this.selKey);  
        }, 0);  
    },  
    onDel(e) {  
        if (!window.confirm('sure to delete?')) {  
  
        }else{  
            setTimeout(() => {  
                console.log('delete key: ', this.selKey);  
            }, 0);  
        }  
        e.stopPropagation();  
    },  
    onLoadData(treeNode) {  
        return new Promise((resolve) => {  
            if(treeNode.props.children!=null&&treeNode.props.children.length>0){  
                resolve();  
            }else{  
                setTimeout(() => {  
                    let treeData=this.state.treeData;  
                    //动态加载树节点  
                    createDynamicNode(treeData,treeNode.props.eventKey);  
                    this.setState({ treeData });  
                    resolve();  
                },500);  
            }  
        });  
    },  
    render() { 
    	console.log("bbbbb")
        //先查出根节点  
        function findRoot(treeData) {  
            var nodeStr=treeData.map(function(node){  
                return (  
                    <TreeNode title={node.title} key={node.key}>{findChild(node)}</TreeNode>  
                );  
            });  
            return nodeStr;  
        }  
        //循环递归展开树  
        function findChild(node){  
           if(node!=null){  
               if(node.child!=null){  
                 var str=node.child.map(function(n){  
                       return(  
                           <TreeNode title={n.title} key={n.key}>{findChild(n)}</TreeNode>  
                       );  
                 })  
                 return str;  
               }  
           }  
        }  
  
        var dynamicNodeList=(  
            <TreeNode title="根节点" key="0-0">  
               {findRoot(this.state.treeData)}  
            </TreeNode>  
        );  
  
        var treeNodeList=(  
            <TreeNode title="根节点" key="0-0">  
                {findRoot(this.state.treeData2)}  
            </TreeNode>  
        );  
  
        const animation = {  
            enter(node, done) {  
                return animate(node, true, done);  
            },  
            leave(node, done) {  
                return animate(node, false, done);  
            },  
            appear(node, done) {  
                return animate(node, true, done);  
            }  
        };  
  
        const customLabel = (  
            <span className="cus-label">  
                    <span>operations </span>  
              </span>  
        );  
        //defaultExpandAll 默认全部展开  
        //showline  显示树中的虚线  
        //checkable 提供复选框功能  
        //onExpand 树展开后的回调  onSelect 树选中后的回调  onCheck 树选择的回调  
        //onLoadData 动态加载树  
        //openAnimation 展开节点时动画函数  
        return (<div style={{ margin: '0 20px' }}>  
            <div>  
                选中的节点key值：{this.state.selectedKeys}<br/>  
                展开的节点key值：{this.state.expandedKeys}<br/>  
                check的节点key值：{this.state.checkedKeys}<br/>  
            </div>  
            <h2>基础树</h2>  
            <style dangerouslySetInnerHTML={{ __html: STYLE }}/>  
            <Tree  
                className="myCls" showLine checkable  
                defaultExpandedKeys={this.state.defaultExpandedKeys}  
                onExpand={this.onExpand}  
                defaultSelectedKeys={this.state.defaultSelectedKeys}  
                defaultCheckedKeys={this.state.defaultCheckedKeys}  
                onSelect={this.onSelect} onCheck={this.onCheck}  
                openAnimation={animation}  
                >  
                <TreeNode title="parent 1" key="0-0">  
                    <TreeNode title={customLabel} key="0-0-0">  
                        <TreeNode title="leaf" key="0-0-0-0" />  
                        <TreeNode title="leaf" key="0-0-0-1" />  
                    </TreeNode>  
                    <TreeNode title="parent 1-1" key="0-0-1">  
                        <TreeNode title="parent 1-1-0" key="0-0-1-0" />  
                        <TreeNode title="parent 1-1-1" key="0-0-1-1" />  
                    </TreeNode>  
                </TreeNode>  
            </Tree>  
            <h2>基础树2</h2>  
            <Tree  
                className="myCls" showLine checkable defaultExpandAll  
                defaultExpandedKeys={this.state.defaultExpandedKeys}  
                onExpand={this.onExpand}  
                defaultSelectedKeys={this.state.defaultSelectedKeys}  
                defaultCheckedKeys={this.state.defaultCheckedKeys}  
                onSelect={this.onSelect} onCheck={this.onCheck}  
                >  
                {treeNodeList}  
            </Tree>  
            <h2>动态树</h2>  
            <Tree  
                className="myCls" showLine checkable  
                defaultExpandedKeys={this.state.defaultExpandedKeys}  
                onExpand={this.onExpand}  
                defaultSelectedKeys={this.state.defaultSelectedKeys}  
                defaultCheckedKeys={this.state.defaultCheckedKeys}  
                onSelect={this.onSelect} onCheck={this.onCheck}  
                loadData={this.onLoadData}  
                >  
                {dynamicNodeList}  
            </Tree>  
        </div>);  
    }  
});  
  
exports.Tree=myTree;