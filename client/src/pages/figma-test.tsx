import { FigmaTest } from "@/components/figma-test";

export default function FigmaTestPage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Figma API Integration Test</h1>
        <p className="text-muted-foreground">
          Use this page to test the connection to the Figma API and fetching file data.
        </p>
      </div>
      
      <FigmaTest />
    </div>
  );
}