export async function generateKey(): Promise<CryptoKey> {
  return crypto.subtle.generateKey(
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"]
  );
}

export async function exportKey(key: CryptoKey): Promise<string> {
  const raw = await crypto.subtle.exportKey("raw", key);
  return Array.from(new Uint8Array(raw))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function importKey(hex: string): Promise<CryptoKey> {
  const bytes = new Uint8Array(
    hex.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16))
  );
  return crypto.subtle.importKey(
    "raw",
    bytes,
    { name: "AES-GCM" },
    true,
    ["encrypt", "decrypt"]
  );
}

export async function encryptRaw(data: Uint8Array, key: CryptoKey): Promise<Uint8Array> {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const ciphertext = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, data as any);
  const combined = new Uint8Array(iv.length + ciphertext.byteLength);
  combined.set(iv, 0);
  combined.set(new Uint8Array(ciphertext), iv.length);
  return combined;
}

export async function decryptRaw(combined: Uint8Array, key: CryptoKey): Promise<Uint8Array> {
  const iv = combined.slice(0, 12);
  const ciphertext = combined.slice(12);
  const decrypted = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, ciphertext as any);
  return new Uint8Array(decrypted);
}

export async function encryptText(text: string, key: CryptoKey): Promise<string> {
  const encoded = new TextEncoder().encode(text);
  const encrypted = await encryptRaw(encoded, key);
  return Array.from(encrypted).map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function decryptText(hex: string, key: CryptoKey): Promise<string> {
  const bytes = new Uint8Array(hex.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16)));
  const decrypted = await decryptRaw(bytes, key);
  return new TextDecoder().decode(decrypted);
}
