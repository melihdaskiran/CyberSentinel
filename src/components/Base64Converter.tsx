import React, { useState } from 'react';
import { Code, ArrowDownToLine, ArrowUpToLine, Copy, Check } from 'lucide-react';

export function Base64Converter() {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [copied, setCopied] = useState(false);

    const handleEncode = () => {
        if (!input) return;
        try {
            setOutput(btoa(unescape(encodeURIComponent(input))));
        } catch (e) {
            setOutput("Encoding failed.");
        }
    };

    const handleDecode = () => {
        if (!input) return;
        try {
            setOutput(decodeURIComponent(escape(atob(input))));
        } catch (e) {
            setOutput("Decoding failed. The input is not a valid Base64 string.");
        }
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
                <h2><Code className="icon" /> Base64 Converter</h2>
                <p>Encode or decode data to/from Base64 format.</p>
            </header>
            
            <div className="input-group">
                <label>Input Data</label>
                <textarea rows={5} value={input} onChange={e => setInput(e.target.value)} placeholder="Enter text to encode, or Base64 string to decode..."></textarea>
            </div>
            
            <div className="action-buttons">
                <button className="btn primary-btn" onClick={handleEncode}><ArrowDownToLine size={18}/> Encode</button>
                <button className="btn secondary-btn" onClick={handleDecode}><ArrowUpToLine size={18}/> Decode</button>
            </div>
            
            <div className="input-group mt-4">
                <label>Result</label>
                <div className="input-wrapper">
                    <textarea rows={5} readOnly value={output} placeholder="Output will appear here..."></textarea>
                    <button className="icon-btn absolute-top-right" onClick={copyToClipboard}>
                        {copied ? <Check size={18} color="var(--success)" /> : <Copy size={18} />}
                    </button>
                </div>
            </div>
        </section>
    );
}
