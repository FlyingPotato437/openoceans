# Demo Mode Control

## Quick Toggle

To enable/disable demo indicators, edit `components/DemoBanner.tsx`:

```typescript
// Line 6: Change this to control demo mode
const DEMO_MODE = true   // Shows demo indicators
const DEMO_MODE = false  // Hides demo indicators
```

## What Demo Mode Shows

When `DEMO_MODE = true`:
- **Top Banner**: Orange warning banner
- **Logo Badge**: "Demo" badge next to logo
- **Watermark**: "Demo Site" in bottom-right

## Complete Removal

To remove demo functionality entirely:
1. Set `DEMO_MODE = false` in `components/DemoBanner.tsx`
2. Delete: `components/DemoBanner.tsx` and `DEMO_INSTRUCTIONS.md`
3. Remove demo imports from `app/layout.tsx` and `components/Navigation.tsx` 