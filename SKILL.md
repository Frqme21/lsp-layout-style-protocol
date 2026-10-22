---
name: lsp-layout-style-protocol
description: Design and implement clean, responsive, animated, engaging, reactive, and fluid frontend UX/UI. Use this skill whenever the user asks to design, build, style, redesign, animate, or improve a frontend interface, website, app screen, modal, onboarding flow, or interactive visual experience.
---

# LSP — Layout & Style Protocol

## Purpose

Create frontend experiences with clean UX/UI, responsive layouts, meaningful animation, engaging interactions, and fluid visual transitions. The result should feel deliberately designed and interactive rather than static, generic, or assembled from unrelated UI patterns.

## When to Use This Skill

Use this skill when the user asks for designing something, especially a frontend, website, application interface, sign-in page, information modal, onboarding flow, animated background, or any other interactive visual experience.

## Core Design Requirements

1. Design frontend UX/UI to be clean, responsive, animated, engaging, reactive, and fluid.
2. When the user asks for designing something, apply this skill.
3. Treat these requirements as the default design protocol unless the user explicitly asks otherwise.

## Logo-Aware Interactive Design

- If the user has a premade logo and you're making something like a sign in page information modal onboardibng or anything off that kind use that logo and make it go around the space e.g. (theres a login modal  it looks like logo below it a like LOGIN text below it a sign in button afteer the user clicks sign in move slide the logo to the middle constantly like it starts big saying  to login then when he clicks it slides up and so on moves around interactively like the attached html)
- Use the user's existing logo as an active part of the experience rather than leaving it as a static decoration. Make it move between meaningful layout states when the user interacts with the interface.
- Reference example: the attached HTML demonstrates a cinematic sequence where the central logo shrinks and glides toward a header, the brand name reveals itself letter by letter, a login form appears, and later states animate the logo into separate pieces and reassemble it. Use the interaction concept and fluid choreography as inspiration, not necessarily its exact visual theme or colors.

## Layered Media and Scroll Storytelling

- If the user has a asset like a video or a image instead off staticly leaving it in the page make some layers like add for example a forest that as u scroll down the foresh goes over the product or as u go down the video / image enlarges onto full screen and so on good examples are

  - https://www.oneplus.com/us/oxygenos16/
  - https://www.oppo.com/en/coloros17/
  - https://www.igloo.inc/
  - https://hidokmeh.com/
  - https://monochrome-aero.pages.dev/
  - https://head-less.pages.dev/
  - https://www.thisisgazzar.com/en
  - https://appmorphy.com/

- For shared-element transitions, use the browser's native `view-transition-name` where appropriate, or calculate FLIP (First, Last, Invert, Play) states so the transition is perfectly fluid, hardware-accelerated, and never clips.
- Avoid leaving provided video or image assets sitting statically in a page when they can meaningfully become part of a layered, scroll-driven visual story.
- Consider foreground/background depth, parallax, masks, scale transitions, and media that expands to fill the viewport as the user scrolls.
- Before creating a new image or video specifically for parallax or scroll-driven storytelling, ask the user whether they want you to generate an image or a video. Do not assume permission to generate media. If they decline, use existing assets, CSS, SVG, or another suitable non-generated approach.

## Visual Theme and Restraint

- dont make gradients like blue cyan and purple keep it minimal dark / lighty or a theme the user asked either dont spam liquid and frosted glass everywhere
- Avoid defaulting to blue/cyan/purple gradients. Keep the design minimal, dark or light, or aligned with the theme the user requested.
- Do not overuse liquid effects or frosted glass. Use effects only where they contribute to the design.
- Ask the user if he wants to blend some off the other theme into the product like make a small part off the site maybe like a faq background be the opposite color like dark theme site - light theme part to make constract but not too much dont do it if he says no and if u do make it if its a dark theme site and u do a light theme part make it a very low light white so it dosent burn the eyes
- If considering a contrasting theme section, ask the user whether they want to blend some of the opposite theme into the product. For example, a mostly dark site could use a small light-themed FAQ section for contrast. Do not do this if the user says no. Keep contrast restrained; if the site is dark and a light section is used, use a very low-light off-white so it does not burn the eyes.

## Writing Style Constraint
- dont make lines off text keep it minimal anything longer then 10 words in the above the fold off the site (hero + header)
- dont make huge text in the hero section like dont go  with "h1 the best SKILL.md file" make it minimal and dont put a sentence with for example "ONE GUI. ALL ACTIONS." dont do that
- Never use em dashes (—) in user-facing copy, UI text, documentation, or generated code comments. Rewrite the sentence with commas, parentheses, a colon, or a regular hyphen instead.

## Frameworks and Animation Libraries

