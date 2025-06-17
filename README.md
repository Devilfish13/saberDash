# Saber Dash

Dashboard Layout:
1. Left Panel:
○ Can toggle between two modes: Edit Mode and Approval Mode.
This section contains the space to show regex extractions when in
Approve mode, and able to edit/delete/add new regex extractions
when in Edit mode.

2. Middle Section:
○ A simple text area containing random lorem ipsum text. Use an
NPM library (e.g., lorem-ipsum) to generate the text dynamically.
(this simulates the emails / documents our users see normally).

Functional Requirements:
1. Edit Mode:
○ Users can:
■ Add New Regex Extractions: Input regex patterns and save
them.
■ Edit Existing Regex Extractions: Modify previously added
regex patterns.
■ Delete Regex Extractions: Remove unwanted regex patterns.
○ On adding or editing a regex pattern, the application should
attempt to re-extract and display the matching terms from the
text.
2. Approval Mode:
○ A dropdown to select a specific regex extraction.
○ Extracted regex terms are displayed dynamically.
○ When "Approve" is clicked:
■ Clear and update the regex extraction statuses as approved.
■ Extract regex terms again from the text area if the content
changes.
3. Data Storage:

○ Use local storage for all data (e.g., regex patterns, extracted terms,
text area content).
○ No database connection is required.
4. Responsive Behavior:
○ Ensure seamless switching between Edit Mode and Approval Mode
without loss of data or UI glitches.

## Prerequisites

- Node.js 18 or later
- Yarn package manager

## Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/saberDash.git
cd saberDash
```

2. Install dependencies
```bash
yarn install
```

## Development

Run the development server:
```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Build for Production

Build the application:
```bash
yarn build
```

Start the production server:
```bash
yarn start
```

## Testing

Run tests:
```bash
yarn test
```

## Scripts

- `yarn dev` - Start development server
- `yarn build` - Build for production
- `yarn start` - Start production server
- `yarn lint` - Run ESLint
- `yarn test` - Run tests

## Tech Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
