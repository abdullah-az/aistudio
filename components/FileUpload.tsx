import React, { useState } from 'react';
import { DocumentArrowUpIcon } from './icons/DocumentArrowUpIcon';
import { TrashIcon } from './icons/TrashIcon';
import { DocumentIcon } from './icons/DocumentIcon';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  selectedFile: File | null;
  onClear: () => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, selectedFile, onClear }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      if(e.dataTransfer.files[0].type === 'application/pdf') {
          onFileSelect(e.dataTransfer.files[0]);
      }
      e.dataTransfer.clearData();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelect(e.target.files[0]);
    }
  };
  
  const handleClearClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();
    onClear();
  }

  if (selectedFile) {
    return (
        <div className="bg-gray-900/50 border-2 border-dashed border-indigo-500 rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3 overflow-hidden">
                <DocumentIcon className="w-8 h-8 text-indigo-400 flex-shrink-0" />
                <div className="text-left overflow-hidden">
                    <p className="text-white font-semibold truncate">{selectedFile.name}</p>
                    <p className="text-gray-400 text-sm">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
            </div>
            <button onClick={handleClearClick} className="p-2 rounded-full hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-colors flex-shrink-0 ml-2">
                <TrashIcon className="w-5 h-5" />
            </button>
        </div>
    )
  }

  return (
    <div
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className={`relative bg-gray-900/50 border-2 border-dashed border-gray-600 rounded-xl p-8 text-center transition-all duration-300 ${isDragging ? 'border-indigo-500 scale-105 bg-gray-900' : 'hover:border-gray-500'}`}
    >
      <input
        type="file"
        id="file-upload"
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        onChange={handleFileChange}
        accept=".pdf"
      />
      <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center justify-center">
        <DocumentArrowUpIcon className="w-12 h-12 text-gray-500 mb-4 transition-colors group-hover:text-indigo-400" />
        <p className="text-white font-semibold">اسحب وأفلت ملف PDF هنا</p>
        <p className="text-gray-400 mt-1">أو <span className="text-indigo-400 font-bold">انقر للتصفح</span></p>
        <p className="text-xs text-gray-500 mt-4">ملفات PDF فقط، بحد أقصى 10 ميغابايت.</p>
      </label>
    </div>
  );
};

export default FileUpload;
