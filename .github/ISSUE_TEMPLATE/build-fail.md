---
name: Build Failure
about: Report a build failure that occurred during Sprint Autopilot execution
title: "Build Failure: [Brief description]"
labels: ["build-fail", "sprint-autopilot", "urgent"]
assignees: []
---

## Build Failure Report

### Branch Information
- **Branch**: `<!-- Branch name where build failed -->`
- **Commit Hash**: `<!-- Full commit hash -->`
- **Sprint Autopilot Task**: `<!-- Which task was being executed -->`

### Error Details
- **First Error Message**:
  ```
  <!-- Paste the first error message from the build log -->
  ```

- **Full Stack Trace**:
  ```
  <!-- Paste the complete error stack trace -->
  ```

- **Build Command**: `<!-- Which command failed (e.g., npm run build) -->`

### Context
- **Recent Changes**: `<!-- What changes were made before the build -->`
- **Environment**: `<!-- Node version, OS, etc. -->`

### Suggested Next Steps
<!-- Based on error type, suggest debugging steps -->

### Memory-Bank Context
- **Architecture Reference**: [`.kilocode/rules/memory-bank/architecture.md`](.kilocode/rules/memory-bank/architecture.md)
- **Tech Stack Reference**: [`.kilocode/rules/memory-bank/tech.md`](.kilocode/rules/memory-bank/tech.md)
- **Current Context**: [`.kilocode/rules/memory-bank/context.md`](.kilocode/rules/memory-bank/context.md)

### Checklist
- [ ] Error reproduced locally
- [ ] Memory-bank files reviewed for configuration conflicts
- [ ] Dependencies verified (package.json, package-lock.json)
- [ ] TypeScript configuration checked
- [ ] Build works on main branch

### Additional Notes
<!-- Any other relevant information -->