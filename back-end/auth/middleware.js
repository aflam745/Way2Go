// Helper function
const factoryResponse = (status, message) => ({ status, message });

//! Will not use this for now
const isAuthenticated = (req, res, next) => {
    return req.isAuthenticated()
        ? next()
        : res.status(401).json(factoryResponse(401, "Unauthorized"));
};

//Might add role authorization checking later.
exports.factoryResponse = factoryResponse
exports.isAuthenticated = isAuthenticated