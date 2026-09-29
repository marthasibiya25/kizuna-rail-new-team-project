export const requireAuth = (req, res, next) => {
  if (req.session && req.session.user) {
    return next();
  }
  if (req.originalUrl.startsWith('/api')) {
    return res.status(401).json({ error: 'No autenticado' });
  }
  return res.redirect('/login');
};

export const requireAdmin = (req, res, next) => {
  if (!req.session || !req.session.user) {
    if (req.originalUrl.startsWith('/api')) {
      return res.status(401).json({ error: 'No autenticado' });
    }
    return res.redirect('/login');
  }

  if (req.session.user.role !== 'admin') {
    if (req.originalUrl.startsWith('/api')) {
      return res.status(403).json({ error: 'Acceso denegado: se requiere rol de admin' });
    }
    return res.status(403).render('403', { title: 'Acceso Denegado' });
  }

  next();
};