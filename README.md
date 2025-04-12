# Personal Finance Dashboard

## Overview

This personal finance dashboard is a comprehensive web application built with React that helps users track their finances, manage budgets, and monitor savings goals. The project demonstrates my ability to create complex, interactive web applications with a focus on user experience and responsive design.

![Design preview for the Personal finance app](./preview.jpg)

## Features

- **Overview Dashboard**: At-a-glance view of financial status including balance, income, and expenses
- **Transaction Management**: View, search, sort, and filter transactions with pagination
- **Budget Tracking**: Create and manage budget categories with visual spending progress
- **Savings Goals**: Set up and track savings pots with visual progress indicators
- **Recurring Bills**: Monitor monthly bills with payment status and due date tracking
- **Responsive Design**: Optimized for all device sizes from mobile to desktop
- **Accessibility**: Full keyboard navigation support and WCAG compliance

## Technologies Used

- **React**: Frontend library for building the user interface
- **React Router**: For navigation and routing
- **CSS Modules**: For component-specific styling
- **Context API**: For state management across components
- **Local Storage**: For persistent data without a backend
- **Chart.js**: For data visualizations
- **Jest & React Testing Library**: For unit and integration testing

## Development Process

This project was approached with a focus on component reusability and maintainable code structure. I implemented:

- Mobile-first responsive design
- Accessible UI with ARIA attributes and keyboard navigation
- Modular components with clear separation of concerns
- Comprehensive test coverage for critical functionality
- Clean, documented code following best practices

## Installation and Setup

1. Clone the repository
2. Install dependencies with `npm install`
3. Start the development server with `npm start`
4. Build for production with `npm run build`

## Challenges and Solutions

Building this application presented several challenges:

1. **Complex Data Relationships**: Transactions needed to connect with budgets and recurring bills, requiring careful state management.
2. **Data Visualization**: Implementing interactive charts while maintaining performance across devices.
3. **Form Validation**: Creating a robust validation system for all user inputs.

These challenges were addressed through thoughtful component architecture, selective rendering, and custom validation hooks.

## Future Enhancements

- Backend integration for data persistence
- User authentication system
- Financial insights and analytics
- Dark mode theme
- Export functionality for financial reports


## License

This project is open source and available under the [MIT License](LICENSE).
