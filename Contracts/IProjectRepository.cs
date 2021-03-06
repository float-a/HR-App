﻿using Domain.Models;
using System.Collections.Generic;
using System.Linq;
using Domain.Enums;

namespace Contracts
{
    public interface IProjectRepository
    {
        IEnumerable<Employee> GetEmployeesByProjectId(int projectId,PositionType? ptype, int? pageSize, int? pageNr);
        IQueryable<EmployeeProject> GetEmployeesAllocation(int projectId);

        void Save();
        Project GetProjectById(int projectId);

        void Add(Project project);

        void Delete(Project project);

        IEnumerable<EmployeeProject> GetEmployeeProjectById(int projectId);

        IEnumerable<Project> GetAllDepartmentProjects(Department department,ProjectStatus? status, int? pageSize, int? pageNr);
        int GetEmployeeProjectAllocationById(int projectId, int employeeId);
        
        //IEnumerable<string> GetProjectStatusDescriptions();
        EmployeeProject GetEmployeeProjectById(int employeeId, int projectId);

        void DeleteEmployeeProject(EmployeeProject ep);
    }
}
