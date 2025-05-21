import React, {
  useState,
  forwardRef,
  useImperativeHandle,
  useEffect,
} from "react";
import styles from "../Styles/FileUpload.module.css";
import { MdOutlineFileUpload } from "react-icons/md";

interface FileUploadProps {
  label: string;
  onFileSelect: (file: File | null) => void;
  progressPercentage?: number; // Optional progress percentage
  onUploadComplete?: () => void;
  disabled?: boolean;
}

export interface FileUploadRef {
  clearFile: () => void; // Expose a method to clear the file
}

const FileUpload = forwardRef<FileUploadRef, FileUploadProps>(
  (
    { disabled, label, onFileSelect, progressPercentage = 0, onUploadComplete },
    ref
  ) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [status, setStatus] = useState<"uploading" | "complete">("uploading");
    const [isDragOver, setIsDragOver] = useState<boolean>(false); // To track drag over state

    // Handle file change (when file is selected)
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files ? event.target.files[0] : null;
      setSelectedFile(file);

      onFileSelect(file);
    };

    // Handle programmatic clear
    const clearFile = () => {
      setSelectedFile(null);
      onFileSelect(null);
      setStatus("uploading");
    };

    // Expose the clearFile method to the parent through the ref
    useImperativeHandle(ref, () => ({
      clearFile,
    }));

    // Handle file input click
    const handleContainerClick = () => {
      const fileInput = document.querySelector(
        `.${styles.fileInput}`
      ) as HTMLInputElement | null;
      fileInput?.click();
    };

    // Handle drag events
    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault(); // Prevent the default behavior to allow dropping
      setIsDragOver(true);
    };

    const handleDragLeave = () => {
      setIsDragOver(false); // Reset drag state when leaving
    };

    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setIsDragOver(false);

      const file = event.dataTransfer.files
        ? event.dataTransfer.files[0]
        : null;
      setSelectedFile(file);
      onFileSelect(file);
    };

    // Set the status based on progress percentage
    useEffect(() => {
      if (progressPercentage > 0 && progressPercentage < 100) {
        setStatus("uploading");
      } else if (progressPercentage === 100) {
        setStatus("complete");
      }
    }, [progressPercentage]);

    // Determine status message based on the upload status
    const getStatusMessage = () => {
      switch (status) {
        case "uploading":
          return "Uploading...";
        case "complete":
          if (onUploadComplete) {
            onUploadComplete();
          }
          return "Upload complete!";
        default:
          return "";
      }
    };

    return (
      <div
        className={`${disabled ? styles.disabled : ""} ${
          styles.fileUploadContainer
        }`}
      >
        <label className={styles.label}>{label}</label>
        {/* Clicking anywhere in this container will trigger the file input */}
        <div
          className={`${styles.fileInputContainer} ${
            isDragOver ? styles.dragOver : ""
          }`}
          onClick={handleContainerClick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            type="file"
            className={styles.fileInput}
            onChange={handleFileChange}
            style={{ cursor: "pointer" }}
          />
          <div className={styles.visibleElements}>
            <MdOutlineFileUpload />
            <div>
              {selectedFile
                ? selectedFile.name
                : "No file selected. Click or drag file here to upload"}
            </div>
          </div>

          {/* <input
            type="text"
            className={styles.fileName}
            value={
              selectedFile
                ? selectedFile.name
                : "No file selected. Click or drag file here to upload"
            }
            readOnly
            style={{
              cursor: "pointer",
              backgroundColor: "#EFEFEF",
              borderRadius: "5px",
            }}
          /> */}
        </div>

        {/* Progress dialog */}
        {progressPercentage > 0 && progressPercentage < 100 && (
          <div className={styles.progressDialog}>
            <div className={styles.progressBar}>
              <div
                className={styles.progressFill}
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <span>{`Uploading... ${progressPercentage.toFixed(2)}%`}</span>
          </div>
        )}

        {/* Status message */}
        {status !== "uploading" && (
          <div
            className={`${styles.statusMessage} ${
              status === "complete" ? styles.successAnimation : ""
            }`}
          >
            {getStatusMessage()}
          </div>
        )}
      </div>
    );
  }
);

// Assign display name for debugging
FileUpload.displayName = "FileUpload";

export default FileUpload;
