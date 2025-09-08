# GitHub Projects v2 Automation

This document provides comprehensive guidance for setting up and using GitHub Projects v2 automation in your repository.

## Overview

GitHub Projects v2 provides a powerful way to organize and track work using customizable fields and automation. This setup automates the synchronization between GitHub issues, pull requests, and your project board.

### Key Features

- **Automatic Item Addition**: Issues and PRs are automatically added to the project board
- **Field Synchronization**: Custom fields are updated based on labels and events
- **Status Management**: Status changes based on issue/PR lifecycle events
- **CI Integration**: Status updates based on build results
- **Dry-Run Support**: Test changes without affecting the live board
- **Error Handling**: Robust error handling with retry logic and audit trails

## Project Setup

### 1. Create Project v2

1. Go to your repository or organization
2. Navigate to Projects tab
3. Click "New project"
4. Choose "Table" or "Board" view
5. Name it "Product Delivery Board"

### 2. Configure Custom Fields

Add these custom fields to your project:

#### Status (Single Select)
- Backlog
- Planned
- In Progress
- Review
- Blocked
- Done

#### Priority (Single Select)
- P0 (Critical)
- P1 (High)
- P2 (Medium)
- P3 (Low)

#### Type (Single Select)
- Feature
- Bug
- Chore
- Spec

#### Estimate (Number)
- Field for story points (0-21)

#### Sprint (Text or Iteration)
- For sprint assignment

## Authentication Setup

### GitHub Token Requirements

Create a GitHub Personal Access Token (PAT) or GitHub App with these permissions:

**Required Scopes:**
- `repo` - Full repository access
- `read:org` - Read organization data (if using org projects)
- `project` - Full project access

**Recommended:** Use GitHub App for better security and audit trails.

### Token Storage

Store the token as a repository secret:

1. Go to Repository Settings → Secrets and variables → Actions
2. Add new repository secret: `GH_PROJECT_TOKEN`
3. Paste your token value

For organization projects, you may need to store it as an organization secret.

## Environment Configuration

Set these as Repository Variables (Settings → Secrets and variables → Variables):

```bash
# Project Configuration
PROJECT_ID=PV_lADOAA8E1s4AA8MD

# Field IDs
FIELD_ID_STATUS=PVTF_lADOAA8E1s4AA8MD
FIELD_ID_PRIORITY=PVTF_lADOAA8E1s4AA8ME
FIELD_ID_TYPE=PVTF_lADOAA8E1s4AA8MF
FIELD_ID_ESTIMATE=PVTF_lADOAA8E1s4AA8MG
FIELD_ID_SPRINT=PVTF_lADOAA8E1s4AA8MH

# Status Option IDs
STATUS_BACKLOG_ID=f75ad846
STATUS_IN_PROGRESS_ID=47fc9ee4
STATUS_REVIEW_ID=abc123
STATUS_BLOCKED_ID=def456
STATUS_DONE_ID=98236657

# Priority Option IDs
PRIORITY_P0_ID=6f669d0d
PRIORITY_P1_ID=0c1e4d3a
PRIORITY_P2_ID=1a2b3c4d
PRIORITY_P3_ID=5e6f7g8h

# Type Option IDs
TYPE_FEATURE_ID=abc123def
TYPE_BUG_ID=ghi456jkl
TYPE_CHORE_ID=mno789pqr
TYPE_SPEC_ID=stu012vwx
```

## Workflow Triggers

### Automatic Triggers

The sync workflow runs on these events:

#### Issues
- `opened` - New issue created
- `labeled` - Label added/removed
- `reopened` - Issue reopened
- `closed` - Issue closed

#### Pull Requests
- `opened` - New PR created
- `synchronize` - New commits pushed
- `ready_for_review` - PR marked ready for review
- `closed` - PR merged or closed

#### CI Integration
- `workflow_run` - When build/test workflows complete
- Supports custom workflow names (configure in workflow file)

### Manual Triggers

#### Backfill Workflow
Run manually to sync existing items:

```bash
gh workflow run project-backfill.yml -f days_back=30 -f dry_run=true
```

Parameters:
- `days_back`: Number of days to look back (default: 30)
- `dry_run`: Test mode without making changes (default: false)

## Automation Rules

### Status Updates

