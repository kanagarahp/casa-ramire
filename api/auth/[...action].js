import {
  handleBootstrap,
  handleChangePassword,
  handleForgotPassword,
  handleLogin,
  handleRecover,
  handleResetPassword,
  handleUsers,
} from '../_lib/auth-handlers.js';
import { sendJson } from '../_lib/http.js';

function actionFrom(req) {
  const fromQuery = req.query?.action;
  if (Array.isArray(fromQuery) && fromQuery.length) return String(fromQuery[0]);
  if (typeof fromQuery === 'string' && fromQuery) return fromQuery;

  const path = new URL(req.url || '/', 'http://localhost').pathname;
  return path.split('/').filter(Boolean).pop() || '';
}

const HANDLERS = {
  login: handleLogin,
  bootstrap: handleBootstrap,
  users: handleUsers,
  'change-password': handleChangePassword,
  recover: handleRecover,
  'forgot-password': handleForgotPassword,
  'reset-password': handleResetPassword,
};

export default async function handler(req, res) {
  const action = actionFrom(req);
  const handler = HANDLERS[action];

  if (!handler) {
    return sendJson(res, 404, { error: 'Endpoint auth tidak ditemukan.' });
  }

  return handler(req, res);
}
