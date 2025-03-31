import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import multer from 'multer';
import { z } from "zod";
import fetch from 'node-fetch';
import { insertDocumentSchema, insertFigmaDesignSchema, insertProjectSchema, insertValidationSchema } from "@shared/schema";

// Helper functions for test case generation
function getTestCaseName(index: number, testType: string): string {
  const uiTestNames = [
    'Verify Login Form Layout',
    'Check Navigation Menu Consistency',
    'Validate Product Card Design',
    'Confirm Modal Dialogs Appearance',
    'Verify Form Field Styling',
    'Review Dashboard Layout',
    'Validate Icon Consistency',
    'Check Button Styling Standards',
    'Verify Typography Hierarchy',
    'Review Color Scheme Implementation'
  ];

  const functionalTestNames = [
    'Test Login Form Validation',
    'Verify Search Functionality',
    'Check Filter Operations',
    'Validate Checkout Process',
    'Test Form Submission Logic',
    'Verify Password Reset Flow',
    'Test User Registration Process',
    'Validate Payment Processing',
    'Check Error Handling Logic',
    'Verify Data Saving Functionality'
  ];

  const accessibilityTestNames = [
    'Verify Color Contrast Compliance',
    'Check Screen Reader Compatibility',
    'Test Keyboard Navigation',
    'Validate ARIA Attributes',
    'Review Focus States',
    'Check Alt Text Implementation',
    'Test Form Labeling',
    'Verify Heading Structure',
    'Check Text Resizing Support',
    'Validate Accessible Error Messages'
  ];

  const uxTestNames = [
    'Verify User Flow Efficiency',
    'Check Interaction Feedback',
    'Test Load Time Perception',
    'Validate Form Completion Experience',
    'Review Error Recovery Process',
    'Check Onboarding Experience',
    'Test Multi-device Consistency',
    'Verify Information Architecture',
    'Check Help Documentation Access',
    'Validate Confirmation Messaging'
  ];

  const visualTestNames = [
    'Verify Brand Consistency',
    'Check Visual Hierarchy',
    'Test Image Quality Standards',
    'Validate Animation Smoothness',
    'Review Visual Balance',
    'Check Design System Compliance',
    'Test Responsive Layout Visuals',
    'Verify Empty State Designs',
    'Check Loading State Visuals',
    'Validate Dark/Light Mode Appearance'
  ];

  // Select appropriate list based on test type
  let nameList;
  switch (testType.toLowerCase()) {
    case 'ui': nameList = uiTestNames; break;
    case 'functional': nameList = functionalTestNames; break;
    case 'accessibility': nameList = accessibilityTestNames; break;
    case 'ux': nameList = uxTestNames; break;
    case 'visual': nameList = visualTestNames; break;
    default: nameList = uiTestNames;
  }

  return nameList[index % nameList.length];
}

