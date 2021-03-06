import React from 'react';
import Modal from '../modal/Modal.jsx';
import configs from '../helpers/calls';
import Context from '../../context/Context.js';
import * as Immutable from 'immutable';
import * as $ from 'jquery';
import ValidateDepartment from '../validators/ValidateDepartment.js';

export default class EditForm extends React.Component{
    
    constructor(){
        super();
        this.state={
            departmentManagers:[],
            department:{
            },
             errors:{
                NameErrors:[]
            }
        }
    }

    componentWillMount(){
        $.ajax({
            method: 'GET',
            async: false,
            url: configs.baseUrl + 'api/department/getAllDepartmentManagers',
            success: function (data) {
                this.setState({
                    departmentManagers: data,
                    department: this.props.element
                })
            }.bind(this)
        })     
    }

    
    changeData(){

        const name = this.refs.name.value;
       
        const newO = {
            Id: this.state.department.get('Id'),
            Name:name,
            DepartmentManager:this.state.department.get('DepartmentManager'),
            NbrOfEmployees:this.state.department.get('NbrOfEmployees'),
            NbrOfProjects: this.state.department.get('NbrOfProjects')
        }

        this.setState({
            department: Immutable.fromJS(newO)
        })         
    }

    checkErrors()
    {
        if (this.state.errors.NameErrors.length == 0)
            return true
        return false
    }

    edit(cb){
        if (this.checkErrors() == true)
        {
        const depManagerId=this.refs.managersDropdown.options[this.refs.managersDropdown.selectedIndex].value;
        const depManagerName=this.refs.managersDropdown.options[this.refs.managersDropdown.selectedIndex].text;

        const newDep={
            Id: this.state.department.get('Id'),
            Name:this.state.department.get('Name'),
            OfficeId:this.props.officeId,
            DepartmentManagerId:depManagerId,
            NbrOfEmployees:this.state.department.get('NbrOfEmployees'),
            NbrOfProjects: this.state.department.get('NbrOfProjects')
        }

        const np= this.state.department.set('DepartmentManager',depManagerName);

          
        $.ajax({
            method: 'PUT',
            async: false,
            url: configs.baseUrl + 'api/department/updateDepartment',
            data:newDep,
            success: function (data) {
                if (data.Success == true)
                { 
                 const index= Context.cursor.get('departments').indexOf(this.props.element)
                   Context.cursor.get('departments').update( index,  oldInstance => {
                        oldInstance=np
                        return oldInstance;
                    });              
                 
                 cb();
                }
                else
                    alert("Invalid input!") 
                 
            }.bind(this)
        })   
        }
        else
            alert("Invalid input!")
              
    }

    onChangeName()
    {    
        const errors = ValidateDepartment.validateName(this.refs.name.value)
        this.state.errors.NameErrors = errors
       
         this.setState({
             errors: this.state.errors
         })
    }
  
    render(){

        const departmentManagers=this.state.departmentManagers.map((el, x) => {
            return (
                <option  value={el.Id} key={x} >{el.Name}</option>                         
            )
        });

        return(

        <Modal title={'Edit department'} button={'Edit'} close={this.props.close} action={this.edit.bind(this)}>
            <div className="form-group">
                <label className="col-sm-4 control-label"> Name </label>
                <div className="col-sm-6">
                    <div className="col-sm-10 red">
                        {this.state.errors.NameErrors}
                    </div>
                    <input  ref="name" className="form-control" placeholder="Name" value={this.state.department.get('Name')} onChange={this.changeData.bind(this)} onKeyUp={this.onChangeName.bind(this)}/>
                </div>
            </div>
           <div className="form-group">
           <label className="col-sm-4 control-label"> Department manager </label>
               <div className="col-sm-6">
                    <select className="selectpicker" ref="managersDropdown" >
                        {departmentManagers}
                    </select>
               </div>
           </div>
     
       
        </Modal>
        )
    }
    
    
}