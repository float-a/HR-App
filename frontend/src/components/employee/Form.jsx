import React from 'react';
import configs from '../helpers/calls';
import Context from '../../context/Context.js';
import * as Immutable from 'immutable';
import * as Controller from '../controller';
import Modal from '../modal/Modal.jsx';
import ValidateEmployee from '../validators/ValidateEmployee.js';

export default class Form extends React.Component{

    constructor(){
        super();
        this.state={
            jobTypes:[],
            positionTypes:[],
            errors:{
                NameErrors:[],
                AddressErrors:[]
            }
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
            url: configs.baseUrl + 'api/employee/getPositionTypes',
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

        checkErrors()
    {
        console.log(this.state.errors.AddressErrors)
        if (this.state.errors.NameErrors.length == 0 && this.state.errors.AddressErrors.length == 0)
            return true
        return false
    }


    store(cb){

        if (this.checkErrors() == true)
        {
        const jobType = this.refs.jobType.options[this.refs.jobType.selectedIndex].value
        const positionType = this.refs.positionType.options[this.refs.positionType.selectedIndex].value

        var inputInfo = {
            DepartmentId: this.props.departmentId,
            Name: this.refs.name.value,
            Address: this.refs.address.value,
            EmploymentDate: this.refs.employmentDate.value,
            ReleaseDate: this.refs.releaseDate.value,
            JobType: jobType,
            PositionType: positionType
        }

        console.log(inputInfo)
         $.ajax({
            method: 'POST',
            url: configs.baseUrl + 'api/employee/addEmployee',
            data:inputInfo,
            success: function (data) { 
                    if (data.Success == true){             
                     cb(); 
                     this.refresh(this.props.departmentId);}
                     else
                        alert("Invalid input!")
            }.bind(this)
         }
         )
        }
        else
        {
            alert("Invalid input!")
        }
    }

    refresh(departmentId){
        this.props.setPageNr();
         Controller.getAllEmployeesByDepartmentId(departmentId,"",null,{},{},1)
         }

    onChangeName()
    { 
        const errors = ValidateEmployee.validateName(this.refs.name.value)
        this.state.errors.NameErrors = errors
       
         this.setState({
             errors: this.state.errors
         })
    }

    onChangeAddress()
    { 
        const errors = ValidateEmployee.validateAddress(this.refs.address.value)
        this.state.errors.AddressErrors = errors
       
         this.setState({
             errors: this.state.errors
         })
    }

    render(){
        const jobTypes = this.state.jobTypes.map((el,x)=>{
            return (
                <option value={el.Id} key={x} id={el.Id}  > {el.Description} </option>                         
            )
        });
        const positionTypes = this.state.positionTypes.map((el,x)=>{
            return (
                <option value={el.Id} key={x} id ={el.Id} >{el.Description}</option>                         
            )
        });
         return(

        <Modal title={'Add new employee'} button={'Add'} close={this.props.close} action={this.store.bind(this)}>
      
           <div className="form-group">
                <label className="col-sm-4 control-label"> Name </label>
                <div className="col-sm-6">
                    <div className="col-sm-10 red">
                        {this.state.errors.NameErrors}
                    </div>
                    <input  ref="name" className="form-control" placeholder="Name" onKeyUp={this.onChangeName.bind(this)}/>
                </div>
            </div>
            <div className="form-group">
                <label className="col-sm-4 control-label"> Address </label>
                <div className="col-sm-6">
                    <div className="col-sm-10 red">
                        {this.state.errors.AddressErrors}
                    </div>
                    <input  ref="address" className="form-control" placeholder="Address" onKeyUp={this.onChangeAddress.bind(this)}/>
                </div>
            </div>
            <div className="form-group">
                <label className="col-sm-4 control-label">Employment Date</label>
                <div className="col-sm-6">
                    <div className="input-group date">
                      <div className="input-group-addon">
                        <i className="fa fa-calendar"></i>
                      </div>
                      <input type="text" ref ="employmentDate"className="form-control pull-right" id="datepicker1"/>
                    </div>
                </div>
                
              </div>
            <div className="form-group">
                <label className="col-sm-4 control-label">Release Date <div className="col-sm-16 darkred">
                        *Release date must be set after employment date!
                        </div></label>
                <div className="col-sm-6">
                    <div className="input-group date">
                      <div className="input-group-addon">
                        <i className="fa fa-calendar"></i>
                      </div>
                      <input type="text" ref ="releaseDate"className="form-control pull-right" id="datepicker2"/>
                    </div>
                </div>
              </div>
            
            <div className="form-group">
             <label className="col-sm-4 control-label"> Job Type </label>
                <div className="col-sm-6">
                    <select ref="jobType" className="selectpicker form-control">
                        {jobTypes}
                    </select>
                </div>
            </div>




            <div className="form-group">
                <label className="col-sm-4 control-label"> Position Type </label>
                 <div className="col-sm-6">
                <select ref="positionType" className="selectpicker form-control">
                          {positionTypes}           
                </select>
                </div>
            </div>
           

            </Modal>


        
        )
    }
}