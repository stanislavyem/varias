# Risk App - Insurance Risk Assessment Platform

## Overview

Risk App is a full-stack web application for insurance risk assessment and action management. It enables carriers, agents, and insured organizations to evaluate safety, workers' compensation, and fleet risks through a structured 20-question assessment with precision scoring based on an Excel-defined scoring engine.

The platform calculates normalized scores, weighted points, and overall risk ratings across three pillars (Safety 40%, Workers Comp 20%, Fleet 40%), with rating bands from "High Risk" to "Strong / Low Risk". It also includes a subcontractor sub-score assessment with guardrail triggering logic.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript, using Vite as the build tool
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack React Query for server state and caching
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS custom properties for theming (light/dark mode support)
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **API Pattern**: RESTful API endpoints under `/api/*` prefix
- **Authentication**: Replit Auth integration with OpenID Connect, session-based with PostgreSQL session storage
- **File Uploads**: Multer for document handling

### Database Layer
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema Location**: `shared/schema.ts` contains all table definitions
- **Migrations**: Drizzle Kit for schema management (`drizzle-kit push`)
- **Connection**: Node-postgres (pg) pool with `DATABASE_URL` environment variable

### Key Data Models
- **Users/Sessions**: Managed by Replit Auth integration
- **Organizations**: Insured accounts with industry and NAICS codes
- **Assessments**: Risk assessments with DRAFT/SUBMITTED/CLOSED status
- **Questions**: 20 predefined questions across Safety, WorkersComp, Fleet pillars
- **Responses**: User answers (1-5 scale) with calculated normScore and weightedPts
- **ScoreSnapshots**: Cached calculation results for overall and pillar scores
- **ActionItems**: Task management with priority ranking and status tracking
- **Documents**: File attachments with category classification
- **SubcontractorResponses**: Separate mini-assessment with guardrail logic

### Scoring Engine (Do Not Modify)
The scoring logic must match the Excel workbook exactly:
- NormScore = (response - 1) / 4
- WeightedPts = NormScore × Weight
- OverallScore = 100 × SUM(WeightedPts)
- Pillar scores use weight shares: Safety (0.4), WorkersComp (0.2), Fleet (0.4)
- Rating bands: 0-54.999 High Risk, 55-69.999 Elevated Risk, 70-84.999 Moderate Risk, 85-100 Strong/Low Risk

### Build System
- **Development**: TSX for running TypeScript directly
- **Production Build**: esbuild for server bundling, Vite for client bundling
- **Output**: Server bundle to `dist/index.cjs`, client to `dist/public`

## External Dependencies

### Database
- **PostgreSQL**: Primary database, connected via `DATABASE_URL` environment variable
- **connect-pg-simple**: Session storage in PostgreSQL

### Authentication
- **Replit Auth**: OpenID Connect integration for user authentication
- **passport**: Authentication middleware with openid-client strategy
- **express-session**: Session management

### File Storage
- **Multer**: Multipart form handling for file uploads
- Documents stored with category classification (SAFETY_PROGRAM, TRAINING, COI, OSHA_LOG, INCIDENT_REPORT, OTHER)

### UI Framework Dependencies
- **Radix UI**: Full suite of accessible primitives (dialog, dropdown, tabs, etc.)
- **Tailwind CSS**: Utility-first styling with custom design tokens
- **Lucide React**: Icon library

### Data Processing
- **xlsx**: Excel file parsing (for question data import from workbook)
- **Zod**: Runtime schema validation for API requests
- **drizzle-zod**: Zod schema generation from Drizzle tables