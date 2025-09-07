---
name: Preview Deployment Failure
about: Report a Vercel preview deployment failure during Sprint Autopilot execution
title: "Preview Failure: [Brief description]"
labels: ["preview-fail", "sprint-autopilot", "deployment"]
assignees: []
---

## Preview Deployment Failure Report

### Branch Information
- **Branch**: `<!-- Branch name where preview failed -->`
- **Commit Hash**: `<!-- Full commit hash -->`
- **Sprint Autopilot Task**: `<!-- Which task was being executed -->`

### Deployment Details
- **Preview URL**: `<!-- Vercel preview URL that failed -->`
- **Deployment Status**: `<!-- Ready, Error, Building, etc. -->`
- **Retry Attempts**: `<!-- Number of retry attempts made -->`

### Error Details
- **Error Message**:
  ```
  <!-- Error message from Vercel deployment -->
  ```

- **Console Errors** (if accessible):
  ```
  <!-- Browser console errors from preview URL -->
  ```

- **Failed Pages**: `<!-- Which pages failed to load (e.g., /admin, /rooms) -->`

### Context
- **Recent Changes**: `<!-- What changes triggered this deployment -->`
- **Build Status**: `<!-- Did the build succeed locally? -->`

### Memory-Bank Alignment Check
- [ ] Changes align with [architecture.md](.kilocode/rules/memory-bank/architecture.md)
- [ ] No violations of [auto-approval.md](.kilocode/rules/auto-approval.md)
- [ ] Consistent with [context.md](.kilocode/rules/memory-bank/context.md)

### Checklist
- [ ] Preview URL is accessible
- [ ] Core pages (/admin, /rooms) load without errors
- [ ] No console errors in browser
- [ ] Build succeeds locally
- [ ] Memory-bank files reviewed for deployment requirements

### Additional Notes
<!-- Any other relevant information -->