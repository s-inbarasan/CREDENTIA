import { PasswordAnalysis, PhishingAnalysis } from '../types';

export const analyzePassword = (password: string): PasswordAnalysis => {
  let score = 0;
  const suggestions: string[] = [];

  if (password.length >= 8) score += 20;
  else suggestions.push("Increase length to at least 12 characters.");

  if (/[A-Z]/.test(password)) score += 20;
  else suggestions.push("Add uppercase letters.");

  if (/[a-z]/.test(password)) score += 20;
  else suggestions.push("Add lowercase letters.");

  if (/[0-9]/.test(password)) score += 20;
  else suggestions.push("Add numbers.");

  if (/[^A-Za-z0-9]/.test(password)) score += 20;
  else suggestions.push("Add special symbols.");

  // Common patterns
  const common = ['password', '123456', 'admin', 'qwerty'];
  if (common.some(c => password.toLowerCase().includes(c))) {
    score = Math.max(0, score - 40);
    suggestions.push("Avoid common words or sequences.");
  }

  let strength: PasswordAnalysis['strength'] = 'Weak';
  if (score > 40) strength = 'Medium';
  if (score > 80) strength = 'Strong';

  let crackTime = "Seconds";
  if (score > 80) crackTime = "Centuries";
  else if (score > 60) crackTime = "Years";
  else if (score > 40) crackTime = "Months";
  else if (score > 20) crackTime = "Days";

  return { strength, score, crackTime, suggestions };
};

