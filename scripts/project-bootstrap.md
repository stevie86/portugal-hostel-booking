# Project Bootstrap Guide

This guide helps you retrieve the necessary IDs for GitHub Projects v2 automation.

## Prerequisites

- GitHub CLI (`gh`) installed and authenticated
- Repository access with Projects permissions
- GitHub Personal Access Token with `repo`, `read:org`, `project` scopes (if using PAT instead of GitHub App)

## Step 1: Get Project ID

### Using GitHub CLI

```bash
# For user-owned projects
gh api graphql -f query='
query {
  user(login: "YOUR_USERNAME") {
    projectsV2(first: 20) {
      nodes {
        id
        title
        number
      }
    }
  }
}'

# For organization projects (replace ORG_NAME)
gh api graphql -f query='
query {
  organization(login: "ORG_NAME") {
    projectsV2(first: 20) {
      nodes {
        id
        title
        number
      }
    }
  }
}'
```

### Using curl

```bash
# Replace TOKEN with your GitHub token
curl -H "Authorization: bearer TOKEN" \
     -H "Content-Type: application/json" \
     -X POST \
     -d '{"query": "query { user(login: \"YOUR_USERNAME\") { projectsV2(first: 20) { nodes { id title number } } } }"}' \
     https://api.github.com/graphql
```

## Step 2: Get Field IDs

Once you have the Project ID, get the field IDs:

### Using GitHub CLI

```bash
# Replace PROJECT_ID with the ID from Step 1
gh api graphql -f query='
query($projectId: ID!) {
  node(id: $projectId) {
    ... on ProjectV2 {
      fields(first: 20) {
        nodes {
          ... on ProjectV2Field {
            id
            name
            dataType
          }
          ... on ProjectV2SingleSelectField {
            id
            name
            options {
              id
              name
            }
          }
          ... on ProjectV2IterationField {
            id
            name
            configuration {
              iterations {
                id
                title
                startDate
                duration
              }
            }
          }
        }
      }
    }
  }
}' -f projectId="PROJECT_ID"
```

### Using curl

```bash
curl -H "Authorization: bearer TOKEN" \
     -H "Content-Type: application/json" \
     -X POST \
     -d '{"query": "query($projectId: ID!) { node(id: $projectId) { ... on ProjectV2 { fields(first: 20) { nodes { ... on ProjectV2Field { id name dataType } ... on ProjectV2SingleSelectField { id name options { id name } } ... on ProjectV2IterationField { id name configuration { iterations { id title startDate duration } } } } } } } }", "variables": {"projectId": "PROJECT_ID"}}' \
     https://api.github.com/graphql
```

## Step 3: Map Field IDs

From the response, identify and map your custom fields:

### Example Response Structure

```json
{
  "data": {
    "node": {
      "fields": {
        "nodes": [
          {
            "id": "PVTF_lADOAA8E1s4AA8MD",
            "name": "Status",
            "dataType": "SINGLE_SELECT",
            "options": [
              {"id": "f75ad846", "name": "Backlog"},
              {"id": "47fc9ee4", "name": "In Progress"},
              {"id": "98236657", "name": "Done"}
            ]
          },
          {
            "id": "PVTF_lADOAA8E1s4AA8ME",
            "name": "Priority",
            "dataType": "SINGLE_SELECT",
            "options": [
              {"id": "6f669d0d", "name": "P0"},
              {"id": "0c1e4d3a", "name": "P1"}
            ]
          }
        ]
      }
    }
  }
}
```

### Required Environment Variables

Set these as Repository Variables in GitHub:

```bash
# Project ID
PROJECT_ID=PV_lADOAA8E1s4AA8MD

# Field IDs
FIELD_ID_STATUS=PVTF_lADOAA8E1s4AA8MD
FIELD_ID_PRIORITY=PVTF_lADOAA8E1s4AA8ME
FIELD_ID_TYPE=PVTF_lADOAA8E1s4AA8MF
FIELD_ID_ESTIMATE=PVTF_lADOAA8E1s4AA8MG
FIELD_ID_SPRINT=PVTF_lADOAA8E1s4AA8MH

# Status Option IDs (for single-select fields)
STATUS_BACKLOG_ID=f75ad846
STATUS_IN_PROGRESS_ID=47fc9ee4
STATUS_DONE_ID=98236657

# Priority Option IDs
PRIORITY_P0_ID=6f669d0d
PRIORITY_P1_ID=0c1e4d3a

# Type Option IDs
TYPE_FEATURE_ID=abc123
TYPE_BUG_ID=def456
TYPE_CHORE_ID=ghi789
TYPE_SPEC_ID=jkl012
```

## Step 4: Verify Setup

Test your setup by running the backfill workflow in dry-run mode:

```bash
gh workflow run project-backfill.yml -f dry_run=true -f days_back=1
```

Check the workflow logs to ensure IDs are correctly configured.

## Troubleshooting

### Common Issues

1. **"Resource not accessible by integration"**
   - Ensure your token has the correct scopes
   - For org projects, use an org-level token

2. **"Field not found"**
   - Double-check field IDs from Step 2
   - Ensure fields exist in the project

3. **"Project not found"**
   - Verify PROJECT_ID is correct
   - Check if the project is accessible to your token

### Getting Help

- Check GitHub's [Projects v2 API documentation](https://docs.github.com/en/graphql/reference/objects#projectv2)
- Use GitHub's GraphQL Explorer: https://docs.github.com/en/graphql/overview/explorer
- Review workflow logs for detailed error messages