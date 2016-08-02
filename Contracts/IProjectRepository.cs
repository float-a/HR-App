﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Domain.Models;

namespace Contracts
{
    public interface IProjectRepository
    {
        IEnumerable<Employee> GetEmployeeByProjectId(int ProjectId);
        IQueryable<EmployeeProject> GetEmployeesAllocation(int ProjectId);

        void Save();
        Project GetProjectById(int projectId);
        void AddEmployeeToProject(EmployeeProject ep);

        IEnumerable<EmployeeProject> GetEmployeeProjectById(int projectId);

        void Add(Project project);

        void Delete(Project project, IEnumerable <EmployeeProject> employeeProject);

        
    }
}
