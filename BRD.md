# Business Requirements Document: Issue Tracker

## Project Overview

The Issue Tracker is a web application where a team can record problems or tasks ("issues"), assign them to people, follow their progress and discuss them.

## Objective

Teams often track work in chats or spreadsheets, so it is unclear who owns what and what state it is in. This application gives one shared place where every issue has an owner, a status and a discussion history.

## Users

**User**
- Registers, logs in and out
- Creates issues; edits and deletes their own issues
- Views all issues and the issues assigned to them
- Assigns issues to other users and changes issue status
- Adds and reads comments
- Sees a personal dashboard with issue counts

**Admin**
- Everything a user can do, plus:
- Admin dashboard with overall statistics (users and issues)
- Views all users
- Views, assigns, changes status of, and deletes any issue

Admin accounts cannot be created through public registration; they are created by the seed script.

## Main Features

- Authentication with hashed passwords and JWT tokens
- Issue management (create, view, edit, delete, assign, change status)
- Comments on issues
- Role-based navigation and dashboards in a single application

## Basic Requirements

1. Users can register, log in and log out; passwords are never stored in plain text.
2. Protected pages and APIs require authentication.
3. An issue has a title, description, status (Open, In Progress, Closed), creator, assignee and created/updated timestamps.
4. An issue can be assigned to any registered user, and creator, assignee and status are shown clearly.
5. A comment has text, author and creation time, and is shown on the issue details page.
6. Users see counts: Total, Open, In Progress, Closed, Assigned to Me.
7. Admins see counts: Total Users, Total Issues, Open, In Progress, Closed.
8. Only the creator or an admin can edit/delete an issue; only admins can see the full user list. These rules are enforced in the API, not just hidden in the UI.

## Deployment

- **Hosting:** Vercel (separate projects for `client` and `server`)
- **Database:** MongoDB Atlas
- **Approach:** the repository is connected to Vercel; the server project has `MONGODB_URI`, `JWT_SECRET` and `CLIENT_URL` set, and the client project has `VITE_API_URL` set.
- **Deploy/update:** push to the connected Git branch and Vercel redeploys. Detailed steps are in `README.md`.
