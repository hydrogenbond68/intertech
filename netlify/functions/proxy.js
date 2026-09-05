export default async (event, context) => {
  const rawPath = event.path || '';
  const path = rawPath.replace(/^\/\.netlify\/functions\/proxy/, '');
  const queryString = event.rawQuery ? `?${event.rawQuery}` : '';
  const targetUrl = `https://hk-backend-1.onrender.com${path}${queryString}`;

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
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, Cache-Control, Pragma, Expires, ngrok-skip-browser-warning',
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
