import React from "react";
import {Card, Transfer, Button, Modal, Form,Input,Select,Tree } from "antd";
import BaseForm from '../../../../common/BaseForm'
import Etable from "../../../../common/Etable";
import { formateDate, updateSelectedItem, getList } from '../../../../utils'
import request from '../../../../utils/request'
import menuConfig from '../../../../config/menuConfig'
const Option = Select.Option
const FormItem = Form.Item
const { TreeNode } = Tree


export default class Permission extends React.Component{

    params = {
        page:1,
        pageSize:5
    }
    data = [
        {
            type:'input',
            initialValue:'',
            label:'用户名',
            placeholder:'请输入用户名',
            field:'username',
            width:'150px'
        }
    ]

    state= {
        rowSelection:{
            selectedRowKeys:[],
            selectedRows:[],
        },
        type:'radio',
        list:[],
        roleVisible:false,
        perVisible:false,
        authVisible:false,
        checkedKeys:[],
        targetKeys:[]
    }

    handleSearch = (data)=>{
        console.log(data)
    }

    componentDidMount(){
        const options = {
            url:'/role/allList',
            type:'get',
            params:{}
        }
        getList(this,options)
    }

    requestList(){
        request({
            url:'/role/list',
            type:'get',
            params:{
                page:this.params.page,
                pageSize:this.params.pageSize
            }
        }).then(res =>{
            console.log(res)
        })
    }

    handleRole=()=>{
        this.setState({
            roleVisible:true
        })
    }
    creatRoleSubmit= ()=>{
        let data = this.roleForm.props.form.getFieldsValue()
        request({
            url:'role/create',
            data:{
                params:{
                    ...data
                }
            }
        }).then(res =>{
            this.setState({
                roleVisible:false
            })
        })
        this.requestList();
    }

    handlePermission= ()=>{
        if(this.state.rowSelection.selectedRows.length===0){
            Modal.info({
                title:'信息',
                content:'请选择一个角色'
            })
            return;
        }
        this.setState({
            perVisible:true,
            checkedKeys:this.state.rowSelection.selectedRows[0].menus
        })
    }
    onCheck = checkedKeys => {
        console.log("onCheck", checkedKeys);
        this.setState({ checkedKeys });
    }

    setPerFn=()=>{
        
        let data = this.perForm.props.form.getFieldsValue()
        data.user_id = this.state.rowSelection.selectedRows[0].id
        data.checkedKeys = this.state.checkedKeys
        
        request({
            url:'/permission/edit',
            data:{
                params:{
                    ...data
                }
            }
        }).then((res)=>{
            if(res){
                this.setState({
                    perVisible:false
                })
                this.requestList();
            }
        })
    }

    handleUserAuth = () =>{
        if(this.state.rowSelection.selectedRows.length===0){
            Modal.info({
                title:'信息',
                content:'请选择一个角色'
            })
            return;
        }
        this.setState({
            authVisible:true
        })
        this.getRoleUserList(this.state.rowSelection.selectedRows[0].id)
    }
    getRoleUserList(id){
        request({
            url:'/role/user_list',
            data:{
                params:{
                    id:id
                }
            }
        }).then((res)=>{
            if(res){
                this.getAuthUserList(res.data.data);
            }
        })
    }

    getAuthUserList = (dataSource)=>{
        const mockData = [];
        const targetKeys = [];
        if (dataSource && dataSource.length > 0) {
            for (let i = 0; i < dataSource.length; i++) {
                const data = {
                    key: dataSource[i].user_id,
                    title: dataSource[i].user_name,
                    status: dataSource[i].status,
                };
                if (data.status === 1) {
                    targetKeys.push(data.key);
                }
                mockData.push(data);
            }
        }
        this.setState({mockData, targetKeys});
    }

    userAuth = ()=>{
        let data = {};
        data.user_ids = this.state.targetKeys || [];
        data.role_id = this.state.rowSelection.selectedRows[0].id;
        request({
            url:'/role/user_role_edit',
            data:{
                params:{
                    ...data
                }
            }
        }).then((res)=>{
            if(res){
                this.setState({
                    authVisible:false
                })
                this.requestList();
            }
        })
    
    }

    

    //左右穿梭时的回调
    handleChange = (nextTargetKeys, direction, moveKeys) => {
        this.setState({ targetKeys: nextTargetKeys });
    };