| Event | New Status | Conditions |
|-------|------------|------------|
| Issue opened | Backlog | Always |
| Issue reopened | Backlog | Always |
| Issue closed | Done | Always |
| PR opened | In Progress | Always |
| PR synchronize | In Progress | Always |
| PR ready_for_review | Review | Always |
| PR closed (merged) | Done | merged = true |
| PR closed (not merged) | Backlog | merged = false |
| CI failure | Blocked | workflow_run conclusion = failure |
| Label `blocked` | Blocked | Label present |

### Label Mappings

| Label | Field | Value |
|-------|-------|-------|
| `type:feature` | Type | Feature |
| `type:bug` | Type | Bug |
| `type:chore` | Type | Chore |
| `type:spec` | Type | Spec |
| `priority:p0` | Priority | P0 |
| `priority:p1` | Priority | P1 |
| `priority:p2` | Priority | P2 |
| `priority:p3` | Priority | P3 |
| `sprint:<name>` | Sprint | `<name>` |
| `blocked` | Status | Blocked |

### Estimate Parsing

Estimates are parsed from issue/PR bodies:

```markdown
Estimate: 5
```

- Case-insensitive
- Supports 0-21 (Fibonacci scale)
- Updates Estimate field automatically

## Dry-Run Mode

Test changes without affecting the live board:

```bash
# Sync workflow dry-run
gh workflow run project-sync.yml -f dry_run=true

# Backfill dry-run
gh workflow run project-backfill.yml -f dry_run=true -f days_back=7
```

## Error Handling

### Retry Logic
- API failures trigger 1 retry with exponential backoff
- Failed syncs add `sync:failed` label
- Error comments posted to issues/PRs

### Rate Limiting
- Respects GitHub API rate limits
- Automatic backoff on 429 responses
- Batch processing for bulk operations

### Audit Trail
- All operations logged in workflow summary
- Error details included in failure comments
- Job summaries with operation counts

## Troubleshooting

### Common Issues

#### 1. "Project not found"
- Verify `PROJECT_ID` is correct
- Check token permissions
- Ensure project is accessible to the token

#### 2. "Field not found"
- Re-run bootstrap script to get current field IDs
- Check for field name changes
- Verify field IDs in environment variables

#### 3. "Permission denied"
- Ensure token has `project:write` scope
- For org projects, use org-level token
- Check repository vs organization permissions

#### 4. "Item already exists"
- Normal behavior - item is updated instead
- Check logs for update operations

#### 5. Labels not syncing
- Verify label names match exactly
- Check case sensitivity
- Ensure labels exist in repository

### Debug Steps

1. **Check Workflow Logs**
   ```bash
   gh run list --workflow=project-sync.yml
   gh run view <run-id> --log
   ```

2. **Test with Dry-Run**
   ```bash
   gh workflow run project-sync.yml -f dry_run=true
   ```

3. **Verify Environment Variables**
   - Check repository variables are set
   - Ensure no extra spaces or characters
   - Verify field IDs match project

4. **Test GraphQL Queries**
   ```bash
   gh api graphql -f query='query { viewer { login } }'
   ```

### Getting Help

- Review workflow run logs for detailed errors
- Check GitHub API status: https://www.githubstatus.com/
- Use GraphQL Explorer: https://docs.github.com/en/graphql/overview/explorer
- Review Projects v2 API docs: https://docs.github.com/en/issues/planning-and-tracking-with-projects/automating-your-project/using-the-api-to-manage-projects

## Security Considerations

- **Least Privilege**: Token only has required permissions
- **No Production Access**: Workflows don't access production secrets
- **Audit Trail**: All operations logged
- **Idempotent Operations**: Safe to re-run workflows
- **Error Isolation**: Failures don't affect other operations

## Performance

- **Batch Processing**: Multiple items processed efficiently
- **Pagination**: Handles large repositories
- **Caching**: Avoids redundant API calls
- **Rate Limit Aware**: Respects API limits

## Monitoring

Monitor automation health:

```bash
# Check recent workflow runs
gh run list --workflow=project-sync.yml --limit=10

# View workflow usage
gh workflow view project-sync.yml

# Check for failed runs
gh run list --workflow=project-sync.yml --status=failure
```

## Related Documentation

- [Field Mapping](scripts/project-field-mapping.md)
- [Bootstrap Guide](scripts/project-bootstrap.md)
- [Board Usage](docs/boards-usage.md)
- [Reuse Guide](docs/reuse-in-new-repo.md)