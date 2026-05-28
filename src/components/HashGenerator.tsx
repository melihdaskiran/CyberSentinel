import React, { useState } from 'react';
import { Hash, Copy, Check } from 'lucide-react';

export function HashGenerator() {
    const [input, setInput] = useState('');
    const [algo, setAlgo] = useState('SHA-256');
    const [output, setOutput] = useState('');
    const [copied, setCopied] = useState(false);

    const generateHash = async (text: string, algorithm: string) => {
        if (!text) {
            setOutput('');
            return;
        }
        try {
            const encoder = new TextEncoder();
            const data = encoder.encode(text);
            const hashBuffer = await window.crypto.subtle.digest(algorithm, data);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
            setOutput(hashHex);
        } catch (e) {
            setOutput('Error generating hash');
        }
    };

    const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInput(e.target.value);
        generateHash(e.target.value, algo);
    };

    const handleAlgo = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setAlgo(e.target.value);
        generateHash(input, e.target.value);
    };

    const copyToClipboard = async () => {
        if (!output) return;
        await navigator.clipboard.writeText(output);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <section className="tool-section glass-panel">
            <header className="section-header">
                <h2><Hash className="icon" /> Hash Generator</h2>
                <p>Generate secure cryptographic hashes directly in browser.</p>
            </header>
            
            <div className="input-group">
                <label>Input Data</label>
                <textarea rows={4} value={input} onChange={handleInput} placeholder="Enter text to hash..."></textarea>
            </div>
            
            <div className="input-group">
                <label>Algorithm</label>
                <div className="select-wrapper">
                    <select className="glass-select" value={algo} onChange={handleAlgo}>
                        <option value="SHA-256">SHA-256 (Recommended)</option>
                        <option value="SHA-512">SHA-512</option>
                        <option value="SHA-1">SHA-1 (Insecure)</option>
                    </select>
                </div>
            </div>
            
            <div className="input-group">
                <label>Result (Hex)</label>
                <div className="input-wrapper">
                    <input type="text" readOnly value={output} />
                    <button className="icon-btn" onClick={copyToClipboard}>
                        {copied ? <Check size={18} color="var(--success)" /> : <Copy size={18} />}
                    </button>
                </div>
            </div>
        </section>
    );
}
