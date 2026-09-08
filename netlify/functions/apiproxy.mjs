export default async (event) => {
  return new Response(JSON.stringify({ ok: true, path: event.path, rawPath: event.rawPath, query: event.query, rawQuery: event.rawQuery }), {
    status: 200,
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
  });
};
