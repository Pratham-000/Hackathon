const mapEmployee = (employee) => ({
  id: employee.id,
  employeeCode: employee.employeeCode,
  fullName: employee.fullName,
  email: employee.email,
  salary: Number(employee.salary),
  bonus: employee.bonus ? Number(employee.bonus) : 0,
  experienceYears: employee.experienceYears,
  performanceScore: employee.performanceScore ? Number(employee.performanceScore) : null,
  workloadScore: employee.workloadScore ? Number(employee.workloadScore) : null,
  isActive: employee.isActive,
  hiredAt: employee.hiredAt,
  createdAt: employee.createdAt,
  updatedAt: employee.updatedAt,
  organization: employee.organization
    ? {
        id: employee.organization.id,
        name: employee.organization.name,
        industry: employee.organization.industry,
        currency: employee.organization.currency,
      }
    : null,
  department: employee.department
    ? {
        id: employee.department.id,
        name: employee.department.name,
        code: employee.department.code,
      }
    : null,
  role: employee.role
    ? {
        id: employee.role.id,
        title: employee.role.title,
        level: employee.role.level,
      }
    : null,
  skills: employee.employeeSkills
    ? employee.employeeSkills.map((item) => ({
        id: item.skill.id,
        name: item.skill.name,
        category: item.skill.category,
        proficiency: item.proficiency,
        yearsUsed: item.yearsUsed,
      }))
    : [],
});
module.exports = { mapEmployee };