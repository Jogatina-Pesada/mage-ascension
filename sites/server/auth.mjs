export class HttpError extends Error {
  constructor(status, message) { super(message); this.status = status; }
}
export function json(value, status=200, extra={}) {
  return new Response(JSON.stringify(value), {status, headers:{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff',...extra}});
}
export function failure(error) {
  return json({error:error.status ? error.message : 'Erro interno. Nenhuma credencial foi exposta.'},error.status || 500);
}
export async function authorize(request, env) {
  // These headers are trusted only behind Sites dispatch. Local server always strips them.
  const id = request.headers.get('oai-authenticated-user-id');
  const email = request.headers.get('oai-authenticated-user-email');
  if (!id || !email) throw new HttpError(401,'Sessão expirada ou ausente. Entre com ChatGPT novamente.');
  const user={id,email};
  if (!['GET','HEAD'].includes(request.method)) {
    const origin=request.headers.get('Origin');
    if (origin && origin!==new URL(request.url).origin) throw new HttpError(403,'Origem não autorizada.');
    if (request.headers.get('Sec-Fetch-Site')==='cross-site') throw new HttpError(403,'Origem não autorizada.');
    if (!request.headers.get('Content-Type')?.startsWith('application/json')) throw new HttpError(415,'Envie application/json.');
  }
  if (!env.DB) throw new HttpError(503,'Banco de dados não configurado.');
  // Bind the bootstrap email to a stable Site ID once. Never grant first-visitor admin.
  if (env.MAGE_BOOTSTRAP_ADMIN_EMAIL && email.toLowerCase()===env.MAGE_BOOTSTRAP_ADMIN_EMAIL.toLowerCase()) {
    await env.DB.prepare("INSERT INTO members (user_id,email,role) SELECT ?,?,'admin' WHERE NOT EXISTS (SELECT 1 FROM members WHERE role='admin' AND active=1) ON CONFLICT(user_id) DO NOTHING").bind(id,email).run();
  }
  const membership=await env.DB.prepare('SELECT role FROM members WHERE user_id=? AND active=1').bind(id).first();
  user.role=membership?.role || null;
  // Let a visitor learn their Site-specific ID; this grants no record access.
  if(new URL(request.url).pathname==='/api/session' && request.method==='GET') return user;
  if (!user.role) throw new HttpError(403,'Usuário sem autorização. Solicite acesso ao narrador.');
  return user;
}
export function requireAdmin(user) {
  if(user.role!=='admin') throw new HttpError(403,'Ação exclusiva do narrador.');
}
export async function readBody(request, max=2*1024*1024) {
  if(Number(request.headers.get('Content-Length'))>max) throw new HttpError(413,'Arquivo muito grande.');
  const reader=request.body?.getReader();let size=0, chunks=[];
  if(!reader) throw new HttpError(400,'Corpo ausente.');
  while(true){const {done,value}=await reader.read();if(done)break;size+=value.byteLength;if(size>max){await reader.cancel();throw new HttpError(413,'Arquivo muito grande.');}chunks.push(value);}
  const bytes=new Uint8Array(size);let offset=0;for(const chunk of chunks){bytes.set(chunk,offset);offset+=chunk.byteLength;}
  try{return JSON.parse(new TextDecoder('utf-8',{fatal:true}).decode(bytes));}catch{throw new HttpError(400,'JSON inválido.');}
}
