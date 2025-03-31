import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { File, X, Check, FileText, FileType } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useDocumentParser } from "@/hooks/use-document-parser";

interface DocumentUploadStepProps {
  projectId: number;
  onContinue: () => void;
}

type UploadedFile = {
  id: number;
  name: string;
  size: string;
  status: "success" | "error" | "uploading";
  originalFilename: string;
  fileType: string;
};

const getFileIcon = (fileName: string) => {
  if (fileName.endsWith('.pdf')) {
    return <File className="text-red-600 h-5 w-5 mr-3" />;
  } else if (fileName.endsWith('.docx')) {
    return <FileType className="text-primary h-5 w-5 mr-3" />;
  } else {
    return <FileText className="text-neutral-600 h-5 w-5 mr-3" />;
  }
};

const DocumentUploadStep: React.FC<DocumentUploadStepProps> = ({ projectId, onContinue }) => {
  const [projectName, setProjectName] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const { toast } = useToast();
  const { parseDocument } = useDocumentParser();

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("name", file.name);
      
      const response = await fetch(`/api/projects/${projectId}/documents`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      
      if (!response.ok) {
        throw new Error("Failed to upload document");
      }
      
      return await response.json();
    },
    onSuccess: (data) => {
      setUploadedFiles(prev => {
        const newFiles = [...prev];
        const fileIndex = newFiles.findIndex(f => f.originalFilename === data.originalFilename);
        
        if (fileIndex !== -1) {
          newFiles[fileIndex] = {
            ...newFiles[fileIndex],
            id: data.id,
            status: "success",
          };
        }
        
        return newFiles;
      });
      
      toast({
        title: "Upload successful",
        description: `${data.originalFilename} has been uploaded successfully.`,
      });
    },
    onError: (error, file) => {
      setUploadedFiles(prev => {
        const newFiles = [...prev];
        const fileIndex = newFiles.findIndex(f => f.originalFilename === file.name);
        
        if (fileIndex !== -1) {
          newFiles[fileIndex] = {
            ...newFiles[fileIndex],
            status: "error",
          };
        }
        
        return newFiles;
      });
      
      toast({
        title: "Upload failed",
        description: `Failed to upload ${file.name}. ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileSize = formatFileSize(file.size);
      
      // Add file to uploaded files list with "uploading" status
      setUploadedFiles(prev => [
        ...prev,
        {
          id: 0,
          name: file.name,
          size: fileSize,
          status: "uploading",
          originalFilename: file.name,
          fileType: file.type,
        }
      ]);
      
      // Start upload
      uploadMutation.mutate(file);
      
      // Parse document (in a real app, this would be handled by the backend)
      parseDocument(file);
    }
  };

  const removeFile = (fileName: string) => {
    setUploadedFiles(prev => prev.filter(file => file.name !== fileName));
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <div>
      <h3 className="text-lg font-medium mb-6">Upload SRS Documents</h3>
      
      <div className="mb-6">
        <label className="block text-sm font-medium mb-1">Project Name</label>
        <Input 
          type="text" 
          className="w-full md:w-1/2" 
          placeholder="Enter project name"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
        />
      </div>
      
      <div className="border-2 border-dashed border-neutral-200 rounded-lg p-8 text-center mb-6">
        <div className="flex flex-col items-center justify-center">
          <File className="h-16 w-16 text-neutral-400 mb-4" />
          <h4 className="text-lg font-medium mb-2">Drag & drop your SRS documents here</h4>
          <p className="text-neutral-600 mb-4">Supports PDF, Word (.docx), and text (.txt) formats</p>
          <div>
            <label htmlFor="file-upload" className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded cursor-pointer">
              <span>Browse Files</span>
              <input 
                id="file-upload" 
                type="file" 
                className="hidden" 
                multiple 
                accept=".pdf,.docx,.txt"
                onChange={handleFileUpload}
              />
            </label>
          </div>
        </div>
      </div>
      
      {uploadedFiles.length > 0 && (
        <div className="bg-neutral-50 rounded-lg p-4 mb-6">
          <h4 className="font-medium mb-3">Uploaded Documents</h4>
          <div className="space-y-3">
            {uploadedFiles.map((file, index) => (
              <div key={index} className="flex items-center justify-between bg-white p-3 rounded border border-neutral-200">
                <div className="flex items-center">
                  {getFileIcon(file.name)}
                  <div>
                    <p className="font-medium">{file.name}</p>
                    <p className="text-sm text-neutral-600">{file.size}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  {file.status === "success" && (
                    <span className="text-green-600 mr-3">
                      <Check className="h-5 w-5" />
                    </span>
                  )}
                  {file.status === "uploading" && (
                    <span className="text-blue-600 mr-3">
                      <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    </span>
                  )}
                  <button 
                    className="text-neutral-600 hover:text-red-600" 
                    onClick={() => removeFile(file.name)}
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="flex justify-end">
        <Button 
          onClick={onContinue} 
          disabled={uploadedFiles.length === 0 || uploadedFiles.some(file => file.status === "uploading")}
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default DocumentUploadStep;
