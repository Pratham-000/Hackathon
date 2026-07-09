const normalizeRole = (role) => {
  const mapped = String(role || '').toUpperCase();
  const roleMap = {
    ADMIN: 'SUPER_ADMIN',
    SUPERADMIN: 'SUPER_ADMIN',
    SUPER_ADMIN: 'SUPER_ADMIN',
    ORGADMIN: 'ORG_ADMIN',
    ORG_ADMIN: 'ORG_ADMIN',
    FINANCE: 'FINANCE_MANAGER',
    FINANCE_MANAGER: 'FINANCE_MANAGER',
    HR: 'HR_MANAGER',
    HR_MANAGER: 'HR_MANAGER',
    EMPLOYEE: 'EMPLOYEE',
    ANALYST: 'ANALYST',
  };

  return roleMap[mapped] || mapped;
};

const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    const userRole = normalizeRole(req.user?.role);
    const normalizedAllowedRoles = allowedRoles.map(normalizeRole);

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    if (!normalizedAllowedRoles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: insufficient permissions',
      });
    }

    next();
  };
};

module.exports = authorizeRoles;