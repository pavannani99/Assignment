# Button Color Assignment

## Overview
This project implements a button color assignment feature using ReactJS. When a button is clicked, it assigns the next color in sequence from a predefined list of colors and disables the button after it is clicked. The process repeats for subsequent button clicks, assigning colors in sequence to whichever buttons are clicked.

## Features
- Displays 9 buttons in a 3x3 grid
- Assigns colors sequentially to clicked buttons
- Disables buttons after they're clicked
- Visual indication of which color will be assigned next
- Progress tracking of color assignments
- Reset functionality to start over
- Undo feature to revert the last color assignment
- Timer to track completion time
- Keyboard navigation support (arrow keys and Enter)
- Responsive design

## Technologies Used
- ReactJS
- CSS3
- JavaScript (ES6+)

## Live Demo
The live application is deployed at: [Button Color Assignment on Render](https://assignment-2azr.onrender.com)

## Development
1. Clone the repository
2. Install dependencies: `npm install`
3. Start development server: `npm start`
4. Build for production: `npm run build`

## Project Structure
- `src/App.js` - Main application component
- `src/ButtonColorAssignment.jsx` - Core feature implementation
- `src/ButtonColorAssignment.css` - Styling for the component
- `src/index.js` - Application entry point

## Assignment Requirements
This project was created as part of an assignment with the following requirements:
- Display 9 buttons
- Maintain a list of colors
- When a button is clicked: 
  1. Assign the next color in sequence from the colors list to the button
  2. Disable the button after it is clicked
- Repeat the process for subsequent button clicks