    render(){
        const columns = [
            {
                title: '角色ID',
                dataIndex: 'id'
            }, {
                title: '角色名称',
                dataIndex: 'role_name'
            },{
                title: '创建时间',
                dataIndex: 'create_time',
                render(time){
                    return formateDate(time)
                }
            }, {
                title: '使用状态',
                dataIndex: 'status',
                render(status){
                    if (status === 1) {
                        return "启用"
                    } else {
                        return "停用"
                    }
                }
            }, {
                title: '授权时间',
                dataIndex: 'authorize_time',
                render(time){
                    return formateDate(time)
                }
            }, {
                title: '授权人',
                dataIndex: 'authorize_user_name',
            }
        ];

        return (
            <div>
                <Card>
                    <BaseForm
                        data={this.data}
                        handleSearch = {this.handleSearch}
                    />
                </Card>
                <Card style={{margin:'10px 0'}}>
                    <Button type="primary" onClick={this.handleRole}>创建角色</Button>
                    <Button type="primary" onClick={this.handlePermission} style={{margin:'0 20px'}}>设置权限</Button>
                    <Button type="primary" onClick={this.handleUserAuth}>用户授权</Button>
                </Card>
                <Card>
                    <Etable
                        that={this}
                        dataSource={this.state.dataSource}
                        columns={columns}
                        rowSelection={this.state.rowSelection}
                        updateSelectedItem={updateSelectedItem.bind(this)}
                        pagination={this.state.pagination}
                        type={this.state.type}
                    >    
                    </Etable>
                </Card>
                <Modal
                    title="创建角色"
                    visible={this.state.roleVisible}
                    onOk={this.creatRoleSubmit}
                    onCancel={()=>{this.setState({
                        roleVisible:false
                    })}}
                >
                    <CreatRole wrappedComponentRef={(inst) => this.roleForm = inst} />
                </Modal>
                <Modal
                    title="设置权限"
                    visible={this.state.perVisible}
                    onOk={this.setPerFn}
                    onCancel={()=>{
                        this.setState({
                            perVisible:false
                        })
                    }}
                >
                    <SetPer 
                        detailInfo={this.state.rowSelection.selectedRows[0]} 
                        wrappedComponentRef={(inst) => this.perForm = inst}
                        checkedKeys={this.state.checkedKeys}
                        onCheck={this.onCheck}
                    />
                </Modal>
                <Modal
                    width={800}
                    title="用户授权"
                    visible={this.state.authVisible}
                    onOk={this.userAuth}
                    onCancel={()=>{
                        this.setState({
                            authVisible:false
                        })
                    }}
                >
                    <UserAuth
                        dataSource={this.state.mockData}
                        targetKeys={this.state.targetKeys} //右侧选中数据
                        onChange={this.handleChange} //左右穿梭时的回调
                        detailInfo = {this.state.rowSelection.selectedRows[0]}
                    />
                </Modal>
            </div>
        )
    }
}

//创建角色
class CreatRole extends React.Component{

    render(){
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: {span: 5},
            wrapperCol: {span: 16}
        }
        return (
            <Form>
                <FormItem label="角色名称" {...formItemLayout}>
                    {
                        getFieldDecorator('role_name',{
                            initialValue:''
                        })(
                            <Input  type="text" placeholder="请输入角色名称" />
                        )
                    }
                </FormItem>
                <FormItem label="状态" {...formItemLayout}>
                    {
                        getFieldDecorator('status',{
                            initialValue:1
                        })(
                            <Select>
                                <Option value={1}>开启</Option>
                                <Option value={0}>关闭</Option>
                            </Select>
                        )
                    }
                </FormItem>
            </Form>
        )
    }
}
CreatRole = Form.create()(CreatRole)


class SetPer extends React.Component{

    renderTreeNodes = data =>
        data.map(item => {
            if (item.children) {
                return (
                    <TreeNode title={item.title} key={item.key} dataRef={item}>
                        {this.renderTreeNodes(item.children)}
                    </TreeNode>
                );
            }
            return <TreeNode {...item} />;
        });

    render(){
        const { getFieldDecorator } = this.props.form
        const formItemLayout = {
            labelCol: {span: 5},
            wrapperCol: {span: 18}
        }
        const detail_info = this.props.detailInfo;
        return (
            <Form layout="horizontal">
                <FormItem {...formItemLayout} label="角色名称">
                    <Input disabled maxLength={8}  placeholder={detail_info.role_name} />
                </FormItem>
                <FormItem label="状态"  {...formItemLayout}>
                    {
                        getFieldDecorator("status",{
                            initialValue:'1'
                        })(
                            <Select>
                                <Option value="1">启用</Option>
                                <Option value="0">停用</Option>
                            </Select>
                        )
                    }
                </FormItem>
                <FormItem label="权限"  {...formItemLayout}>
                    <Tree
                        checkable//可勾选
                        defaultExpandAll//展开所有
                        onCheck={this.props.onCheck}//勾选的回调
                        checkedKeys={this.props.checkedKeys}//选中的值
                    >
                        {this.renderTreeNodes(menuConfig)}
                    </Tree>
                </FormItem>
            </Form>
        )
    }
}
SetPer = Form.create()(SetPer)




// 用户授权
class UserAuth extends React.Component {
    

    render() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: {span: 5},
            wrapperCol: {span: 19}
        }
        const detail_info = this.props.detailInfo
        return (
            <Form layout="horizontal">
                <FormItem label="角色名称" {...formItemLayout}>
                    {getFieldDecorator('role_name')(
                        <Input disabled maxLength={8} placeholder={detail_info.role_name} />
                    )}
                </FormItem>
                <FormItem label="选择用户:" {...formItemLayout}>
                    <Transfer
                        dataSource={this.props.dataSource} //左侧所有的数据
                        titles={["待选用户", "已选用户"]}
                        targetKeys={this.props.targetKeys} //右侧选中数据
                        onChange={this.props.onChange} //左右穿梭时的回调
                        render={item => item.title} //显示的label名字
                        showSearch //时候显示搜索框
                        listStyle={{
                            width: 250,
                            height: 500
                        }}
                    />
                </FormItem>
            </Form>
        )
    }
}
UserAuth = Form.create()(UserAuth)
