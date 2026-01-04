# AGENTS.md

## Project Overview

This is a NestJS application designed to manage household savings. It provides functionalities for user authentication, household management, transaction tracking, and notifications.

## Project Structure

The project is organized into several modules, each responsible for a specific set of features:

- **`auth`**: Handles user authentication, including registration, login, and Google OAuth2 integration.
- **`categories`**: Manages transaction categories.
- **`household`**: Manages household information, including members and savings goals.
- **`notifications`**: Sends notifications to users about important events.
- **`transaction`**: Manages financial transactions, including income and expenses.
- **`users`**: Manages user profiles and settings.

All modules are imported and configured in the root `app.module.ts` file.

## Running the Project

To run the project, you need to have Node.js and pnpm installed.

1. **Install dependencies**: `pnpm install`
2. **Set up environment variables**: Create a `.env` file in the root of the project and add the required environment variables. You can find a list of all required variables in `src/app.module.ts`.
3. **Run the project in development mode**: `pnpm run start:dev`

The application will be available at `http://localhost:3000`.

## Running Tests

The project uses Jest for testing. You can run the tests using the following commands:

- **Unit tests**: `pnpm run test`
- **End-to-end tests**: `pnpm run test:e2e`

## Database

The project uses a PostgreSQL database. The database schema is managed by TypeORM, and the entities are located in each module's `entities` directory. When running the application in a non-production environment, the database schema is automatically synchronized.

## Contributing

When contributing to this project, please follow these guidelines:

- **Coding style**: Adhere to the coding style defined in the `.eslintrc.js` and `.prettierrc` files.
- **Commit messages**: Use conventional commit messages to ensure a clear and consistent commit history.
- **Pull requests**: Create a pull request for each new feature or bug fix. Provide a detailed description of the changes and link to any relevant issues.
- **Code reviews**: All pull requests must be reviewed and approved by at least one other contributor before being merged.
