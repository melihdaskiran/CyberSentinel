import React, { useState } from 'react';
import { Lock, Unlock, Copy, Check } from 'lucide-react';

export function Encryption() {
    const [password, setPassword] = useState('');
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [copied, setCopied] = useState(false);

    const copyToClipboard = async () => {
        if (!output) return;
        await navigator.clipboard.writeText(output);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    function ab2base64(ab: ArrayBuffer) {
        let binary = '';
        const bytes = new Uint8Array(ab);
        const len = bytes.byteLength;
        for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return window.btoa(binary);
    }

    function base642ab(base64: string) {
        const binary_string = window.atob(base64);
        const len = binary_string.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            bytes[i] = binary_string.charCodeAt(i);
        }
        return bytes.buffer;
    }

    async function getKeyMaterial(pwd: string) {
        const enc = new TextEncoder();
        return window.crypto.subtle.importKey(
          "raw", 
          enc.encode(pwd), 
          {name: "PBKDF2"}, 
          false, 
          ["deriveBits", "deriveKey"]
        );
    }

    async function getKey(keyMaterial: CryptoKey, salt: Uint8Array) {
        return window.crypto.subtle.deriveKey(
          {
            "name": "PBKDF2",
            salt: salt, 
            "iterations": 100000,
            "hash": "SHA-256"
          },
          keyMaterial,
          { "name": "AES-GCM", "length": 256},
          true,
          [ "encrypt", "decrypt" ]
        );
    }

    const handleEncrypt = async () => {
        if (!password || !input) {
            setOutput("Please enter both a secret key and a message to encrypt.");
            return;
        }
        try {
            const salt = window.crypto.getRandomValues(new Uint8Array(16));
            const iv = window.crypto.getRandomValues(new Uint8Array(12));
            
            const keyMaterial = await getKeyMaterial(password);
            const key = await getKey(keyMaterial, salt);
            
            const encoded = new TextEncoder().encode(input);
            const ciphertext = await window.crypto.subtle.encrypt(
                { name: "AES-GCM", iv: iv },
                key,
                encoded
            );
            
            const packed = new Uint8Array(salt.length + iv.length + ciphertext.byteLength);
            packed.set(salt, 0);
            packed.set(iv, salt.length);
            packed.set(new Uint8Array(ciphertext), salt.length + iv.length);
            
            setOutput(ab2base64(packed.buffer));
        } catch (e) {
            setOutput("Encryption failed.");
        }
    };

    const handleDecrypt = async () => {
        if (!password || !input) {
            setOutput("Please enter both a secret key and ciphertext to decrypt.");
            return;
        }
        try {
            const packedBuffer = base642ab(input);
            const packed = new Uint8Array(packedBuffer);
            
            const salt = packed.slice(0, 16);
            const iv = packed.slice(16, 16 + 12);
            const ciphertext = packed.slice(16 + 12);
            
            const keyMaterial = await getKeyMaterial(password);
            const key = await getKey(keyMaterial, salt);
            
            const decrypted = await window.crypto.subtle.decrypt(
                { name: "AES-GCM", iv: iv },
                key,
                ciphertext
            );
            
            setOutput(new TextDecoder().decode(decrypted));
        } catch (e) {
            setOutput("Decryption failed. Incorrect key or corrupted data.");
        }
    };

    return (
        <section className="tool-section glass-panel">
            <header className="section-header">
                <h2><Lock className="icon" /> AES-GCM Encryption</h2>
                <p>Securely encrypt and decrypt messages using a secret key.</p>
            </header>
            
            <div className="input-group">
                <label>Secret Key</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter encryption key..." />
            </div>
            
            <div className="input-group">
                <label>Message / Ciphertext</label>
                <textarea rows={3} value={input} onChange={e => setInput(e.target.value)} placeholder="Enter text to encrypt or decrypt..."></textarea>
            </div>
            
            <div className="action-buttons">
                <button className="btn primary-btn" onClick={handleEncrypt}><Lock size={18}/> Encrypt</button>
                <button className="btn secondary-btn" onClick={handleDecrypt}><Unlock size={18}/> Decrypt</button>
            </div>
            
            <div className="input-group mt-4">
                <label>Result</label>
                <div className="input-wrapper">
                    <textarea rows={3} readOnly value={output} placeholder="Output will appear here..."></textarea>
                    <button className="icon-btn absolute-top-right" onClick={copyToClipboard}>
                        {copied ? <Check size={18} color="var(--success)" /> : <Copy size={18} />}
                    </button>
                </div>
            </div>
        </section>
    );
}
