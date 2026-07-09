const mapAuthUser = (user) => ({
  id: user.id,
  fullName: user.fullName,
  email: user.email,
  role: user.role,
});

module.exports = {
  mapAuthUser,
};
