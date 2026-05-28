# 🛡️ CyberSentinel

**CyberSentinel** is an advanced, all-in-one cybersecurity toolkit built with modern web technologies. Designed with a stunning dark-themed glassmorphism interface, it provides a comprehensive suite of tools for cryptography, reconnaissance (OSINT), and security analysis—all running blazingly fast in your browser.

![CyberSentinel Interface](https://img.shields.io/badge/UI-Glassmorphism-00f0ff?style=flat-square)
![React](https://img.shields.io/badge/React-18-61dafb?style=flat-square&logo=react)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=flat-square&logo=vite)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)

## 🚀 Features

### 1. 🔍 Shodan OSINT Scanner (Advanced Reconnaissance)
*   Integrates with the Shodan API (securely proxied) to scan target IP addresses.
*   **Deep Recon:** Retrieves Open Ports, Banners (Service/Version), ISP, ASN, OS, and Location.
*   **CVE Vulnerability Engine:** Automatically detects known vulnerabilities on the target. If CVEs are found, an interactive prompt allows you to fetch detailed vulnerability descriptions directly from the **MITRE API** and provides links to Exploit-DB.

### 2. 🖼️ Steganography (Data Hiding)
*   Embed secret text messages inside image files (PNG) using **Least Significant Bit (LSB)** manipulation.
*   Extract hidden messages from stego-images.
*   *100% Client-Side:* Image processing happens entirely in the browser using the HTML5 Canvas API.

### 3. 🔑 JWT Analyzer
*   Decode and analyze JSON Web Tokens.
*   Inspect Header and Payload securely.
*   **Vulnerability Detection:** Automatically alerts you if the token is using the dangerous `alg: none` signature bypass misconfiguration.

### 4. 🌐 DNS Intelligence
*   Perform fast DNS reconnaissance on any domain.
*   Fetches multiple DNS record types including **A, AAAA, MX, TXT, and CNAME** using DoH (DNS over HTTPS).

### 5. 🔒 Encryption & Cryptography Suite
*   **Password Studio:** Analyze password strength based on entropy algorithms and generate highly secure, customizable passwords.
*   **Hash Generator:** Calculate SHA-256, SHA-512, and SHA-1 hashes instantly using the Web Crypto API.
*   **AES-GCM Encryption:** Encrypt and decrypt messages using military-grade AES-GCM symmetric encryption with PBKDF2 key derivation.
*   **Base64 Converter:** Quickly encode or decode data to/from Base64 format.

## 🛠️ Technology Stack

*   **Frontend Framework:** React (with Hooks)
*   **Build Tool:** Vite (Ultra-fast HMR and optimized builds)
*   **Language:** TypeScript (Type-safe and modern JavaScript)
*   **Styling:** Pure Modern CSS with CSS Variables, Flexbox/Grid, and Backdrop-filter for Glassmorphism.
*   **Icons:** Lucide-React
*   **APIs Used:** Shodan API, MITRE CVE API, Google DoH API, ipify API, Browser Web Crypto API.

## ⚙️ Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/cybersentinel.git
   cd cybersentinel
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Shodan API Key (Optional but recommended):**
   *   The project uses a Vite proxy in `vite.config.ts` to securely append your Shodan API key to requests without exposing it to the frontend.
   *   Open `vite.config.ts` and replace the placeholder API key in the `rewrite` function with your actual Shodan API Key.

4. **Start the Development Server:**
   ```bash
   npm run dev
   ```
   The application will automatically open in your browser at `http://localhost:5173`.

## 🛡️ Security Note

*   **Zero-Tracking:** All cryptography (Hashing, Encryption, Steganography) happens entirely on the client-side within your browser. No sensitive text or passwords are ever sent to a server.
*   **API Security:** The Shodan API key is deliberately hidden from the React frontend code and is only injected by the local Vite development server proxy.

---

*Built for Security Professionals, Pentesters, and Enthusiasts.*
