# Reusing GitHub Projects Automation in New Repositories

This guide provides step-by-step instructions for setting up the GitHub Projects v2 automation in new repositories.

## Prerequisites

- Repository with GitHub Actions enabled
- Admin access to repository settings
- GitHub CLI (`gh`) installed (optional, for easier setup)
- GitHub Personal Access Token or GitHub App with required permissions

## Quick Setup (Automated)

### Option 1: Using GitHub CLI

```bash
# Clone this repository or copy files
git clone https://github.com/your-org/your-repo.git
cd your-repo

# Copy automation files
cp -r .github/workflows/project-*.yml .github/workflows/
cp scripts/project-*.md scripts/
cp docs/github-projects.md docs/
cp docs/boards-usage.md docs/
cp docs/reuse-in-new-repo.md docs/

# Commit and push
git add .
git commit -m "Add GitHub Projects automation"
git push
```

### Option 2: Manual File Copy

1. Copy these files from the source repository:
   - `.github/workflows/project-sync.yml`
   - `.github/workflows/project-backfill.yml`
   - `scripts/project-bootstrap.md`
   - `scripts/project-field-mapping.md`
   - `docs/github-projects.md`
   - `docs/boards-usage.md`
   - `docs/reuse-in-new-repo.md`

2. Update issue/PR templates (see below)

## Step-by-Step Setup

### Step 1: Create Project v2

1. Go to your repository → Projects tab
2. Click "New project"
3. Choose "Table" view
4. Name: "Product Delivery Board"
5. Add custom fields (see field configuration below)

### Step 2: Configure Custom Fields

Add these fields to your project:

#### Status (Single Select)
Options: Backlog, Planned, In Progress, Review, Blocked, Done

#### Priority (Single Select)
Options: P0, P1, P2, P3

#### Type (Single Select)
Options: Feature, Bug, Chore, Spec

#### Estimate (Number)
For story points (0-21)

#### Sprint (Text)
For sprint names

### Step 3: Get Project and Field IDs

Use the bootstrap script to get required IDs:

```bash
# Using GitHub CLI
gh api graphql -f query='
query {
  repository(owner: "YOUR_ORG", name: "YOUR_REPO") {
    projectsV2(first: 10) {
      nodes {
        id
        title
      }
    }
  }
}'
```

Or use the detailed guide in `scripts/project-bootstrap.md`.

### Step 4: Set Environment Variables

In Repository Settings → Secrets and variables → Variables:

```bash
# Project ID
PROJECT_ID=PV_lADOAA8E1s4AA8MD

# Field IDs (get from GraphQL query)
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

### Step 5: Set GitHub Token

In Repository Settings → Secrets and variables → Actions:

1. Create new secret: `GH_PROJECT_TOKEN`
2. Use Personal Access Token with scopes:
   - `repo` (full repository access)
   - `read:org` (if using org projects)
   - `project` (project access)

### Step 6: Configure Labels

Create these labels in your repository:

```bash
# Type labels
gh label create "type:feature" --color "84cc16" --description "New feature"
gh label create "type:bug" --color "dc2626" --description "Bug fix"
gh label create "type:chore" --color "6b7280" --description "Maintenance task"
gh label create "type:spec" --color "3b82f6" --description "Specification/documentation"

# Priority labels
gh label create "priority:p0" --color "7c2d12" --description "Critical priority"
gh label create "priority:p1" --color "ea580c" --description "High priority"
gh label create "priority:p2" --color "d97706" --description "Medium priority"
gh label create "priority:p3" --color "65a30d" --description "Low priority"

# Status labels
gh label create "blocked" --color "991b1b" --description "Work blocked"
gh label create "sync:failed" --color "7c2d12" --description "Project sync failed"
```

### Step 7: Update Issue/PR Templates

Update `.github/ISSUE_TEMPLATE/feature.md`:

```markdown
---
name: Feature Request
about: Request a new feature
title: "[FEATURE] "
labels: ["type:feature"]
---

## Description
Brief description of the feature

## Acceptance Criteria
- [ ] Criteria 1
- [ ] Criteria 2

## Priority
- [ ] P0 (Critical)
- [ ] P1 (High)
- [ ] P2 (Medium)
- [ ] P3 (Low)

## Estimate
Estimate: 

## Additional Context
Any additional context or screenshots
```

Update `.github/ISSUE_TEMPLATE/bug.md`:

```markdown
---
name: Bug Report
about: Report a bug
title: "[BUG] "
labels: ["type:bug"]
---

## Description
Brief description of the bug

## Steps to Reproduce
1. Step 1
2. Step 2
3. Step 3

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Severity
- [ ] P0 (Critical - blocks work)
- [ ] P1 (High - major issue)
- [ ] P2 (Medium - minor issue)
- [ ] P3 (Low - cosmetic)

## Environment
- Browser: 
- OS: 
- Version: 

