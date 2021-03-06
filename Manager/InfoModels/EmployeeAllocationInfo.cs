﻿using Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Manager.InfoModels
{
    public class EmployeeAllocationInfo
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int Allocation { get; set; }
        public PositionType PositionType { get; set; }
    }
}
