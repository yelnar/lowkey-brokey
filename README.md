# Lowkey Brokey Telegram Mini App

## Introduction

Welcome to the Lowkey Brokey Telegram Mini App project! This repository contains the source code for an app designed for [Telegram Mini App Contest](https://t.me/contest/327).

To access the Lowkey Brokey Telegram Mini App, visit https://t.me/LowkeyBrokeyBot/app.

## Getting Started

### Project structure

This project is organized using pnpm workspaces and comprises two main components:

1. Telegram Mini App ([apps/tma](/apps/tma/))
2. Brokey SDK ([packages/brokey](/packages/brokey/))

### Prerequisites

Before you dive into developing your Telegram Mini App, make sure you have the following prerequisites in place:

1. **Node.js**: Ensure you have Node.js version 16.13 or higher installed on your machine. You can download it from nodejs.org.
2. **ngrok**: You'll need ngrok to expose your local development server to the internet. You can get ngrok from ngrok.com.

#### Creating a Mini App in Telegram

To use this Telegram Mini App, you'll first need to create a mini app associated with your Telegram bot. Here's how:

1. Open [BotFather](https://t.me/BotFather) on Telegram.
2. Create a new bot using the `/newbot` command and provide all the necessary details as instructed.
3. Once the bot is created, use the `/newapp` command to create an app associated with the newly created bot.
4. Your app will be accessible via a URL in the following format: `https://t.me/{bot-username}/{app-name}`.

### Installation

Follow these steps to set up your development environment and install project dependencies:

1. **Enable pnpm using corepack**:

If you haven't already enabled pnpm using corepack, you can do so by running the following command:

```bash
corepack enable
```

2. **Install project dependencies**:

Run the following command in your project's root directory to install the required dependencies:

```bash
pnpm install
```

### Development

Now that you've set up your environment and installed dependencies, it's time to start developing your Telegram Mini App.

#### Starting the Mini App Locally

To begin developing your mini app locally, use the following command:

```bash
pnpm dev
```

This command will start your mini app in development mode, allowing you to make changes and test them in real-time.

#### Linking Your App with Telegram Mini App

To integrate your local development server with your Telegram Mini App, follow these steps:

1. **Expose your local development server**:

Use ngrok to expose your local development server to the internet. Replace <port> with the port number your mini app is running on (e.g., 5173):

```bash
ngrok http <port>
```

2. **Configure your app in BotFather**:

- Open [BotFather](https://t.me/BotFather) on Telegram.
- Send the `/myapps` command to view your apps.
- Select your newly created app from the list.
- Click **Edit Web App URL** and paste the forwarding URL provided by ngrok.

With these steps completed, your Telegram Mini App will be linked to your local development environment, allowing you to test and develop your app seamlessly.

Happy coding, and enjoy building your Lowkey Brokey Telegram Mini App!