function getTestCaseDescription(index: number, testType: string): string {
  const uiDescriptions = [
    'Verify that the login form layout matches the SRS specifications for field arrangement and spacing',
    'Check that navigation menu items are consistently styled and arranged according to the design system',
    'Validate that product cards follow the design specifications for size, spacing, and information display',
    'Confirm that modal dialogs appear as specified in the design with correct overlay, positioning, and close functions',
    'Verify that form fields maintain consistent styling for inputs, labels, and validation states',
    'Review dashboard layout for compliance with grid spacing and widget arrangement specifications',
    'Validate that icons throughout the application maintain consistent size, style, and placement',
    'Check that button styling follows the design system standards for primary, secondary, and tertiary actions',
    'Verify that typography hierarchy is maintained with correct heading and body text styles',
    'Review implementation of color scheme to ensure consistent use of primary, secondary, and accent colors'
  ];

  const functionalDescriptions = [
    'Test that login form validates email format and password requirements as specified in SRS',
    'Verify that search functionality returns relevant results and handles special characters properly',
    'Check that filter operations correctly narrow down results based on selected criteria',
    'Validate that the checkout process completes all required steps in the correct sequence',
    'Test that form submission logic validates all required fields before submission',
    'Verify that password reset flow sends email and allows secure password creation',
    'Test the user registration process for all required fields and validation rules',
    'Validate that payment processing handles various payment methods and error states',
    'Check that error handling logic displays appropriate messages for different error conditions',
    'Verify that data saving functionality correctly persists information to the database'
  ];

  const accessibilityDescriptions = [
    'Verify that color contrast meets WCAG AA standards for text and interactive elements',
    'Check that all interface elements are properly announced by screen readers',
    'Test complete keyboard navigation through all interactive elements in logical order',
    'Validate proper implementation of ARIA attributes for dynamic content and states',
    'Review focus states for clear visibility and traversal order',
    'Check that all images have appropriate alternative text descriptions',
    'Test that all form fields have associated labels accessible to assistive technology',
    'Verify correct heading structure and hierarchy for document outline',
    'Check that text resizing up to 200% maintains readability and layout',
    'Validate that error messages are accessible and understandable to all users'
  ];

  const uxDescriptions = [
    'Verify that user flows require minimal steps to complete common tasks',
    'Check that all interactive elements provide appropriate feedback on user actions',
    'Test perceived load times and implementation of loading states',
    'Validate that form completion experience is streamlined with appropriate guidance',
    'Review error recovery process to ensure users can easily understand and fix mistakes',
    'Check that onboarding experience effectively introduces key functionality',
    'Test consistency of experience across desktop, tablet, and mobile devices',
    'Verify logical organization of information architecture for intuitive navigation',
    'Check that help documentation is easily accessible from relevant contexts',
    'Validate that confirmation messages provide clear next steps and confirmation of actions'
  ];

  const visualDescriptions = [
    'Verify consistent application of brand colors, typography, and imagery',
    'Check visual hierarchy to ensure most important elements receive proper emphasis',
    'Test that all images meet quality standards for resolution and compression',
    'Validate that animations and transitions appear smooth and purposeful',
    'Review visual balance and alignment of elements across different layouts',
    'Check compliance with design system for components and patterns',
    'Test that visual elements respond appropriately to different viewport sizes',
    'Verify that empty states provide helpful guidance and maintain visual consistency',
    'Check that loading states appear polished and integrate with the overall design',
    'Validate appearance in both dark and light modes for proper contrast and readability'
  ];

  // Select appropriate list based on test type
  let descriptionList;
  switch (testType.toLowerCase()) {
    case 'ui': descriptionList = uiDescriptions; break;
    case 'functional': descriptionList = functionalDescriptions; break;
    case 'accessibility': descriptionList = accessibilityDescriptions; break;
    case 'ux': descriptionList = uxDescriptions; break;
    case 'visual': descriptionList = visualDescriptions; break;
    default: descriptionList = uiDescriptions;
  }

  return descriptionList[index % descriptionList.length];
}

function getDesignElement(index: number, testType: string): string {
  const uiElements = [
    'Login Form', 'Navigation Menu', 'Product Card', 'Modal Dialog', 
    'Form Fields', 'Dashboard Layout', 'Icon System', 'Button Components',
    'Typography System', 'Color Palette'
  ];

  const functionalElements = [
    'Login Validation', 'Search Component', 'Filter Interface', 'Checkout Flow', 
    'Form Submission', 'Password Reset UI', 'Registration Form', 'Payment Interface',
    'Error Display Component', 'Data Entry Form'
  ];

  const accessibilityElements = [
    'Text Component', 'Interactive Elements', 'Keyboard Focus Indicators', 'ARIA-enhanced Components', 
    'Focus Management', 'Image Components', 'Form Labels', 'Heading Structure',
    'Responsive Text', 'Error Notification'
  ];

  const uxElements = [
    'User Flow Diagram', 'Interactive Feedback', 'Loading States', 'Form Design', 
    'Error Recovery Pattern', 'Onboarding Screens', 'Responsive Layouts', 'Navigation Structure',
    'Help Documentation', 'Confirmation Messages'
  ];

  const visualElements = [
    'Brand Identity', 'Visual Hierarchy', 'Image Guidelines', 'Animation Pattern', 
    'Layout Balance', 'Design System Components', 'Responsive Visuals', 'Empty State Design',
    'Loading Animation', 'Theme Modes'
  ];

  // Select appropriate list based on test type
  let elementList;
  switch (testType.toLowerCase()) {
    case 'ui': elementList = uiElements; break;
    case 'functional': elementList = functionalElements; break;
    case 'accessibility': elementList = accessibilityElements; break;
    case 'ux': elementList = uxElements; break;
    case 'visual': elementList = visualElements; break;
    default: elementList = uiElements;
  }

  return elementList[index % elementList.length];
}

