﻿using Domain.Models;
using System.Collections.Generic;

namespace Contracts
{
    public interface IDepartmentRepository
    {
        IEnumerable<Department> GetAll();
        Department GetById(int id);

        void Save();

        IEnumerable<Project> GetAllDepartmentProjects(int id);

        IEnumerable<Employee> GetAllUnAllocatedEmployeesOnProject();


        IEnumerable<Employee> GetEmployeesThatAreNotFullyAllocated();

        IEnumerable<Employee> GetAllDepartmentMembers(int id);

        void AddEmployeeToDepartment(Employee employee);
    }
}
