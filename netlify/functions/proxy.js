export default async (event) => {
  const rawQuery = event.rawQuery || '';
  const pathMatch = rawQuery.match(/path=([^&]*)/);
  const path = pathMatch ? decodeURIComponent(pathMatch[1]) : '';
  const remainingQuery = rawQuery.replace(/&?path=[^&]*/, '').replace(/^\?/, '');
  const queryString = remainingQuery ? `?${remainingQuery}` : '';
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
    return new Response(JSON.stringify({ error: 'Proxy error', message: err.message, targetUrl }), {
      status: 502,
      headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' },
    });
  }
};
