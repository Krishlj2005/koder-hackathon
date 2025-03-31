// Project types
export interface Project {
  id: number;
  name: string;
  description?: string;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

// Document types
export interface Document {
  id: number;
  projectId: number;
  name: string;
  originalFilename: string;
  fileSize: number;
  fileType: string;
  content?: string;
  extractedRequirements?: any;
  createdAt: string;
}

// Figma design types
export interface FigmaDesign {
  id: number;
  projectId: number;
  name: string;
  figmaFileUrl: string;
  figmaFileKey?: string;
  accessToken?: string;
  thumbnailUrl?: string;
  lastAccessed: string;
  createdAt: string;
}

// Validation types
export interface Validation {
  id: number;
  projectId: number;
  startedAt: string;
  completedAt?: string;
  status: string;
  complianceScore?: number;
  compliantElements?: number;
  inconsistencies?: number;
  results?: any;
}

// Test case types
export interface TestCase {
  id: number;
  validationId: number;
  testCaseId: string;
  name: string;
  description?: string;
  type: string;
  severity: string;
  status: string;
  requirement?: string;
  designElement?: string;
  createdAt: string;
}

// Inconsistency types
export interface Inconsistency {
  name: string;
  status: 'Missing' | 'Partial' | 'Mismatch';
  description: string;
}