- always use frameworks such as shadcn framer motion gsap anime.js and lenis.dev
- Choose appropriate tools from the user's stack. Use shadcn/ui for suitable component systems, Framer Motion for React animation, GSAP for complex timelines and   ScrollTrigger sequences, Anime.js for suitable motion effects, and Lenis for smooth scrolling.
- Do not blindly install or use every listed library when it is incompatible with the project or unnecessary; use the relevant tools that fit the existing framework and requested result.
- if the user askes make a background smooth scrolling animation using a custom made 3d model or using lines that connected or three.js for whatever the user is asking
- When the user asks for an animated background, consider a custom 3D model, connected lines, Three.js, or another approach that fits what the user is asking for.

## Glassmorphism Limit

- Limit glassmorphism to 1–2 glass assets per viewport, such as a navbar. Use a third only if necessary.

## Icons

- for icons use https://lordicon.com/ (animated) or lucide for static icons never emojis
- Use Lordicon for animated icons and Lucide for static icons. Never use emojis as interface icons.

## Layout and Spacing Rules

### Multiple of 8 Rule
Every margin, padding, and layout gap value must strictly be a multiple of 8px (e.g., 8px, 16px, 24px, 32px, 48px, 64px).

### No Sibling Margins
Never put top or bottom margins on adjacent items; use parent container gaps (`gap-*` or flex layout spacing) to handle vertical flow safely.

### Scroll Boundary Safety
Always use `overflow-x: hidden` on your outer layout wrapper to stop scaling images or moving logos from breaking mobile viewports.

### Component Padding Safe Zones
Every structural section component must maintain a minimum uniform vertical padding of 64px to 128px to give content clear room to breathe.

### Layout Isolation Bounds
Use `box-sizing: border-box` globally to prevent inside padding values from inflating your absolute width math.

### Fluid Screen Scaling
Use CSS `clamp()`, `vw`, and `vh` variables for font sizes and primary container widths so elements scale smoothly instead of snapping at rigid breakpoints.

### Line Length Limit
Never let a body text paragraph stretch past a maximum container width of `65ch` or `680px` for human scanning comfort.

### Minimum Click Targets
All interactive triggers, links, and layout action buttons must have a clear padding footprint of at least `44x44px` for precise touch ergonomics.
### call to actions
Call to action per element. dont make multiple call for actions or duplicate buttons dont say like "watch the trailer" then below make a "play trailer button" abundent.
beside that also dont make like for example your making a card. dont make all the components in the same color. but also dont make them all with a primary color make the primary call for action have a the primary color and eveverything else other colour
## Motion and Interaction Rules

### Easing
No Linear Animations: Ban all standard linear movements; execute every single UI transition, hover effect, and slide on a custom cubic-bezier(0.16, 1, 0.3, 1) easing curve.

Use this default easing curve for transitions and movement:

```css
cubic-bezier(0.16, 1, 0.3, 1)
```

Avoid `linear` easing for UI transitions, hover effects, and slides.
### Swipes, wipers, and movements.
make full screen wipers or transitions
### Hardware Acceleration
Hardware Acceleration Mandate: Always use `transform: translate3d()` or `opacity` modifications for kinetic logo paths to keep browser rendering at a locked 60/120fps.

Prefer `transform: translate3d()` and `opacity` for animated logo paths and other moving elements to keep animation rendering smooth and hardware-accelerated. Avoid animating expensive layout properties when a transform-based approach can achieve the same result.
### Strict Type Pair Separation
Limit layouts to exactly **one high-personality display font** (serif, brutalist grotesque, or geometric) for headers, paired exclusively with a highly legible, neutral geometric neo-grotesque for body paragraphs.

### OKLCH Color Space Mandate
Ban raw HEX or RGB color definitions for design accents. use the **OKLCH color system** (`oklch(L C H)`) to ensure completely smooth, perceptually uniform color gradients and accessible contrasts that never look muddy or washed out.
### Magnetic Component Threshold
Any isolated high-priority action button or floating menu toggle must calculate a mathematical **magnetic pull radius of 30px to 50px**, smoothly warping the target toward the user's cursor vector before snapping back fluidly on mouse-leave.
### Dynamic Asset Stage Preloaders
Explicitly forbid loading complex 3D assets, Lottie files, or heavy HTML5 videos inline. Require a **visual asset preloading state (percentage counter)** that holds the viewport block until all critical WebGL shaders and textures are fully compiled in the GPU cache.

### Asynchronous Text Layout First
Force code structures to initialize text DOM boundaries instantly while heavy decorative assets load asynchronously beneath them to guarantee an excellent **Largest Contentful Paint (LCP)** score.
### Subpixel Anti-Aliasing Enforcements
Force the inclusion of `-webkit-font-smoothing: antialiased`, `transform-style: preserve-3d`, and `backface-visibility: hidden` globally across all components undergoing CSS or GSAP transforms to prevent text blurs and micro-stuttering on Safari and mobile WebKit engine viewports.

