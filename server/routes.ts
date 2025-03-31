import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import multer from 'multer';
import { z } from "zod";
import { insertDocumentSchema, insertFigmaDesignSchema, insertProjectSchema, insertValidationSchema } from "@shared/schema";

// Set up multer for file uploads
const memStorage = multer.memoryStorage();
const upload = multer({ 
  storage: memStorage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  // ============== PROJECT ROUTES ==============
  
  // Get all projects for a user
  app.get('/api/projects', async (req, res) => {
    try {
      // For demo purposes, we'll use user ID 1
      const userId = 1;
      const projects = await storage.getProjects(userId);
      res.json(projects);
    } catch (error) {
      res.status(500).json({ message: `Failed to fetch projects: ${error.message}` });
    }
  });

  // Get a specific project
  app.get('/api/projects/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const project = await storage.getProject(id);
      
      if (!project) {
        return res.status(404).json({ message: 'Project not found' });
      }
      
      res.json(project);
    } catch (error) {
      res.status(500).json({ message: `Failed to fetch project: ${error.message}` });
    }
  });

  // Create a new project
  app.post('/api/projects', async (req, res) => {
    try {
      // Validate request body
      const projectData = insertProjectSchema.parse(req.body);
      
      // For demo purposes, we'll use user ID 1
      projectData.userId = 1;
      
      const project = await storage.createProject(projectData);
      res.status(201).json(project);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: 'Invalid project data', 
          errors: error.errors 
        });
      }
      res.status(500).json({ message: `Failed to create project: ${error.message}` });
    }
  });

  // ============== DOCUMENT ROUTES ==============
  
  // Get all documents for a project
  app.get('/api/projects/:projectId/documents', async (req, res) => {
    try {
      const projectId = parseInt(req.params.projectId);
      const documents = await storage.getDocuments(projectId);
      res.json(documents);
    } catch (error) {
      res.status(500).json({ message: `Failed to fetch documents: ${error.message}` });
    }
  });

  // Upload a document
  app.post('/api/projects/:projectId/documents', upload.single('file'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }

      const projectId = parseInt(req.params.projectId);
      const project = await storage.getProject(projectId);
      
      if (!project) {
        return res.status(404).json({ message: 'Project not found' });
      }

      // Prepare document metadata
      const documentData = {
        projectId,
        name: req.body.name || req.file.originalname,
        originalFilename: req.file.originalname,
        fileSize: req.file.size,
        fileType: req.file.mimetype
      };

      // Validate document data
      const validatedData = insertDocumentSchema.parse(documentData);
      
      // Create document record
      const document = await storage.createDocument(validatedData);
      
      // In a real implementation, we would parse the file content here
      // and update the document with extracted content and requirements
      const mockContent = "Sample document content";
      const mockRequirements = { requirements: [] };
      
      await storage.updateDocument(document.id, mockContent, mockRequirements);
      
      res.status(201).json(document);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: 'Invalid document data', 
          errors: error.errors 
        });
      }
      res.status(500).json({ message: `Failed to upload document: ${error.message}` });
    }
  });

  // ============== FIGMA DESIGN ROUTES ==============
  
  // Get all Figma designs for a project
  app.get('/api/projects/:projectId/figma-designs', async (req, res) => {
    try {
      const projectId = parseInt(req.params.projectId);
      const figmaDesigns = await storage.getFigmaDesigns(projectId);
      res.json(figmaDesigns);
    } catch (error) {
      res.status(500).json({ message: `Failed to fetch Figma designs: ${error.message}` });
    }
  });

  // Add a Figma design
  app.post('/api/projects/:projectId/figma-designs', async (req, res) => {
    try {
      const projectId = parseInt(req.params.projectId);
      const project = await storage.getProject(projectId);
      
      if (!project) {
        return res.status(404).json({ message: 'Project not found' });
      }

      const figmaData = {
        ...req.body,
        projectId
      };

      // Validate Figma design data
      const validatedData = insertFigmaDesignSchema.parse(figmaData);
      
      // Create Figma design record
      const figmaDesign = await storage.createFigmaDesign(validatedData);
      
      res.status(201).json(figmaDesign);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: 'Invalid Figma design data', 
          errors: error.errors 
        });
      }
      res.status(500).json({ message: `Failed to add Figma design: ${error.message}` });
    }
  });

  // ============== VALIDATION ROUTES ==============
  
  // Get all validations for a project
  app.get('/api/projects/:projectId/validations', async (req, res) => {
    try {
      const projectId = parseInt(req.params.projectId);
      const validations = await storage.getValidations(projectId);
      res.json(validations);
    } catch (error) {
      res.status(500).json({ message: `Failed to fetch validations: ${error.message}` });
    }
  });

  // Start a new validation
  app.post('/api/projects/:projectId/validations', async (req, res) => {
    try {
      const projectId = parseInt(req.params.projectId);
      const project = await storage.getProject(projectId);
      
      if (!project) {
        return res.status(404).json({ message: 'Project not found' });
      }

      const validationData = {
        projectId,
        status: 'in-progress'
      };

      // Validate validation data
      const validatedData = insertValidationSchema.parse(validationData);
      
      // Create validation record
      const validation = await storage.createValidation(validatedData);
      
      res.status(201).json(validation);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: 'Invalid validation data', 
          errors: error.errors 
        });
      }
      res.status(500).json({ message: `Failed to start validation: ${error.message}` });
    }
  });

  // Update a validation
  app.patch('/api/validations/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validation = await storage.getValidation(id);
      
      if (!validation) {
        return res.status(404).json({ message: 'Validation not found' });
      }
      
      const updatedValidation = await storage.updateValidation(id, req.body);
      res.json(updatedValidation);
    } catch (error) {
      res.status(500).json({ message: `Failed to update validation: ${error.message}` });
    }
  });

  // ============== TEST CASE ROUTES ==============
  
  // Get all test cases for a validation
  app.get('/api/validations/:validationId/test-cases', async (req, res) => {
    try {
      const validationId = parseInt(req.params.validationId);
      const testCases = await storage.getTestCases(validationId);
      res.json(testCases);
    } catch (error) {
      res.status(500).json({ message: `Failed to fetch test cases: ${error.message}` });
    }
  });

  // Generate test cases
  app.post('/api/validations/:validationId/test-cases/generate', async (req, res) => {
    try {
      const validationId = parseInt(req.params.validationId);
      const validation = await storage.getValidation(validationId);
      
      if (!validation) {
        return res.status(404).json({ message: 'Validation not found' });
      }
      
      // In a real implementation, we would generate test cases from the validation results
      // For now, we'll create sample test cases
      const sampleTestCases = [
        {
          validationId,
          testCaseId: 'TC-001',
          name: 'Verify Email Validation',
          description: 'Verify that email validation displays error message as specified in SRS',
          type: 'Functional',
          severity: 'High',
          status: 'New',
          requirement: 'REQ-001',
          designElement: 'Login Form'
        },
        {
          validationId,
          testCaseId: 'TC-002',
          name: 'Filter Categories',
          description: 'Verify that all 5 product filter categories are implemented as per SRS',
          type: 'UI',
          severity: 'Medium',
          status: 'New',
          requirement: 'REQ-002',
          designElement: 'Product Listing'
        },
        {
          validationId,
          testCaseId: 'TC-003',
          name: 'Checkout Process Flow',
          description: 'Validate that the checkout process includes all 4 steps specified in SRS',
          type: 'Functional',
          severity: 'High',
          status: 'New',
          requirement: 'REQ-003',
          designElement: 'Checkout Flow'
        },
        {
          validationId,
          testCaseId: 'TC-004',
          name: 'Payment Method Options',
          description: 'Verify all payment methods in SRS are present in the design',
          type: 'UI',
          severity: 'Medium',
          status: 'New',
          requirement: 'REQ-004',
          designElement: 'Payment Form'
        }
      ];
      
      const createdTestCases = await storage.createTestCases(sampleTestCases);
      
      // Update validation status
      await storage.updateValidation(validationId, {
        status: 'complete',
        completedAt: new Date(),
        complianceScore: 87,
        compliantElements: 23,
        inconsistencies: 4,
        results: {
          inconsistencies: [
            {
              name: 'Login Form Field Validation',
              status: 'Missing',
              description: 'SRS specifies email validation messaging that is not present in the design'
            },
            {
              name: 'Product Filter Options',
              status: 'Partial',
              description: 'SRS specifies 5 filter categories, design only shows 3'
            },
            {
              name: 'Checkout Process Steps',
              status: 'Mismatch',
              description: 'SRS specifies 4-step checkout, design shows 3-step process'
            }
          ]
        }
      });
      
      res.json(createdTestCases);
    } catch (error) {
      res.status(500).json({ message: `Failed to generate test cases: ${error.message}` });
    }
  });

  // Export test cases (returns download URL instead of actual file for demo)
  app.post('/api/validations/:validationId/test-cases/export', async (req, res) => {
    try {
      const validationId = parseInt(req.params.validationId);
      const validation = await storage.getValidation(validationId);
      
      if (!validation) {
        return res.status(404).json({ message: 'Validation not found' });
      }
      
      const format = req.body.format || 'xlsx';
      
      // In a real implementation, we would generate the export file
      // For now, we'll return a mock download URL
      res.json({ 
        downloadUrl: `/api/downloads/test-cases-${validationId}.${format}`,
        format,
        fileName: `test-cases-${validationId}.${format}`
      });
    } catch (error) {
      res.status(500).json({ message: `Failed to export test cases: ${error.message}` });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
