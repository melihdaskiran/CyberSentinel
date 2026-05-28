import React, { useState } from 'react';
import { FileJson, AlertTriangle } from 'lucide-react';

export function JwtAnalyzer() {
    const [jwt, setJwt] = useState('');
    const [header, setHeader] = useState('');
    const [payload, setPayload] = useState('');
    const [error, setError] = useState('');
    const [isVulnerable, setIsVulnerable] = useState(false);

    const parseJwt = (token: string) => {
        try {
            setError('');
            setIsVulnerable(false);
            
            if (!token) {
                setHeader('');
                setPayload('');
                return;
            }

            const parts = token.split('.');
            if (parts.length !== 3) {
                throw new Error('Invalid JWT format (requires Header.Payload.Signature)');
            }

            const decodedHeader = JSON.parse(atob(parts[0].replace(/-/g, '+').replace(/_/g, '/')));
            const decodedPayload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));

            setHeader(JSON.stringify(decodedHeader, null, 4));
            setPayload(JSON.stringify(decodedPayload, null, 4));

            // Basic vulnerability check
            if (decodedHeader.alg && decodedHeader.alg.toLowerCase() === 'none') {
                setIsVulnerable(true);
            }

        } catch (e) {
            setError('Failed to parse JWT. Ensure it is a valid Base64 encoded token.');
            setHeader('');
            setPayload('');
        }
    };

    const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setJwt(e.target.value);
        parseJwt(e.target.value);
    };

    return (
        <section className="tool-section glass-panel">
            <header className="section-header">
                <h2><FileJson className="icon" /> JWT Analyzer</h2>
                <p>Decode and analyze JSON Web Tokens for vulnerabilities and payload data.</p>
            </header>

            <div className="input-group">
                <label>Encoded JWT</label>
                <textarea 
                    rows={4} 
                    value={jwt} 
                    onChange={handleInput} 
                    placeholder="Paste JWT here (ey...)"
                    style={{ wordBreak: 'break-all' }}
                />
            </div>

            {error && (
                <div style={{ color: 'var(--error)', marginBottom: '1.5rem', fontWeight: 'bold' }}>
                    {error}
                </div>
            )}

            {isVulnerable && (
                <div style={{ 
                    background: 'rgba(255, 0, 60, 0.1)', 
                    border: '1px solid var(--error)', 
                    padding: '1rem', 
                    borderRadius: '12px', 
                    marginBottom: '1.5rem',
                    color: 'var(--text-main)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem'
                }}>
                    <AlertTriangle color="var(--error)" size={24} />
                    <div>
                        <strong style={{ color: 'var(--error)' }}>CRITICAL VULNERABILITY:</strong> 
                        <br/>The token uses `alg: none`. It may be susceptible to signature bypass attacks!
                    </div>
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                <div className="glass-panel-inner" style={{ padding: '1rem' }}>
                    <label style={{ color: 'var(--error)', fontWeight: 'bold', marginBottom: '0.5rem', display: 'block' }}>HEADER (Algorithm & Token Type)</label>
                    <pre style={{ color: 'var(--text-main)', fontFamily: 'JetBrains Mono', fontSize: '0.9rem', whiteSpace: 'pre-wrap' }}>
                        {header || '...'}
                    </pre>
                </div>
                <div className="glass-panel-inner" style={{ padding: '1rem' }}>
                    <label style={{ color: 'var(--accent-primary)', fontWeight: 'bold', marginBottom: '0.5rem', display: 'block' }}>PAYLOAD (Data)</label>
                    <pre style={{ color: 'var(--text-main)', fontFamily: 'JetBrains Mono', fontSize: '0.9rem', whiteSpace: 'pre-wrap' }}>
                        {payload || '...'}
                    </pre>
                </div>
            </div>
        </section>
    );
}
