﻿using Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Domain.Enums;

namespace Contracts
{
    public interface IEmployeeRepository
    {
        IEnumerable<EmployeeProject> GetProjectByEmployeeId(int employeeId);

        void ReleaseEmployee(int employeeId);

        Employee GetById(int employeeId);

        void Save();

        int ComputeTotalAllocation(int employeeId);

        void AddEmployeeToProject(EmployeeProject ep);

        IEnumerable<EmployeeProject> GetEmployeeProjectById(int projectId);

        IEnumerable<Employee> GetAllDepartmentEmployees(Department department, string employeeName,int? pageSize,int? pageNr,int? allocation, PositionType? ptype = null, JobType? jtype = null);

        void AddEmployee(Employee employee);

        IEnumerable<Employee> GetAllUnAllocatedEmployeesOnProject();

        IEnumerable<Employee> GetEmployeesThatAreNotFullyAllocated(int projectId,int? DepartmentId, int? pageSize, int? pageNr,PositionType? ptype);


        void AssignEmployee(EmployeeProject ep);

        IEnumerable<Employee> SearchEmployeesByName(int departmentId,string employeeName, int? pageSize, int? pageNr);
    }
}
