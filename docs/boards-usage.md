# Board Usage Guide

This guide explains how to effectively use your automated GitHub Projects v2 board for project management.

## Board Overview

Your "Product Delivery Board" automatically organizes work items with these views:

- **Table View**: Detailed view with all custom fields
- **Board View**: Kanban-style with status columns
- **Roadmap View**: Timeline view for sprint planning

## Daily Workflow

### 1. Morning Standup

1. **Review Backlog**
   - Check items in "Backlog" status
   - Prioritize based on labels and estimates
   - Move urgent items to "Planned"

2. **Check Blocked Items**
   - Review "Blocked" status items
   - Remove blockers or escalate
   - Update labels as needed

3. **Sprint Capacity**
   - Review current sprint items
   - Check team capacity vs estimates
   - Adjust priorities if needed

### 2. During the Day

1. **New Issues/PRs**
   - Automatically added to board
   - Fields populated from labels
   - Status set based on type

2. **Status Updates**
   - Move items as work progresses
   - Use labels to trigger automation
   - Monitor CI status changes

### 3. End of Day

1. **Review Progress**
   - Check items moved to "Done"
   - Update remaining estimates
   - Plan next day's work

## Sprint Management

### Sprint Planning

1. **Create Sprint Label**
   ```bash
   # Create label for current sprint
   sprint:2025-W36
   ```

2. **Assign Items to Sprint**
   - Add sprint label to issues
   - Automation updates Sprint field
   - Items appear in sprint view

3. **Capacity Planning**
   - Sum estimates in sprint
   - Compare to team capacity
   - Adjust scope as needed

### During Sprint

1. **Daily Updates**
   - Move items through status columns
   - Update estimates if needed
   - Add blockers with `blocked` label

2. **Sprint Burndown**
   - Monitor progress in board view
   - Use filters for sprint items
   - Track velocity for planning

### Sprint Review

1. **Review Completed Work**
   - Check "Done" items in sprint
   - Verify acceptance criteria
   - Update documentation

2. **Retrospective**
   - Review blocked items
   - Identify improvement areas
   - Plan process improvements

## Work Item Management

### Creating Issues

Use issue templates with proper labels:

```markdown
## Feature Request
- Labels: `type:feature`, `priority:p1`, `sprint:2025-W36`
- Estimate: 5
- Description: Clear requirements
```

### Creating Pull Requests

1. **Link to Issue**
   - Reference issue in PR description
   - Use `Closes #123` or `Fixes #123`

2. **Labels**
   - Add relevant labels
   - Sprint label for tracking

3. **Ready for Review**
   - Mark as ready when complete
   - Automation moves to "Review" status

### Status Transitions

| From | To | Trigger |
|------|----|---------|
| Backlog | Planned | Manual move |
| Planned | In Progress | Work started |
| In Progress | Review | PR ready |
| Review | Done | PR merged |
| Any | Blocked | `blocked` label added |

## Filtering and Views

### Common Filters

1. **Current Sprint**
   ```
   Sprint: 2025-W36
   ```

2. **High Priority**
   ```
   Priority: P0, P1
   ```

3. **Blocked Items**
   ```
   Status: Blocked
   ```

4. **My Work**
   ```
   Assignee: @me
   ```

5. **Team Work**
   ```
   Assignee: team-name
   ```

### Saved Views

Create saved views for common scenarios:

- **Sprint Backlog**: Current sprint items
- **My Tasks**: Assigned to me
- **Blocked Items**: Need attention
- **Ready for Review**: PRs waiting
- **This Week**: Due this week

## Reporting

### Sprint Metrics

1. **Velocity**
   - Story points completed per sprint
   - Track in board views

2. **Cycle Time**
   - Time from backlog to done
   - Use board history

3. **Blockers**
   - Count and duration of blocks
   - Identify patterns

### Team Dashboard

Create dashboard views:

- **Team Capacity**: Current workload
- **Sprint Progress**: Burndown chart
- **Quality Metrics**: Bug rates, reopen rates

## Best Practices

### Labeling

1. **Consistent Naming**
   - Use standard label formats
   - Keep labels updated

2. **Priority Management**
   - P0: Critical, blocking
   - P1: High priority features
   - P2: Normal priority
   - P3: Nice to have

3. **Type Classification**
   - Feature: New functionality
   - Bug: Fixes
   - Chore: Maintenance
   - Spec: Documentation/research

### Estimation

1. **Story Points**
   - Use Fibonacci: 1, 2, 3, 5, 8, 13, 21
   - Relative sizing
   - Team consensus

2. **When to Estimate**
   - During refinement
   - Before sprint planning
   - Update during sprint if needed

### Communication

1. **Issue Updates**
   - Keep descriptions current
   - Add context in comments
   - Link related items

2. **PR Reviews**
   - Clear descriptions
   - Reference requirements
   - Tag reviewers appropriately

## Troubleshooting

### Common Issues

1. **Items Not Appearing**
   - Check workflow runs
   - Verify labels are correct
   - Check for `sync:failed` label

2. **Wrong Status**
   - Check automation rules
   - Verify event triggers
   - Manual override if needed

3. **Fields Not Updating**
   - Check label format
   - Verify field mappings
   - Run manual sync

### Getting Help

1. **Check Logs**
   ```bash
   gh run list --workflow=project-sync.yml
   ```

2. **Manual Sync**
   ```bash
   gh workflow run project-backfill.yml -f days_back=1
   ```

3. **Dry Run Test**
   ```bash
   gh workflow run project-sync.yml -f dry_run=true
   ```

## Advanced Usage

### Custom Workflows

1. **Epic Tracking**
   - Use labels for epic grouping
   - Create epic-specific views

2. **Dependency Management**
   - Link dependent issues
   - Use blocking labels

3. **Release Planning**
   - Version labels for releases
   - Release-specific views

### Integration

1. **CI/CD Status**
   - Monitor build status
   - Block deployments on failures

2. **External Tools**
   - Export board data
   - Integrate with project tools

3. **Automation Rules**
   - Custom label triggers
   - Status transition rules

## Metrics and Analytics

### Key Metrics

1. **Throughput**
   - Items completed per week
   - Average cycle time

2. **Quality**
   - Bug rates
   - Reopen rates
   - Block duration

3. **Predictability**
   - Sprint goal achievement
   - Estimate accuracy

### Reporting Views

1. **Sprint Summary**
   - Completed vs planned
   - Blockers encountered
   - Lessons learned

2. **Team Health**
   - Work in progress
   - Capacity utilization
   - Bottleneck identification

## Related Documentation

- [GitHub Projects Setup](docs/github-projects.md)
- [Field Mapping](scripts/project-field-mapping.md)
- [Bootstrap Guide](scripts/project-bootstrap.md)