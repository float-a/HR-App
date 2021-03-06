import React, { Component } from 'react';
import {Link} from 'react-router';
import * as $ from 'jquery';
import configs from '../helpers/calls'
import Context from '../../context/Context.js';
import * as Immutable from 'immutable';
import Form from './Form';
import * as Controller from '../controller';
import EmployeeItem from './EmployeeItem.jsx'

export default class Employee extends React.Component{


    constructor(){
        super();
        this.state ={
            add: false,
            employees: Context.cursor.get("employees"),
            pageNr: 1,
            pageSize: 3,
            nrOfPages: null,
            filterByJob:{},
            filterByPosition:{},
            filterByAllocation:null,
            search:"",
            positionTypes:[],
            jobTypes:[],
            allocation: [0,10,20,30,40,50,60,70,80,90,100, 'None']
        }
    }

    componentWillMount(){
        $.ajax({
            method: 'GET',
            async: false,
            url: configs.baseUrl + 'api/employee/getPositionTypes',
            success: function (data) {
                console.log(data, this);
                this.setState({
                    positionTypes: data
                })
            }.bind(this)
        })  

        $.ajax({
            method: 'GET',
            async: false,
            url: configs.baseUrl + 'api/employee/getJobTypes',
            success: function (data) {
                console.log(data, this);
                this.setState({
                    jobTypes: data
                })
            }.bind(this)
        })

        Controller.getAllOffices();

       this.subscription = Context.subscribe(this.onContextChange.bind(this));
    }

      componentDidMount(){
          Controller.getAllEmployeesByDepartmentId(this.props.routeParams.departmentId,"",null,{},{},1);
          this.setNumberOfPages("",null,{},{}); 
    }

    componentWillUnmount () {
        this.subscription.dispose(); 
    }

    onContextChange(cursor){
        this.setState({
            employees: cursor.get('employees')
        })
    }

    getAllEmployeesByDepartmentId(pageNr,employeeName,allocation,position,job){
        Controller.getAllEmployeesByDepartmentId(this.props.routeParams.departmentId,employeeName,allocation,position,job,pageNr);
    }

    setNumberOfPages(employeeName,allocation,position,job){
         $.ajax({
            method: 'GET',
            async: false,
            url: configs.baseUrl + 'api/employee/getAllDepartmentEmployees?departmentId=' + this.props.routeParams.departmentId+ '&employeeName=' + employeeName + '&allocation=' + allocation + '&ptype=' +position + '&jtype=' + job  + '&pageSize=null&pageNr=null',
            success: function (data) {   

                if (!data){
                        data=[]
                }
                if (data.length==0){
                    this.setState(
                        {
                            nrOfPages: 1
                        }
                    )

                }else{
                    this.setState(
                        {
                            nrOfPages: Math.ceil( data.length / this.state.pageSize)
                        }
                    )

                }
            }.bind(this)
        })

    }

    showAddForm(){
        this.setState({
            add:true
        });
    }

    closeAddForm(){
        this.setState({
            add: !this.state.add
        })
    }

    back(){

        if (this.state.pageNr > 1){

            const whereTo=this.state.pageNr-1

            this.getAllEmployeesByDepartmentId(whereTo,this.state.search,this.state.filterByAllocation,this.state.filterByPosition,this.state.filterByJob)
            
             this.setState({
                pageNr:this.state.pageNr-1
            })
        }
                
    }

    next(){

        const whereTo=this.state.pageNr+1

        if(whereTo <= this.state.nrOfPages) {

            this.getAllEmployeesByDepartmentId(whereTo,this.state.search,this.state.filterByAllocation,this.state.filterByPosition,this.state.filterByJob)

            this.setState({
                pageNr:this.state.pageNr+1
            })

        }
    }

    last(){
        this.setNumberOfPages(this.state.search,this.state.filterByAllocation,this.state.filterByPosition,this.state.filterByJob);


        this.getAllEmployeesByDepartmentId(this.state.nrOfPages,this.state.search,this.state.filterByAllocation,this.state.filterByPosition,this.state.filterByJob)

        this.setState({
            pageNr: this.state.nrOfPages
        })
    }

    first(){
            if (this.state.pageNr!=1){
        this.getAllEmployeesByDepartmentId(1,this.state.search,this.state.filterByAllocation,this.state.filterByPosition,this.state.filterByJob)

        this.setState({
            pageNr:1
        })

            }


    }

    setPageNr(){
        
        this.setState({
            pageNr:1,
            filterByAllocation:null,
            filterByJob:{},
            filterByPosition:{},
            search:"",
        })

        this.setNumberOfPages("",null,{},{});
    }

    onDropDownChange(){
        
        let ptype=this.refs.positionTypes.options[this.refs.positionTypes.selectedIndex].value;
            if (ptype == 'None')
                ptype = {}

        let jtype=this.refs.jobTypes.options[this.refs.jobTypes.selectedIndex].value;
            if (jtype == 'None')
                jtype={}

        let allocation = this.refs.allocation.options[this.refs.allocation.selectedIndex].value;
            if (allocation == 'None')
                allocation = null

        let employeeName = this.refs.search.value;

        const pageNr = 1;

        this.setState({
            filterByPosition: ptype,
            filterByJob:jtype,
            filterByAllocation:allocation,
            search:employeeName,
            pageNr:pageNr
        })

        this.setNumberOfPages(employeeName,allocation, ptype, jtype );

        this.getAllEmployeesByDepartmentId(pageNr,employeeName,allocation,ptype,jtype)
    }

