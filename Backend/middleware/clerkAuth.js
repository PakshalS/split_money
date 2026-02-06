const { clerkMiddleware, requireAuth } = require('@clerk/express');

const authUser = clerkMiddleware();

// Middleware to ensure user is authenticated
const requireUserAuth = requireAuth({
});

module.exports = { authUser, requireUserAuth };