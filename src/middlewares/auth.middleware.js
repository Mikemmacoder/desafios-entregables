export const privateRoutes = (req, res, next) => {
  if (req.user) return res.redirect("/profile");
  next();
};

export const publicRoutes = (req, res, next) => {
  if (!req.user) return res.redirect("/");
  next();
};
