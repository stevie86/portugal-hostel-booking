# KiloCode Configuration for Portugal Hostel Booking Project

## 1. Memory Bank Setup and Structure

The Memory Bank is a critical component of KiloCode's configuration for the Portugal Hostel Booking project, serving as the persistent knowledge base that maintains project context across sessions. Located in `.kilocode/rules/memory-bank/`, it consists of structured Markdown files that document all aspects of the project.

### Core Files

1. **brief.md**: Foundation document defining project scope, objectives, key features, and technologies. Created manually and serves as the source of truth for project requirements.

2. **product.md**: Explains why the project exists, problems it solves, user experience goals, and how the platform should work from a user perspective.

3. **context.md**: Tracks current work focus, recent changes, and next steps. Maintained factually without speculation.

4. **architecture.md**: Documents system architecture, source code paths, key technical decisions, design patterns, and critical implementation paths.

5. **tech.md**: Details technologies used, development setup, dependencies, and tool usage patterns.

### Additional Files

- **branding.md**: Comprehensive branding guide including colors, typography, layout guidelines, and copy rules specific to the Lisbon Hostel Booking brand.

- **tasks.md**: (Optional) Documentation of repetitive tasks and their workflows for future reference.

### Initialization Process

Memory Bank initialization is triggered by the command `initialize memory bank`. This involves:

1. Exhaustive analysis of all source code files and relationships
2. Review of configuration files and build system setup
3. Documentation of project structure and organization patterns
4. Analysis of dependencies and external integrations
5. Creation of all core memory bank files with comprehensive project understanding

After initialization, the user is prompted to verify the accuracy of the generated documentation.

### Update Workflows

Updates occur when:

- Discovering new project patterns
- After implementing significant changes
- User explicitly requests with "update memory bank"
- Context needs clarification

The update process requires reviewing ALL memory bank files, with special focus on context.md for current state tracking.

## 2. Available Modes and Their Usage

KiloCode supports multiple specialized modes, each optimized for different aspects of software development:

- **Architect**: For planning, designing, and strategizing complex systems
- **Code**: For writing, modifying, and refactoring code
- **Ask**: For explanations, documentation, and technical questions
- **Debug**: For troubleshooting issues and systematic debugging
- **Orchestrator**: For complex, multi-step projects requiring coordination
- **Code Reviewer**: For thorough code reviews and quality assessment
- **Code Simplifier**: For refactoring code to be clearer and more maintainable
- **Documentation Specialist**: For creating clear, comprehensive documentation (current mode)
- **Frontend Specialist**: For React, TypeScript, and modern CSS development
- **Test Engineer**: For writing tests and improving code coverage
- **Code Skeptic**: For critical code quality inspection

### Usage in This Project

- **Documentation Specialist**: Used for creating comprehensive project documentation like this configuration guide
- **Frontend Specialist**: Applied for UI component development, Tailwind CSS styling, and responsive design implementation
- **Code**: Utilized for implementing core features, API routes, and database integration
- **Orchestrator**: Employed for breaking down complex tasks like the fast-track prototype creation
- **Debug**: Used for troubleshooting PostCSS configuration issues and deployment problems

## 3. Custom Rules and Instructions

The project incorporates several custom rules and instructions tailored to the Portugal Hostel Booking platform:

### Branding Integration

- Strict adherence to the Lisbon Hostel Booking brand DNA: warm tiles & ocean teal, friendly & human, social/community-driven
- Color palette enforcement: brand.600 (#0088e6) for primary CTAs, accent.500 (#ff8212) for highlights
- Typography standards: Inter font family, specific weight scales for headings and body text
- Copy guidelines: Direct, friendly, transparent language avoiding corporate buzzwords

### Architecture Rules

- Next.js App Router migration from Pages Router
- Component composition patterns with reusable React components
- Server-side rendering leveraging Next.js capabilities
- Container/Presentational pattern for separating business logic from presentation

### Language and Mode-Specific Instructions

- English language preference for all communications and documentation
- Mode-specific restrictions (e.g., Architect mode cannot edit .js files)
- Focus on clarity, proper formatting, and comprehensive examples in documentation

## 4. Task Delegation Workflow

Complex tasks are managed through the Orchestrator mode, which breaks down large projects into manageable subtasks:

### Task Breakdown Process

1. **Analysis**: Orchestrator analyzes the complex task and identifies key components
2. **Delegation**: Assigns subtasks to appropriate specialist modes (e.g., Frontend Specialist for UI, Code for backend)
3. **Coordination**: Manages dependencies between subtasks and ensures sequential execution
4. **Integration**: Oversees the combination of completed subtasks into the final deliverable

### Example Workflow

For the fast-track prototype creation:
- Orchestrator broke down into: Tailwind setup, component creation, mock data integration, testing
- Delegated UI components to Frontend Specialist
- Assigned database schema to Code mode
- Coordinated testing across all components

## 5. Project-Specific Configurations

### Branding Guide Integration

The branding guide is deeply integrated into the development process:

- **Color System**: Implemented as Tailwind CSS custom colors (brand.*, accent.*, tile.*, teal.*)
- **Typography**: Configured in global styles with Inter font and specified weight scales
- **Component Guidelines**: Applied to Button, Card, and Navigation components
- **Imagery Rules**: Guides selection of Lisbon-specific hostel photos and icons

### Branch Management

Strict branch management ensures code quality:

- **Main Branch**: Production-ready code with full test coverage and security scans
- **Dev Branch**: Integration branch for tested improvements
- **Feature Branches**: Short-lived branches for individual features, regularly synced with dev
- **Workflow**: Feature → dev (with PR reviews) → main (after validation)

## 6. Examples of System Usage

### Memory Bank Initialization

During project setup, KiloCode performed exhaustive analysis of:
- All source code files and their relationships
- Configuration files (package.json, tailwind.config.js, prisma.schema.prisma)
- Project structure and component organization
- Dependencies and testing frameworks

Result: Created comprehensive memory bank files documenting the Portugal Hostel Booking platform as a niche booking alternative for hostels across Portugal.

### Branding Application

In component development:
- Applied brand.600 color to primary buttons
- Implemented tile.500 for background accents
- Used Inter typography with proper weight scales
- Ensured mobile-first responsive design with specified spacing scale

### Fast-Track Prototype Creation

Orchestrator mode broke down the prototype into:
1. Tailwind CSS setup with custom brand colors
2. Creation of reusable components (Header, Footer, PropertyCard, SearchBar)
3. Mock data integration for 5 Lisbon hostels
4. Functional pages (Home, Property List, Property Details, Booking Form)
5. Comprehensive test suite (31 tests passing)

This resulted in a clickable mock prototype with core booking platform features.

---

This configuration ensures consistent, high-quality development aligned with the project's goals of providing a fair, curated alternative to large OTAs for Portugal's hostel market.