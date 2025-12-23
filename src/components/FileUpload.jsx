import React, { useState, useCallback } from 'react';
import { Upload, FileText, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';
import Papa from 'papaparse';
import { processData } from '../utils/analyzer';

const FileUpload = ({ onDataLoaded }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleDrag = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setIsDragging(true);
        } else if (e.type === 'dragleave') {
            setIsDragging(false);
        }
    }, []);

    const processFiles = async (files) => {
        setIsLoading(true);
        setError(null);

        try {
            let allRows = [];

            for (const file of files) {
                if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
                    console.warn(`Skipping non-CSV file: ${file.name}`);
                    continue;
                }

                const result = await new Promise((resolve, reject) => {
                    Papa.parse(file, {
                        header: true,
                        skipEmptyLines: true,
                        complete: (res) => resolve(res),
                        error: (err) => reject(err)
                    });
                });

                if (result.data) {
                    allRows = [...allRows, ...result.data];
                }
            }

            if (allRows.length === 0) {
                throw new Error("No valid data found in uploaded files.");
            }

            const processed = processData(allRows);
            onDataLoaded(processed);

        } catch (err) {
            console.error(err);
            setError('Failed to parse files. ' + err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            processFiles(Array.from(e.dataTransfer.files));
        }
    }, []);

    const handleChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            processFiles(Array.from(e.target.files));
        }
    };

    return (
        <div style={{ width: '100%', maxWidth: 560, margin: '0 auto', padding: '0 16px' }}>
            <div
                style={{
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '48px 32px',
                    borderRadius: 20,
                    border: isDragging ? '2px solid #f97316' : '2px dashed rgba(255,255,255,0.15)',
                    background: isDragging
                        ? 'rgba(249, 115, 22, 0.08)'
                        : 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)',
                    transition: 'all 0.3s ease',
                    transform: isDragging ? 'scale(1.02)' : 'scale(1)',
                    boxShadow: isDragging
                        ? '0 20px 60px rgba(249, 115, 22, 0.15)'
                        : '0 8px 32px rgba(0,0,0,0.2)',
                    cursor: 'pointer'
                }}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
            >
                <input
                    type="file"
                    accept=".csv"
                    multiple
                    onChange={handleChange}
                    style={{
                        position: 'absolute',
                        inset: 0,
                        width: '100%',
                        height: '100%',
                        opacity: 0,
                        cursor: 'pointer'
                    }}
                />

                {/* Icon */}
                <div style={{
                    width: 72,
                    height: 72,
                    borderRadius: 20,
                    background: isDragging
                        ? 'linear-gradient(135deg, #f97316, #ec4899)'
                        : 'rgba(255,255,255,0.05)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 24,
                    transition: 'all 0.3s ease'
                }}>
                    {isLoading ? (
                        <div style={{
                            width: 32,
                            height: 32,
                            border: '3px solid rgba(255,255,255,0.2)',
                            borderTopColor: 'white',
                            borderRadius: '50%',
                            animation: 'spin 1s linear infinite'
                        }} />
                    ) : (
                        <Upload style={{
                            width: 32,
                            height: 32,
                            color: isDragging ? 'white' : '#9ca3af',
                            transition: 'color 0.3s'
                        }} />
                    )}
                </div>

                {/* Main Text */}
                <h3 style={{
                    fontSize: 22,
                    fontWeight: 600,
                    color: isDragging ? '#f97316' : 'white',
                    marginBottom: 8,
                    transition: 'color 0.3s'
                }}>
                    {isLoading ? 'Analyzing your data...' : isDragging ? 'Drop it here!' : 'Drop your CSV file here'}
                </h3>

                <p style={{
                    fontSize: 15,
                    color: '#64748b',
                    marginBottom: 20
                }}>
                    or click to browse your files
                </p>

                {/* CTA Button Style */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '12px 24px',
                    background: 'linear-gradient(135deg, #f97316, #ec4899)',
                    borderRadius: 50,
                    fontWeight: 600,
                    fontSize: 14,
                    color: 'white',
                    boxShadow: '0 4px 20px rgba(249, 115, 22, 0.3)'
                }}>
                    <span>Upload Retail.OrderHistory.csv</span>
                    <ArrowRight style={{ width: 16, height: 16 }} />
                </div>

                {/* File Type Badge */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    marginTop: 20,
                    padding: '6px 12px',
                    background: 'rgba(255,255,255,0.05)',
                    borderRadius: 20,
                    fontSize: 12,
                    color: '#64748b'
                }}>
                    <FileText style={{ width: 14, height: 14 }} />
                    <span>CSV files only • Order History Reports</span>
                </div>
            </div>

            {/* Error State */}
            {error && (
                <div style={{
                    marginTop: 16,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '12px 16px',
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.2)',
                    borderRadius: 12,
                    color: '#f87171',
                    fontSize: 14
                }}>
                    <AlertCircle style={{ width: 18, height: 18, flexShrink: 0 }} />
                    <span>{error}</span>
                </div>
            )}

            {/* Inline CSS for spinner animation */}
            <style>{`
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default FileUpload;
