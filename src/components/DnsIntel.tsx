import React, { useState } from 'react';
import { Network, Search, TerminalSquare } from 'lucide-react';

export function DnsIntel() {
    const [domain, setDomain] = useState('');
    const [isScanning, setIsScanning] = useState(false);
    const [outputLines, setOutputLines] = useState<React.ReactNode[]>([
        <div key="init">&gt; Ready for DNS Reconnaissance...</div>
    ]);

    const addLine = (line: React.ReactNode) => {
        setOutputLines(prev => [...prev, line]);
    };

    const performDnsLookup = async (type: string) => {
        try {
            // Google DoH API
            const res = await fetch(`https://dns.google/resolve?name=${domain}&type=${type}`);
            const data = await res.json();
            
            if (data.Answer && data.Answer.length > 0) {
                addLine(<div style={{ color: 'var(--accent-primary)', marginTop: '0.5rem' }}>&gt; [{type}] Records Found:</div>);
                data.Answer.forEach((ans: any) => {
                    addLine(<div style={{ marginLeft: '1rem' }}>- {ans.data}</div>);
                });
            } else {
                addLine(<div style={{ color: 'var(--text-muted)' }}>&gt; No {type} records found.</div>);
            }
        } catch (e) {
            addLine(<div className="error">&gt; Failed to resolve {type} records.</div>);
        }
    };

    const scanDns = async () => {
        if (!domain) return;
        setIsScanning(true);
        setOutputLines([]);
        addLine(<div>&gt; Initiating Deep DNS Recon for <span className="info-value">{domain}</span>...</div>);

        await performDnsLookup('A');
        await performDnsLookup('AAAA');
        await performDnsLookup('MX');
        await performDnsLookup('TXT');
        await performDnsLookup('CNAME');

        addLine(<div style={{ marginTop: '1rem', color: 'var(--success)' }}>&gt; Reconnaissance complete.</div>);
        setIsScanning(false);
    };

    return (
        <section className="tool-section glass-panel">
            <header className="section-header">
                <h2><Network className="icon" /> DNS Intelligence</h2>
                <p>Extract routing, mail exchange, and verification records for any domain.</p>
            </header>

            <div className="glass-panel-inner" style={{ marginBottom: '2rem' }}>
                <div className="input-group" style={{ marginBottom: 0 }}>
                    <label>Target Domain</label>
                    <div className="input-wrapper">
                        <input 
                            type="text" 
                            value={domain} 
                            onChange={e => setDomain(e.target.value)} 
                            placeholder="e.g. google.com"
                        />
                        <button 
                            className="btn primary-btn" 
                            style={{ position: 'absolute', right: '5px', padding: '0.5rem 1rem', fontSize: '0.9rem', height: '80%' }}
                            onClick={scanDns}
                            disabled={isScanning}
                        >
                            <Search size={16} /> Scan
                        </button>
                    </div>
                </div>
            </div>

            <div className="terminal-box">
                <div className="terminal-header">
                    <span className="dot" style={{ background: '#ff5f56' }}></span>
                    <span className="dot" style={{ background: '#ffbd2e' }}></span>
                    <span className="dot" style={{ background: '#27c93f' }}></span>
                    <span className="title"><TerminalSquare size={14} style={{display:'inline', marginBottom:'-2px', marginRight:'4px'}}/>dns-recon@cybersentinel</span>
                </div>
                <div className="terminal-content">
                    {outputLines.map((line, idx) => (
                        <div key={idx}>{line}</div>
                    ))}
                    {!isScanning && <div key="wait" style={{ marginTop: '1rem' }}>&gt; Waiting for target domain... <span className="blink">_</span></div>}
                </div>
            </div>
        </section>
    );
}
