Flashcard App
Description
The Flashcard App allows users to create, manage, and review flashcards. The application stores flashcards in groups, supports image uploads, and persists data across sessions using localStorage. Users can dynamically add terms, edit their details, and view them in a clean, responsive interface.

Features
Flashcard Creation: Create flashcards with titles, descriptions, and terms. Optionally, add images to terms.

Persistent Storage: Flashcards are stored in localStorage and Redux for session persistence.

Dynamic Routing: View, edit, and study flashcards through clean, navigable routes.

Flashcard Study Mode: Navigate through terms, with image previews, shareable links, and print/download options.

Responsive UI: Tailwind CSS ensures a mobile-friendly experience.

Components
CreateFlashcard.jsx: Manages form state for creating new flashcards and dispatches them to Redux.

FlashcardForm.jsx: Handles the group-level data (title, description, image), includes Base64 conversion for images.

TermForm.jsx: Allows dynamic term editing with real-time validation and localStorage syncing.

MyFlashcards.jsx: Displays a list of flashcards fetched from Redux.

FlashcardDetails.jsx: Displays detailed flashcard and terms data.

FlashcardView.jsx: Allows users to navigate through terms in a study-like mode with additional actions (share, download).

ShareModal.jsx: Modal for sharing the flashcard link via clipboard.

Setup and Installation
Clone this repository.

Install dependencies:
npm install

Start the development server:
npm start

Usage
Create Flashcards: Go to /create to add new flashcards.

View Flashcards: Go to / to view all flashcards.

Study Flashcards: Click on any flashcard to view its details or navigate through its terms.

Contributing
Feel free to fork the repository, submit pull requests, or open issues for any improvements or bugs.
