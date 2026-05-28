import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { PasswordStudio } from './components/PasswordStudio';
import { HashGenerator } from './components/HashGenerator';
import { Encryption } from './components/Encryption';
import { Base64Converter } from './components/Base64Converter';
import { NetworkIntel } from './components/NetworkIntel';
import { Steganography } from './components/Steganography';
import { DnsIntel } from './components/DnsIntel';
import { JwtAnalyzer } from './components/JwtAnalyzer';

function App() {
  const [activeTab, setActiveTab] = useState('password-tool');

  return (
    <>
      <div className="background-effects">
        <div className="glow glow-1"></div>
        <div className="glow glow-2"></div>
      </div>
      <div className="app-container">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <main className="main-content relative w-full h-full">
          {activeTab === 'password-tool' && <PasswordStudio />}
          {activeTab === 'hash-tool' && <HashGenerator />}
          {activeTab === 'encrypt-tool' && <Encryption />}
          {activeTab === 'base64-tool' && <Base64Converter />}
          {activeTab === 'network-tool' && <NetworkIntel />}
          {activeTab === 'dns-tool' && <DnsIntel />}
          {activeTab === 'stego-tool' && <Steganography />}
          {activeTab === 'jwt-tool' && <JwtAnalyzer />}
        </main>
      </div>
    </>
  );
}

export default App;
