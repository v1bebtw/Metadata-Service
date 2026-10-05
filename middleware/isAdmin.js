function isAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      error: 'Доступ запрещён. Требуется роль администратора'
    });
  }

  next();
}

module.exports = { isAdmin };
