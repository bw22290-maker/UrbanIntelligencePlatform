# Urban Intelligence Platform

## Overview

This is a comprehensive urban planning and city management platform built with modern web technologies. The application provides intelligent tools for land-use optimization, traffic simulation, environmental impact assessment, and project management to help city planners make data-driven decisions.

## User Preferences

Preferred communication style: Simple, everyday language.
User Profile: BRIAN MUTUNGA - Senior Urban Planner
Personalization: Professional interface with real-time functionality and advanced features.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui component library
- **State Management**: TanStack Query for server state management
- **Routing**: Wouter for client-side routing
- **Form Management**: React Hook Form with Zod validation
- **Build Tool**: Vite for fast development and optimized builds

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ESM modules
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Replit Auth with OpenID Connect
- **Session Management**: Express sessions with PostgreSQL storage

### Database Design
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema**: Shared between client and server in `/shared/schema.ts`
- **Migrations**: Managed through Drizzle Kit
- **Connection**: Neon serverless PostgreSQL with connection pooling

## Key Components

### Authentication System
- **Provider**: Replit Auth with OpenID Connect
- **Session Storage**: PostgreSQL-backed sessions with automatic cleanup
- **User Management**: User profiles with role-based access (admin, planner, viewer)
- **Security**: Secure cookies with HTTPS enforcement

### Core Domain Models
- **Users**: Profile management with roles and permissions
- **Projects**: Multi-type projects (land use, traffic, environmental, mixed)
- **Land Use Zones**: Zoning data with geographic information
- **Traffic Nodes**: Traffic flow simulation points
- **Environmental Metrics**: Sustainability measurements and scoring
- **Activity Logs**: Audit trail for all user actions

### UI Components
- **Design System**: shadcn/ui components with consistent styling
- **Layout**: Responsive sidebar navigation with main content area
- **Interactive Elements**: Maps, charts, forms, and data tables
- **Accessibility**: ARIA-compliant components with keyboard navigation

## Data Flow

### Authentication Flow
1. User accesses protected route
2. Middleware checks session validity
3. If unauthenticated, redirects to Replit Auth
4. After successful auth, creates/updates user profile
5. Establishes session with role-based permissions

### Project Management Flow
1. User creates new project with type selection
2. Project data stored with user association
3. Type-specific modules activated (land use, traffic, environmental)
4. Real-time updates through TanStack Query
5. Activity logging for audit trail

### Data Persistence
- **Client**: TanStack Query for caching and synchronization
- **Server**: Drizzle ORM with prepared statements
- **Database**: PostgreSQL with JSONB for flexible data storage
- **Real-time**: Query invalidation for live updates

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL database connectivity
- **drizzle-orm**: Type-safe database operations
- **@tanstack/react-query**: Server state management
- **@radix-ui/***: Accessible UI primitives
- **react-hook-form**: Form validation and management
- **zod**: Schema validation

### Development Tools
- **Vite**: Build tool with HMR
- **TypeScript**: Type safety across the stack
- **Tailwind CSS**: Utility-first styling
- **ESBuild**: Fast server-side bundling

### Replit Integration
- **@replit/vite-plugin-runtime-error-modal**: Development error handling
- **@replit/vite-plugin-cartographer**: Development tooling
- **Replit Auth**: Authentication provider

## Deployment Strategy

### Development Environment
- **Hot Reload**: Vite dev server with instant updates
- **Database**: Neon serverless PostgreSQL
- **Environment**: Replit development environment
- **Error Handling**: Runtime error overlay for debugging

### Production Build
- **Client**: Vite build with optimized bundles
- **Server**: ESBuild bundling for Node.js deployment
- **Assets**: Static file serving through Express
- **Database**: Production PostgreSQL with connection pooling

### Configuration Management
- **Environment Variables**: Database URL, session secrets, OAuth config
- **Build Scripts**: Separate dev/build/start commands
- **Database Migrations**: Automated schema updates through Drizzle

The application follows a modern full-stack architecture with strong typing, comprehensive error handling, and scalable database design. The separation of concerns between client, server, and shared code enables maintainable development while providing rich interactive features for urban planning professionals.

## Recent Updates (July 15, 2025)

### Enhanced Map Functionality
- Implemented interactive SVG-based city map with clickable districts
- Added real-time traffic route visualization with animated paths
- Created layer-based filtering system for projects, traffic, environmental, and land use data
- Added fullscreen mode capability for detailed analysis

### Improved Activity Performance
- Enhanced activity feed with real-time updates (30-second refresh interval)
- Added priority-based activity categorization (high, medium, low)
- Implemented live activity creation with sample data generation
- Added activity scrollable container with improved UI/UX

### Professional Personalization
- Customized for Brian Mutunga as Senior Urban Planner
- Added professional profile section with progress tracking
- Implemented online status indicators and monthly progress metrics
- Enhanced navigation with better accessibility and user experience

### Technical Improvements
- Fixed PostgreSQL geometry type compatibility issues
- Replaced spatial data with coordinate-based fields (latitude/longitude)
- Resolved CSS compilation errors and HTML nesting issues
- Added comprehensive API endpoints for land use zones and traffic nodes
- Implemented proper error handling and loading states throughout the application

The platform now provides a fully functional, professional-grade urban planning interface with real-time data visualization and interactive mapping capabilities.