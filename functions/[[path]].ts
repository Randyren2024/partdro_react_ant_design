// Cloudflare Functions 处理www域名重定向
// 这个函数会拦截所有请求并将子域名重定向到www主域名

interface Env {
  // 可以在这里定义环境变量
}

export const onRequest: PagesFunction<Env> = async (context) => {
  const { request } = context;
  const url = new URL(request.url);
  const hostname = url.hostname;
  
  // 如果已经是www域名，继续处理请求
  if (hostname.startsWith('www.')) {
    return context.next();
  }
  
  // 获取域名部分
  const parts = hostname.split('.');
  
  // 检查是否是主域名（没有子域名）
  if (parts.length === 2) {
    // 主域名访问，重定向到www
    const newUrl = new URL(request.url);
    newUrl.hostname = `www.${hostname}`;
    
    return Response.redirect(newUrl.toString(), 301);
  }
  
  // 有子域名的情况，重定向到www
  if (parts.length >= 3) {
    const newUrl = new URL(request.url);
    const domainParts = hostname.split('.');
    domainParts[0] = 'www';
    newUrl.hostname = domainParts.join('.');
    
    return Response.redirect(newUrl.toString(), 301);
  }
  
  // 其他情况继续处理
  return context.next();
};