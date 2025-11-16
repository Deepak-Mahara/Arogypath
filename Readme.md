# Ayurveda Diet App

A cross-platform application that helps users discover personalized diet recommendations based on Ayurvedic principles (dosha type, seasonal adjustments, and digestive strength). This repository contains the app code, configuration, and resources needed to run and extend the project.

## Features
- Dosha-based diet recommendations (Vata, Pitta, Kapha)
- Meal plans and recipes tailored to seasons and digestion
- User profile for tracking preferences and restrictions
- Searchable recipe database with tags (e.g., gluten-free, vegan)
- Admin interface for content management (recipes, tips)
- Localization-ready strings

## Tech stack
- Frontend: React / React Native (web + mobile)
- Backend: Node.js / Express (REST API)
- Database: PostgreSQL or SQLite for local development
- Optional: Docker for containerized development

## Getting started

Prerequisites
- Node.js (LTS)
- npm or yarn
- PostgreSQL (or use SQLite for local dev)
- Git

Basic setup
```bash
# clone the repo
git clone <repo-url>
cd ayurveda-diet-app

# install dependencies
npm install

# copy environment template and edit
cp .env.example .env

# run database migrations (example)
npm run migrate

# start development server
npm run dev