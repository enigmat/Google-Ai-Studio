import React, { useState } from 'react';
import Loader from './Loader';
import jsPDF from 'jspdf';
import htmlToDocx from 'html-to-docx';

export interface EbookChapter {
  title: string;
  content: string; // HTML content
}

export interface Ebook {
  title: string;
  author: string;
  chapters: EbookChapter[];
  originalIdea: string;
}

interface EbookDisplayProps {
  ebook: Ebook | null;
  isLoading: boolean;
  progressMessage: string;
  coverUrl: string | null;
  isGeneratingCover: boolean;
  onGenerateCover: () => void;
  uploadedPdfUrl: string | null;
}

const EbookDisplay: React.FC<EbookDisplayProps> = ({ ebook, isLoading, progressMessage, coverUrl, isGeneratingCover, onGenerateCover, uploadedPdfUrl }) => {
  const [downloadState, setDownloadState] = useState<{ active: boolean; format: 'html' | 'docx' | 'pdf' | null }>({ active: false, format: null });
  const [showDownloadOptions, setShowDownloadOptions] = useState(false);
  
  const createEbookHtml = (includeCover: boolean = true): string => {
    if (!ebook) return '';
    const { title, author, chapters } = ebook;

    const coverImgHtml = (includeCover && coverUrl) ? `<img src="${coverUrl}" alt="Book Cover" style="width:100%; max-width:600px; margin: 0 auto 2em; display: block; border: 1px solid #ccc;" />` : '';

    const chapterHtml = chapters
        .map(ch => `<h2>${ch.title}</h2>\n${ch.content}`)
        .join('\n\n');

    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <title>${title}</title>
          <style>
              body { font-family: Georgia, serif; line-height: 1.6; color: #111; max-width: 800px; margin: 2rem auto; padding: 0 1rem; }
              h1, h2 { font-family: "Helvetica Neue", Helvetica, Arial, sans-serif; }
              h1 { font-size: 2.8em; text-align: center; margin-bottom: 0.2em; }
              .author { font-size: 1.5em; text-align: center; font-style: italic; color: #555; margin-bottom: 4em; }
              h2 { font-size: 2em; margin-top: 2.5em; border-bottom: 1px solid #ccc; padding-bottom: 0.3em; page-break-before: always; }
              p { margin-bottom: 1.2em; text-indent: 1.5em; }
              p:first-of-type { text-indent: 0; }
              img { max-width: 100%; height: auto; }
          </style>
      </head>
      <body>
          ${coverImgHtml}
          <h1>${title}</h1>
          <p class="author">by ${author}</p>
          ${chapterHtml}
      </body>
      </html>`;
  };
  
  const downloadBlob = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownload = async (format: 'html' | 'docx' | 'pdf') => {
    if (!ebook) return;
    setDownloadState({ active: true, format });
    
    const sanitizedTitle = ebook.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();

    try {
        if (format === 'html') {
            const html = createEbookHtml();
            const blob = new Blob([html], { type: 'text/html' });
            downloadBlob(blob, `${sanitizedTitle}.html`);
        } else if (format === 'docx') {
            const html = createEbookHtml();
            const docxContent = await htmlToDocx(html, undefined, {
                margins: { top: 720, right: 720, bottom: 720, left: 720 },
            });
            const docxBlob = docxContent instanceof Blob
              ? docxContent
              : new Blob([docxContent], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });

            downloadBlob(docxBlob, `${sanitizedTitle}.docx`);
        } else if (format === 'pdf') {
            const doc = new jsPDF({ unit: 'pt', format: 'a4' });
            const page_width = doc.internal.pageSize.getWidth();
            const margin = 72;
            let y = margin;

            doc.setFontSize(24).setFont('times', 'bold');
            doc.text(ebook.title, page_width / 2, y, { align: 'center' });
            y += 30;

            doc.setFontSize(16).setFont('times', 'italic');
            doc.text(`by ${ebook.author}`, page_width / 2, y, { align: 'center' });
            
            for (const chapter of ebook.chapters) {
                doc.addPage();
                y = margin;
                doc.setFontSize(18).setFont('times', 'bold');
                const chapterLines = doc.splitTextToSize(chapter.title, page_width - margin * 2);
                doc.text(chapterLines, margin, y);
                y += (chapterLines.length * 20) + 10;
                
                doc.setFontSize(12).setFont('times', 'normal');
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = chapter.content;
                const paragraphs = Array.from(tempDiv.getElementsByTagName('p')).map(p => p.innerText.trim()).filter(Boolean);

                for (const pText of paragraphs) {
                    const textLines = doc.splitTextToSize(pText, page_width - margin * 2);
                    const textHeight = textLines.length * 14;
                    if (y + textHeight > doc.internal.pageSize.getHeight() - margin) {
                        doc.addPage();
                        y = margin;
                    }
                    doc.text(textLines, margin, y, { lineHeightFactor: 1.2 });
                    y += textHeight + 12;
                }
            }
            doc.deletePage(1); // Remove initial blank page
            downloadBlob(doc.output('blob'), `${sanitizedTitle}.pdf`);
        }
    } catch (err) {
      console.error(`Failed to generate ${format}`, err);
    } finally {
      setDownloadState({ active: false, format: null });
      setShowDownloadOptions(false);
    }
  };

  return (
    <div className="relative w-full h-full min-h-[500px] bg-gray-800 border-2 border-dashed border-gray-700 rounded-lg flex flex-col p-4 transition-all duration-300">
      {isLoading ? (
        <div className="flex-grow flex items-center justify-center">
          <Loader message={progressMessage || "Writing your ebook..."} />
        </div>
      ) : ebook ? (
        <>
          <div className="flex justify-between items-start mb-4 pb-2 border-b border-gray-700">
            <h3 className="text-lg font-bold text-indigo-400">Ebook Preview</h3>
            <div className="relative">
              <button
                onClick={() => setShowDownloadOptions(prev => !prev)}
                disabled={downloadState.active}
                className="px-4 py-2 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-green-500 transition-colors flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                <span>Download</span>
              </button>
              {showDownloadOptions && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-gray-900 border border-gray-700 rounded-lg shadow-2xl z-10 p-2">
                  <p className="text-xs text-gray-500 px-2 pb-1">KDP Formats:</p>
                  <button onClick={() => handleDownload('docx')} disabled={downloadState.active} className="w-full text-left text-sm p-2 rounded hover:bg-gray-700">Word (.docx)</button>
                  <button onClick={() => handleDownload('pdf')} disabled={downloadState.active} className="w-full text-left text-sm p-2 rounded hover:bg-gray-700">PDF (.pdf)</button>
                  <button onClick={() => handleDownload('html')} disabled={downloadState.active} className="w-full text-left text-sm p-2 rounded hover:bg-gray-700">HTML (for Epub)</button>
                </div>
              )}
            </div>
          </div>
          <div className="prose prose-invert prose-sm sm:prose-base max-w-none w-full h-full overflow-y-auto pr-2">
            <div className="w-full mb-8">
              {isGeneratingCover ? (
                  <div className="w-full max-w-sm mx-auto bg-gray-900 rounded-lg flex items-center justify-center" style={{ aspectRatio: '9 / 16' }}><Loader message="Designing cover..." /></div>
              ) : coverUrl ? (
                  <img src={coverUrl} alt="Generated Book Cover" className="w-full max-w-sm object-cover mx-auto rounded-lg shadow-2xl" style={{ aspectRatio: '9 / 16' }} />
              ) : (
                  <div className="w-full max-w-sm mx-auto bg-gray-900 rounded-lg flex flex-col items-center justify-center border-2 border-dashed border-gray-600" style={{ aspectRatio: '9 / 16' }}>
                    <button onClick={onGenerateCover} className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:bg-indigo-700">Generate Cover</button>
                  </div>
              )}
            </div>

            <h1>{ebook.title}</h1>
            <p className="lead"><em>by {ebook.author}</em></p>
            {ebook.chapters.map((chapter, index) => (
                <div key={index}>
                    <h2>{chapter.title}</h2>
                    {chapter.content ? (
                        <div dangerouslySetInnerHTML={{ __html: chapter.content }} />
                    ) : (
                        <p className="text-gray-500 italic">[Content for this chapter is being generated...]</p>
                    )}
                </div>
            ))}
          </div>
        </>
      ) : uploadedPdfUrl ? (
        <div className="flex-grow flex items-center justify-center">
            <div className="text-center text-gray-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-16 w-16 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9 2a2 2 0 00-2 2v8a2 2 0 002 2h2a2 2 0 002-2V4a2 2 0 00-2-2H9z" />
                    <path d="M4 12a2 2 0 012-2h10a2 2 0 012 2v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5z" />
                </svg>
                <p className="mt-4 text-lg font-semibold">Uploaded Ebook Ready</p>
                <p className="text-sm text-gray-400 mb-6">Your uploaded PDF is ready for download.</p>
                <a
                    href={uploadedPdfUrl}
                    download="uploaded-ebook.pdf"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500 transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                    Download PDF
                </a>
            </div>
        </div>
      ) : (
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <p className="mt-2 text-lg font-semibold">Your generated ebook will appear here</p>
            <p className="text-sm">Provide your idea and generate an outline to start.</p>
          </div>
        </div>
      )}
      
      <style>{`
        .prose h1 { color: #a78bfa; text-align: center; }
        .prose h2 { color: #818cf8; border-bottom: 1px solid #4b5563; padding-bottom: 0.25em; page-break-before: always; }
        .prose .lead { font-size: 1.2em; text-align: center; color: #d1d5db; }
        .prose p { color: #d1d5db; }
      `}</style>
    </div>
  );
};

export default EbookDisplay;
