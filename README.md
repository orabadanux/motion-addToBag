# 🛍️ Add to Bag Animation – React + Rive

This is a product animation built with **React**, **Framer Motion**, **Rive**, and **html-to-image**. The animation simulates a button transforming into a shopping bag, including a dynamic cart icon update.

## ✨ Features

- **Rive integration**: Handles front and back animations for a shopping bag.
- **Animated product screenshot**: Uses `html-to-image` to capture the product card and animate it into the bag.
- **Framer Motion transitions**: Adds anticipation, blur, skew, and scale animations for a tactile feel.
- **Live cart badge**: The bag icon in the top-right corner updates with a badge and pulse effect.
- **Precise hit area**: Only the visual button area is clickable, even though the Rive asset covers more.

## 📦 Stack

- [React](https://reactjs.org/)
- [Rive](https://rive.app/)
- [Framer Motion](https://www.framer.com/motion/)
- [html-to-image](https://www.npmjs.com/package/html-to-image)
- Tailwind CSS

## 🧱 Structure

- `App.tsx`: Main animation logic, product card, and click handling
- `BagAnimation.riv`: Rive asset containing the shopping bag animation (front and back artboards)
- `/assets`: Static files (videos, icons, UI overlays)

## 🧠 Key Concepts

### 👜 Rive Setup

The Rive bag animation is split into two layers:
- `FrontArtboard` and `BackArtboard`
- Controlled independently to simulate the card entering between them

### 📸 Card Screenshot

The product card is captured via `html-to-image` and animated with:

- `anticipate`: Skews and scales the card
- `enter`: Shrinks and blurs into the bag
- `hidden`: Fades out

### 🧼 Cart Icon Badge

- Located top-right (uses `phosphor-react`)
- Animates only **after** bag closes
- Number and pulse animation sync perfectly

### 🧩 Click Target

- The Rive animation spans a large area
- A `56px` tall clickable zone is defined with `absolute bottom-[42px]`
- Prevents accidental clicks above the button

## 🚀 Run Locally

```bash
npm install
npm run dev
