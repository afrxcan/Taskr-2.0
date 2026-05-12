# Taskr 2.0 — React Gold Edition

Taskr has evolved. Originally built as a vanilla HTML/CSS/JS project, this version is a complete rewrite using **React**. It moves away from direct DOM manipulation to a modern, state-driven architecture, featuring a refined "Gold Edition" aesthetic.

## The Migration: Vanilla to React

The transition to React wasn't just about changing the file extensions. It was about changing how the app "thinks."

* **State-Driven UI:** Instead of manually grabbing elements with `document.getElementById`, the UI now reacts automatically to changes in state.
* **Component Architecture:** The app is broken down into reusable logic blocks (like `TaskCard` and `EditModal`), making the codebase much cleaner.
* **Improved Performance:** Using hooks like `useMemo` ensures that task filtering and sorting only happen when necessary, keeping the app snappy even with many tasks.

## ✨ New & Improved Features

This version introduces several "Gold Edition" features that weren't possible in the basic version:

* ** Task Pinning:** Keep your most critical tasks at the very top of the list regardless of category.
* ** Priority Levels:** Assign **High, Medium, or Low** priority to tasks, color-coded for quick scanning.
* ** Due Dates & Notes:** Add detailed context and deadlines to every task via the new Edit Modal.
* ** Deep Editing:** A dedicated modal allows you to update task text, category, priority, and notes in one place.
* ** Premium Theme:** A sophisticated dark-and-gold aesthetic with improved typography (`Cinzel` and `DM Mono`).
* ** Smart Persistence:** Tasks and their new metadata (priority, notes, pinned status) still persist through `localStorage`.

## 📂 Project Structure

```text
Taskr-2.0/
├── src/
│   ├── App.jsx        → Main layout and high-level logic
│   ├── Taskr.jsx      → The core Taskr component (state, handlers, modal)
│   ├── main.jsx       → React entry point
│   ├── App.css        → Layout-specific styles
│   └── index.css      → Global variables and base "Gold" theme
├── public/            → Static assets and icons
└── index.html         → The root HTML template

```

## Technical Growth

Building this version helped bridge the gap between basic scripting and full-scale application development. Key concepts implemented:

* **Hooks:** Managing complex state with `useState` and side effects with `useEffect`.
* **Ref Management:** Using `useRef` for handling clicks outside of modals and managing focus.
* **Computed State:** Leveraging `useMemo` for efficient category filtering.
* **Conditional Rendering:** Dynamically showing/hiding empty states and specific task sections (like the Pinned section).

## 🛠️ How to Run

1. **Install Dependencies:**
```bash
npm install

```


2. **Start Dev Server:**
```bash
npm run dev

```


3. **Build for Production:**
```bash
npm run build

```



## 🤝 Credits

**Ernest** — Lead Developer

Rewrote the logic from the ground up to move from vanilla JS to React during my IT course (Jan–Jul 2026).

**Vite + React** — The engine behind the "Gold Edition."

---