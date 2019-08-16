import React from "react";
import {Card, Modal, Form,Input, Button } from "antd";
import BaseForm from '../../../../common/BaseForm'
import Etable from "../../../../common/Etable";
import { updateSelectedItem } from '../../../../utils'
import request from '../../../../utils/request'
const FormItem = Form.Item


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
        targetKeys:[],
        detail:{},
        title:''
    }

    //查询
    handleSearch = (data)=>{
        console.log(data)
    }

    componentDidMount(){
        this.requestList()
    }

    //请求列表
    requestList(){
        request({
            url:'/user/list',
            type:'get',
            params:{
                page:this.params.page,
                pageSize:this.params.pageSize
            }
        }).then(res =>{
            if(res.code ===1){
                let dataSource = res.data.map((item, index) => {
                    item.key = index;
                    return item;
                });
                this.setState({
                    dataSource
                })
            }
        })
    }

    // 创建用户
    handleUser=()=>{
        this.setState({
            detail:{
                loginName:'',
                name:'',
                mobile:'',
                address:'',
                email:''
            },
            roleVisible:true,
            title:'创建用户'
        })
    }
    //编辑用户
    userEdit=(item)=>{
        this.setState({
            detail:item,
            roleVisible:true,
            title:'编辑用户'
        })
    }
    //重置密码
    resetPassword=()=>{
        const _this = this
        Modal.confirm({
            title: '提示',
            content: '确认要重置密码吗?',
            okText: '确认',
            cancelText: '取消',
            onOk:_this.doResetPassword
          });
    }
    //确认重置
    doResetPassword = ()=>{
        console.log(11)
    }
    



    render(){
        const columns = [
            {
                title: '角色ID',
                dataIndex: 'id'
            }, 
            {
                title: '登录名',
                dataIndex: 'loginName'
            },
            {
                title: '真实姓名',
                dataIndex: 'name'
            },
            {
                title: '联系电话',
                dataIndex: 'mobile'
            },
            {
                title: '权限',
                dataIndex: 'erpMemberRoles',
                render:(list)=>{
                    return list.map(item =>{
                        return item.roleName
                    }).join(",")
                }
            },
            {
                title: '联系地址',
                dataIndex: 'address'
            },
            {
                title:'操作',
                render:(item)=>{
                    return (
                        <div>
                            <Button size="small" type="primary" onClick={this.userEdit.bind(this,item)} style={{marginRight:'10px'}}>编辑</Button>
                            <Button size="small" type="primary" onClick={this.resetPassword} >重置密码</Button>
                        </div>
                    )
                }
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
                    <Button type="primary" onClick={this.handleUser}>创建用户</Button>
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
                    title={this.state.title}
                    visible={this.state.roleVisible}
                    onOk={this.creatRoleSubmit}
                    onCancel={()=>{this.setState({
                        roleVisible:false
                    })}}
                >
                    <CreatUser
                        detail = {this.state.detail}
                        wrappedComponentRef={(inst) => this.roleForm = inst} 
                    />
                </Modal>
            </div>
        )
    }
}

//创建角色
class CreatUser extends React.Component{

    render(){
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: {span: 5},
            wrapperCol: {span: 16}
        }
        const detail = this.props.detail
        return (
            <Form>
                <FormItem label="登录名" {...formItemLayout}>
                    {
                        getFieldDecorator('loginName',{
                            initialValue:detail.loginName
                        })(
                            <Input  type="text" placeholder="登录名" />
                        )
                    }
                </FormItem>
                <FormItem label="真实姓名" {...formItemLayout}>
                    {
                        getFieldDecorator('name',{
                            initialValue:detail.name
                        })(
                            <Input  type="text" placeholder="真实姓名" />
                        )
                    }
                </FormItem>
                <FormItem label="联系电话" {...formItemLayout}>
                    {
                        getFieldDecorator('mobile',{
                            initialValue:detail.mobile
                        })(
                            <Input  type="text" placeholder="联系电话" />
                        )
                    }
                </FormItem>
                <FormItem label="联系地址" {...formItemLayout}>
                    {
                        getFieldDecorator('address',{
                            initialValue:detail.address
                        })(
                            <Input  type="text" placeholder="联系地址" />
                        )
                    }
                </FormItem>
                <FormItem label="电子邮箱" {...formItemLayout}>
                    {
                        getFieldDecorator('email',{
                            initialValue:detail.email
                        })(
                            <Input  type="text" placeholder="电子邮箱" />
                        )
                    }
                </FormItem>
            </Form>
        )
    }
}
CreatUser = Form.create()(CreatUser)
