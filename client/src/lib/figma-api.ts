// Figma API integration module
// This interacts with the Figma API using environment variables for authentication

interface FigmaNode {
  id: string;
  name: string;
  type: string;
  children?: FigmaNode[];
}

interface FigmaPage {
  id: string;
  name: string;
  nodes: FigmaNode[];
}

interface FigmaFile {
  name: string;
  lastModified: string;
  version: string;
  pages: FigmaPage[];
}

/**
 * Fetch Figma file data from the Figma API
 */
export async function fetchFigmaFile(fileKey: string, accessToken: string): Promise<FigmaFile> {
  try {
    // Make a server-side request to proxy the Figma API call
    // This way we avoid exposing the access token in the client
    const response = await fetch(`/api/figma/file/${fileKey}`);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Failed to fetch Figma file: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Transform the response into our expected format
    return {
      name: data.name,
      lastModified: data.lastModified || new Date().toISOString(),
      version: data.version || "1.0",
      pages: transformFigmaPages(data)
    };
  } catch (error) {
    console.error("Error fetching Figma file:", error);
    
    // If the API request fails, we'll return a placeholder with error info
    // so the UI can display the appropriate error state
    return {
      name: "Error: Could not load Figma file",
      lastModified: new Date().toISOString(),
      version: "error",
      pages: []
    };
  }
}

/**
 * Transform Figma API response to our page structure
 */
function transformFigmaPages(figmaData: any): FigmaPage[] {
  try {
    // If we have real Figma data, extract the pages
    if (figmaData.document && figmaData.document.children) {
      return figmaData.document.children.map((page: any) => ({
        id: page.id,
        name: page.name,
        nodes: extractNodes(page)
      }));
    }
    
    // Fallback to empty array if no pages are found
    return [];
  } catch (error) {
    console.error("Error transforming Figma pages:", error);
    return [];
  }
}

/**
 * Extract nodes from a Figma page
 */
function extractNodes(page: any): FigmaNode[] {
  try {
    if (!page || !page.children) {
      return [];
    }
    
    const processNode = (node: any): FigmaNode => {
      return {
        id: node.id,
        name: node.name,
        type: node.type,
        ...(node.children && { children: node.children.map(processNode) })
      };
    };
    
    return page.children.map(processNode);
  } catch (error) {
    console.error("Error extracting Figma nodes:", error);
    return [];
  }
}

/**
 * Fetch Figma image URLs for nodes
 */
export async function fetchFigmaImages(fileKey: string, nodeIds: string[], accessToken: string): Promise<Record<string, string>> {
  try {
    // Make a server-side request to proxy the Figma API call for images
    const queryParams = new URLSearchParams({
      ids: nodeIds.join(','),
      format: 'png'
    });
    
    const response = await fetch(`/api/figma/images/${fileKey}?${queryParams}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch Figma images: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Return the images object from the response
    return data.images || {};
  } catch (error) {
    console.error("Error fetching Figma images:", error);
    return {};
  }
}

/**
 * Generate mock login UI nodes
 */
function generateMockLoginNodes(): FigmaNode[] {
  return [
    {
      id: "login-screen",
      name: "Login Screen",
      type: "FRAME",
      children: [
        {
          id: "login-form",
          name: "Login Form",
          type: "GROUP",
          children: [
            {
              id: "email-field",
              name: "Email Field",
              type: "INPUT"
            },
            {
              id: "password-field",
              name: "Password Field",
              type: "INPUT"
            },
            {
              id: "login-button",
              name: "Login Button",
              type: "BUTTON"
            }
          ]
        }
      ]
    }
  ];
}

/**
 * Generate mock product listing nodes
 */
function generateMockProductListingNodes(): FigmaNode[] {
  return [
    {
      id: "product-listing",
      name: "Product Listing",
      type: "FRAME",
      children: [
        {
          id: "filters",
          name: "Filters",
          type: "GROUP",
          children: [
            {
              id: "category-filter",
              name: "Category Filter",
              type: "DROPDOWN"
            },
            {
              id: "price-filter",
              name: "Price Filter",
              type: "SLIDER"
            },
            {
              id: "brand-filter",
              name: "Brand Filter",
              type: "DROPDOWN"
            }
          ]
        },
        {
          id: "product-grid",
          name: "Product Grid",
          type: "GROUP"
        }
      ]
    }
  ];
}

/**
 * Generate mock checkout flow nodes
 */
function generateMockCheckoutNodes(): FigmaNode[] {
  return [
    {
      id: "checkout-flow",
      name: "Checkout Flow",
      type: "FRAME",
      children: [
        {
          id: "cart-review",
          name: "Cart Review",
          type: "FRAME"
        },
        {
          id: "shipping-info",
          name: "Shipping Information",
          type: "FRAME"
        },
        {
          id: "payment",
          name: "Payment",
          type: "FRAME"
        }
      ]
    }
  ];
}
