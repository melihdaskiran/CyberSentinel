import React from 'react';
import { ShieldHalf, Key, Hash, Lock, Code, Globe, CheckCircle, Image as ImageIcon, Network, FileJson } from 'lucide-react';

export function Sidebar({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (tab: string) => void }) {
    const navItems = [
        { id: 'password-tool', label: 'Password Studio', icon: <Key size={20} /> },
        { id: 'hash-tool', label: 'Hash Generator', icon: <Hash size={20} /> },
        { id: 'encrypt-tool', label: 'Encryption', icon: <Lock size={20} /> },
        { id: 'base64-tool', label: 'Base64 Converter', icon: <Code size={20} /> },
        { id: 'network-tool', label: 'Network Intel', icon: <Globe size={20} /> },
        { id: 'dns-tool', label: 'DNS Intelligence', icon: <Network size={20} /> },
        { id: 'stego-tool', label: 'Steganography', icon: <ImageIcon size={20} /> },
        { id: 'jwt-tool', label: 'JWT Analyzer', icon: <FileJson size={20} /> },
    ];

    return (
        <aside className="sidebar glass-panel">
            <div className="logo">
                <ShieldHalf size={28} className="text-accent" style={{ color: 'var(--accent-primary)', filter: 'drop-shadow(0 0 8px rgba(0,255,204,0.5))' }} />
                <span>CyberSentinel</span>
            </div>
            <nav className="nav-menu">
                {navItems.map(item => (
                    <button 
                        key={item.id}
                        className={`nav-btn ${activeTab === item.id ? 'active' : ''}`}
                        onClick={() => setActiveTab(item.id)}
                    >
                        {item.icon}
                        <span>{item.label}</span>
                    </button>
                ))}
            </nav>
            <div className="sidebar-footer">
                <p style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    Local & Secure <CheckCircle size={14} color="var(--success)" />
                </p>
            </div>
        </aside>
    );
}
