// TEMPORARY STUB for Feature Set 1 (#13) Core Authentication.
// Exports match the documented contract exactly — delete this file
// once #13 is merged; nothing else needs to change as long as the
// real file exports these same four functions from this same path.

export function requireApiLogin() {
  return (req, res, next) => {
    if (!req.session?.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    return next();
  };
}

export function requirePageLogin() {
  return (req, res, next) => {
    if (!req.session?.user) {
      return res.redirect("/login");
    }
    return next();
  };
}

export function requireApiRole(role) {
  return (req, res, next) => {
    if (!req.session?.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    if (req.session.user.role !== role) {
      return res.status(403).json({ error: "Forbidden" });
    }
    return next();
  };
}

export function requirePageRole(role) {
  return (req, res, next) => {
    if (!req.session?.user) {
      return res.redirect("/login");
    }
    if (req.session.user.role !== role) {
      return res.redirect("/403");
    }
    return next();
  };
}