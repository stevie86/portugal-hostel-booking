# Governance and Branch Management

This document outlines the governance structure for the Portugal Hostel Booking Platform, including branch protection, Sprint Autopilot behavior, and quality assurance processes.

## Branch Protection

The `main` branch is protected to ensure code quality and stability:

### Protection Rules
- **Pull Request Reviews**: Required (minimum 1 approving review)
- **Status Checks**: Required (build must pass)
- **Include Administrators**: Enabled (rules apply to all users)
- **Restrictions**: No additional restrictions on who can push

### Implementation
Branch protection was configured using GitHub CLI:
```bash
gh api repos/stevie86/portugal-hostel-booking/branches/main/protection --method PUT \
  --field required_status_checks='{"strict":true,"contexts":[]}' \
  --field enforce_admins=true \
  --field required_pull_request_reviews='{"required_approving_review_count":1}' \
  --field restrictions=null
```

### Automated Governance Checks
The [governance.yml](../.github/workflows/governance.yml) workflow automatically enforces quality gates on all pull requests to main:

- **Build Verification**: Runs `npm run build` to ensure no compilation errors
- **Memory-Bank Validation**: Confirms all required memory-bank files are present
- **Policy Compliance**: Verifies auto-approval and escalation policies exist
- **Template Validation**: Ensures PR templates are properly configured
- **Change Analysis**: Flags potentially destructive or infrastructure changes for manual review
- **Preview Deployment**: Initiates preview checks and provides manual verification guidance

## Sprint Autopilot Mode

The Sprint Autopilot mode operates within strict guardrails to ensure autonomous task execution while maintaining project integrity.

### Operational Scope
- **Write Access**: Limited to `app/`, `components/`, `prisma/`, `scripts/`, `docs/`, `README.md`
- **Read Access**: Full access to `.kilocode/rules/memory-bank/**` for context and consistency
- **Command Execution**: Restricted to safe operations (`npm ci`, `npm run build`, `npx prisma generate`)

### Branch Strategy
- **Target Branches**: Sprint Autopilot only writes to feature and sprint branches
- **Main Branch**: Never directly modified by autopilot (requires PR review)
- **Workflow**: Feature branches → dev (with PR reviews) → main (after validation)

### Auto-Approval Matrix
Changes are automatically approved without user confirmation if they meet criteria defined in [auto-approval.md](../.kilocode/rules/auto-approval.md):

**Auto-Approved:**
- UI/UX changes in `app/`, `components/**`
- Documentation updates in `docs/`, `README.md`
- Additive database changes in `prisma/` (new fields/tables only)
- Small utility scripts in `scripts/**`

**Approval Required:**
- Destructive database operations
- Infrastructure changes (`.github/`, `next.config.js`, `package.json` scripts)
- Security and environment modifications

## Quality Assurance

### Ready-Gate Requirements
All changes must pass these checks before completion:
1. **Build Success**: `npm run build` completes without errors
2. **Preview Deployment**: Vercel preview URL loads core pages (`/admin`, `/rooms`)
3. **Memory-Bank Alignment**: Changes consistent with documented architecture

### Escalation Procedures
Error handling follows the workflow defined in [escalation.md](../.kilocode/rules/escalation.md):

- **Build Failures**: Create `build-fail` issue, cancel batch execution
- **Preview Failures**: Retry once, then create `preview-fail` issue
- **Policy Violations**: Immediate stop, request explicit approval
- **Other Errors**: Document in `docs/parking-lot.md`

## Memory-Bank Integration

All governance decisions and quality checks reference the Memory Bank:

- **[Architecture](../.kilocode/rules/memory-bank/architecture.md)**: System design and technical decisions
- **[Context](../.kilocode/rules/memory-bank/context.md)**: Current work focus and recent changes
- **[Tech Stack](../.kilocode/rules/memory-bank/tech.md)**: Technologies and development setup
- **[Product](../.kilocode/rules/memory-bank/product.md)**: Business requirements and user experience goals

## Issue and PR Templates

Standardized templates ensure consistent reporting and review:

- **Build Fail**: [build-fail.md](../.github/ISSUE_TEMPLATE/build-fail.md)
- **Preview Fail**: [preview-fail.md](../.github/ISSUE_TEMPLATE/preview-fail.md)
- **Pull Request**: [PULL_REQUEST_TEMPLATE.md](../.github/PULL_REQUEST_TEMPLATE.md)

## Compliance and Audit

- All auto-approved changes are logged with timestamps and verification results
- Policy violations trigger immediate escalation with detailed documentation
- Regular audits ensure alignment between code, documentation, and governance rules

## References

- [Auto-Approval Policy](../.kilocode/rules/auto-approval.md)
- [Escalation Procedures](../.kilocode/rules/escalation.md)
- [Memory Bank](../.kilocode/rules/memory-bank/)
- [Sprint Autopilot Mode](../.kilocodemodes) (sprint-autopilot entry)