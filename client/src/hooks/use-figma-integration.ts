import { useState, useEffect } from "react";
import { useToast } from "./use-toast";
import { fetchFigmaFile as apiFetchFigmaFile } from "@/lib/figma-api";

export function useFigmaIntegration() {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const { toast } = useToast();

  // Check for existing token on mount
  useEffect(() => {
    const checkAccessToken = async () => {
      try {
        // This would check if there's an environment variable for the Figma token
        const response = await fetch('/api/figma/check-token');
        const data = await response.json();
        
        if (data.hasToken) {
          setIsConnected(true);
          setAccessToken(data.tokenHint || "****");
        }
      } catch (error) {
        console.error("Error checking Figma token:", error);
      }
    };
    
    checkAccessToken();
  }, []);

  const connectToFigma = async () => {
    try {
      setIsConnecting(true);
      
      // In a real app with OAuth, we would handle the full flow
      // For now, we'll use the environment variable token directly
      const response = await fetch('/api/figma/connect');
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || "Failed to connect to Figma");
      }
      
      setIsConnected(true);
      setAccessToken(data.tokenHint || "****");
      setIsConnecting(false);
      return true;
    } catch (error) {
      setIsConnecting(false);
      toast({
        title: "Failed to connect to Figma",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
      return false;
    }
  };

  const disconnectFigma = async () => {
    try {
      const response = await fetch('/api/figma/disconnect');
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || "Failed to disconnect from Figma");
      }
      
      setIsConnected(false);
      setAccessToken(null);
      return true;
    } catch (error) {
      toast({
        title: "Failed to disconnect from Figma",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
      return false;
    }
  };

  const fetchFigmaFile = async (fileUrl: string) => {
    try {
      if (!isConnected) {
        throw new Error("Not connected to Figma. Please connect first.");
      }
      
      // Extract file key from URL - supporting both file and design URLs
      let fileKey;
      
      // First try the standard file URL format (https://www.figma.com/file/KEY/NAME)
      const fileMatch = fileUrl.match(/figma\.com\/file\/([a-zA-Z0-9]+)/i);
      if (fileMatch && fileMatch[1]) {
        fileKey = fileMatch[1];
      } else {
        // Try the design URL format (https://www.figma.com/design/KEY/NAME)
        const designMatch = fileUrl.match(/figma\.com\/design\/([a-zA-Z0-9]+)/i);
        if (designMatch && designMatch[1]) {
          fileKey = designMatch[1];
        } else {
          throw new Error("Invalid Figma URL. Expected format: https://www.figma.com/file/FILEID/NAME");
        }
      }
      
      // Call our API function that will make the actual request to Figma's API
      const fileData = await apiFetchFigmaFile(fileKey, "");
      
      return fileData;
    } catch (error) {
      toast({
        title: "Failed to fetch Figma file",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
      return null;
    }
  };

  return {
    connectToFigma,
    disconnectFigma,
    fetchFigmaFile,
    isConnecting,
    isConnected,
    accessToken
  };
}
