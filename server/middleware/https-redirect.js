export default defineEventHandler((event) => {
  const req = event.node.req;
  const host = req.headers.host;
  const proto = req.headers['x-forwarded-proto'];

  if (proto === 'http' && !host.includes('localhost')) {
    const url = `https://${host}${req.url}`;
    sendRedirect(event, url, 301);
  }
});
