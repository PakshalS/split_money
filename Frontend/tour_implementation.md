# Driver.js Tour Implementation Guide

## Overview

This document outlines the complete implementation of a guided onboarding tour using **Driver.js v1.3.1**, with special focus on achieving cross-platform (mobile + desktop) compatibility and handling dynamic element rendering.

---

## The Problem We Solved

### Original Issue
When implementing a tour with Driver.js, we encountered a **critical mobile/desktop mismatch**:

1. **Multiple Elements in DOM**: Both mobile and desktop versions of elements existed in the DOM simultaneously
   - Desktop FAB (e.g., `.create-group-fab`) - visible on desktop, hidden on mobile (width/height: 0)
   - Mobile FAB (e.g., same class) - visible on mobile, hidden on desktop
   
2. **Element Selector Ambiguity**: Using a simple selector like `.create-group-fab` could match:
   - First: Hidden desktop version (0 dimensions)
   - Second: Visible mobile version (correct target)

3. **Driver.js Limitation**: Driver.js highlights the *first matching element* it finds in the DOM, regardless of visibility

### Result
Tour highlights were positioned on **invisible elements**, making the tour completely unusable on mobile while working fine on desktop.

---

## The Solution: Dynamic Element Finding

### Core Concept
Instead of passing a static selector string, pass a **function that dynamically finds the visible element** when the step is highlighted.

### Key Implementation

```javascript
// Step 1: Define the finder function
const findVisibleElement = (selector) => {
  const elements = document.querySelectorAll(selector);
  for (const el of elements) {
    const rect = el.getBoundingClientRect();
    // Check if element has non-zero dimensions
    if (rect.width > 0 && rect.height > 0) {
      return el;
    }
  }
  // Fallback to first element if none visible (edge case)
  return elements[0] || selector;
};

// Step 2: Use function in step config
steps: tourSteps.map((step) => ({
  // Pass function that returns the element dynamically
  element: typeof step.element === 'string' && step.element !== 'body'
    ? () => findVisibleElement(step.element)  // ← Function, not string
    : step.element,
  popover: { ... }
}))
```

### Why This Works

1. **Function Execution Timing**: Driver.js calls this function when the step is highlighted, not when the tour initializes
2. **Runtime Visibility Check**: `getBoundingClientRect()` returns real-time dimensions
3. **Adaptive Selection**: Always picks the visible element, whether on mobile or desktop

---

## Complete Implementation Details

### 1. Tour Steps Configuration (`tourSteps.js`)

```javascript
export const tourSteps = [
  {
    // Element selector - used by findVisibleElement function
    element: ".create-group-fab",
    popover: {
      title: "Create Your First Group",
      description: "Tap this button to create a new group...",
      side: "left",
      align: "start",
      showButtons: ["next", "close"],  // Custom buttons per step
    },
    requireInteraction: true,
    waitForNavigation: true,
    action: "click",
  },
  // ... more steps
];
```

### 2. TourProviderComponent Implementation

```javascript
// Key features:
1. Dynamic element finding with visibility check
2. Interactive step handling with auto-advance
3. Modal detection with delayed advance
4. Navigation awareness
5. Custom button configuration per step

// Mobile-aware patterns:
- All selectors use simple classes (not complex paths)
- Classes added to both mobile and desktop variants
- Visibility check ensures correct version is targeted
- Delays account for modal rendering time
```

### 3. CSS Classes in Components

**Critical**: Add CSS classes to ALL versions of a component (mobile + desktop):

```jsx
// ✅ CORRECT - Class added to the actual interactive element
<button className="create-group-fab">
  Create Group
</button>

// ✅ CORRECT for duplicated components (mobile/desktop)
{/* Desktop Version */}
<div className="hidden md:block create-group-fab">Desktop FAB</div>

{/* Mobile Version */}
<div className="md:hidden create-group-fab">Mobile FAB</div>
```

---

## Specific Implementation for This Tour

### Platform Detection Without Breakpoints

Instead of relying on media queries during tour execution, we:

1. **Query All Matching Elements** at highlight time
2. **Check Bounding Rectangles** for > 0 dimensions
3. **Select the Visible One** automatically

```javascript
// This works regardless of viewport size or breakpoint changes
const findVisibleElement = (selector) => {
  const elements = document.querySelectorAll(selector);
  for (const el of elements) {
    const rect = el.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) {
      return el;  // Returns first visible element
    }
  }
  return elements[0];  // Fallback
};
```

### Interactive Steps with Auto-Advance

