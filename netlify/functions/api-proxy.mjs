export default async (event) => {
  const rawPath = event.rawPath || event.path || 'unknown';
  const rawQuery = event.rawQuery || '';
  const httpMethod = event.httpMethod || 'unknown';

  return new Response(JSON.stringify({
    ok: true,
    rawPath,
    rawQuery,
    httpMethod,
    headers: Object.keys(event.headers || {}),
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
  });
};
