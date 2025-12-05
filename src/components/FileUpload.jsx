import React, { useState, useCallback } from 'react';
import { Upload, FileText, AlertCircle } from 'lucide-react';
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

            // Import processData dynamically or assume it's exported from analyzer
            // We need to make sure we import processData in this file.
            // I'll add the import in a separate edit if needed, but let's assume I can change the import here.
            // Wait, I need to change the import at the top of the file too.
            // Let's do a multi-replace or just replace the whole file content if it's cleaner.
            // I'll stick to replacing the function and then the import.

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
        <div className="w-full max-w-xl mx-auto p-6">
            <div
                className={`
          relative flex flex-col items-center justify-center p-10 border-2 border-dashed rounded-xl transition-all duration-300
          ${isDragging
                        ? 'border-blue-500 bg-blue-50/10 scale-105'
                        : 'border-gray-600 hover:border-gray-400 bg-gray-800/50'
                    }
        `}
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
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />

                <div className="flex flex-col items-center space-y-4 text-center">
                    <div className={`p-4 rounded-full ${isDragging ? 'bg-blue-500/20 text-blue-400' : 'bg-gray-700 text-gray-400'}`}>
                        {isLoading ? (
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                        ) : (
                            <Upload className="w-8 h-8" />
                        )}
                    </div>

                    <div className="space-y-2">
                        <h3 className="text-xl font-semibold text-white">
                            {isLoading ? 'Processing...' : 'Drop your Amazon CSV here'}
                        </h3>
                        <p className="text-sm text-gray-400">
                            or click to browse
                        </p>
                    </div>

                    <div className="flex items-center space-x-2 text-xs text-gray-500 bg-gray-900/50 px-3 py-1.5 rounded-full">
                        <FileText className="w-3 h-3" />
                        <span>Supports Order History Reports</span>
                    </div>
                </div>
            </div>

            {error && (
                <div className="mt-4 flex items-center space-x-2 text-red-400 bg-red-900/20 p-3 rounded-lg text-sm">
                    <AlertCircle className="w-4 h-4" />
                    <span>{error}</span>
                </div>
            )}
        </div>
    );
};

export default FileUpload;