## Additional Context
Screenshots, logs, etc.
```

Update `.github/PULL_REQUEST_TEMPLATE.md`:

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Linked Issues
Closes #123

## Testing
- [ ] Tests pass
- [ ] Manual testing completed
- [ ] No breaking changes

## Checklist
- [ ] Code follows style guidelines
- [ ] Documentation updated
- [ ] Tests added/updated
- [ ] Ready for review

## Project Sync
- [ ] IDs/Secrets configured (PROJECT_ID, FIELD_ID_*)
- [ ] Expected status after merge: Done
- [ ] CI must be green
```

### Step 8: Configure CODEOWNERS

Update `.github/CODEOWNERS`:

```bash
# Protect automation workflows
.github/workflows/ @your-team
scripts/project-*.md @your-team
docs/github-projects.md @your-team
```

### Step 9: Test Setup

1. **Create Test Issue**
   ```bash
   gh issue create --title "Test Issue" --body "Estimate: 3" --label "type:feature,priority:p1"
   ```

2. **Check Workflow**
   ```bash
   gh run list --workflow=project-sync.yml --limit=1
   ```

3. **Verify Board**
   - Check if issue appears in project
   - Verify fields are populated correctly

4. **Test Dry-Run**
   ```bash
   gh workflow run project-backfill.yml -f dry_run=true -f days_back=1
   ```

## Organization-Level Setup

For organization-wide projects:

### 1. Organization Project
- Create project at organization level
- Use org token with `read:org` scope

### 2. Organization Secrets
- Store `GH_PROJECT_TOKEN` as org secret
- Available to all repos in org

### 3. Shared Configuration
- Use same PROJECT_ID across repos
- Consistent field mappings
- Centralized label management

## Monorepo Support

For monorepos with multiple teams:

### 1. Multiple Projects
```bash
# Different projects per team
PROJECT_ID_TEAM_A=PV_lADOAA8E1s4AA8MD
PROJECT_ID_TEAM_B=PV_lADOAA8E1s4AA8ME
```

### 2. Conditional Logic
Update workflows to use different projects based on paths:

```yaml
jobs:
  sync:
    if: contains(github.event.pull_request.changed_files, 'team-a/')
    env:
      PROJECT_ID: ${{ vars.PROJECT_ID_TEAM_A }}
```

### 3. Shared Workflows
Use `workflow_call` for reusable workflows across repos.

## Troubleshooting Setup

### Common Issues

1. **Workflow Not Triggering**
   - Check branch protection rules
   - Verify workflow file syntax
   - Check repository permissions

2. **Token Issues**
   - Verify token scopes
   - Check token expiration
   - Test with `gh auth status`

3. **ID Configuration**
   - Re-run bootstrap queries
   - Check for typos in variables
   - Verify project accessibility

4. **Label Problems**
   - Ensure labels exist
   - Check exact name matching
   - Verify color codes

### Validation Steps

1. **Test GraphQL Access**
   ```bash
   gh api graphql -f query='{ viewer { login } }'
   ```

2. **Verify Project Access**
   ```bash
   gh api graphql -f query='
   query($id: ID!) {
     node(id: $id) {
       ... on ProjectV2 {
         title
       }
     }
   }' -f id=$PROJECT_ID
   ```

3. **Check Field Access**
   ```bash
   gh api graphql -f query='
   query($id: ID!) {
     node(id: $id) {
       ... on ProjectV2 {
         fields(first: 5) {
           nodes {
             ... on ProjectV2Field {
               name
             }
           }
         }
       }
     }
   }' -f id=$PROJECT_ID
   ```

## Maintenance

### Regular Tasks

1. **Update IDs** (when fields change)
   ```bash
   # Re-run bootstrap script
   # Update environment variables
   # Test with dry-run
   ```

2. **Review Failed Syncs**
   ```bash
   # Check for sync:failed labels
   gh issue list --label "sync:failed"
   ```

3. **Monitor Usage**
   ```bash
   # Check workflow run frequency
   gh run list --workflow=project-sync.yml --limit=20
   ```

### Updates

1. **Workflow Updates**
   - Pull latest versions from source repo
   - Test in dry-run mode
   - Update documentation

2. **Field Changes**
   - Update field mappings
   - Reconfigure environment variables
   - Update documentation

## Support

- Check [GitHub Projects Setup](docs/github-projects.md) for detailed configuration
- Review [Field Mapping](scripts/project-field-mapping.md) for label rules
- Use [Bootstrap Guide](scripts/project-bootstrap.md) for ID retrieval
- Check workflow logs for error details

## Quick Reference

### Required Files
- `.github/workflows/project-sync.yml`
- `.github/workflows/project-backfill.yml`
- `scripts/project-bootstrap.md`
- `scripts/project-field-mapping.md`
- `docs/github-projects.md`
- `docs/boards-usage.md`

### Required Secrets
- `GH_PROJECT_TOKEN` (repo or org secret)

### Required Variables
- `PROJECT_ID`
- `FIELD_ID_*` (5 field IDs)
- Status/Priority/Type option IDs

### Required Labels
- `type:*` (4 labels)
- `priority:*` (4 labels)
- `blocked`
- `sync:failed`