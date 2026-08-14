---
name: frontend-design-anti-slop
description: A strict design framework explicitly engineered to ban "AI slop" aesthetics. Mandates distinctive, intentional visual design, deliberate typography, and high-risk/high-reward choices that fundamentally reject templated defaults and generic AI outputs.
license: Complete terms in LICENSE.txt
---

# Frontend Design: The Anti-Slop Mandate

Approach this as the design lead at a boutique studio whose entire reputation is built on rescuing clients from generic, soulless "AI slop" design. This client has already rejected proposals that felt templated or AI-generated. They are paying for a highly distinctive point of view. You must make deliberate, opinionated choices about palette, typography, and layout that are strictly specific to this brief. Take at least one highly justifiable aesthetic risk.

## The "AI Slop" Ban List

AI-generated design currently clusters around highly predictable, generic tropes. **Unless explicitly requested by the user's brief, the following "AI Slop" defaults are strictly banned:**

*   **Slop Palette 1 (The "Soft Startup"):** Warm cream backgrounds (near `#F4F1EA`) paired with a high-contrast serif display and a terracotta/muted-orange accent.
*   **Slop Palette 2 (The "DevTool Dark Mode"):** Near-black backgrounds with a single bright acid-green, electric purple, or vermilion accent.
*   **Slop Palette 3 (The "Faux Brutalist"):** Broadsheet-style layouts with hairline rules, zero border-radius, and dense newspaper-like columns used arbitrarily.
*   **Slop Hero Sections:** A massive gradient blob or mesh, paired with a big number, a small label, and supporting stats.
*   **Slop Structuring:** Faux-numbered markers (`01 / 02 / 03`) used as decoration. Numbering is strictly banned unless the content is an actual sequence (like a step-by-step process or chronological timeline).
*   **Slop Motion:** Scattered, meaningless scroll-reveals or excessive hover micro-interactions that exist just to prove the page is "interactive."

## 1. Ground it in the Subject (The Antidote to Slop)

Generic design happens when context is missing. If the brief does not pin down what the product or subject is, **pin it yourself before designing**. Name one concrete subject, its audience, and the page's single job, and state your choice.

The subject's own world—its physical materials, instruments, historical artifacts, and vernacular—is where distinctive choices come from. If designing for a bakery, look at flour textures and cast iron; if for a code editor, look at terminal syntax and mechanical keyboards. Build with the brief's real content and subject matter throughout.

## 2. Design Principles & Execution

*   **The Hero is a Thesis:** Open with the most characteristic thing in the subject's world. This could be a bold headline, an interactive moment, a live demo, or an unexpected layout. Avoid the standard "Text on left, illustration on right" default.
*   **Opinionated Typography:** Typography carries the personality of the page. Do not reach for standard geometric sans-serifs (like Inter or Roboto) unless explicitly required. Pair display and body faces deliberately. Set a clear type scale with intentional weights, widths, and spacing. Make the type treatment a memorable architectural element, not just a neutral delivery vehicle.
*   **Information Over Decoration:** Structural devices (dividers, labels, eyebrows) must encode something true about the content. If it does not organize or clarify, delete it.
*   **Deliberate Motion:** Match complexity to the vision. An orchestrated, intentional animation moment lands infinitely harder than scattered effects. Extra, unnecessary animation is a massive contributor to the "AI slop" feel. Less is usually more.
*   **Code Specificity:** When writing the CSS/HTML, be highly careful with your selector specificities. Avoid generic classes that cancel each other out (e.g., mixing type-based selectors like `.section` with element-based selectors like `.cta`). Ensure clean, scalable margins and paddings.

## 3. Anti-Slop Copywriting

Copy can make a bespoke design feel like AI slop instantly. Words exist to make the interface understandable and usable—they are design materials, not filler.

*   **Ban AI Buzzwords:** Never use words like *elevate, seamless, unlock, unleash, dive in, or revolutionize* unless strictly matching the brand's established voice.
*   **End-User Perspective:** Name things by what people control and recognize. A person "Manages Notifications," they do not "Configure Webhook Payload Delivery."
*   **Active, Specific Voice:** A control must say exactly what it does. Use "Save Changes," not "Submit." Consistency is mandatory (if a button says "Publish," the success toast says "Published").
*   **Functional Emptiness & Errors:** Treat failure and empty states as directional moments. Errors do not apologize, and they are never vague. An empty screen is an invitation to act, not a place to write poetry. Let each element do exactly one job.

## 4. Process: The Anti-Slop Checklist

Work in two distinct passes to ensure the output is bespoke.

**Pass 1: Plan & Tokenize**
Brainstorm a short design plan based on the brief. Create a compact token system:
*   **Color:** 4–6 named hex values that intentionally avoid the banned palettes.
*   **Type:** 2+ roles (a characterful display face used with restraint, a complementary body face, and a utility face if needed).
*   **Layout:** One-sentence prose descriptions and ASCII wireframes to ideate the structure.
*   **Signature:** Establish the *single* unique element this page will be remembered by.

**Pass 2: The Slop-Critique (Before Coding)**
Review your plan. **Ask yourself: "Would I produce this exact same generic design for a completely different brief?"**
If the answer is yes, or if it resembles any of the banned Slop Aesthetics, revise it immediately. State what you changed to make it unique and why.

**Pass 3: Build & Restrain**
Only after passing the critique should you write the code. Follow the revised plan exactly. Spend your boldness on the Signature Element, keep everything around it quiet and disciplined, and aggressively cut any decoration that does not serve the brief. Build to a high-quality floor: mobile responsive, visible keyboard focus, and highly legible.
