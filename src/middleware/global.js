/**
 * Helper function to set all expected res.locals values
 */
const setLocalVariables = (req, res, next) => {
    // Make NODE_ENV available to all templates
    res.locals.NODE_ENV = process.env.NODE_ENV?.toLowerCase() || 'production';

    // Make any query parameters available to all templates
    res.locals.query = req.query;

    // Make the logged-in session user (if any) available to all templates.
    // TEMPORARY: relies on req.session.user, set by our dev-login stub for now —
    // once Feature Set 1 (#13) provides real login, this line needs no changes.
    res.locals.user = req.session?.user || null;

    next();
};

export default setLocalVariables;