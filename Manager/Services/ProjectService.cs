﻿using AutoMapper;
using Contracts;
using Domain.Models;
using Manager.InfoModels;
using Manager.InputInfoModels;
using System.Collections.Generic;
using System.Linq;

namespace Manager.Services
{
    public class ProjectService
    {
        private readonly IProjectRepository _projectRepository;
        private readonly IDepartmentRepository _departmentRepository;
        private readonly IMapper _mapper;

        public ProjectService(IMapper mapper, IProjectRepository projectRepository, IDepartmentRepository departmentRepository)
        {
            _projectRepository = projectRepository;
            _departmentRepository = departmentRepository;
            _mapper = mapper;
        }

        public IEnumerable<EmployeeAllocationInfo> GetEmployeesAllocation(int projectId)
        {
            return _projectRepository.GetEmployeesAllocation(projectId)
                .Select(proj => new EmployeeAllocationInfo
                {
                    Id = proj.EmployeeId,
                    Name = proj.Employee.Name,
                    Allocation = proj.Allocation,
                    PositionType = proj.Employee.PositionType
                }).ToList();
        }

        public IEnumerable<EmployeeInfo> GetEmployeesByProjectId(int projectId)
        {
            var project = _projectRepository.GetProjectById(projectId);
            if (project != null)
            {
                var employees = _projectRepository.GetEmployeesByProjectId(projectId);

                if (employees != null)
                {
                    var employeeInfos = _mapper.Map<IEnumerable<EmployeeInfo>>(employees);
                    return employeeInfos;
                }
               
            }

            return null;

        }

        public OperationResult Add(AddProjectInputInfo inputInfo)
        {
            var newProject = _mapper.Map<Project>(inputInfo);

            var department = _departmentRepository.GetDepartmentById(inputInfo.DepartmentId);

            if (department != null)
            {
                _projectRepository.Add(newProject);
                return new OperationResult(true, Messages.SuccessfullyAddedProject);
            }

            return new OperationResult(false, Messages.ErrorWhileAddingProject);

        }
       

        public OperationResult Delete(int projectId)
        {
            Project project = _projectRepository.GetProjectById(projectId);
            IEnumerable<EmployeeProject> employeeProject = _projectRepository.GetEmployeeProjectById(projectId);
            _projectRepository.Delete(project, employeeProject);
            return new OperationResult(true, Messages.SuccessfullyDeletedProject);
        }

        
        public OperationResult UpdateProject(UpdateProjectInputInfo inputInfo)
        {
            var updatedProject = _projectRepository.GetProjectById(inputInfo.Id);

            if (updatedProject != null)
            {
                //update
                updatedProject.Name = inputInfo.Name;
                updatedProject.Status = inputInfo.Status;
                if (inputInfo.Duration != null)
                {
                    updatedProject.Duration = inputInfo.Duration;
                }
                //save
                _projectRepository.Save();
                //result
                return new OperationResult(true, Messages.SuccessfullyUpdatedProject);
               
            }
            return new OperationResult(false, Messages.ErrorWhileUpdatingProject);
        }

        public IEnumerable<ProjectInfo> GetAllDepartmentProjects(int inputInfo)
        {
            var depId = _mapper.Map<int>(inputInfo);

            var department = _departmentRepository.GetDepartmentById(depId);
            if (department != null)
            {
                var projects = _projectRepository.GetAllDepartmentProjects(department);
                if (projects != null)
                {
                    var projectInfos = _mapper.Map<IEnumerable<ProjectInfo>>(projects);
                    return projectInfos;
                }
                
            }
            return null;
        }

    }
}
