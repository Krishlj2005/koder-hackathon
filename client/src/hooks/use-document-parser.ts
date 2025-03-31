import { useState } from "react";
import { useToast } from "./use-toast";
import { parseDocument } from "@/lib/document-parser";

export function useDocumentParser() {
  const [isLoading, setIsLoading] = useState(false);
  const [extractedRequirements, setExtractedRequirements] = useState<any>(null);
  const { toast } = useToast();

  const parse = async (file: File) => {
    try {
      setIsLoading(true);
      const result = await parseDocument(file);
      setExtractedRequirements(result);
      setIsLoading(false);
      return result;
    } catch (error) {
      setIsLoading(false);
      toast({
        title: "Failed to parse document",
        description: error.message,
        variant: "destructive",
      });
      return null;
    }
  };

  return {
    parseDocument: parse,
    isLoading,
    extractedRequirements,
  };
}
