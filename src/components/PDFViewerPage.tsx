import { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { 
  ArrowLeft, 
  Download, 
  ZoomIn, 
  ZoomOut, 
  ChevronLeft, 
  ChevronRight, 
  Printer,
  Loader2
} from 'lucide-react';

// Set up PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PDFViewerPageProps {
  lecture: {
    name: string;
    url: string;
    size: number;
    createdAt: string;
  };
  onBack: () => void;
}

const Button = ({ children, variant = 'primary', className = '', icon: Icon, ...props }: any) => {
  const baseStyle = "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants: any = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white shadow-sm rounded-lg",
    secondary: "bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-sm rounded-lg",
    ghost: "bg-transparent hover:bg-slate-200/50 text-slate-600 hover:text-slate-900 rounded-lg",
    icon: "p-2 hover:bg-slate-200/50 text-slate-600 rounded-full"
  };

  const sizes = "px-4 py-2 text-sm";
  const iconSize = "p-2";

  return (
    <button className={`${baseStyle} ${variants[variant]} ${variant === 'icon' ? iconSize : sizes} ${className}`} {...props}>
      {Icon && <Icon className={`w-4 h-4 ${children ? 'mr-2' : ''}`} strokeWidth={2} />}
      {children}
    </button>
  );
};

export const PDFViewerPage = ({ lecture, onBack }: PDFViewerPageProps) => {
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [zoom, setZoom] = useState(1.5);
  const [isLoading, setIsLoading] = useState(true);

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.25, 2.0));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.25, 0.5));
  const handleNextPage = () => setCurrentPage(prev => Math.min(prev + 1, numPages));
  const handlePrevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setIsLoading(false);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50 font-sans overflow-hidden">
      
      {/* Header / Toolbar */}
      <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 z-20 shadow-sm relative">
        
        {/* Left: Back & Title */}
        <div className="flex items-center gap-4 w-1/3">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-slate-100 rounded-full text-slate-500 hover:text-slate-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex flex-col">
            <h1 className="font-semibold text-slate-800 text-sm md:text-base truncate max-w-[200px] md:max-w-xs">
              {lecture.name.replace(/\d+-\w+\.pdf$/, '').replace(/_/g, ' ')}
            </h1>
            <span className="text-xs text-slate-400">{formatFileSize(lecture.size)} • {formatDate(lecture.createdAt)}</span>
          </div>
        </div>

        {/* Center: Page Navigation & Zoom Controls */}
        <div className="hidden md:flex items-center gap-2 bg-slate-100 p-1 rounded-lg">
          <Button variant="icon" onClick={handleZoomOut} disabled={zoom <= 0.5} icon={ZoomOut} />
          <span className="text-xs font-medium text-slate-600 w-12 text-center">{Math.round(zoom * 100)}%</span>
          <Button variant="icon" onClick={handleZoomIn} disabled={zoom >= 2.0} icon={ZoomIn} />
          
          <div className="w-px h-4 bg-slate-300 mx-1"></div>
          
          <Button variant="icon" onClick={handlePrevPage} disabled={currentPage === 1} icon={ChevronLeft} />
          <div className="flex items-center gap-1 text-sm text-slate-600 px-2">
            <input 
              type="number" 
              value={currentPage}
              onChange={(e) => {
                const page = parseInt(e.target.value);
                if (page >= 1 && page <= numPages) setCurrentPage(page);
              }}
              className="w-10 text-center bg-white border border-slate-200 rounded text-xs py-0.5 focus:outline-none focus:border-blue-500"
            />
            <span className="text-slate-400">/ {numPages || '...'}</span>
          </div>
          <Button variant="icon" onClick={handleNextPage} disabled={currentPage === numPages} icon={ChevronRight} />
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 w-1/3 justify-end">
          <div className="hidden sm:flex items-center gap-1">
             <Button variant="ghost" icon={Printer} className="hidden lg:flex" onClick={() => window.print()}>Print</Button>
             <a href={lecture.url} download>
               <Button variant="secondary" icon={Download}>Download</Button>
             </a>
          </div>
          
          <a href={lecture.url} target="_blank" rel="noopener noreferrer" className="sm:hidden">
            <Button variant="secondary" icon={Download}>Download</Button>
          </a>
        </div>
      </header>

      {/* Main PDF Viewport */}
      <div className="flex flex-1 overflow-hidden relative">
        
        {/* PDF Canvas Area */}
        <main className="flex-1 bg-slate-200/50 overflow-auto flex justify-center items-start p-2">
          
          {/* Loading State */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-32">
              <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
              <p className="text-slate-600 font-medium">Loading PDF...</p>
            </div>
          )}

          {/* PDF Document */}
          <div className="w-full max-w-full">
            <Document
              file={lecture.url}
              onLoadSuccess={onDocumentLoadSuccess}
              onLoadError={(error) => {
                console.error('Error loading PDF:', error);
                setIsLoading(false);
              }}
              loading={null}
              className="flex justify-center"
            >
              <Page
                pageNumber={currentPage}
                scale={zoom}
                renderTextLayer={true}
                renderAnnotationLayer={true}
                className="shadow-lg"
                width={Math.min(window.innerWidth - 32, 1200)}
              />
            </Document>
          </div>

          {/* Floating Controls for Mobile */}
          <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur shadow-lg border border-slate-200 rounded-full px-4 py-2 flex items-center gap-3 z-10">
             <button 
               onClick={handlePrevPage} 
               disabled={currentPage === 1}
               className="p-1 disabled:opacity-30"
             >
               <ChevronLeft className="w-5 h-5 text-slate-600" />
             </button>
             <span className="text-sm font-medium text-slate-800">{currentPage} / {numPages || '...'}</span>
             <button 
               onClick={handleNextPage} 
               disabled={currentPage === numPages}
               className="p-1 disabled:opacity-30"
             >
               <ChevronRight className="w-5 h-5 text-slate-600" />
             </button>
             
             <div className="w-px h-6 bg-slate-300 mx-1"></div>
             
             <button 
               onClick={handleZoomOut} 
               disabled={zoom <= 0.5}
               className="p-1 disabled:opacity-30"
             >
               <ZoomOut className="w-4 h-4 text-slate-600" />
             </button>
             <span className="text-xs font-medium text-slate-700">{Math.round(zoom * 100)}%</span>
             <button 
               onClick={handleZoomIn} 
               disabled={zoom >= 2.0}
               className="p-1 disabled:opacity-30"
             >
               <ZoomIn className="w-4 h-4 text-slate-600" />
             </button>
          </div>

        </main>

      </div>
    </div>
  );
};
