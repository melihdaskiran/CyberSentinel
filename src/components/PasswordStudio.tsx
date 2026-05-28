import React, { useState } from 'react';
import { Key, Wand2, Eye, EyeOff } from 'lucide-react';

export function PasswordStudio() {
    const [pwd, setPwd] = useState('');
    const [showPwd, setShowPwd] = useState(false);
    
    // Generator state
    const [genLen, setGenLen] = useState(16);
    const [hasUpper, setHasUpper] = useState(true);
    const [hasLower, setHasLower] = useState(true);
    const [hasNum, setHasNum] = useState(true);
    const [hasSym, setHasSym] = useState(true);
    const [genOutput, setGenOutput] = useState('');

    const analyzePassword = (password: string) => {
        let score = 0;
        let feedbackList: string[] = [];

        if (password.length >= 8) score += 1;
        if (password.length >= 12) score += 1;
        if (password.length >= 16) score += 1;
        if (/[A-Z]/.test(password)) score += 1;
        if (/[a-z]/.test(password)) score += 1;
        if (/[0-9]/.test(password)) score += 1;
        if (/[^A-Za-z0-9]/.test(password)) score += 1;

        if (/(.)\1{2,}/.test(password)) {
            score -= 1;
            feedbackList.push("Avoid repeating characters.");
        }

        let strengthStr = 'None';
        let color = 'var(--error)';
        let percentage = 0;

        if (password.length > 0) {
            if (score <= 3) {
                strengthStr = 'Weak';
                color = 'var(--error)';
                percentage = 33;
                feedbackList.push("Add more length and mix characters (uppercase, lowercase, numbers, symbols).");
            } else if (score >= 4 && score <= 5) {
                strengthStr = 'Moderate';
                color = 'var(--warning)';
                percentage = 66;
                feedbackList.push("Good, but could be longer or have more special characters.");
            } else {
                strengthStr = 'Strong';
                color = 'var(--success)';
                percentage = 100;
                feedbackList.push("Excellent password!");
            }
        }

        return { strengthStr, color, percentage, feedbackList };
    };

    const analysis = analyzePassword(pwd);

    const generatePassword = () => {
        const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const lower = "abcdefghijklmnopqrstuvwxyz";
        const num = "0123456789";
        const sym = "!@#$%^&*()_+~`|}{[]:;?><,./-=";

        let chars = "";
        if (hasUpper) chars += upper;
        if (hasLower) chars += lower;
        if (hasNum) chars += num;
        if (hasSym) chars += sym;

        if (chars === "") {
            setGenOutput("Select at least one option!");
            return;
        }

        let password = "";
        if (hasUpper) password += upper[Math.floor(Math.random() * upper.length)];
        if (hasLower) password += lower[Math.floor(Math.random() * lower.length)];
        if (hasNum) password += num[Math.floor(Math.random() * num.length)];
        if (hasSym) password += sym[Math.floor(Math.random() * sym.length)];

        for (let i = password.length; i < genLen; i++) {
            password += chars[Math.floor(Math.random() * chars.length)];
        }

        password = password.split('').sort(() => 0.5 - Math.random()).join('');
        setGenOutput(password);
        setPwd(password);
        setShowPwd(true);
    };

    return (
        <section className="tool-section glass-panel">
            <header className="section-header">
                <h2><Key className="icon" /> Password Strength Analyzer</h2>
                <p>Evaluate the security of your passwords in real-time.</p>
            </header>
            
            <div className="input-group">
                <label>Enter Password</label>
                <div className="input-wrapper">
                    <input 
                        type={showPwd ? "text" : "password"} 
                        value={pwd}
                        onChange={(e) => setPwd(e.target.value)}
                        placeholder="Type a password..."
                    />
                    <button className="icon-btn" onClick={() => setShowPwd(!showPwd)}>
                        {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                </div>
            </div>
            
            <div className="strength-meter">
                <div className="meter-bar">
                    <div className="meter-fill" style={{ width: `${analysis.percentage}%`, backgroundColor: analysis.color }}></div>
                </div>
                <div className="strength-text" style={{ color: analysis.color }}>{analysis.strengthStr}</div>
            </div>
            
            <div className="feedback-box glass-panel-inner" style={{ marginBottom: '2rem' }}>
                {pwd.length === 0 ? "Enter a password to see analysis." : (
                    <ul style={{ paddingLeft: '20px', color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.6' }}>
                        {analysis.feedbackList.map((f, i) => <li key={i}>{f}</li>)}
                    </ul>
                )}
            </div>

            <hr style={{ borderTop: '1px solid var(--panel-border)', margin: '2rem 0', borderBottom: 'none' }} />
            
            <header className="section-header" style={{ marginBottom: '1.5rem', paddingBottom: 0, border: 'none' }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Wand2 size={20} /> Secure Password Generator</h3>
            </header>
            
            <div className="generator-controls glass-panel-inner">
                <div className="input-group">
                    <label>Password Length: <span style={{ color: 'var(--text-main)', fontWeight: 'bold' }}>{genLen}</span></label>
                    <input 
                        type="range" 
                        min="8" max="64" 
                        value={genLen} 
                        onChange={(e) => setGenLen(Number(e.target.value))}
                        style={{ width: '100%', marginTop: '0.5rem' }}
                    />
                </div>
                <div className="checkbox-group">
                    <label><input type="checkbox" checked={hasUpper} onChange={e => setHasUpper(e.target.checked)} /> Uppercase</label>
                    <label><input type="checkbox" checked={hasLower} onChange={e => setHasLower(e.target.checked)} /> Lowercase</label>
                    <label><input type="checkbox" checked={hasNum} onChange={e => setHasNum(e.target.checked)} /> Numbers</label>
                    <label><input type="checkbox" checked={hasSym} onChange={e => setHasSym(e.target.checked)} /> Symbols</label>
                </div>
                <div className="input-wrapper mt-4">
                    <input type="text" readOnly value={genOutput} placeholder="Generated password..." style={{ paddingRight: '120px' }} />
                    <button onClick={generatePassword} className="btn primary-btn" style={{ position: 'absolute', right: 0, top: 0, bottom: 0, borderRadius: '0 12px 12px 0', width: '110px' }}>
                        Generate
                    </button>
                </div>
            </div>
        </section>
    );
}
