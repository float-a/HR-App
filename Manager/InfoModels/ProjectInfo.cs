﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Manager.InfoModels
{
    public class ProjectInfo
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public string Status { get; set; }

        public int Duration { get; set; }

        public int EmployeesNumber { get; set; }
    }
}
