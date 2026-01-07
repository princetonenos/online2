# Live Class UI (Zoom-like) – Modular Components

This UI refactor keeps existing WebRTC hooks intact and composes the page from small, testable Vue SFCs. Tailwind utilities are used; if Tailwind is unavailable, map equivalent classes in a CSS module with the same tokens.

## Components
- TopBar.vue: meeting title, participants count, elapsed time, recording badge
- ControlsBar.vue: bottom toolbar (mic, camera, share, participants, chat, record, leave). Keyboard navigable and emits events.
- RightPanel.vue: collapsible panel with tabs (Participants / Chat). Overlays on mobile.
- VideoGrid.vue: gallery and speaker (stage) layouts. Uses existing VideoTile.vue.
- VideoTile.vue (existing): single participant tile; supports avatar fallback, mute/video-off overlays, pin state.

## Integration Contract
Props exposed to LiveClass children (names only; types implied):
- participants (array of participant objects)
- localParticipantId
- meetingTitle
- isRecording
- isScreenShared
- stageParticipantId (optional/pinned)

Events emitted by the UI (handled in LiveClass.vue):
- toggle-mute, toggle-video, pin, start-share, stop-share, leave, open-chat, toggle-participants

Streams are native `MediaStream` objects. They should be attached to `<video>` elements via `videoEl.srcObject = stream` in the consuming component (e.g., VideoTile).

## Accessibility & Keyboard
- ARIA roles: grid/tiles use role="list"/"listitem"; header/toolbar have labels; right panel is an `<aside>`.
- Keyboard shortcuts: M (mute), V (video), S (share), C (chat), Esc (close overlay). Implemented in LiveClass.vue and should be documented in help.
- Focus-visible outlines and 44x44px tap targets on mobile.

## Layout & Responsive Rules
- Gallery: responsive CSS grid. Columns: 1,2,3,4,5 for <=1, <=4, <=9, <=16, >16 participants.
- Stage/Speaker: large active (or pinned) tile in a 2/3 column; thumbnails in a rail.
- Screen-share: use stage mode; prioritize sharer’s tile.
- Right panel: overlay on small screens; fixed side on desktop.

## Performance Techniques
- Stable keys (`:key=participant.id`) and v-memo when possible.
- Virtualize or lazily render offscreen thumbnails with IntersectionObserver (future enhancement).
- Throttle resize/active-speaker logic; run layout in `requestAnimationFrame`.

## QA Checklist (acceptance)
- Gallery adapts correctly for 1,4,9,16+.
- Stage view shows large tile + thumbnails; pin toggles and persists in state.
- ControlsBar clickable & keyboard-accessible; emits events correctly.
- RightPanel toggles, overlays on mobile, and scrolls chat/participants.
- Recording badge visible when isRecording.
- Screen-share switches to emphasize shared content.
- Axe-core audit shows no critical violations.
- UI remains responsive with 40+ participants (tiles paginate/virtualize plan).

## Test Suggestions
- Unit (Jest + Vue Test Utils):
  - Snapshot TopBar with recording on/off.
  - ControlsBar emits events on button click + key.
  - VideoGrid gallery layout classes for 1, 4, 9 participants.
  - VideoTile overlays for muted/video-off/pinned.
- Visual (Playwright/Cypress):
  - Screenshots: gallery, stage, mobile overlay, screen-share.
  - Keyboard shortcut e2e: M / V / C / Esc.
- Accessibility: `axe-core` checks in CI.

## Migration Notes
- No changes to WebRTC hooks. LiveClass.vue wires UI events to existing functions:
  - toggleMute → useWebRTC.toggleMicrophone
  - toggleVideo → useWebRTC.toggleCamera
  - share → startScreenShare/stopScreenShare
  - join/leave → backend API unchanged
- If Tailwind is disabled, create `live.module.css` that maps tokens used here (bg-gray-800, rounded, ring, etc.).
