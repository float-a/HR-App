import React from 'react';
import AddEmployeeModalTemplate from './AddEmployeeModalTemplate.jsx';
import configs from '../helpers/calls';
import Context from '../../context/Context.js';
import * as Immutable from 'immutable';
import * as Controller from '../controller';

export default class Form extends React.Component{

    constructor(){
        super();
        this.state={
            jobTypes:[],
            positionTypes:[]
        }
    }

    componentWillMount(){
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
        
        $.ajax({
            method: 'GET',
            async: false,
            url: configs.baseUrl + 'api/employee/getPoisitionTypes',
            success: function (data) {
                console.log(data, this);
                this.setState({
                    positionTypes: data
                })
            }.bind(this)
        })          
    }

    componentDidMount(){
        $('#datepicker1').datepicker({});
        $('#datepicker2').datepicker({});
    }

    store(cb){

        const jobTypes = this.refs.jobType.options[this.refs.jobType.selectedIndex].value
        const positionypes = this.refs.positionType.options[this.refs.positionType.selectedIndex].value
        var inputInfo = {
            DepartmentId: this.props.departmentId,
            Name: this.refs.name.value,
            Address: this.refs.address.value,
            EmploymentDate: this.refs.employmentDate.value,
            ReleaseDate: this.refs.releaseDate.value,
            JobType: this.refs.jobType.value,
            PositionType: this.refs.positionType.value
        }
         $.ajax({
            method: 'POST',
            url: configs.baseUrl + 'api/employee/addEmployee',
            data:inputInfo,
            success: function (data) {              
                Context.cursor.update('employees',(oldList) => {      
                    return oldList.push( Immutable.fromJS(inputInfo) );
                   
                });
                 cb(); 
                 this.refresh(this.props.departmentId);
            }.bind(this)
        })   
        console.log(3)
    }

    refresh(departmentId){
         Controller.getAllEmployeesByDepartmentId(departmentId,1)
    }

    render(){
        const jobTypes = this.state.jobTypes.map((el,x)=>{
            return (
                <option value={el} key={x} > {el} </option>                         
            )
        });
        const positionTypes = this.state.positionTypes.map((el,x)=>{
            return (
                <option value={el} key={x} >{el}</option>                         
            )
        });
        return (

        <AddEmployeeModalTemplate close={this.props.close} store={this.store.bind(this)}>
            <div className="form-group">
                <label className="col-sm-4 control-label"> Name </label>
                <div className="col-sm-6">
                    <input  ref="name" className="form-control" placeholder="Name"/>
                </div>
            </div>
            <div className="form-group">
                <label className="col-sm-4 control-label"> Address </label>
                <div className="col-sm-6">
                    <input  ref="address" className="form-control" placeholder="Address"/>
                </div>
            </div>
            <div className="form-group">
                <label className="col-sm-4">Employment Date:</label>

                <div className="input-group date col-sm-6">
                  <div className="input-group-addon">
                    <i className="fa fa-calendar"></i>
                  </div>
                  <input type="text" ref ="employmentDate"className="form-control pull-right" id="datepicker1"/>
                </div>
                
              </div>
            <div className="form-group">
                <label className="col-sm-4">Release Date:</label>

                <div className="input-group date col-sm-6">
                  <div className="input-group-addon">
                    <i className="fa fa-calendar"></i>
                  </div>
                  <input type="text" ref ="releaseDate"className="form-control pull-right" id="datepicker2"/>
                </div>
                
              </div>
            
            <div className="form-group">
             <label className="col-sm-4 control-label"> Job Type </label>
                 <div className="col-sm-6">
            <select ref="jobType" className="selectpicker form-group">
                {jobTypes}        
                              
            </select>
            </div>
            </div>

            <div className="form-group">
                <label className="col-sm-4 control-label"> Position Type </label>
                 <div className="col-sm-6">
                <select ref="positionType" className="selectpicker form-group">
                          {positionTypes}           
                </select>
                </div>
            </div>
        </AddEmployeeModalTemplate>
        )
    }
}