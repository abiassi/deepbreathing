// A temporary redirect, so a client that cached it still reaches the legacy
// handler if the static image is ever removed from the registry. The CDN keeps
// it for the life of the deployment, so the handler runs about once per URL.
export function redirectToStaticOgImage(request: Request, staticPath: string) {
  return new Response(null, {
    status: 307,
    headers: {
      Location: new URL(staticPath, request.url).toString(),
      'Cache-Control': 'public, max-age=86400, s-maxage=31536000',
      'X-Robots-Tag': 'noindex',
    },
  });
}