export const analyzePhishing = (text: string): PhishingAnalysis => {
  const reasons: string[] = [];
  const tips: string[] = [
    "Never click links from unknown senders.",
    "Check the sender's email address carefully.",
    "Look for spelling and grammar mistakes.",
    "Hover over links to see the actual destination URL."
  ];

  // 1. URL Extraction & Basic Preprocessing
  const urlRegex = /(https?:\/\/[^\s]+)/gi;
  const urls = text.match(urlRegex);
  let totalScore = 0;

  // 2. Keyword Analysis (Text-based)
  const suspiciousKeywords = [
    'urgent', 'verify', 'login', 'account', 'suspended', 'bank', 'prize', 'winner', 
    'click here', 'action required', 'security alert', 'unauthorized', 'access', 
    'confirm', 'password reset', 'immediate', 'restricted', 'blocked', 'secure link',
    'payment failed', 'invoice', 'refund', 'tax', 'irs', 'government'
  ];
  const foundKeywords = suspiciousKeywords.filter(k => text.toLowerCase().includes(k));
  
  if (foundKeywords.length > 2) {
    totalScore += 30;
    reasons.push("Highly urgent or suspicious language detected.");
  } else if (foundKeywords.length > 0) {
    totalScore += 15;
    reasons.push("Contains sensitive keywords often used in phishing.");
  }

  // 3. Advanced URL Analysis
  if (urls && urls.length > 0) {
    urls.forEach(urlStr => {
      try {
        const url = new URL(urlStr.toLowerCase());
        const hostname = url.hostname;
        const pathname = url.pathname;
        const subdomain = hostname.split('.').slice(0, -2).join('.');
        const domain = hostname.split('.').slice(-2).join('.');

        // A. Temporary Tunnel / Hosting Domains / URL Shorteners
        const tempDomains = [
          'trycloudflare.com', 'ngrok.io', 'ngrok-free.app', 'localtonet.com', 
          'serveo.net', 'telebit.io', 'pagekite.me', 'localtunnel.me',
          'webhook.site', 'glitch.me', 'herokuapp.com', '000webhostapp.com',
          'bit.ly', 'tinyurl.com', 't.co', 'rb.gy', 'is.gd', 's.id', 'cutt.ly',
          'cloudflare-gateway.com', 'workers.dev', 'pages.dev', 'firebaseapp.com',
          'web.app', 'github.io', 'vercel.app', 'netlify.app', 'surge.sh'
        ];
        
        if (tempDomains.some(td => hostname.includes(td))) {
          totalScore += 75; // Guaranteed High Risk
          reasons.push(`Uses a temporary tunnel, hosting, or URL shortener domain: ${hostname}`);
        }

        // B. Suspicious TLDs
        const suspiciousTLDs = ['.xyz', '.top', '.pw', '.tk', '.ga', '.cf', '.ml', '.bid', '.loan', '.download', '.date', '.review', '.country', '.stream', '.gdn', '.mom', '.xin', '.kim', '.men', '.win', '.vip', '.work', '.click', '.link'];
        if (suspiciousTLDs.some(tld => hostname.endsWith(tld))) {
          totalScore += 40;
          reasons.push(`Uses a suspicious or low-cost top-level domain: ${hostname.split('.').pop()}`);
        }

        // C. Suspicious Subdomain Patterns
        if (subdomain) {
          // Excessive hyphens
          const hyphenCount = (subdomain.match(/-/g) || []).length;
          if (hyphenCount >= 3) {
            totalScore += 40;
            reasons.push("Excessive hyphens in subdomain, typical of phishing links.");
          }

          // Random-looking strings (basic heuristic: length and lack of vowels)
          if (subdomain.length > 20 && !/[aeiou]{2,}/i.test(subdomain)) {
            totalScore += 35;
            reasons.push("Subdomain appears to be a random or generated string.");
          }

          // Brand Impersonation (Basic)
          const commonBrands = [
            'google', 'microsoft', 'facebook', 'apple', 'amazon', 'paypal', 
            'netflix', 'bank', 'secure', 'support', 'login', 'verify', 
            'account', 'billing', 'security', 'wallet', 'crypto', 'coinbase', 'binance',
            'instagram', 'twitter', 'linkedin', 'whatsapp', 'telegram', 'outlook', 'gmail'
          ];
          
          const impersonated = commonBrands.find(brand => {
            // Check if brand is in subdomain but the main domain is NOT the official one
            const isOfficial = hostname.endsWith(`${brand}.com`) || hostname.endsWith(`${brand}.net`) || hostname.endsWith(`${brand}.org`) || hostname.endsWith(`${brand}.co`);
            return subdomain.includes(brand) && !isOfficial;
          });

          if (impersonated) {
            totalScore += 60;
            reasons.push(`Potential brand or service impersonation detected: "${impersonated}" in subdomain.`);
          }
        }

        // D. Phishing Keywords in URL
        const urlKeywords = ['login', 'verify', 'secure', 'account', 'update', 'signin', 'billing', 'portal', 'confirm', 'unauthorized', 'access', 'blocked', 'suspended', 'payment', 'refund', 'invoice'];
        if (urlKeywords.some(k => hostname.includes(k) || pathname.includes(k))) {
          totalScore += 25;
          reasons.push("URL contains phishing-related keywords like 'login' or 'verify'.");
        }

        // E. IP Address as Hostname
        const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
        if (ipRegex.test(hostname)) {
          totalScore += 75;
          reasons.push(`Uses a raw IP address (${hostname}) instead of a domain name, highly suspicious.`);
        }

        // F. Protocol Check
        if (url.protocol === 'http:') {
          totalScore += 30;
          reasons.push("Uses unencrypted HTTP protocol instead of HTTPS.");
        }

        // G. Long URL Check
        if (urlStr.length > 100) {
          totalScore += 15;
          reasons.push("URL is unusually long, which is often used to hide the true destination.");
        }

        // H. Excessive Subdomains
        const subdomainParts = hostname.split('.');
        if (subdomainParts.length > 4) {
          totalScore += 35;
          reasons.push("URL has an unusually high number of subdomains, which is a common obfuscation technique.");
        }

        // I. Obfuscation Techniques
        if (urlStr.includes('@')) {
          totalScore += 60;
          reasons.push("URL contains an '@' symbol, a common technique to hide the actual destination.");
        }

        if (pathname.includes('//')) {
          totalScore += 40;
          reasons.push("URL contains double slashes in the path, which can be used for obfuscation.");
        }

        if (hostname.includes('xn--')) {
          totalScore += 65;
          reasons.push("Punycode detected in domain, potential homograph attack (impersonating a real domain).");
        }

        if (/%[0-9a-f]{2}/i.test(urlStr)) {
          totalScore += 20;
          reasons.push("URL contains encoded characters, which can be used to hide malicious patterns.");
        }
      } catch (e) {
        totalScore += 10;
        reasons.push("Contains a malformed or suspicious URL structure.");
      }
    });
  } else if (text.length < 50 && foundKeywords.length > 0) {
    // Short message with keywords but no link (might be a precursor)
    totalScore += 15;
  }

  // 4. Final Risk Scoring
  let riskLevel: PhishingAnalysis['riskLevel'] = 'Low';
  if (totalScore >= 70) riskLevel = 'High';
  else if (totalScore >= 35) riskLevel = 'Medium';

  return {
    riskLevel,
    suspicious: totalScore >= 30,
    reasons: Array.from(new Set(reasons)), // Remove duplicates
    tips
  };
};
