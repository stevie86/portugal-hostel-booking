# Escalation and Error Workflow

This document defines the escalation procedures for the Sprint Autopilot mode when errors or policy violations occur during autonomous task execution.

## Build Failures

**Trigger**: `npm run build` fails with errors

**Workflow**:
1. **Immediate Response**: Post PR comment with first error message and basic context
2. **Issue Creation**: Create `build-fail` issue using template with:
   - Branch name and commit hash
   - First error message and stack trace
   - Suggested next steps based on error type
   - Link to memory-bank context for debugging
3. **Batch Cancellation**: Stop current batch execution
4. **Notification**: Tag relevant team members for urgent review

**Memory-Bank Integration**: Reference architecture.md and tech.md for build configuration context

## Preview Deployment Failures

**Trigger**: Vercel preview URL fails to load or core pages (`/admin`, `/rooms`) are inaccessible

**Workflow**:
1. **Retry Logic**: Attempt 1 additional deployment
2. **If Retry Fails**: Create `preview-fail` issue using template with:
   - Branch name and preview URL
   - Error details and console logs
   - Retry attempt status
   - Memory-bank alignment verification
3. **Batch Cancellation**: Stop current batch execution
4. **Notification**: Tag deployment team for review

**Memory-Bank Integration**: Check context.md for recent changes and architecture.md for deployment requirements

## Policy Violations

**Trigger**: Any change violates auto-approval criteria (see auto-approval.md)

**Workflow**:
1. **Immediate Stop**: Halt all execution immediately
2. **Issue Creation**: Create `policy-violation` issue with:
   - Specific policy violated
   - Files affected
   - Proposed change details
   - Memory-bank reference for policy context
3. **User Notification**: Request explicit approval with detailed explanation
4. **Rollback Preparation**: Document rollback steps if needed

**Memory-Bank Integration**: Reference auto-approval.md and architecture.md for policy context

## Other Errors and Edge Cases

**Trigger**: Any error not covered above

**Workflow**:
1. **Documentation**: Move issue to `docs/parking-lot.md` with:
   - Error description and context
   - Steps taken before failure
   - Memory-bank references for debugging
   - Suggested resolution approaches
2. **Priority Assessment**: Evaluate if issue blocks sprint progress
3. **Escalation Decision**: Determine if human intervention required

**Memory-Bank Integration**: Include links to relevant memory-bank files for context and debugging

## Debugging Context Integration

All escalation issues must include:
- **Memory-Bank References**: Links to relevant files in `.kilocode/rules/memory-bank/`
- **Architecture Alignment**: Verification against documented patterns
- **Recent Changes**: Context from context.md for change tracking
- **Technical Constraints**: Reference to tech.md for environment details

## Recovery Procedures

### After Build Fix
1. Re-run `npm run build` locally
2. Verify preview deployment
3. Update issue with resolution details
4. Resume batch execution if appropriate

### After Preview Fix
1. Verify core pages load correctly
2. Check console for errors
3. Update issue with resolution
4. Resume batch if no blocking issues

### After Policy Approval
1. Implement approved changes
2. Update audit trail
3. Resume execution with safeguards

## Monitoring and Alerts

- **Automated Checks**: Build status and preview health monitored continuously
- **Threshold Alerts**: Immediate notification for critical failures
- **Batch Health**: Track success rate and failure patterns
- **Memory-Bank Sync**: Ensure escalation procedures align with current project state