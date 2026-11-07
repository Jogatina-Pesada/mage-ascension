import { authorize, json, failure } from './auth.mjs';
import { dataRoute } from './data.mjs';
export default {
  async fetch(request, env) {
    try {
      const url = new URL(request.url);
      if (url.pathname.startsWith('/api/')) {
        const user = await authorize(request, env);
        return await dataRoute(request, env, user);
      }
      if (!['GET','HEAD'].includes(request.method)) return json({error:'Método não permitido.'},405);
      const key = url.pathname === '/' ? '/index.html' : url.pathname;
      const asset = bundledAssets[key];
      if (!asset) return json({error:'Não encontrado.'},404);
      return new Response(request.method==='HEAD' ? null : asset.binary ? Uint8Array.from(atob(asset.body),c=>c.charCodeAt(0)) : asset.body, {
        headers:{'Content-Type':asset.type,'X-Content-Type-Options':'nosniff','Cache-Control':'no-store','Referrer-Policy':'same-origin'}
      });
    } catch(error) { return failure(error); }
  }
};
