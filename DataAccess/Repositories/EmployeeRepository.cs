﻿using Contracts;
using DataAccess.Context;
using Domain.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity.Core.Objects;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Extensions;
using Domain.Enums;
using Manager.Descriptors;

namespace DataAccess.Repositories
{
    public class EmployeeRepository: IEmployeeRepository
    {
        private readonly DbContext _context;
        public EmployeeRepository(DbContext context)
        {
            _context = context;
        }
        public IEnumerable<EmployeeProject> GetProjectByEmployeeId(int employeeId)
        {
            return _context.EmployeeProjects.Where(e => e.EmployeeId == employeeId).ToList();
        }
        public void Save()
        {
            _context.SaveChanges();
        }
        public void ReleaseEmployee(int employeeId)
        {
            var employees=_context.EmployeeProjects.Where(e => e.EmployeeId == employeeId).ToList();


            if (employees.Count != 0)
            {

                foreach (var ep in employees)
                {
                    _context.EmployeeProjects.Remove(ep);
                }
            }

            var employee = _context.Employees.SingleOrDefault(e => e.Id == employeeId);

            if (employee != null)
            {
                employee.ReleaseDate = DateTime.Now;
                Save();
            }
            
        }

        public Employee GetById(int employeeId)
        {
            return _context.Employees.SingleOrDefault(o => o.Id == employeeId);
        }

        public int ComputeTotalAllocation(int employeeId)
        {
            return _context.EmployeeProjects.Where(ep => ep.EmployeeId == employeeId).ToList().Sum(ep => ep.Allocation);         
        }


        public void AddEmployeeToProject(EmployeeProject ep)
        {
            Employee employee = _context.Employees.SingleOrDefault(e => e.Id == ep.EmployeeId);
            Project project = _context.Projects.SingleOrDefault(p => p.Id == ep.ProjectId);
            ep.Employee = employee;
            ep.Project = project;
            _context.EmployeeProjects.Add(ep);
            Save();
        }

        public IEnumerable<EmployeeProject> GetEmployeeProjectById(int projectId)
        {
            return _context.EmployeeProjects.Where(ep => ep.ProjectId == projectId).ToList();
        }

        public IEnumerable<Employee> GetAllDepartmentEmployees(Department department,string employeeName, int? pageSize, int? pageNr, int? allocation, PositionType? ptype = null, JobType? jtype = null)
        {
            return
                _context.Employees.Where(e => e.DepartmentId == department.Id)
                    .Where(e =>(allocation == null|| ( !e.EmployeeProjects.Any() && allocation ==0) || e.EmployeeProjects.Sum(ep=>ep.Allocation)==allocation) && (ptype == null || e.PositionType == ptype) && (jtype == null || e.JobType == jtype) && (string.IsNullOrEmpty(employeeName) || e.Name.StartsWith(employeeName)))
                    .OrderBy(e => e.Name)
                    .Paginate(pageSize, pageNr)
                    .ToArray();    
        }
        public void AddEmployee(Employee employee)
        {
            _context.Employees.Add(employee);
            Save();
        }

        public IEnumerable<Employee> GetAllUnAllocatedEmployeesOnProject()
        {
            var employees = _context.Employees.ToList();
            List<Employee> unallocatedEmployees = new List<Employee>();
            foreach (Employee employee in employees)
            {
                if (ComputeTotalAllocation(employee.Id) == 0)
                {
                    unallocatedEmployees.Add(employee);
                }
            } 
            return unallocatedEmployees;
        }

        public IEnumerable<Employee> GetEmployeesThatAreNotFullyAllocated(int projectId,int? departmentId,int? pageSize, int? pageNr,PositionType? ptype)
        {
            var employees = _context.Employees.ToList();
            List<Employee> notfullyAllocatedEmployees = new List<Employee>();
            foreach (Employee employee in employees)
            {
                var employeeProject = GetEmployeeProjectCombinationById(projectId, employee.Id);
                if (ComputeTotalAllocation(employee.Id) < 100 && employeeProject ==null && (employee.ReleaseDate ==null || employee.ReleaseDate.Equals(DateTime.MinValue)))
                {
                    notfullyAllocatedEmployees.Add(employee);
                }
            }
            return notfullyAllocatedEmployees.
                Where(e =>(departmentId == null || e.Department.Id==departmentId) && (ptype == null || e.PositionType == ptype)).    
                AsQueryable().
                Paginate(pageSize, pageNr);
        }

        public IEnumerable<string> GetJobTypesDescriptions()
        {
            List<string> descriptions = new List<string>();
            foreach (JobType jt in Enum.GetValues(typeof(JobType)))
            {
                descriptions.Add(jt.GetDescription());
            }
            return descriptions;
        }

        public IEnumerable<string> GetPositionTypeDescriptions()
        {
            List<string> descriptions = new List<string>();
            foreach (PositionType pt in Enum.GetValues(typeof(PositionType)))
            {
                descriptions.Add(pt.GetDescription());
            }
            return descriptions;
        }

        public void AssignEmployee(EmployeeProject ep)
        {
            _context.EmployeeProjects.Add(ep);
            Save();
        }

        public EmployeeProject GetEmployeeProjectCombinationById(int projectId, int employeeId)
        {
            return _context.EmployeeProjects.SingleOrDefault(ep => ep.ProjectId == projectId && ep.EmployeeId == employeeId);
        }

        public IEnumerable<Employee> SearchEmployeesByName(int departmentId,string employeeName, int? pageSize, int? pageNr)
        {
            return _context.Employees.Where(e =>(e.Department.Id==departmentId) && e.Name.StartsWith(employeeName)).ToArray();
        }
    }
}