    onSearchChange(){
        let ptype=this.refs.positionTypes.options[this.refs.positionTypes.selectedIndex].value;
            if (ptype == 'None')
                ptype = {}

        let jtype=this.refs.jobTypes.options[this.refs.jobTypes.selectedIndex].value;
            if (jtype == 'None')
                jtype={}

        let allocation = this.refs.allocation.options[this.refs.allocation.selectedIndex].value;
            if (allocation == 'None')
                allocation = null

        const pageNr = 1;
        const employeeName = this.refs.search.value;

        this.setState({
            filterByPosition: ptype,
            filterByJob:jtype,
            filterByAllocation:allocation,
            search:employeeName,
            pageNr:pageNr
        })

        this.setNumberOfPages(employeeName,allocation, ptype, jtype );

        this.getAllEmployeesByDepartmentId(pageNr,employeeName,allocation,ptype,jtype)
    }

    render(){
        let positionTypes=this.state.positionTypes.map((el, x) => {
                return (
                    <option value={el.Id} key={x} >{el.Description}</option>
                )
            });

        const jobTypes=this.state.jobTypes.map((el, x) => {
                return (
                    <option value={el.Id} key={x} >{el.Description}</option>
                )
            });

        const allocation = this.state.allocation.map((el,x) =>{
            return(
                <option value={el} key={x}> {el} </option>
            )
        }
        )



        const items = this.state.employees.map( (element, index) => {
            return(
                <EmployeeItem
                    node = {element}
                    key = {index}
                    index={index}
                    departmentId = {this.props.routeParams.departmentId}
                    setPageNr={this.setPageNr.bind(this)}
                />
            )


        });


       const addModal = this.state.add ? <Form setPageNr={this.setPageNr.bind(this)} departmentId={this.props.routeParams.departmentId} show={this.state.add} close ={this.closeAddForm.bind(this)} /> : ""

        return(
            <div>

                <h2> {this.props.routeParams.departmentName} Employees</h2>

                <button className="btn btn-md btn-info" onClick={this.showAddForm.bind(this)}> <span className="glyphicon glyphicon-plus-sign"></span> Add new employee </button>

             <div>
                <div className="row">
                    <div className="col-sm-6 pull-right form-group">
                        <div className="col-sm-4">
                            <label className="control-label"> Job Type </label>
                            <select className="form-control" ref="jobTypes" onChange={this.onDropDownChange.bind(this)}>
                                <option value=""> None </option>
                                {jobTypes}
                            </select>
                        </div>

                        <div className="col-sm-4">
                            <label className="control-label"> Position </label>
                            <select className="form-control" ref="positionTypes" onChange={this.onDropDownChange.bind(this)}>
                                <option value=""> None </option>
                                {positionTypes}
                            </select>
                        </div>

                        <div className="col-sm-4">
                            <label className="control-label"> Allocation </label>
                            <select className="form-control" ref="allocation" onChange={this.onDropDownChange.bind(this)}>
                                <option value=""> None </option>
                                {allocation}
                            </select>
                        </div>

                    </div>

                    <div className="col-sm-2 pull-left form-group">
                            <label />
                            <input type="search" ref="search" className="form-control" placeholder="Search employee" onChange={this.onSearchChange.bind(this)}/>
                    </div>
                </div>
            </div>

                {addModal}

                    <table className="table table-striped table-custom">
                        <thead>
                        <tr>
                            <th className="col-md-2">Name</th>
                            <th className="col-md-2">Address</th>
                            <th className="col-md-2">Employment Date</th>
                            <th className="col-md-2">Termination Date</th>
                            <th className="col-md-2">Job Type</th>
                            <th className="col-md-2">Position</th>
                            <th className="col-md-2">Allocation</th>
                            <th className="col-md-2">Actions </th>
                        </tr>
                        </thead>
                        <tbody>
                            {items}
                        </tbody>
                    </table>

                    <div className="btn-wrapper">
                        <button className="rightArrow" onClick={this.first.bind(this)}>
                            <i className="fa fa-angle-double-left fa-2x" aria-hidden="true"></i>
                        </button>
                        <button className="leftArrow" onClick={this.back.bind(this)}>
                            <i className="fa fa-angle-left fa-2x" aria-hidden="true"></i>
                        </button>
                        <label className="to-right">{this.state.pageNr} </label>
                        <button className="rightArrow" onClick={this.next.bind(this)}>
                            <i className="fa fa-angle-right fa-2x" aria-hidden="true"></i>
                        </button>
                        <button className="rightArrow" onClick={this.last.bind(this)}>
                            <i className="fa fa-angle-double-right fa-2x" aria-hidden="true"></i>
                        </button>

                    </div>

            </div>
        )
    }
    
    
    
}