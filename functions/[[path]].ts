// Cloudflare Functions 处理域名重定向
// 支持多语言子域名，只重定向主域名和英文子域名到www

interface Env {
  // 可以在这里定义环境变量
}

// 支持的语言子域名列表
const SUPPORTED_LANGUAGE_SUBDOMAINS = ['es', 'de', 'fr', 'ja', 'ko', 'th'];

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
  
  // 有子域名的情况
  if (parts.length >= 3) {
    const subdomain = parts[0];
    
    // 如果是支持的语言子域名，不重定向，继续处理
    if (SUPPORTED_LANGUAGE_SUBDOMAINS.includes(subdomain)) {
      return context.next();
    }
    
    // 如果是英文子域名，重定向到www（因为英文是默认语言）
    if (subdomain === 'en') {
      const newUrl = new URL(request.url);
      const domainParts = hostname.split('.');
      domainParts[0] = 'www';
      newUrl.hostname = domainParts.join('.');
      
      return Response.redirect(newUrl.toString(), 301);
    }
    
    // 其他未知子域名，重定向到www
    const newUrl = new URL(request.url);
    const domainParts = hostname.split('.');
    domainParts[0] = 'www';
    newUrl.hostname = domainParts.join('.');
    
    return Response.redirect(newUrl.toString(), 301);
  }
  
  // 其他情况继续处理
  return context.next();
};