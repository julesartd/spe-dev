const csrf = require('csrf');
const tokens = new csrf();
const crypto = require('crypto');
const secret = tokens.secretSync();

const csrfMiddleware = (req, res, next) => {
  if (req.method === 'OPTIONS') {
    return next();
  }

  if (req.method === 'GET') {
    const csrfToken = tokens.create(secret); 
    res.locals.csrfToken = csrfToken; 

    const csrfTokenHash = crypto.createHmac('sha256', secret).update(csrfToken).digest('hex');
    res.cookie('csrf_token', csrfTokenHash, {
      httpOnly: true,
      sameSite: 'Lax', 
      secure: true,
    });

    return next();
  }

  if (['POST', 'PUT', 'DELETE'].includes(req.method)) {
    const csrfTokenClient = req.headers['x-csrf-token'] ;
    const csrfTokenServer = req.cookies['csrf_token'];


    if (!csrfTokenClient || !csrfTokenServer) {
      return res.status(403).json({ error: 'CSRF token is missing' });
    }

    const csrfTokenClientHash = crypto.createHmac('sha256', secret).update(csrfTokenClient).digest('hex');
    if (csrfTokenClientHash !== csrfTokenServer) {
      return res.status(403).json({ error: 'Invalid CSRF token' });
    }

    return next();
  }

  next();
};

module.exports = csrfMiddleware;