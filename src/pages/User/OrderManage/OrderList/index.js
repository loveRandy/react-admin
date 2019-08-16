import React,{ Fragment } from 'react'
import { Card,Button,Modal,message } from 'antd'
import FormCollection from '../../../../common/BaseForm'
import Etable from '../../../../common/Etable'
import { updateSelectedItem, getList } from '../../../../utils'

class FormList extends React.Component{
    
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
            width:'120px'
        },
        {
            type:'input',
            initialValue:'',
            label:'密码',
            placeholder:'请输入用密码',
            field:'password',
            width:'120px'
        },
        {
            type:'select',
            initialValue:'',
            label:'网名',
            field:'siteName',
            width:'100px',
            list:[{id:0,label:'全部',value:''},{id:1,label:'randy',value:'1'},{id:2,label:'peter',value:'2'},{id:3,label:'hui',value:'3'}]
        },
        {
            type:'chooseTime',
            label:'订单时间'
        }
    ]

    state = {
        dataSource:[],
        rowSelection:{
            selectedRowKeys:[],
            selectedRows:[]
        }
    }

    componentDidMount(){
        this.requestList()
    }
    requestList = () =>{
        const options = {
            url: '/initial/list',
            method: 'get',
            params:{
                page:this.params.page,
                pageSize:this.params.pageSize
            },
            data:{}
        }
        getList(this,options)
    }
    handleSearch = (data)=>{
        console.log(this)
    }
    handleDelete = (item,e)=>{
        e.stopPropagation()//阻止冒泡
        Modal.confirm({
            title:'确认',
            content:'您确认要删除此条数据吗？',
            onOk:()=>{
                message.success('删除成功');
            }
        })
    }
    render(){
        const columns = [
            {
                title:'Id',
                dataIndex:'id'
            },
            {
                title:'姓名',
                dataIndex:'teacherName'
            },
            {
                title:'年龄',
                dataIndex:'Seniority'
            },
            {
                title:'性别',
                dataIndex:'grade',
                render(grade){
                    const config = {
                        '1':'男',
                        '2':'女',
                        '3':'女娇娥'
                    }
                    return config[grade]
                }
            },
            {
                title:'操作',
                render:(item)=>{
                    return <Button size="small" type="primary" onClick={ (e)=>{this.handleDelete(item,e)} }>删除</Button>
                }
            }
        ];
        return (
            <Fragment>
                <Card style={{margin:'20px 0'}}>
                    <FormCollection data={this.data} handleSearch={this.handleSearch}></FormCollection>
                </Card>
                <Card>
                    <Etable
                        that={this}
                        dataSource={this.state.dataSource}
                        columns={columns}
                        pagination={this.state.pagination}
                        rowSelection={this.state.rowSelection}
                        updateSelectedItem={updateSelectedItem.bind(this)}
                    />
                </Card>
                
            </Fragment>
            

        )
    }
}

export default FormList;