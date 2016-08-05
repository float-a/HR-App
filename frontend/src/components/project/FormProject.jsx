import React from 'react';
import configs from '../helpers/calls';
import Context from '../../context/Context.js';
import * as Immutable from 'immutable';
import Modal from '../modal/Modal.jsx';
import * as Controller from '../controller';

export default class Form extends React.Component{

    constructor(){
        super();
    };

    store(cb){
        var inputInfo={
            Name: this.refs.name.value,
            Status: this.refs.status.value,
            Duration: this.refs.duration.value,
            DepartmentId: this.props.departmentId,
        }
        
        $.ajax({
            method: 'POST',
            async: false,
            url: configs.baseUrl + 'api/project/add',
            data:inputInfo,
            success: function (data) {
                cb();
                this.refresh(this.props.departmentId);
            }.bind(this)
        })
    }

    refresh(departmentId){
        Controller.getAllDepProjects(departmentId,1);
    }

    render(){

        return(

           <Modal title={'Add new project'} button={'Add'} close={this.props.close} action={this.store.bind(this)}>
            <div className="form-group">
                <label className="col-sm-4 control-label"> Name </label>
                <div className="col-sm-6">
                    <input  ref="name" className="form-control" placeholder="Name"/>
                </div>
                <label className="col-sm-4 control-label"> Status </label>
                    <div className="col-sm-6">
                        <input  ref="status" className="form-control" placeholder="Project Status"/>
                    </div>
                    <label className="col-sm-4 control-label"> Duration </label>
                    <div className="col-sm-6">
                        <input  ref="duration" className="form-control" placeholder="Project Status"/>
                    </div>
            </div>
     
       
        </Modal>
        )
    }
}