### High-Frequency Resize Debouncing
When scaling canvas components or interactive SVG paths, bind layout updates to a **debounced window resize handler** using a 100ms to 150ms timeout threshold to prevent browser crashes or rendering glitches during viewport adjustments.
### Motion Reduction Media Queries
Wrap all intense kinetic animation strings, continuous WebGL canvas loops, and heavy parallax logic inside a `(prefers-reduced-motion: no-preference)` CSS or JS query block to ensure smooth, functional static fallback layouts for users with vestibular sensitivities.

### Screen Reader Attribute Mirroring
When animating shared-element DOM nodes off-screen or fading structural sections dynamically, explicitly match the visibility state with `aria-hidden="true"` and `tabindex="-1"` toggles.

### Continuous Scroll-Velocity Interpolation
Bind secondary decorative visual transformations—like image skew angles or text marquee speeds—directly to **instantaneous scroll velocity** values calculated dynamically from Lenis or custom `requestAnimationFrame` loops.

### Scroll-Driven Animation
(if the user askes for scrolling animations) Scroll-Driven Binding: Bind your parallax multi-layered assets (like zooming videos or foreground forest masks) directly to scroll progression using modern animation-timeline: scroll().

When the user asks for scroll animations, bind parallax and layered assets—such as zooming videos or foreground forest masks—to scroll progression using modern `animation-timeline: scroll()` where supported. If support or compatibility is a concern, use a suitable GSAP ScrollTrigger implementation or equivalent scroll-progress binding.

### State-Change Clarity
State Change Clarity: Explicitly write out smooth visual layout transitions for `:hover`, `:focus-visible`, and `:disabled` button properties.

Define clear visual states and smooth transitions for `:hover`, `:focus-visible`, and `:disabled` buttons. Ensure focus is visible, disabled controls are unmistakably disabled, and hover states do not replace keyboard accessibility.

### Lifecycle Cleanup
use correct lifecycle cleanup When instantiating GSAP ScrollTriggers, Lenis instances, or Three.js context loops, you must explicitly wrap them in cleanup hooks (e.g., React's useEffect return scope or gsap.context()) to completely prevent catastrophic memory leaks or frame rate crashes during re-renders.

When instantiating GSAP ScrollTriggers, Lenis instances, or Three.js animation/context loops, explicitly clean them up. In React, use a `useEffect` cleanup return or `gsap.context()` and revert/kill created animations, listeners, RAF loops, and instances as appropriate. Prevent memory leaks and frame-rate degradation during re-renders and unmounts.

## Implementation Checklist

Before considering the design complete, verify:
- Opengraph with image for Discord and e.t.c sites
- The UX/UI is clean, responsive, animated where useful, engaging, reactive, and fluid.
- Existing user-provided logos and assets are integrated intentionally and interactively where appropriate.
- Images and videos are treated as potential layers in a scroll-driven story, not automatically as static content.
- Before generating new parallax imagery or video, ask the user whether they want an image or video generated.
- User-facing copy contains no em dashes.
- Shared-element transitions use native View Transitions or FLIP when appropriate.
- The visual theme follows the user's requested theme and avoids excessive gradients, liquid effects, and frosted glass.
- Relevant frameworks and animation libraries are selected to fit the existing project.
- Glassmorphism is limited to 1–2 assets per viewport unless a third is genuinely necessary.
- Icons use Lordicon or Lucide, never emoji icons.
- Spacing values follow the 8px multiple rule.
- Parent gaps are used instead of adjacent sibling vertical margins.
- The outer layout wrapper prevents horizontal overflow.
- Structural sections have 64px–128px minimum vertical padding.
- Global `box-sizing: border-box` is applied.
- Fluid sizing uses `clamp()`, `vw`, and `vh` where appropriate.
- Body text stays within 65ch or 680px.
- Interactive targets are at least 44×44px.
- UI motion uses `cubic-bezier(0.16, 1, 0.3, 1)` rather than linear easing.
- Moving elements favor transforms and opacity.
- Scroll-driven animation is bound to scroll progression when requested.
- Hover, focus-visible, and disabled states are explicitly designed.
- GSAP, Lenis, and Three.js resources are cleaned up correctly.

## Reference HTML

The user supplied an HTML example titled Astra. It demonstrates the intended interaction style: a centered logo begins above a login button; after the user clicks, the logo shrinks and glides to the top while the brand name types in; a login form appears; submitting the form returns the logo to the center, splits the logo into four quadrant pieces that move to the corners, reveals a central card, and then reassembles the logo before showing a final success card. It also includes an ambient particle canvas, shockwaves, and optional synthesized UI sounds. Use this as an interaction reference when relevant, while adapting the styling and behavior to the user's. astra is a example for logo movement dont take inspiration from other parts off it.:
u can fetch/curl it at: https://obsidian-lps.pages.dev/astra_example
