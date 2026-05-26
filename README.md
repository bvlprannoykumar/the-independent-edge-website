# The Independent Edge — v2 Changes (Production Fixes + Sheets Redesign)

This update applies the 7 production fixes from your brief plus the Google Sheets payload redesign. The SEO infrastructure from v1 is untouched.

## What was changed

### apply.html

| Fix | What was done |
|---|---|
| Scroll bug after each answer | `applyScrollTop()` rewritten to use `scrollIntoView({block: 'nearest'})`. Browser only scrolls if the active question is actually off-screen. No more snap to top. |
| Pre-call preparation stage | The entire `<div id="apply-precall">` block was removed (~5,300 chars). `applyGoToPreCall()` function deleted. |
| Strong fit result | Now shows the booking CTA directly as an `<a href>` opening Cal in a new tab. Copy updated per brief. No intermediate screen. |
| Medium fit result | Copy shortened per brief ("You may be a fit, but this work requires serious effort." + the 2-line subtext). CTA is now a direct anchor to Cal, no intermediate screen. |
| "20-Minute Founder Call" | Replaced with "Focused Founder Call". Removed all duration mentions including the "20 minutes. Not a pressure call." line under the "Book a focused call" step. |
| Empty bullet under "Do not apply if" | Removed. |
| `applySelect` choice tracking | Now stores the option index (0-3) alongside the score, so we can map back to the specific answer label even when two options share the same score. |
| Payload structure to Google Sheets | Completely restructured. See "New payload" below. |

### work-with-me.html

| Fix | What was done |
|---|---|
| Orphan "This is exactly what we fix" transition block | Removed the entire `<div class="wwm-transition-wrap">` block. The page now transitions directly from the dark "lose control of conversations" card into the "The process experience" section. CSS class definitions left in place as harmless dead code (we did not touch the style block to avoid risk). |

### Untouched

- Metadata, canonicals, OG tags, sitemap, robots.txt, navigation, footer, all other copy
- CSS block (verified byte-identical via MD5 hash on all 4 files, same hash as v1)
- index.html, the-weekly-edge.html (no changes needed)

## New payload to Google Sheets

The fetch() in `applyShowResult` now sends this structure:

```js
{
  timestamp:               "2026-05-20T10:24:33.000Z",
  name:                    "Aishwarya R.",
  email:                   "aish@example.com",
  phone:                   "9876543210",
  totalScore:              13,
  fitCategory:             "Strong Fit",
  q1Score:                 3,
  q2Score:                 3,
  q3Score:                 2,
  q4Score:                 3,
  q5Score:                 2,
  experienceLevel:         "Experienced consultant/freelancer",
  conversationConfidence:  "Money/pricing hesitation",
  pressureAvoidance:       "Moderate avoidance",
  actionOrientation:       "Immediate (30 days)",
  commitmentLevel:         "Moderate commitment",
  coreProblem:             "Money and pricing confidence gap",
  recommendedPath:         "Founder Call",
  status:                  "Founder Call Pending"
}
```

The order of keys matches the column order in the sheet exactly. The Apps Script iterates over the column array and looks up each value from the payload, so as long as both files agree on the key names, ordering survives.

## REQUIRED: Server-side update (Apps Script)

The client-side payload alone does nothing if your Google Apps Script keeps writing the old column structure. You must update both.

1. Open https://script.google.com
2. Find the project that owns the URL ending in `/AKfycbwZ_uu...exec`.
3. Open `Code.gs`. Replace its entire contents with the file `apps-script.gs` from this deliverable.
4. At the top of the script, set:
   - `SHEET_ID` to the long ID from your Google Sheet URL (between `/d/` and `/edit`)
   - `SHEET_NAME` to the tab name you want rows written to (e.g. "Leads")
5. Deploy → Manage deployments → pencil icon on existing deployment → Version: New version → Deploy. Reusing the same deployment keeps the same URL, so apply.html keeps working with no client change.
6. The first form submission to a fresh sheet auto-writes the header row (bold, navy background, frozen).

## Old data: my recommendation

You said "ensure old submissions do not break the sheet." Old rows are already written with the old column structure. If you use the SAME sheet and tab:

- **Option A (clean)**: Create a fresh sheet or fresh tab. Start clean. Old data stays archived in the original tab. This is what I recommend.
- **Option B (messy)**: Keep the same sheet. The script will see existing rows, assume the header already exists, and start appending new rows in the new column order. Old rows look visually offset for columns that did not exist before. Old rows still readable, just misaligned.

Both options work technically. Option A is cleaner.

## Test plan (since I cannot test live)

The webhook uses `mode: 'no-cors'` so even the browser cannot read the response. I cannot hit your Apps Script from this sandbox. You verify on your end:

1. Deploy the new HTML to Netlify (drag-and-drop).
2. Deploy the new Apps Script (above).
3. Open `theindependentedge.in/apply` in an incognito window.
4. Click through with bullshit but VARIED answers (intentionally trigger Strong one time, Medium another, Weak another).
5. Open your Google Sheet. Verify three new rows. Check that Core Problem, Recommended Path, and Status columns are populated, not empty.
6. If a column is empty: a payload key in apply.html does not match `PAYLOAD_TO_COLUMN` in `apps-script.gs`. Search both files for the offending key.

## What I tested without a real webhook

Ran the payload-building logic locally with 5 synthetic profiles (strong, medium, weak, two edge cases) and verified:

- 19 keys generated, 19 columns expected, match
- Key order matches column order
- All interpreted labels resolve to non-empty strings
- Core Problem logic fires sensibly for each profile
- Strong → "Founder Call Pending". Medium → "Review Needed". Weak → "Newsletter". Matches brief.

## What I deliberately did NOT do

- **Did not change the apply page copy beyond what the brief specified.** Side observation: the first bullet under "Do not apply if" reads "You are a corporate professional with 4-12 years of experience and existing expertise worth packaging." That reads like an Apply-IF criterion, not a Do-NOT-Apply one. The brief said "Do not change unrelated copy," so I left it. You may want to fix this on your next pass.
- **Did not touch the `.wwm-transition-wrap` / `.wwm-transition` CSS class definitions.** They are now orphaned (no HTML uses them) but removing CSS risks breaking something I cannot see. They are 6 lines of dead code. Acceptable.
- **Did not retroactively migrate old Google Sheet rows.** Out of scope.

## Files in this deliverable

```
index.html              (unchanged from v1)
work-with-me.html       (orphan transition removed)
the-weekly-edge.html    (unchanged from v1)
apply.html              (all 7 fixes + new payload)
apps-script.gs          (NEW: paste into your Apps Script project)
robots.txt              (unchanged from v1)
sitemap.xml             (unchanged from v1)
netlify.toml            (unchanged from v1)
og-default.jpg          (unchanged from v1)
README.md               (this file)
```
