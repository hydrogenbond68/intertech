export default async (event) => {
  const path = event.path.replace(/^\/\.netlify\/functions\/proxy/, '');
  const queryString = event.rawQuery ? `?${event.rawQuery}` : '';
  const targetUrl = `https://hk-backend-1.onrender.com${path}${queryString}`;

  const headers = {};
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

    return {
      statusCode: response.status,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, Cache-Control, Pragma, Expires, ngrok-skip-browser-warning',
        'Content-Type': response.headers.get('Content-Type') || 'application/json',
      },
      body,
    };
  } catch (err) {
    return {
      statusCode: 502,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: 'Proxy error', message: err.message }),
    };
  }
};
