'use client';

import { useState } from 'react';

export default function EmailExtractor() {
  const [rawText, setRawText] = useState('');
  const [extractedEmails, setExtractedEmails] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleProcessText = () => {
    const emailRegex = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi;
    const foundEmails = rawText.match(emailRegex) || [];
    const uniqueEmails = [...new Set(foundEmails.map(email => email.toLowerCase()))];
    setExtractedEmails(uniqueEmails);
  };
  
  const handleSendInvitations = async () => {
    setIsLoading(true);
    setIsSuccess(false);
    setError(null);

    try {
      const response = await fetch('/api/invite-students', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ emails: extractedEmails }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Gagal mengirim undangan.');
      }

      const resultData = await response.json();
      console.log('Hasil dari server:', resultData);
      setIsSuccess(true);
      setExtractedEmails([]);
      setRawText('');

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full p-6 bg-white rounded-lg shadow-md">
      <h3 className="text-xl font-semibold text-gray-800">Undang Siswa Secara Otomatis</h3>
      <p className="mt-1 text-gray-600">Salin dan tempel daftar siswa dari Word, Excel, atau WhatsApp di bawah ini.</p>
      
      <textarea
        value={rawText}
        onChange={(e) => setRawText(e.target.value)}
        placeholder="Contoh: 1. Budi (budi@email.com), 2. Susi - susi@email.com..."
        rows={10}
        className="w-full mt-4 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
      />
      
      <button 
        onClick={handleProcessText}
        className="mt-4 w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
      >
        Proses & Tampilkan Email
      </button>

      {extractedEmails.length > 0 && (
        <div className="mt-6 border-t pt-4">
          <h4 className="font-semibold text-gray-700">Ditemukan {extractedEmails.length} Alamat Email Unik:</h4>
          <ul className="mt-2 list-disc list-inside bg-gray-50 p-3 rounded-md">
            {extractedEmails.map((email) => (
              <li key={email} className="text-gray-800">{email}</li>
            ))}
          </ul>
          <p className="mt-2 text-sm text-gray-500">Apakah daftar di atas sudah benar?</p>
          <button
            onClick={handleSendInvitations}
            disabled={isLoading}
            className="mt-3 w-full bg-green-600 text-white font-bold py-2 px-4 rounded-md hover:bg-green-700 disabled:bg-gray-400 transition-colors"
          >
            {isLoading ? 'Mengirim...' : 'Ya, Kirim Undangan'}
          </button>
        </div>
      )}
      
      {isSuccess && <p className="mt-4 text-green-600 font-semibold">Undangan berhasil dikirim!</p>}
      {error && <p className="mt-4 text-red-600 font-semibold">{error}</p>}
    </div>
  );
}