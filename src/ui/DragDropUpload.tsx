import React, {
  useState,
  useRef,
  DragEvent,
  ChangeEvent,
  TouchEvent,
  useEffect,
} from "react";
import Button from "./Button";
import styles from "./DragDropUpload.module.css";

interface DragDropUploadProps {
  onFileSelected: (file: File) => void;
  acceptedFileTypes?: string;
  maxFileSize?: number; // in bytes
  primaryText?: string;
  secondaryText?: string;
  mobileBreakpoint?: number; // Custom breakpoint for mobile layout
  isLoading?: boolean; // Loading state indicator
}

const DragDropUpload: React.FC<DragDropUploadProps> = ({
  onFileSelected,
  acceptedFileTypes = "*",
  maxFileSize = 10485760, // 10MB default
  primaryText = "Upload Document",
  secondaryText = "Drag and drop or click to select",
  mobileBreakpoint = 640, // Default breakpoint when card stacks above text
  isLoading = false, // Default not loading
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMobileLayout, setIsMobileLayout] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Detect mobile layout on mount and window resize
  useEffect(() => {
    const checkLayout = () => {
      // Use the custom breakpoint to determine when the layout changes
      setIsMobileLayout(window.innerWidth <= mobileBreakpoint);
    };

    checkLayout();
    window.addEventListener("resize", checkLayout);

    return () => {
      window.removeEventListener("resize", checkLayout);
    };
  }, [mobileBreakpoint]);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const validateFile = (file: File): boolean => {
    setError(null);

    // Check file type if specified
    if (acceptedFileTypes !== "*") {
      const fileType = file.type;
      const acceptedTypes = acceptedFileTypes.split(",");

      if (!acceptedTypes.some((type) => fileType.includes(type.trim()))) {
        setError(`File type not supported. Please upload ${acceptedFileTypes}`);
        return false;
      }
    }

    // Check file size
    if (file.size > maxFileSize) {
      const maxSizeMB = Math.round(maxFileSize / (1024 * 1024));
      setError(`File is too large. Maximum size is ${maxSizeMB}MB`);
      return false;
    }

    return true;
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];

      if (validateFile(file)) {
        onFileSelected(file);
      }
    }
  };

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];

      if (validateFile(file)) {
        onFileSelected(file);
      }
    }
  };

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Touch event handlers for visual feedback
  const handleTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    setIsDragging(true);
  };

  const handleTouchEnd = (e: TouchEvent<HTMLDivElement>) => {
    setIsDragging(false);
  };

  // Add loading indicator in the component UI
  const renderLoadingIndicator = () => {
    if (!isLoading) return null;

    return (
      <div className={styles.loadingOverlay}>
        <div className={styles.spinner}></div>
        <p>Processing document...</p>
      </div>
    );
  };

  return (
    <div
      ref={containerRef}
      className={`${styles.container} ${
        isMobileLayout ? styles.mobileContainer : ""
      } ${isLoading ? styles.loading : ""}`}
      onClick={isMobileLayout && !isLoading ? handleClick : undefined}
    >
      {renderLoadingIndicator()}

      <input
        type="file"
        ref={fileInputRef}
        className={styles.fileInput}
        onChange={handleFileSelect}
        accept={acceptedFileTypes}
        disabled={isLoading}
      />

      {/* Only show as separate element on desktop */}
      {!isMobileLayout && (
        <div
          className={`${styles.dropZone} ${isDragging ? styles.dragging : ""}`}
          onDragOver={!isLoading ? handleDragOver : undefined}
          onDragLeave={!isLoading ? handleDragLeave : undefined}
          onDrop={!isLoading ? handleDrop : undefined}
          onClick={!isLoading ? handleClick : undefined}
          role="button"
          tabIndex={0}
          aria-label="Upload file"
        >
          <div className={styles.uploadIcon}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 15V3M12 3L7 8M12 3L17 8"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M3 15V19C3 19.5304 3.21071 20.0391 3.58579 20.4142C3.96086 20.7893 4.46957 21 5 21H19C19.5304 21 20.0391 20.7893 20.4142 20.4142C20.7893 20.0391 21 19.5304 21 19V15"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      )}

      {/* Mobile layout - combined view */}
      {isMobileLayout && (
        <div
          className={`${styles.mobileUploadArea} ${
            isDragging ? styles.dragging : ""
          }`}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          role="button"
          tabIndex={0}
          aria-label="Upload file"
        >
          <div className={styles.uploadIcon}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 15V3M12 3L7 8M12 3L17 8"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M3 15V19C3 19.5304 3.21071 20.0391 3.58579 20.4142C3.96086 20.7893 4.46957 21 5 21H19C19.5304 21 20.0391 20.7893 20.4142 20.4142C20.7893 20.0391 21 19.5304 21 19V15"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className={styles.mobileTextContainer}>
            <h3 className={styles.primaryText}>{primaryText}</h3>
            <p className={styles.secondaryText}>Tap to select a file</p>
          </div>
        </div>
      )}

      {/* Desktop text container */}
      {!isMobileLayout && (
        <div className={styles.textContainer}>
          <h3 className={styles.primaryText}>{primaryText}</h3>
          <p className={styles.secondaryText}>{secondaryText}</p>
          {error && <p className={styles.errorText}>{error}</p>}
        </div>
      )}

      {/* Show error on mobile if present */}
      {isMobileLayout && error && <p className={styles.errorText}>{error}</p>}
    </div>
  );
};

export default DragDropUpload;
