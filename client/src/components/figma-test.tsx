import { useState } from "react";
import { useFigmaIntegration } from "@/hooks/use-figma-integration";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function FigmaTest() {
  const [figmaUrl, setFigmaUrl] = useState("");
  const [fileData, setFileData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  
  const { 
    connectToFigma, 
    disconnectFigma, 
    fetchFigmaFile, 
    isConnected, 
    isConnecting, 
    accessToken 
  } = useFigmaIntegration();
  
  const handleConnect = async () => {
    await connectToFigma();
  };
  
  const handleDisconnect = async () => {
    await disconnectFigma();
    setFileData(null);
  };
  
  const handleFetchFile = async () => {
    setLoading(true);
    const data = await fetchFigmaFile(figmaUrl);
    setFileData(data);
    setLoading(false);
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Figma API Integration Test</CardTitle>
          <CardDescription>
            Test the connection to the Figma API and fetch file data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Connection Status</Label>
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span>{isConnected ? 'Connected' : 'Disconnected'}</span>
            </div>
            {accessToken && (
              <div className="text-sm text-muted-foreground">
                Token: {accessToken}
              </div>
            )}
          </div>
          
          <div className="flex flex-col space-y-2">
            {!isConnected ? (
              <Button onClick={handleConnect} disabled={isConnecting}>
                {isConnecting ? 'Connecting...' : 'Connect to Figma'}
              </Button>
            ) : (
              <Button onClick={handleDisconnect} variant="outline">
                Disconnect from Figma
              </Button>
            )}
          </div>
          
          {isConnected && (
            <div className="space-y-2">
              <Label htmlFor="figma-url">Figma File URL</Label>
              <div className="flex space-x-2">
                <Input
                  id="figma-url"
                  placeholder="https://www.figma.com/file/..."
                  value={figmaUrl}
                  onChange={(e) => setFigmaUrl(e.target.value)}
                />
                <Button onClick={handleFetchFile} disabled={loading || !figmaUrl}>
                  {loading ? 'Loading...' : 'Fetch File'}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Enter a Figma file URL to fetch its data
              </p>
            </div>
          )}
        </CardContent>
      </Card>
      
      {fileData && (
        <Card>
          <CardHeader>
            <CardTitle>Figma File: {fileData.name}</CardTitle>
            <CardDescription>
              Version: {fileData.version}, Last Modified: {fileData.lastModified}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Pages ({fileData.pages.length})</h3>
              <div className="grid gap-2">
                {fileData.pages.map((page: any) => (
                  <div key={page.id} className="border rounded-md p-3">
                    <h4 className="font-medium">{page.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {page.nodes.length} nodes
                    </p>
                  </div>
                ))}
                
                {fileData.pages.length === 0 && (
                  <p className="text-muted-foreground">
                    No pages found in this Figma file.
                  </p>
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" onClick={() => setFileData(null)}>
              Clear Results
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}