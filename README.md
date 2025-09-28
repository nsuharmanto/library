# Booky Library Web App

A modern library web application built with React, TypeScript, Tailwind CSS, and shadcn/ui.

## MVP Features

- **Authentication:** Login & Register (token saved in Redux)
- **Book List:** Browse books, filter by category, and search
- **Book Detail:** View book details, stock, reviews, and borrow button
- **My Loans:** See your borrowed/returned books and due dates
- **My Profile:** View and update user data, loan statistics
- **Review:** Add and delete book reviews
- **Optimistic UI:** Stock decreases instantly when borrowing
- **Loading & Error States:** Consistent feedback across all pages
- **Responsive Design:** Works on desktop and mobile

## Tech Stack

- **React + TypeScript:** Main framework & type safety
- **Tailwind CSS:** Fast, responsive styling
- **shadcn/ui:** Ready-to-use UI components
- **Redux Toolkit:** State management (auth, UI, cart)
- **TanStack Query:** Data fetching & caching
- **Day.js:** Date formatting
- **(Optional) Framer Motion:** UI transitions & animation

## Main Pages & Flow

| Page           | Main Features                                 |
|----------------|-----------------------------------------------|
| Login/Register | Form, token storage                           |
| Book List      | List, filter, search                          |
| Book Detail    | Info, stock, reviews, borrow                  |
| My Loans       | Borrowed/returned books, status, due date     |
| My Profile     | User data, loan statistics                    |
| (Optional) Cart| Borrow multiple books at once                 |

**Main Flow:**
1. Login/Register → save token  
2. Browse Books → filter/search → click detail  
3. Borrow Book → stock decreases (optimistic)  
4. Add Review → appears instantly  
5. My Loans → check status & due date  
6. My Profile → update profile, view statistics  

## State Management

- **Redux Toolkit**
  - `authSlice`: token & user data
  - `uiSlice`: filter & search
  - `cartSlice` (optional): books to borrow
- **TanStack Query**
  - `useQuery`: fetch books, details, loans
  - `useMutation`: login, borrow, review
  - Optimistic updates for fast UX

## UX/UI Guidelines

- Use shadcn/ui for consistent components
- Tailwind for responsive layouts
- Show loading & error states everywhere
- Use toast/snackbar for feedback
- Format dates with Day.js

## Getting Started

1. **Install dependencies**
   ```
   npm install
   ```
2. **Run locally**
   ```
   npm start
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

3. **Run tests**
   ```
   npm test
   ```

4. **Build for production**
   ```
   npm run build
   ```

## Folder Structure

- `src/components/` – Reusable UI components (Header, Button, etc)
- `src/Pages/` – Main pages (Home, Login, Register, Book Detail, etc)
- `src/lib/` – Utility functions

## Tips

- Work step-by-step: auth → list → detail → loans → profile  
- Commit each feature for easy progress tracking  
- Start with a simple design, polish the UI later  
- You can deploy to Vercel so everyone can try it  

## License

MIT

---

*This MVP covers all essential library features: authentication, book browsing, borrowing, reviews, and user loan management. For more, see the roadmap or contribute!*