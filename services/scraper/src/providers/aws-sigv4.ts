import crypto from 'node:crypto';

function sha256Hex(input: string | Buffer) {
  return crypto.createHash('sha256').update(input).digest('hex');
}

function hmac(key: Buffer | string, data: string) {
  return crypto.createHmac('sha256', key).update(data).digest();
}

export type SigV4Params = {
  method: 'POST' | 'GET' | 'PUT' | 'DELETE';
  service: string; // e.g., 'ProductAdvertisingAPI'
  region: string; // e.g., 'us-east-1'
  host: string; // e.g., 'webservices.amazon.com'
  path: string; // e.g., '/paapi5/getitems'
  headers: Record<string, string>; // must include 'content-type', 'host', 'x-amz-date', plus service-specific (e.g., x-amz-target)
  body?: string; // raw JSON for POST
  accessKeyId: string;
  secretAccessKey: string;
};

export function signSigV4(p: SigV4Params): { headers: Record<string, string> } {
  const now = p.headers['x-amz-date'];
  if (!now) throw new Error('Missing x-amz-date header');
  const dateStamp = now.slice(0, 8);
  const canonicalHeadersKeys = Object.keys(p.headers)
    .map((h) => h.toLowerCase())
    .sort();
  const canonicalHeaders = canonicalHeadersKeys
    .map((k) => `${k}:${p.headers[k] ?? p.headers[k.toUpperCase()]}`)
    .join('\n');
  const signedHeaders = canonicalHeadersKeys.join(';');
  const payloadHash = sha256Hex(p.body ?? '');
  const canonicalRequest = [
    p.method,
    p.path,
    '', // query string
    canonicalHeaders + '\n',
    signedHeaders,
    payloadHash,
  ].join('\n');

  const algorithm = 'AWS4-HMAC-SHA256';
  const credentialScope = `${dateStamp}/${p.region}/${p.service}/aws4_request`;
  const stringToSign = [
    algorithm,
    now,
    credentialScope,
    sha256Hex(canonicalRequest),
  ].join('\n');

  const kDate = hmac(`AWS4${p.secretAccessKey}`, dateStamp);
  const kRegion = hmac(kDate, p.region);
  const kService = hmac(kRegion, p.service);
  const kSigning = hmac(kService, 'aws4_request');
  const signature = crypto.createHmac('sha256', kSigning).update(stringToSign).digest('hex');

  const authorization = `${algorithm} Credential=${p.accessKeyId}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;
  return { headers: { ...p.headers, Authorization: authorization } };
}