```javascript
onHighlighted: (element, step, options) => {
  const stepConfig = tourSteps[stepIndex];
  
  if (stepConfig?.requireInteraction) {
    if (stepConfig.action === "click") {
      const handleInteraction = () => {
        // Check if this opens a modal
        const opensModal = stepConfig.element?.includes('dropdown-add-guest-option');
        
        // Use longer delay for modal rendering
        const delay = opensModal ? 1000 : 300;
        
        setTimeout(() => {
          driverRef.current.moveNext();
        }, delay);
      };
      
      element.addEventListener("click", handleInteraction, { once: true });
    }
  }
}
```

### Modal Detection Logic

```javascript
// Modal-opening elements need extra delay
const opensModal = 
  stepConfig.element?.includes('dropdown-add-guest-option') ||
  stepConfig.element?.includes('plus-button-action') ||
  stepConfig.element?.includes('action-menu-add-expense') ||
  stepConfig.element?.includes('settle-up-action-button');

// 1000ms delay ensures modal DOM is fully rendered before next step
const delay = opensModal ? 1000 : 300;
```

---

## Do's and Don'ts

### ✅ DO's

1. **Use Simple, Descriptive CSS Classes**
   ```css
   .create-group-fab
   .group-name-input
   .guest-name-input-0
   .add-expense-button
   ```

2. **Apply Classes to ALL Variants**
   - Both mobile and desktop versions
   - Both light and dark theme variants (if relevant)
   - All duplicated components

3. **Test Visibility Before Using Element**
   ```javascript
   const rect = el.getBoundingClientRect();
   if (rect.width > 0 && rect.height > 0) {
     // Safe to use this element
   }
   ```

4. **Use Functions for Dynamic Elements**
   ```javascript
   element: () => findVisibleElement(".my-selector")  // ← Function
   ```

5. **Account for Modal Rendering Time**
   ```javascript
   // After clicking modal-opening button
   await new Promise(resolve => setTimeout(resolve, 1000));
   // Then advance to next step
   ```

6. **Hide Back Button After Navigation**
   ```javascript
   showButtons: ["next", "close"]  // No "previous" to prevent breaking tour
   ```

7. **Use Navigation Detection**
   ```javascript
   waitForNavigation: true  // Auto-advance when URL changes
   ```

### ❌ DON'Ts

1. **Don't Use Complex Selectors**
   ```javascript
   // ❌ WRONG
   element: ".container > div:nth-child(2) .button"
   
   // ✅ CORRECT
   element: ".my-button"
   ```

2. **Don't Pass Static Strings for Dynamic Elements**
   ```javascript
   // ❌ WRONG
   element: ".mobile-fab"  // Picks first match in DOM
   
   // ✅ CORRECT
   element: () => findVisibleElement(".mobile-fab")
   ```

3. **Don't Assume DOM Structure is Stable**
   ```javascript
   // ❌ WRONG - Breaks if DOM changes
   element: ".form > .inputs > .third-input"
   
   // ✅ CORRECT - Resilient to DOM changes
   element: ".expense-amount-input"
   ```

4. **Don't Forget About Hidden Elements**
   ```javascript
   // ❌ WRONG - May highlight hidden element
   element: ".button"
   
   // ✅ CORRECT - Checks visibility
   element: () => findVisibleElement(".button")
   ```

5. **Don't Use Instant Advances for Forms**
   ```javascript
   // ❌ WRONG - Form data not saved
   setTimeout(() => moveNext(), 100);
   
   // ✅ CORRECT - Wait for form processing
   setTimeout(() => moveNext(), 800);
   ```

6. **Don't Show Back Button After Breaking Actions**
   ```javascript
   // ❌ WRONG - User can go back to previous page
   showButtons: ["next", "previous", "close"]
   
   // ✅ CORRECT - Only forward navigation
   showButtons: ["next", "close"]
   ```

---

## Step-by-Step Implementation Checklist

### Phase 1: Setup
- [ ] Install Driver.js: `npm install driver.js`
- [ ] Create `tourSteps.js` with all step configurations
- [ ] Create `TourProviderComponent.jsx` with driver initialization
- [ ] Create `useTour.js` hook for state management

### Phase 2: Add CSS Classes
- [ ] Identify all interactive elements
- [ ] Add unique CSS class to each element
- [ ] Add class to BOTH mobile and desktop versions
- [ ] Add class to BOTH light and dark theme versions
- [ ] Verify classes are not conflicting with existing styles

