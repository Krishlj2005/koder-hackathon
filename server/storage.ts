import { 
  users, User, InsertUser, 
  projects, Project, InsertProject,
  documents, Document, InsertDocument, 
  figmaDesigns, FigmaDesign, InsertFigmaDesign,
  validations, Validation, InsertValidation,
  testCases, TestCase, InsertTestCase
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Project operations
  getProjects(userId: number): Promise<Project[]>;
  getProject(id: number): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: number, project: Partial<InsertProject>): Promise<Project | undefined>;
  deleteProject(id: number): Promise<boolean>;

  // Document operations
  getDocuments(projectId: number): Promise<Document[]>;
  getDocument(id: number): Promise<Document | undefined>;
  createDocument(document: InsertDocument): Promise<Document>;
  updateDocument(id: number, content: string, extractedRequirements: any): Promise<Document | undefined>;
  deleteDocument(id: number): Promise<boolean>;

  // Figma design operations
  getFigmaDesigns(projectId: number): Promise<FigmaDesign[]>;
  getFigmaDesign(id: number): Promise<FigmaDesign | undefined>;
  createFigmaDesign(figmaDesign: InsertFigmaDesign): Promise<FigmaDesign>;
  updateFigmaDesign(id: number, figmaDesign: Partial<FigmaDesign>): Promise<FigmaDesign | undefined>;
  deleteFigmaDesign(id: number): Promise<boolean>;

  // Validation operations
  getValidations(projectId: number): Promise<Validation[]>;
  getValidation(id: number): Promise<Validation | undefined>;
  createValidation(validation: InsertValidation): Promise<Validation>;
  updateValidation(id: number, validation: Partial<Validation>): Promise<Validation | undefined>;
  deleteValidation(id: number): Promise<boolean>;

  // Test case operations
  getTestCases(validationId: number): Promise<TestCase[]>;
  getTestCase(id: number): Promise<TestCase | undefined>;
  createTestCase(testCase: InsertTestCase): Promise<TestCase>;
  deleteTestCase(id: number): Promise<boolean>;
  createTestCases(testCases: InsertTestCase[]): Promise<TestCase[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private projects: Map<number, Project>;
  private documents: Map<number, Document>;
  private figmaDesigns: Map<number, FigmaDesign>;
  private validations: Map<number, Validation>;
  private testCases: Map<number, TestCase>;
  
  private userId: number;
  private projectId: number;
  private documentId: number;
  private figmaDesignId: number;
  private validationId: number;
  private testCaseId: number;

  constructor() {
    this.users = new Map();
    this.projects = new Map();
    this.documents = new Map();
    this.figmaDesigns = new Map();
    this.validations = new Map();
    this.testCases = new Map();
    
    this.userId = 1;
    this.projectId = 1;
    this.documentId = 1;
    this.figmaDesignId = 1;
    this.validationId = 1;
    this.testCaseId = 1;

    // Create default user
    this.createUser({
      username: "johndoe",
      password: "password123",
      email: "john@example.com",
      displayName: "John Doe"
    });

    // Create sample projects
    this.createProject({
      name: "E-commerce Dashboard",
      description: "An e-commerce dashboard project with user management and product features",
      userId: 1
    });

    this.createProject({
      name: "Mobile Banking App",
      description: "A mobile banking application with account management and transactions",
      userId: 1
    });

    this.createProject({
      name: "HR Management System",
      description: "Human Resources management system with employee records and time tracking",
      userId: 1
    });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const now = new Date();
    const user: User = { 
      ...insertUser, 
      id,
      createdAt: now
    };
    this.users.set(id, user);
    return user;
  }

  // Project operations
  async getProjects(userId: number): Promise<Project[]> {
    return Array.from(this.projects.values()).filter(
      (project) => project.userId === userId
    );
  }

  async getProject(id: number): Promise<Project | undefined> {
    return this.projects.get(id);
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const id = this.projectId++;
    const now = new Date();
    const project: Project = {
      ...insertProject,
      id,
      createdAt: now,
      updatedAt: now
    };
    this.projects.set(id, project);
    return project;
  }

  async updateProject(id: number, projectUpdate: Partial<InsertProject>): Promise<Project | undefined> {
    const project = this.projects.get(id);
    if (!project) return undefined;
    
    const updatedProject: Project = {
      ...project,
      ...projectUpdate,
      updatedAt: new Date()
    };
    this.projects.set(id, updatedProject);
    return updatedProject;
  }

  async deleteProject(id: number): Promise<boolean> {
    return this.projects.delete(id);
  }

  // Document operations
  async getDocuments(projectId: number): Promise<Document[]> {
    return Array.from(this.documents.values()).filter(
      (document) => document.projectId === projectId
    );
  }

  async getDocument(id: number): Promise<Document | undefined> {
    return this.documents.get(id);
  }

  async createDocument(insertDocument: InsertDocument): Promise<Document> {
    const id = this.documentId++;
    const now = new Date();
    const document: Document = {
      ...insertDocument,
      id,
      content: null,
      extractedRequirements: null,
      createdAt: now
    };
    this.documents.set(id, document);
    return document;
  }

  async updateDocument(id: number, content: string, extractedRequirements: any): Promise<Document | undefined> {
    const document = this.documents.get(id);
    if (!document) return undefined;
    
    const updatedDocument: Document = {
      ...document,
      content,
      extractedRequirements
    };
    this.documents.set(id, updatedDocument);
    return updatedDocument;
  }

  async deleteDocument(id: number): Promise<boolean> {
    return this.documents.delete(id);
  }

  // Figma design operations
  async getFigmaDesigns(projectId: number): Promise<FigmaDesign[]> {
    return Array.from(this.figmaDesigns.values()).filter(
      (figmaDesign) => figmaDesign.projectId === projectId
    );
  }

  async getFigmaDesign(id: number): Promise<FigmaDesign | undefined> {
    return this.figmaDesigns.get(id);
  }

  async createFigmaDesign(insertFigmaDesign: InsertFigmaDesign): Promise<FigmaDesign> {
    const id = this.figmaDesignId++;
    const now = new Date();
    const figmaDesign: FigmaDesign = {
      ...insertFigmaDesign,
      id,
      figmaFileKey: extractFigmaKeyFromUrl(insertFigmaDesign.figmaFileUrl),
      accessToken: null,
      thumbnailUrl: null,
      lastAccessed: now,
      createdAt: now
    };
    this.figmaDesigns.set(id, figmaDesign);
    return figmaDesign;
  }

  async updateFigmaDesign(id: number, figmaDesignUpdate: Partial<FigmaDesign>): Promise<FigmaDesign | undefined> {
    const figmaDesign = this.figmaDesigns.get(id);
    if (!figmaDesign) return undefined;
    
    const updatedFigmaDesign: FigmaDesign = {
      ...figmaDesign,
      ...figmaDesignUpdate,
      lastAccessed: new Date()
    };
    this.figmaDesigns.set(id, updatedFigmaDesign);
    return updatedFigmaDesign;
  }

  async deleteFigmaDesign(id: number): Promise<boolean> {
    return this.figmaDesigns.delete(id);
  }

  // Validation operations
  async getValidations(projectId: number): Promise<Validation[]> {
    return Array.from(this.validations.values()).filter(
      (validation) => validation.projectId === projectId
    );
  }

  async getValidation(id: number): Promise<Validation | undefined> {
    return this.validations.get(id);
  }

  async createValidation(insertValidation: InsertValidation): Promise<Validation> {
    const id = this.validationId++;
    const now = new Date();
    const validation: Validation = {
      ...insertValidation,
      id,
      startedAt: now,
      completedAt: null,
      complianceScore: null,
      compliantElements: null,
      inconsistencies: null,
      results: null
    };
    this.validations.set(id, validation);
    return validation;
  }

  async updateValidation(id: number, validationUpdate: Partial<Validation>): Promise<Validation | undefined> {
    const validation = this.validations.get(id);
    if (!validation) return undefined;
    
    const updatedValidation: Validation = {
      ...validation,
      ...validationUpdate
    };
    this.validations.set(id, updatedValidation);
    return updatedValidation;
  }

  async deleteValidation(id: number): Promise<boolean> {
    return this.validations.delete(id);
  }

  // Test case operations
  async getTestCases(validationId: number): Promise<TestCase[]> {
    return Array.from(this.testCases.values()).filter(
      (testCase) => testCase.validationId === validationId
    );
  }

  async getTestCase(id: number): Promise<TestCase | undefined> {
    return this.testCases.get(id);
  }

  async createTestCase(insertTestCase: InsertTestCase): Promise<TestCase> {
    const id = this.testCaseId++;
    const now = new Date();
    const testCase: TestCase = {
      ...insertTestCase,
      id,
      createdAt: now
    };
    this.testCases.set(id, testCase);
    return testCase;
  }

  async createTestCases(insertTestCases: InsertTestCase[]): Promise<TestCase[]> {
    return Promise.all(insertTestCases.map(testCase => this.createTestCase(testCase)));
  }

  async deleteTestCase(id: number): Promise<boolean> {
    return this.testCases.delete(id);
  }
}

// Helper function to extract Figma file key from URL
function extractFigmaKeyFromUrl(url: string): string | null {
  // Try the standard file URL format
  const fileRegex = /figma\.com\/file\/([a-zA-Z0-9]+)/i;
  const fileMatch = url.match(fileRegex);
  if (fileMatch && fileMatch[1]) {
    return fileMatch[1];
  }
  
  // Try the design URL format
  const designRegex = /figma\.com\/design\/([a-zA-Z0-9]+)/i;
  const designMatch = url.match(designRegex);
  if (designMatch && designMatch[1]) {
    return designMatch[1];
  }
  
  return null;
}

export const storage = new MemStorage();
