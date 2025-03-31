import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useFigmaIntegration } from "@/hooks/use-figma-integration";
import { FigmaDesign } from "@/types";
import FigmaLogo from "../ui/figma-logo";
import { Check, FileImage } from "lucide-react";

interface FigmaConnectionStepProps {
  projectId: number;
  onContinue: () => void;
  onBack: () => void;
}

const FigmaConnectionStep: React.FC<FigmaConnectionStepProps> = ({ 
  projectId, 
  onContinue, 
  onBack 
}) => {
  const [figmaUrl, setFigmaUrl] = useState("");
  const [figmaConnectionStatus, setFigmaConnectionStatus] = useState<"" | "connected">("");
  const { toast } = useToast();
  const { connectToFigma, disconnectFigma } = useFigmaIntegration();
  const queryClient = useQueryClient();

  // Fetch recent Figma designs
  const { data: recentFigmaDesigns = [] } = useQuery<FigmaDesign[]>({
    queryKey: [`/api/projects/${projectId}/figma-designs`],
  });

  // Mutation for adding a new Figma design
  const addFigmaDesignMutation = useMutation({
    mutationFn: async (data: { name: string; figmaFileUrl: string }) => {
      return apiRequest('POST', `/api/projects/${projectId}/figma-designs`, data);
    },
    onSuccess: async () => {
      toast({
        title: "Figma file added",
        description: "Figma file has been added successfully.",
      });
      await queryClient.invalidateQueries({ queryKey: [`/api/projects/${projectId}/figma-designs`] });
    },
    onError: (error) => {
      toast({
        title: "Failed to add Figma file",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleConnectToFigma = async () => {
    try {
      await connectToFigma();
      setFigmaConnectionStatus("connected");
      toast({
        title: "Connected to Figma",
        description: "Your Figma account has been connected successfully.",
      });
    } catch (error) {
      toast({
        title: "Failed to connect",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    }
  };

  const handleDisconnectFigma = async () => {
    try {
      await disconnectFigma();
      setFigmaConnectionStatus("");
      toast({
        title: "Disconnected from Figma",
        description: "Your Figma account has been disconnected.",
      });
    } catch (error) {
      toast({
        title: "Failed to disconnect",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    }
  };

  const handleLoadFigmaFile = async () => {
    if (!figmaUrl.trim()) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid Figma file URL.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Extract file key from URL - supporting both file and design URLs
      let fileKey;
      
      // First try the standard file URL format
      const fileMatch = figmaUrl.match(/figma\.com\/file\/([a-zA-Z0-9]+)/i);
      if (fileMatch && fileMatch[1]) {
        fileKey = fileMatch[1];
      } else {
        // Try the design URL format
        const designMatch = figmaUrl.match(/figma\.com\/design\/([a-zA-Z0-9]+)/i);
        if (designMatch && designMatch[1]) {
          fileKey = designMatch[1];
        } else {
          throw new Error("Invalid Figma URL format. Expected format: https://www.figma.com/file/FILEID/NAME");
        }
      }

      // Extract name from URL
      const name = figmaUrl.split('/').pop() || "Figma Design";

      await addFigmaDesignMutation.mutateAsync({
        name,
        figmaFileUrl: figmaUrl
      });
      
      setFigmaUrl("");
    } catch (error) {
      toast({
        title: "Failed to load Figma file",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    }
  };

  const handleSelectFigmaFile = (fileId: number) => {
    toast({
      title: "Figma file selected",
      description: "The selected Figma file will be used for validation.",
    });
  };

  // Format the time ago
  const formatTimeAgo = (date: string) => {
    const now = new Date();
    const pastDate = new Date(date);
    const diffInDays = Math.floor((now.getTime() - pastDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return "Today";
    if (diffInDays === 1) return "Yesterday";
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    return `${Math.floor(diffInDays / 30)} months ago`;
  };

  return (
    <div>
      <h3 className="text-lg font-medium mb-6">Connect to Figma</h3>
      
      <div className="border-2 border-dashed border-neutral-200 rounded-lg p-8 text-center mb-6">
        <div className="flex flex-col items-center justify-center">
          <div className="w-16 h-16 mb-4">
            <FigmaLogo />
          </div>
          <h4 className="text-lg font-medium mb-2">Connect to your Figma account</h4>
          <p className="text-neutral-600 mb-6">Access your Figma files to compare with SRS documents</p>
          
          {figmaConnectionStatus !== "connected" ? (
            <Button 
              variant="default" 
              className="bg-black hover:bg-gray-800 text-white px-6 py-3 rounded"
              onClick={handleConnectToFigma}
            >
              Connect to Figma
            </Button>
          ) : (
            <div>
              <div className="flex items-center text-green-600 mb-4">
                <Check className="mr-2 h-5 w-5" />
                <span>Connected to Figma</span>
              </div>
              <Button
                variant="outline"
                className="bg-neutral-200 hover:bg-neutral-300 text-neutral-800 px-4 py-2 rounded text-sm"
                onClick={handleDisconnectFigma}
              >
                Disconnect
              </Button>
            </div>
          )}
        </div>
      </div>
      
      <div className="mb-6">
        <h4 className="font-medium mb-3">Figma File URL</h4>
        <div className="flex">
          <Input 
            type="text" 
            className="flex-1 rounded-r-none" 
            placeholder="Paste Figma file URL here"
            value={figmaUrl}
            onChange={(e) => setFigmaUrl(e.target.value)}
          />
          <Button 
            className="rounded-l-none"
            onClick={handleLoadFigmaFile}
            disabled={addFigmaDesignMutation.isPending}
          >
            {addFigmaDesignMutation.isPending ? "Loading..." : "Load"}
          </Button>
        </div>
        <div className="mt-2 space-y-1">
          <p className="text-sm text-neutral-600">
            Enter a Figma URL in one of these formats:
          </p>
          <p className="text-xs font-mono bg-muted p-1 rounded">
            https://www.figma.com/file/FILE_ID/FILE_NAME
          </p>
          <p className="text-xs font-mono bg-muted p-1 rounded">
            https://www.figma.com/design/FILE_ID/FILE_NAME
          </p>
        </div>
      </div>
      
      {recentFigmaDesigns.length > 0 && (
        <div className="bg-neutral-50 rounded-lg p-4 mb-6">
          <h4 className="font-medium mb-3">Recent Figma Files</h4>
          <div className="divide-y divide-neutral-200">
            {recentFigmaDesigns.map((file) => (
              <div key={file.id} className="flex items-center justify-between py-3">
                <div className="flex items-center">
                  <div className="bg-white p-2 rounded border border-neutral-200 mr-3">
                    <FileImage className="h-5 w-5 text-neutral-600" />
                  </div>
                  <div>
                    <p className="font-medium">{file.name}</p>
                    <p className="text-sm text-neutral-600">
                      Last accessed: {formatTimeAgo(file.lastAccessed)}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  className="text-primary hover:text-primary/90 font-medium"
                  onClick={() => handleSelectFigmaFile(file.id)}
                >
                  Select
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button 
          onClick={onContinue}
          disabled={recentFigmaDesigns.length === 0 || figmaConnectionStatus !== "connected"}
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default FigmaConnectionStep;
