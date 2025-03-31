// This module simulates SRS document parsing functionality
// In a real implementation, it would use libraries like pdf-parse or docx-parser

/**
 * Parse an uploaded document and extract requirements
 */
export async function parseDocument(file: File): Promise<any> {
  // Check file type
  if (!isAcceptedFileType(file)) {
    throw new Error(`Unsupported file type: ${file.type}`);
  }

  // In a real implementation, this would extract text and requirements from document
  // For demo, we'll simulate processing time and return mock data
  await new Promise(resolve => setTimeout(resolve, 1500));

  return {
    requirements: generateMockRequirements(),
    documentMetadata: {
      title: file.name.replace(/\.[^/.]+$/, ""),
      size: file.size,
      type: file.type,
      pages: Math.floor(Math.random() * 20) + 5
    }
  };
}

/**
 * Check if the file is an accepted type for parsing
 */
function isAcceptedFileType(file: File): boolean {
  const acceptedTypes = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain'
  ];
  
  return acceptedTypes.includes(file.type);
}

/**
 * Generate mock requirements for demo purposes
 */
function generateMockRequirements(): Array<any> {
  const requirements = [
    {
      id: "REQ-001",
      category: "Authentication",
      text: "The system shall validate email addresses to ensure they follow the format user@domain.tld and display appropriate error messages.",
      priority: "High"
    },
    {
      id: "REQ-002",
      category: "Product Listing",
      text: "The product listing page shall provide filtering options for category, price range, brand, rating, and availability.",
      priority: "Medium"
    },
    {
      id: "REQ-003",
      category: "Checkout",
      text: "The checkout process shall follow a 4-step workflow: cart review, shipping information, payment method, and order confirmation.",
      priority: "High"
    },
    {
      id: "REQ-004",
      category: "Payment",
      text: "The system shall support multiple payment methods including credit cards, PayPal, Apple Pay, and Google Pay.",
      priority: "High"
    },
    {
      id: "REQ-005",
      category: "User Profile",
      text: "Users shall be able to view and edit their profile information, including name, email, phone number, and address.",
      priority: "Medium"
    }
  ];
  
  return requirements;
}
