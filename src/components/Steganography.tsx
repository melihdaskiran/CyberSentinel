import React, { useState } from 'react';
import { Eye, EyeOff, Upload, Download, Image as ImageIcon } from 'lucide-react';

export function Steganography() {
    const [mode, setMode] = useState<'hide' | 'extract'>('hide');
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [secretMessage, setSecretMessage] = useState('');
    const [extractedMessage, setExtractedMessage] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    // Text to binary
    const textToBinary = (text: string) => {
        let binary = '';
        for (let i = 0; i < text.length; i++) {
            const bin = text.charCodeAt(i).toString(2).padStart(8, '0');
            binary += bin;
        }
        return binary + '00000000'; // Null terminator
    };

    // Binary to text
    const binaryToText = (binary: string) => {
        let text = '';
        for (let i = 0; i < binary.length; i += 8) {
            const byte = binary.slice(i, i + 8);
            if (byte === '00000000') break; // Null terminator found
            text += String.fromCharCode(parseInt(byte, 2));
        }
        return text;
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setImagePreview(event.target?.result as string);
                setExtractedMessage('');
            };
            reader.readAsDataURL(file);
        }
    };

    const processHide = () => {
        if (!imagePreview || !secretMessage) return;
        setIsProcessing(true);

        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;
            
            ctx.drawImage(img, 0, 0);
            const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imgData.data;

            const binaryMessage = textToBinary(secretMessage);
            
            if (binaryMessage.length > data.length * 0.75) {
                alert('Message is too long for this image!');
                setIsProcessing(false);
                return;
            }

            let msgIndex = 0;
            for (let i = 0; i < data.length; i += 4) {
                for (let j = 0; j < 3; j++) { // Use R, G, B (skip Alpha)
                    if (msgIndex < binaryMessage.length) {
                        const bit = parseInt(binaryMessage[msgIndex]);
                        // Clear LSB and set to our bit
                        data[i + j] = (data[i + j] & 254) | bit;
                        msgIndex++;
                    }
                }
            }

            ctx.putImageData(imgData, 0, 0);
            
            // Download the new image
            const link = document.createElement('a');
            link.download = 'secret_image.png'; // Must be PNG to prevent compression destroying LSBs
            link.href = canvas.toDataURL('image/png');
            link.click();

            setIsProcessing(false);
        };
        img.src = imagePreview;
    };

    const processExtract = () => {
        if (!imagePreview) return;
        setIsProcessing(true);

        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            ctx.drawImage(img, 0, 0);
            const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imgData.data;

            let binaryMessage = '';
            for (let i = 0; i < data.length; i += 4) {
                for (let j = 0; j < 3; j++) {
                    binaryMessage += (data[i + j] & 1).toString();
                }
            }

            try {
                const text = binaryToText(binaryMessage);
                setExtractedMessage(text || 'No hidden message found (or image was compressed).');
            } catch (e) {
                setExtractedMessage('Failed to decode message.');
            }
            setIsProcessing(false);
        };
        img.src = imagePreview;
    };

    return (
        <section className="tool-section glass-panel">
            <header className="section-header">
                <h2><ImageIcon className="icon" /> Steganography (Data Hiding)</h2>
                <p>Hide secret messages inside images using LSB (Least Significant Bit) manipulation.</p>
            </header>

            <div className="action-buttons" style={{ marginTop: 0, marginBottom: '2rem' }}>
                <button className={`btn ${mode === 'hide' ? 'primary-btn' : 'secondary-btn'}`} onClick={() => setMode('hide')}>
                    <EyeOff size={18} /> Hide Message
                </button>
                <button className={`btn ${mode === 'extract' ? 'primary-btn' : 'secondary-btn'}`} onClick={() => setMode('extract')}>
                    <Eye size={18} /> Extract Message
                </button>
            </div>

            <div className="glass-panel-inner">
                <div className="input-group">
                    <label>Upload Image (PNG recommended)</label>
                    <input type="file" accept="image/*" onChange={handleImageUpload} style={{ background: 'transparent', padding: '1rem 0' }} />
                </div>

                {imagePreview && (
                    <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
                        <img src={imagePreview} alt="Preview" style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '12px', border: '1px solid var(--panel-border)' }} />
                    </div>
                )}

                {mode === 'hide' ? (
                    <>
                        <div className="input-group">
                            <label>Secret Message to Hide</label>
                            <textarea 
                                rows={3} 
                                value={secretMessage} 
                                onChange={(e) => setSecretMessage(e.target.value)}
                                placeholder="Enter the text you want to hide inside the image..."
                            />
                        </div>
                        <button className="btn primary-btn" onClick={processHide} disabled={!imagePreview || !secretMessage || isProcessing} style={{ width: '100%' }}>
                            <Download size={18} /> {isProcessing ? 'Processing...' : 'Embed & Download Image'}
                        </button>
                    </>
                ) : (
                    <>
                        <button className="btn primary-btn" onClick={processExtract} disabled={!imagePreview || isProcessing} style={{ width: '100%', marginBottom: '1.5rem' }}>
                            <Upload size={18} /> {isProcessing ? 'Scanning...' : 'Extract Hidden Message'}
                        </button>
                        <div className="input-group">
                            <label>Extracted Message</label>
                            <textarea 
                                rows={4} 
                                readOnly 
                                value={extractedMessage} 
                                placeholder="Extracted text will appear here..."
                            />
                        </div>
                    </>
                )}
            </div>
        </section>
    );
}