### Phase 3: Configure Steps
- [ ] Set element selector for each step
- [ ] Set popover title and description
- [ ] Configure buttons (`showButtons` per step)
- [ ] Set `requireInteraction` for clickable elements
- [ ] Set `waitForNavigation` for navigation-triggering steps
- [ ] Set `action` type ("click" or "input")

### Phase 4: Test
- [ ] Test on desktop (all breakpoints)
- [ ] Test on mobile (all sizes)
- [ ] Test in light theme
- [ ] Test in dark theme
- [ ] Test interaction flows (click → modal → next)
- [ ] Verify auto-advance works correctly
- [ ] Check for console errors

### Phase 5: Optimization
- [ ] Adjust delay timings if needed
- [ ] Fine-tune modal detection
- [ ] Add loading indicators if needed
- [ ] Optimize for performance

---

## Real Code Example: Guest Name Input

### Element Definition (tourSteps.js)
```javascript
{
  element: ".guest-name-input-0",  // Target first guest name input
  popover: {
    title: "Enter Guest Name",
    description: "Type the name of the first person to add to this group.",
    side: "bottom",
    showButtons: ["next", "close"],  // Custom buttons
  },
  requireInteraction: true,
  action: "input",
}
```

### Component Implementation (addGuestModal.jsx)
```jsx
<input
  type="text"
  placeholder="Name *"
  value={guest.name}
  onChange={(e) => updateGuest(0, 'name', e.target.value)}
  className={`w-full px-3 py-2 mb-2 rounded-lg border 
    guest-name-input      // ← Generic class for all name inputs
    guest-name-input-0    // ← Specific class for this index
    ${isDark ? 'bg-gray-700' : 'bg-white'}
  `}
/>
```

### Tour Provider (TourProviderComponent.jsx)
```javascript
element: () => findVisibleElement(".guest-name-input-0")  // ← Function finds visible input
```

---

## Troubleshooting

### Tour highlights on wrong element
- **Cause**: Multiple elements with same class, static selector picks first (hidden) one
- **Solution**: Use `element: () => findVisibleElement(".selector")`

### Modal doesn't appear before next step
- **Cause**: Advance triggered before modal renders
- **Solution**: Increase delay for modal-opening elements to 1000ms

### Tour works on desktop but not mobile
- **Cause**: Mobile-specific classes missing
- **Solution**: Add classes to mobile variant elements too

### Tour breaks after navigation
- **Cause**: Back button allowing backward navigation
- **Solution**: Use `showButtons: ["next", "close"]` after navigation

### Input event not detected
- **Cause**: Event listener not attached or detached too early
- **Solution**: Use { once: true } in addEventListener to auto-remove after first trigger

---

## Performance Tips

1. **Lazy Load Forms**: Use Suspense to load forms only when needed
2. **Debounce Visibility Checks**: Cache results if calling frequently
3. **Cleanup Listeners**: Always remove event listeners in cleanup
4. **Use RequestAnimationFrame**: For complex DOM queries
5. **Minimize Re-renders**: Tour state shouldn't trigger full app re-renders

---

## Browser Compatibility

- **Chrome/Edge**: Full support ✅
- **Firefox**: Full support ✅
- **Safari**: Full support ✅
- **Mobile Safari**: Full support ✅
- **Android Chrome**: Full support ✅

The `getBoundingClientRect()` API used for visibility checks is supported in all modern browsers.

---

## Key Learnings

1. **Dynamic > Static**: Functions beat static strings for modern UIs
2. **Visibility Matters**: Always check if element is actually visible before highlighting
3. **Delays Are Critical**: Modal/form rendering needs time; 1000ms is safe for most cases
4. **Mobile-First Thinking**: Design tour assuming responsive layout from start
5. **Classes Over Selectors**: Descriptive classes are more maintainable than complex selectors
6. **Navigation Awareness**: Tours need to know when pages change and adapt
7. **User Control**: Interactive steps need clear CTAs; don't auto-advance everything

---

## Reference Implementation

Full working implementation is available in:
- `/src/config/tourSteps.js` - Step definitions
- `/src/components/TourProviderComponent.jsx` - Driver.js integration
- `/src/hooks/useTour.js` - State management
- `/src/styles/driverTour.css` - Custom styling

---

## Future Enhancements

- [ ] Add tour pause/resume functionality
- [ ] Implement tour progress tracking (localStorage)
- [ ] Add skip tour option
- [ ] Create tour analytics
- [ ] Add multi-language support for tour text
- [ ] Implement conditional steps based on user role
- [ ] Add video tutorials alongside tour
- [ ] Create admin panel to edit tours without code changes

---

Last Updated: February 8, 2026
Version: 1.0 (Production Ready)
