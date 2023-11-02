export const handlePolicies = policies => (req, res, next) => {
    const user = req.user.user || null
    if (!policies.includes(user.role.toUpperCase())) {
        return res.status(403).render('errors/base', { error: 'No autorizado!'})
    }
    return next()
}