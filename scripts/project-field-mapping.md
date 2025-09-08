# Project Field Mapping

This document defines the mapping between GitHub labels and Project v2 fields.

## Custom Fields Configuration

Your GitHub Projects v2 board should have these custom fields:

### Status (Single Select)
- **Field ID**: `FIELD_ID_STATUS`
- **Options**:
  - Backlog
  - Planned
  - In Progress
  - Review
  - Blocked
  - Done

### Sprint (Text or Iteration)
- **Field ID**: `FIELD_ID_SPRINT`
- **Type**: Text (or Iteration if available)
- **Format**: Sprint name (e.g., "Sprint 2025-09", "Q4-Planning")

### Priority (Single Select)
- **Field ID**: `FIELD_ID_PRIORITY`
- **Options**:
  - P0 (Critical)
  - P1 (High)
  - P2 (Medium)
  - P3 (Low)

### Estimate (Number)
- **Field ID**: `FIELD_ID_ESTIMATE`
- **Type**: Number
- **Unit**: Story Points
- **Range**: 0-21 (Fibonacci scale)

### Type (Single Select)
- **Field ID**: `FIELD_ID_TYPE`
- **Options**:
  - Feature
  - Bug
  - Chore
  - Spec

## Label to Field Mapping

### Type Labels
| Label | Maps to | Field Value |
|-------|---------|-------------|
| `type:feature` | Type | Feature |
| `type:bug` | Type | Bug |
| `type:chore` | Type | Chore |
| `type:spec` | Type | Spec |

### Priority Labels
| Label | Maps to | Field Value |
|-------|---------|-------------|
| `priority:p0` | Priority | P0 |
| `priority:p1` | Priority | P1 |
| `priority:p2` | Priority | P2 |
| `priority:p3` | Priority | P3 |

### Sprint Labels
| Label Pattern | Maps to | Field Value |
|---------------|---------|-------------|
| `sprint:<name>` | Sprint | `<name>` |

### Status Labels
| Label | Effect |
|-------|--------|
| `blocked` | Sets Status to Blocked (overrides other status logic) |

## Event-Based Status Updates

### Issue Events
| Event | Status |
|-------|--------|
| Issue opened | Backlog |
| Issue reopened | Backlog |
| Issue closed | Done |
| Label `blocked` added | Blocked |

### Pull Request Events
| Event | Status |
|-------|--------|
| PR opened | In Progress |
| PR synchronize (new commits) | In Progress |
| PR ready_for_review | Review |
| PR closed (merged) | Done |
| PR closed (not merged) | Backlog |
| Label `blocked` added | Blocked |

### CI Workflow Events
| Event | Status |
|-------|--------|
| CI build success | No change |
| CI build failure | Blocked |

## Estimate Parsing

The workflow parses estimates from issue/PR bodies using this pattern:

```
Estimate: N
```

Where `N` is a number (1-21). Examples:

```markdown
## Description
This is a new feature.

## Estimate
Estimate: 5
```

```markdown
Estimate: 13

## Acceptance Criteria
- Feature works
- Tests pass
```

## Examples

### Feature Request
**Labels**: `type:feature`, `priority:p1`, `sprint:Q4-2025`

**Result**:
- Type: Feature
- Priority: P1
- Sprint: Q4-2025
- Status: Backlog (on creation)

### Bug Report
**Labels**: `type:bug`, `priority:p0`, `blocked`

**Result**:
- Type: Bug
- Priority: P0
- Status: Blocked (blocked label overrides)

### Chore Task
**Labels**: `type:chore`, `priority:p3`

**Body**:
```markdown
## Description
Update dependencies

Estimate: 2
```

**Result**:
- Type: Chore
- Priority: P3
- Estimate: 2
- Status: Backlog

## Environment Variables Reference

Set these in GitHub Repository Variables:

```bash
# Project and Field IDs
PROJECT_ID=PV_lADOAA8E1s4AA8MD
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

## Validation

To validate your mapping:

1. Create a test issue with known labels
2. Check workflow logs for correct field updates
3. Verify values appear correctly in the project board
4. Use dry-run mode for testing: `gh workflow run project-sync.yml -f dry_run=true`

## Troubleshooting

### Common Issues

1. **Labels not mapping**: Check label names match exactly (case-sensitive)
2. **Field not updating**: Verify field IDs are correct in environment variables
3. **Status not changing**: Check if `blocked` label is interfering
4. **Estimate not parsing**: Ensure format is `Estimate: N` (case-insensitive)

### Debug Steps

1. Check workflow run logs for detailed error messages
2. Use dry-run mode to see what would be changed
3. Verify all required environment variables are set
4. Test with simple labels first, then add complexity