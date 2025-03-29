# StoryAI - The AI Story Generator

**StoryAI** is an innovative web application that leverages the power of artificial intelligence to create dynamic and engaging stories. Whether you’re interested in crafting a narrative from a prompt, generating user decision-based stories, converting stories into audiobooks, or creating immersive video stories, StoryAI provides an easy-to-use and powerful platform for all your storytelling needs.

## Features

StoryAI offers the following features:

- **Create Story by Prompt**  
  Easily generate a story by simply entering a prompt. The AI will create an engaging narrative based on your input.

- **Create User Decision Based Story**  
  Build interactive stories where users can make decisions that influence the storyline. Create multiple story paths and outcomes based on user choices.

- **Create Audiobooks**  
  Convert your generated stories into audiobooks, allowing you to listen to your stories on the go.

- **Create Video Stories**  
  Generate video stories that combine AI-generated narration, visuals, and animations, bringing your stories to life in video format.

## Tech Stack

### Frontend

- **Next.js**  
  A modern React framework that supports server-side rendering (SSR) and static site generation (SSG), optimizing the performance of our application.
  
- **TypeScript**  
  A superset of JavaScript that ensures type safety and helps in building scalable, maintainable code by reducing errors during development.
  
- **ShadCN UI**  
  A versatile and customizable UI library designed for building visually appealing, responsive, and accessible user interfaces.

- **Framer Motion**  
  A powerful library for creating smooth animations and interactive UI transitions, enhancing the user experience.

### Backend

- **Node.js**  
  A JavaScript runtime built on Chrome's V8 engine that allows for building scalable and high-performance backend services.

- **Express.js**  
  A minimal and flexible Node.js web application framework that helps in building robust RESTful APIs.

### Database & ORM

- **MongoDB**  
  A NoSQL database used to store flexible and scalable data in JSON-like documents, making it ideal for dynamic content like stories.

- **Prisma**  
  A modern Object-Relational Mapping (ORM) tool that simplifies database management, query optimization, and supports MongoDB integration.

### Authentication & Security

- **Clerk**  
  A secure authentication and user management system that provides easy-to-implement login, registration, and user management functionality.

- **JWT & OAuth**  
  Industry-standard protocols for secure API authentication and authorization, ensuring the security and privacy of user data.

### Other Tools & Libraries

- **Zustand**  
  A small but fast state management library for React, providing a simple API for handling global app state.

- **React Query**  
  A powerful library for managing server-state in React applications, optimizing data fetching, caching, and synchronization.

- **Tailwind CSS**  
  A utility-first CSS framework that enables fast, responsive, and highly customizable design without writing a lot of custom CSS.

- **HTMLFlipBook**  
  A unique interactive book preview library that enables a storytelling experience with flipping pages and immersive presentation.

## StoryAI Description

StoryAI is designed to revolutionize the way stories are created. From simple prompts to complex user decision-based narratives, audiobooks, and video content, StoryAI empowers creators to build rich and personalized stories with minimal effort. The AI engine behind StoryAI generates compelling narratives, interactive storylines, and even converts them into audio and video formats, offering a fully immersive storytelling experience.

### How StoryAI Works

1. **Story Generation by Prompt**  
   Users can input a brief prompt, and StoryAI’s AI engine will generate a full-fledged narrative, including characters, plot, and setting. The AI analyzes the prompt to create a story that matches the user’s expectations.

2. **User Decision-Based Story**  
   With this feature, users can create branching storylines where readers or users make decisions that alter the outcome of the story. This creates a dynamic and interactive experience, perfect for games or interactive fiction.

3. **Audiobook Creation**  
   After generating a story, users can convert it into an audiobook format. The AI reads the story aloud with natural-sounding narration, creating a full audiobook experience for listening enjoyment.

4. **Video Story Generation**  
   StoryAI also has the capability to convert stories into video format, with animations, voiceovers, and dynamic visuals that bring the story to life in a cinematic way.

## Installation Guide

To run **StoryAI** locally, follow these steps:

### Prerequisites

Ensure you have the following installed:

- **Node.js** (v14.x or later)  
- **npm** (v6.x or later) or **yarn**

### Setup

1. Clone the repository:
```bash
git clone https://github.com/your-username/storyai.git
cd Story_Generator_Team_Null_Pointers
```

### 2️⃣ Install Dependencies
```sh
npm install
```

### 3️⃣ Setup Environment Variables
Create a **`.env`** file in the root directory and add the following variables:
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=YOUR_PUBLISHABLE_KEY
CLERK_SECRET_KEY=YOUR_SECRET_KEY

NEXT_PUBLIC_GEMINI_API_KEY=YOUR_GEMINI_API_KEY

NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/
```

> **Note:** Keep your `.env` file secure and never commit it to version control.

📧 Support
For any issues, feel free to create an Issue or contact us via email at:

Team Name: Team NULL POINTERS

Email:

kshirsagarpravin.1111@gmail.com

rutujd1111@gmail.com


### Made with ❤️ by the team null pointers