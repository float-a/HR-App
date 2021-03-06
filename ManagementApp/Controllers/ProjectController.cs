﻿using Manager.InputInfoModels;
using Manager.Services;
using System.Web.Http;
using System.Web.Http.Cors;
using Domain.Enums;
using Manager.InfoModels;

namespace ManagementApp.Controllers
{
    [RoutePrefix("api/project")]
    [EnableCors("*", "*", "GET,POST,PUT,DELETE")]
    public class ProjectController : ApiController
    {

        private readonly ProjectService _projectService;

        public ProjectController(ProjectService projectService)
        {
            _projectService = projectService;
        }

        [Route("getEmployeesByProjectId")]
        [HttpGet]
        public IHttpActionResult GetEmployeesByProjectId(int projectId, int? pageSize, int? pageNr,PositionType? ptype = null)
        {
            var result = _projectService.GetEmployeesByProjectId(projectId,ptype, pageSize, pageNr);
            return Json(result);
        }

        [Route("getEmployeesAllocation")]
        [HttpGet]
        public IHttpActionResult GetEmployeesAllocation(int projectId)
        {
            var result = _projectService.GetEmployeesAllocation(projectId);
            return Json(result);
        }

        [Route("add")]
        [HttpPost]
        public IHttpActionResult Add([FromBody] AddProjectInputInfo inputInfo)
        {
            var result = _projectService.Add(inputInfo);
            return Json(result);
        }


        [Route("delete")]
        [HttpDelete]
        public IHttpActionResult Delete(int projectId)
        {
            var result = _projectService.Delete(projectId);
            return Json(result);
        }

        [Route("updateProject")]
        [HttpPut]
        public IHttpActionResult UpdateProject([FromBody] UpdateProjectInputInfo inputInfo)
        {
            var result = _projectService.UpdateProject(inputInfo);
            return Json(result);
        }

        [Route("getAllDepartmentProjects")]
        [HttpGet]
        public IHttpActionResult GetAllDepartmentProjects(int depId,int? pageSize, int? pageNr, ProjectStatus? status = null)
        {
            var result = _projectService.GetAllDepartmentProjects(depId,status, pageSize, pageNr);
            return Json(result);
        }

        [Route("deleteEmployeeFromProject")]
        [HttpDelete]
        public IHttpActionResult DeleteEmployeeFromProject(int employeeId, int projectId)
        {
            var result = _projectService.DeleteEmployeeFromProject(employeeId, projectId);
            return Json(result);
        }

        [Route("getProjectStatusDescriptions")]
        [HttpGet]
        public IHttpActionResult GetProjectStatusDescriptions()
        {
            var result = _projectService.GetProjectStatusDescriptions();
            return Json(result);
        }

    }
}