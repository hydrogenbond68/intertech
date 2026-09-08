export default async (event) => {
  const path = (event.query?.path || '').replace(/^\/api/, '');
  const originalQuery = event.rawQuery || '';
  const queryString = originalQuery ? `?${originalQuery}` : '';
  const targetUrl = `https://hk-backend-1.onrender.com/api${path}${queryString}`;

  const headers = { 'Accept': 'application/json' };
  if (event.headers['content-type']) headers['Content-Type'] = event.headers['content-type'];
  if (event.headers.authorization) headers['Authorization'] = event.headers.authorization;

  const options = {
    method: event.httpMethod,
    headers,
  };

  if (event.body && event.httpMethod !== 'GET' && event.httpMethod !== 'HEAD') {
    options.body = event.body;
  }

  try {
    const response = await fetch(targetUrl, options);
    const body = await response.text();

    return new Response(body, {
      status: response.status,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Content-Type': response.headers.get('Content-Type') || 'application/json',
      },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Proxy error', message: err.message }), {
      status: 502,
      headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' },
    });
  }
};
