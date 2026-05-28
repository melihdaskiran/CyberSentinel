import React, { useState, useRef, useEffect } from 'react';
import { Globe, Radar, ShieldAlert, TerminalSquare } from 'lucide-react';

export function NetworkIntel() {
    const [outputLines, setOutputLines] = useState<React.ReactNode[]>([
        <div key="init">&gt; Ready for Shodan OSINT scan...</div>,
        <div key="init2">&gt; Enter target IP and click "Scan Target".</div>
    ]);
    const [isScanning, setIsScanning] = useState(false);
    const [targetIp, setTargetIp] = useState('');
    const [cveList, setCveList] = useState<string[]>([]);
    const [isVulnPromptActive, setIsVulnPromptActive] = useState(false);
    
    const terminalEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [outputLines, isVulnPromptActive]);

    const addLine = (line: React.ReactNode) => {
        setOutputLines(prev => [...prev, line]);
    };

    const scanShodan = async () => {
        if (!targetIp) {
            addLine(<div className="error">&gt; Error: Please enter a target IP address.</div>);
            return;
        }

        setIsScanning(true);
        setIsVulnPromptActive(false);
        setCveList([]);
        setOutputLines([
            <div key="start">&gt; Initiating Shodan OSINT scan for <span className="info-value">{targetIp}</span>...</div>,
            <div key="query">&gt; Querying global database...</div>
        ]);
        
        try {
            const res = await fetch(`/api/shodan/shodan/host/${targetIp}`);
            const data = await res.json();
            
            if (data.error) throw new Error(data.error);

            const org = data.org || 'Unknown';
            const isp = data.isp || 'Unknown';
            const asn = data.asn || 'Unknown';
            const os = data.os || 'Unknown OS';
            const location = `${data.city || 'Unknown City'}, ${data.country_name || 'Unknown Country'} (Lat: ${data.latitude}, Lon: ${data.longitude})`;
            
            const hostnames = data.hostnames && data.hostnames.length > 0 ? data.hostnames.join(', ') : 'None';
            const domains = data.domains && data.domains.length > 0 ? data.domains.join(', ') : 'None';
            
            // Extract port details
            let servicesInfo: React.ReactNode[] = [];
            if (data.data && data.data.length > 0) {
                servicesInfo = data.data.map((service: any, idx: number) => {
                    const product = service.product ? ` - ${service.product} ${service.version || ''}` : '';
                    return (
                        <div key={`port-${idx}`} style={{marginLeft: '1rem'}}>
                            <span style={{color: '#ffbd2e'}}>Port {service.port}/{service.transport}</span>: {product || 'Unknown Service'}
                        </div>
                    );
                });
            }

            const vulns = data.vulns || [];

            setTimeout(() => {
                addLine(<div key="res1"><br/>&gt; Scan complete. Target: <span className="info-value">{targetIp}</span></div>);
                addLine(<div key="res-org"><span className="info-label">Organization:</span> <span className="info-value">{org}</span></div>);
                addLine(<div key="res-isp"><span className="info-label">ISP / ASN:</span> <span className="info-value">{isp} / {asn}</span></div>);
                addLine(<div key="res-os"><span className="info-label">Operating Sys:</span> <span className="info-value">{os}</span></div>);
                addLine(<div key="res-loc"><span className="info-label">Location:</span> <span className="info-value">{location}</span></div>);
                addLine(<div key="res-host"><span className="info-label">Hostnames:</span> <span className="info-value">{hostnames}</span></div>);
                addLine(<div key="res-dom"><span className="info-label">Domains:</span> <span className="info-value">{domains}</span></div>);
                
                addLine(<div key="res-ports-head" style={{color: 'var(--accent-primary)', marginTop: '1rem'}}>&gt; Open Ports & Services:</div>);
                if (servicesInfo.length > 0) {
                    servicesInfo.forEach(s => addLine(s));
                } else {
                    addLine(<div style={{marginLeft: '1rem'}}>No open ports found.</div>);
                }

                if (vulns.length > 0) {
                    addLine(
                        <div key="res-vulns" style={{color: 'var(--error)', marginTop: '1rem', fontWeight: 'bold'}}>
                            &gt; [CRITICAL WARNING] {vulns.length} vulnerabilities (CVEs) detected on this host!
                        </div>
                    );
                    setCveList(vulns);
                    setIsVulnPromptActive(true);
                } else {
                    addLine(<div key="res-no-vuln" style={{color: 'var(--success)', marginTop: '1rem'}}>&gt; No known vulnerabilities detected.</div>);
                    addLine(<div key="wait">&gt; Waiting for next command... <span className="blink">_</span></div>);
                }

                setIsScanning(false);
            }, 800);
        } catch (err: any) {
            addLine(<div className="error">&gt; Error fetching Shodan intelligence.</div>);
            addLine(<div className="error">&gt; Details: {err.message}</div>);
            addLine(<div key="wait">&gt; Waiting for next command... <span className="blink">_</span></div>);
            setIsScanning(false);
        }
    };

    const analyzeVulns = async () => {
        setIsVulnPromptActive(false);
        addLine(<div style={{color: 'var(--warning)', marginTop: '1rem'}}>&gt; Initiating Deep Vulnerability Analysis...</div>);
        
        // Pick max 3 CVEs to avoid spam
        const topCves = cveList.slice(0, 3);
        
        for (const cve of topCves) {
            addLine(<div>&gt; Fetching details for <span style={{color: 'var(--error)'}}>{cve}</span>...</div>);
            try {
                // Using MITRE CVE API
                const res = await fetch(`https://cveawg.mitre.org/api/cve/${cve}`);
                const data = await res.json();
                
                let description = "Description not available.";
                if (data.containers && data.containers.cna && data.containers.cna.descriptions) {
                    description = data.containers.cna.descriptions[0].value;
                }

                addLine(
                    <div style={{marginLeft: '1rem', marginBottom: '1rem', borderLeft: '2px solid var(--error)', paddingLeft: '10px'}}>
                        <div style={{color: 'var(--error)', fontWeight: 'bold'}}>{cve}</div>
                        <div style={{color: 'var(--text-muted)', fontSize: '0.9em', marginTop: '0.3rem'}}>{description}</div>
                        <div style={{marginTop: '0.5rem'}}>
                            <a 
                                href={`https://www.exploit-db.com/search?cve=${cve.replace('CVE-', '')}`} 
                                target="_blank" 
                                rel="noreferrer"
                                style={{color: 'var(--accent-primary)', textDecoration: 'underline', fontSize: '0.85em'}}
                            >
                                [ Search Exploit-DB for {cve} ]
                            </a>
                        </div>
                    </div>
                );
            } catch (e) {
                addLine(<div style={{marginLeft: '1rem', color: 'var(--error)'}}>Failed to fetch details for {cve}.</div>);
            }
        }

        if (cveList.length > 3) {
            addLine(<div style={{color: 'var(--warning)'}}>&gt; + {cveList.length - 3} more vulnerabilities found. Search manually for complete list.</div>);
        }
        addLine(<div key="wait" style={{marginTop: '1rem'}}>&gt; Waiting for next command... <span className="blink">_</span></div>);
    };

    const getMyIp = async () => {
        try {
            const res = await fetch('https://api.ipify.org?format=json');
            const data = await res.json();
            setTargetIp(data.ip);
        } catch (e) {
            addLine(<div className="error">&gt; Error fetching your public IP.</div>);
        }
    };

    return (
        <section className="tool-section glass-panel">
            <header className="section-header">
                <h2><Globe className="icon" /> Shodan OSINT Scanner</h2>
                <p>Perform advanced reconnaissance, port scanning and vulnerability assessment using Shodan.</p>
            </header>
            
            <div className="glass-panel-inner" style={{ marginBottom: '2rem' }}>
                <div className="input-group" style={{ marginBottom: 0 }}>
                    <label>Target IP Address</label>
                    <div className="input-wrapper">
                        <input 
                            type="text" 
                            value={targetIp} 
                            onChange={e => setTargetIp(e.target.value)} 
                            placeholder="e.g. 8.8.8.8"
                        />
                        <button 
                            className="btn secondary-btn" 
                            style={{ position: 'absolute', right: '5px', padding: '0.5rem 1rem', fontSize: '0.8rem', height: '80%' }}
                            onClick={getMyIp}
                        >
                            Get My IP
                        </button>
                    </div>
                </div>
            </div>
            
            <div className="action-buttons" style={{ marginTop: 0, marginBottom: '2rem' }}>
                <button 
                    onClick={scanShodan} 
                    className="btn primary-btn" 
                    disabled={isScanning}
                >
                    <Radar size={18} /> {isScanning ? 'Scanning...' : 'Scan Target'}
                </button>
            </div>
            
            <div className="terminal-box">
                <div className="terminal-header">
                    <span className="dot" style={{ background: '#ff5f56' }}></span>
                    <span className="dot" style={{ background: '#ffbd2e' }}></span>
                    <span className="dot" style={{ background: '#27c93f' }}></span>
                    <span className="title"><TerminalSquare size={14} style={{display:'inline', marginBottom:'-2px', marginRight:'4px'}}/>root@cybersentinel:~#</span>
                </div>
                <div className="terminal-content" style={{ display: 'flex', flexDirection: 'column' }}>
                    {outputLines.map((line, idx) => (
                        <div key={idx}>{line}</div>
                    ))}
                    
                    {isVulnPromptActive && (
                        <div style={{ marginTop: '1.5rem', padding: '1rem', border: '1px dashed var(--error)', borderRadius: '8px', background: 'rgba(255, 0, 60, 0.05)' }}>
                            <div style={{color: 'var(--text-main)', marginBottom: '1rem'}}>
                                ⚠️ <strong>Action Required:</strong> Shodan reports vulnerabilities for this host. Would you like to deeply analyze these CVEs and check for exploits?
                            </div>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <button onClick={analyzeVulns} className="btn primary-btn" style={{ background: 'var(--error)', boxShadow: '0 0 15px rgba(255, 0, 60, 0.4)' }}>
                                    <ShieldAlert size={16} /> Yes, Analyze CVEs
                                </button>
                                <button onClick={() => {
                                    setIsVulnPromptActive(false);
                                    addLine(<div key="wait" style={{marginTop: '1rem'}}>&gt; Analysis aborted. Waiting for next command... <span className="blink">_</span></div>);
                                }} className="btn secondary-btn">
                                    No, Skip
                                </button>
                            </div>
                        </div>
                    )}
                    <div ref={terminalEndRef} />
                </div>
            </div>
        </section>
    );
}
