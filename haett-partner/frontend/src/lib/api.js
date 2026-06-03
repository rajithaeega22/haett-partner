const BASE = '/api';

function getToken() {
  return localStorage.getItem('haett_token');
}

async function request(method, path, body) {
  const headers = { 'Content-Type': 'application/json' };
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

export const api = {
  // Auth
  login: (email, password) => request('POST', '/auth/login', { email, password }),
  register: (email, password, name) => request('POST', '/auth/register', { email, password, name }),
  me: () => request('GET', '/auth/me'),

  // Applications
  getMyApplication: () => request('GET', '/applications/my'),
  submitApplication: (data) => request('POST', '/applications', data),

  // Admin
  getApplications: (status = 'all') => request('GET', `/admin/applications?status=${status}`),
  approveApplication: (id) => request('POST', `/admin/applications/${id}/approve`),
  rejectApplication: (id, reason) => request('POST', `/admin/applications/${id}/reject`, { reason }),
  toggleCode: (id) => request('PATCH', `/admin/codes/${id}/toggle`),
};
