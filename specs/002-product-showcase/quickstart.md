# Quickstart: Product Showcase Validation

This guide explains how to locally validate the Product Showcase feature.

## Prerequisites
- Node.js 18+
- The project dependencies installed (`npm install`)

## Run the Application
1. Start the development server:
   ```bash
   cd frontend
   npm run dev
   ```
2. Open your browser to `http://localhost:3000/#products`

## Validation Scenarios

### 1. Sticky Scroll
- **Action**: Scroll down slowly from the Hero section.
- **Expected**: The screen layout should snap to a dual-pane view. On the left (or right for RTL), the text description updates. On the other side, the visual product mockup animates into view smoothly without jank.

### 2. Localization
- **Action**: Use the language switcher to change from English to Arabic.
- **Expected**: The layout correctly mirrors (RTL). Text aligns properly. `col-span` configurations in the Bento Grid remain stable but visual ordering flips.

### 3. CTA Routing
- **Action**: Click "Talk to Aivora AI".
- **Expected**: The AI Assistant chat window opens overlaying the screen.
- **Action**: Click "Start Your Project".
- **Expected**: You navigate to the contact form.