// Set up multer for file uploads
const memStorage = multer.memoryStorage();
const upload = multer({ 
  storage: memStorage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  // ============== FIGMA API INTEGRATION ROUTES ==============
  
  // Check if Figma token is available
  app.get('/api/figma/check-token', async (req, res) => {
    try {
      const figmaToken = process.env.FIGMA_ACCESS_TOKEN;
      
      res.json({
        hasToken: !!figmaToken,
        tokenHint: figmaToken ? `${figmaToken.substring(0, 4)}...${figmaToken.substring(figmaToken.length - 4)}` : null
      });
    } catch (error) {
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Failed to check Figma token" 
      });
    }
  });
  
  // Connect to Figma API
  app.get('/api/figma/connect', async (req, res) => {
    try {
      // In a real OAuth implementation, this would involve a multi-step process
      // For this demo, we just check if the access token is available in env vars
      const figmaToken = process.env.FIGMA_ACCESS_TOKEN;
      
      if (!figmaToken) {
        return res.status(400).json({
          success: false,
          message: "No Figma access token found. Please add a FIGMA_ACCESS_TOKEN environment variable."
        });
      }
      
      // Test the token with a simple request to Figma API
      const response = await fetch('https://api.figma.com/v1/me', {
        headers: {
          'Authorization': `Bearer ${figmaToken}`
        }
      });
      
      if (!response.ok) {
        return res.status(401).json({
          success: false,
          message: "Invalid Figma access token. Please check your credentials."
        });
      }
      
      const userData = await response.json();
      
      res.json({
        success: true,
        message: "Successfully connected to Figma",
        tokenHint: `${figmaToken.substring(0, 4)}...${figmaToken.substring(figmaToken.length - 4)}`,
        user: {
          handle: userData.handle,
          img_url: userData.img_url
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : "Failed to connect to Figma API"
      });
    }
  });
  
  // Disconnect from Figma API (just a mock endpoint for the demo)
  app.get('/api/figma/disconnect', async (req, res) => {
    try {
      // In a real implementation with OAuth, this would revoke the token
      // For this demo, we just return success
      res.json({
        success: true,
        message: "Disconnected from Figma"
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : "Failed to disconnect from Figma API"
      });
    }
  });
  
  // Get a Figma file
  app.get('/api/figma/file/:fileKey', async (req, res) => {
    try {
      const figmaToken = process.env.FIGMA_ACCESS_TOKEN;
      const { fileKey } = req.params;
      
      if (!figmaToken) {
        return res.status(401).json({
          message: "No Figma access token found"
        });
      }
      
      // Call the Figma API to get the file data
      const response = await fetch(`https://api.figma.com/v1/files/${fileKey}`, {
        headers: {
          'Authorization': `Bearer ${figmaToken}`
        }
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        return res.status(response.status).json({
          message: `Figma API error: ${errorText || response.statusText}`
        });
      }
      
      const figmaData = await response.json();
      res.json(figmaData);
    } catch (error) {
      res.status(500).json({
        message: error instanceof Error ? error.message : "Failed to fetch Figma file"
      });
    }
  });
  
  // Get Figma image URLs for nodes
  app.get('/api/figma/images/:fileKey', async (req, res) => {
    try {
      const figmaToken = process.env.FIGMA_ACCESS_TOKEN;
      const { fileKey } = req.params;
      const { ids, format } = req.query;
      
      if (!figmaToken) {
        return res.status(401).json({
          message: "No Figma access token found"
        });
      }
      
      if (!ids) {
        return res.status(400).json({
          message: "Missing required parameter: ids"
        });
      }
      
      // Call the Figma API to get image URLs
      const response = await fetch(
        `https://api.figma.com/v1/images/${fileKey}?ids=${ids}&format=${format || 'png'}`, {
        headers: {
          'Authorization': `Bearer ${figmaToken}`
        }
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        return res.status(response.status).json({
          message: `Figma API error: ${errorText || response.statusText}`
        });
      }
      
      const imageData = await response.json();
      res.json(imageData);
    } catch (error) {
      res.status(500).json({
        message: error instanceof Error ? error.message : "Failed to fetch Figma images"
      });
    }
  });
  
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
      
      // First, check if there are existing test cases and delete them
      const existingTestCases = await storage.getTestCases(validationId);
      for (const testCase of existingTestCases) {
        await storage.deleteTestCase(testCase.id);
      }

      // Generate test cases based on the validation results
      let testCases = [];
      
      // If validation has results with inconsistencies, use them to generate test cases
      if (validation.results && validation.results.inconsistencies) {
        const inconsistencies = validation.results.inconsistencies;
        
        testCases = inconsistencies.map((inconsistency, index) => {
          const testCaseId = `TC-${validationId}-${index + 1}`;
          const status = Math.random() > 0.5 ? 'Failed' : 'Passed';
          const severity = inconsistency.status === 'Missing' ? 'High' : 
                          inconsistency.status === 'Partial' ? 'Medium' : 'Low';
          
          let testType = 'UI';
          if (inconsistency.name.toLowerCase().includes('validation') || 
              inconsistency.name.toLowerCase().includes('process')) {
            testType = 'Functional';
          } else if (inconsistency.name.toLowerCase().includes('accessibility')) {
            testType = 'Accessibility';
          }
          
          return {
            validationId,
            testCaseId,
            name: `Verify ${inconsistency.name}`,
            description: inconsistency.description,
            type: testType,
            severity,
            status,
            requirement: inconsistency.requirementId || `Requirement for ${inconsistency.name}`,
            designElement: inconsistency.designElementId || inconsistency.name
          };
        });
      }
      
      // If no inconsistencies or no test cases were generated, create sample ones
      if (testCases.length === 0) {
        // Create a mix of test statuses for better visualization
        const statuses = ['Failed', 'Passed', 'In Progress'];
        const testTypes = ['UI', 'Functional', 'UX', 'Accessibility', 'Visual'];
        const severities = ['High', 'Medium', 'Low'];
        
        // Generate 6-10 test cases for better visualization
        const numTestCases = 6 + Math.floor(Math.random() * 5);
        
        for (let i = 0; i < numTestCases; i++) {
          const statusIndex = Math.floor(Math.random() * statuses.length);
          const typeIndex = Math.floor(Math.random() * testTypes.length);
          const severityIndex = Math.floor(Math.random() * severities.length);
          
          testCases.push({
            validationId,
            testCaseId: `TC-${validationId}-${i + 1}`,
            name: getTestCaseName(i, testTypes[typeIndex]),
            description: getTestCaseDescription(i, testTypes[typeIndex]),
            type: testTypes[typeIndex],
            severity: severities[severityIndex],
            status: statuses[statusIndex],
            requirement: `REQ-${100 + i}`,
            designElement: getDesignElement(i, testTypes[typeIndex])
          });
        }
      }
      
      const createdTestCases = await storage.createTestCases(testCases);
      
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
