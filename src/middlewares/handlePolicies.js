import { JWT_COOKIE_NAME, JWT_PRIVATE_KEY } from "../utils/utils.js";
import { verifyToken } from "../utils/utils.js";

export const handlePolicies = (policies) => (req, res, next) => {
    const token = req.cookies[JWT_COOKIE_NAME];
    if (!token) {
      return res.status(401).render('errors/base', { error: 'Unauthorized' });
    }
    try {
      const decodedToken = verifyToken(token);
      if (!policies.includes(decodedToken.user.role.toUpperCase())) {
        return res.status(403).render('errors/base', { error: 'Forbidden' });
      }
      next();
    } catch (error) {
      console.error('Error al verificar el token:', error);
      return res.status(500).render('errors/base', { error: 'Internal Server Error' });
    }
  };
  