---
author: Jose Sanchez
title: Creating a Telegram Bot
description: A guide on how to create and deploy a Telegram bot using Go
pubDatetime: 2024-11-12T13:22:00Z
modDatetime: 2024-11-12T13:52:47.00Z
slug: telegram-bot
featured: true
draft: false
tags:
  - programming
  - go
  - Continuos Deployment
  - DevOps
---

## Table of contents

## Introduction

Telegram bots have become indispensable tools for automating tasks, providing instant user interaction, and integrating with continuous deployment (CD) pipelines. In this blog, we’ll explore the steps to create a Telegram bot using Go, detailing two approaches: **polling** and **webhooks**. Whether you’re just starting with bots or looking to streamline your deployment process, this guide has you covered.

## Why Build a Telegram Bot?

Telegram bots are incredibly versatile. Here are some reasons to use them:

- **Ease of Use**: With Telegram’s BotFather, creating and managing bots is straightforward.
- **Always-On Capabilities**: Running a small server instance ensures your bot is available 24/7.
- **Seamless Integration**: Bots can act as intermediaries between your CI/CD system and team members, sending updates or handling commands.

Let’s dive into the two primary ways to interact with Telegram’s API: **polling** and **webhooks**.

---

## Polling Approach: A Simple Start

Polling is the simplest method to get your bot up and running. It involves making regular requests to the Telegram API to check for new updates.

### Code Example: Polling Implementation in Go

Below is a basic implementation of polling in Go:

```go
package main

import (
	"log"
	"os"

	"github.com/go-telegram-bot-api/telegram-bot-api"
)

func main() {
	// Load your Telegram bot token from environment variables
	token := os.Getenv("TELEGRAM_BOT_API_TOKEN")

	// Initialize the bot
	bot, err := tgbotapi.NewBotAPI(token)
	if err != nil {
		log.Fatal(err)
	}

	// Log bot information
	log.Printf("Authorized on account %s", bot.Self.UserName)

	// Configure updates with a timeout
	u := tgbotapi.NewUpdate(0)
	u.Timeout = 60

	// Start receiving updates
	updates, err := bot.GetUpdatesChan(u)
	if err != nil {
		log.Fatal(err)
	}

	for update := range updates {
		if update.Message == nil {
			continue
		}

		// Handle group messages
		if update.Message.Chat.IsGroup() || update.Message.Chat.IsSuperGroup() {
			log.Printf("Received message: %s", update.Message.Text)

			// Respond to commands
			if update.Message.IsCommand() && update.Message.Command() == "start" {
				msg := tgbotapi.NewMessage(update.Message.Chat.ID, "Hello! I'm here to assist.")
				bot.Send(msg)
			}
		}
	}
}
```

### Key Points

- **UpdateConfig**: Sets how frequently the bot checks for new updates.
- **Error Handling**: Logs any issues to prevent the bot from crashing silently.
- **Group Messages**: Demonstrates how to process messages specifically from groups.

While polling is easy to set up, it isn’t the most efficient method for high-frequency updates. For better scalability, consider webhooks.

---

## Webhook Approach: Efficient and Scalable

Webhooks allow Telegram’s servers to notify your bot whenever there’s a new update, eliminating the need for constant polling. This is especially useful for production environments with high traffic.

### Setting Up the Webhook

Before diving into the code, configure your webhook using an HTTP POST request. For simplicity, we’ll use [HTTPie](https://httpie.io/), a user-friendly tool for making HTTP requests:

```bash
http POST https://api.telegram.org/bot<Your-Bot-Token>/setWebhook url=<Your-Webhook-URL>
```

Replace `<Your-Bot-Token>` and `<Your-Webhook-URL>` with your actual bot token and the public URL where your bot is hosted.

### Code Example: Webhook Implementation in Go

Here’s how to implement webhooks in Go:

```go
package main

import (
	"encoding/json"
	"log"
	"net/http"
	"os"

	"github.com/go-telegram-bot-api/telegram-bot-api"
)

var bot *tgbotapi.BotAPI

func initBot() {
	var err error
	token := os.Getenv("TELEGRAM_BOT_API_TOKEN")
	bot, err = tgbotapi.NewBotAPI(token)
	if err != nil {
		log.Fatalf("Error initializing bot: %s", err)
	}
	log.Printf("Authorized as %s", bot.Self.UserName)
}

func webhookHandler(w http.ResponseWriter, r *http.Request) {
	var update tgbotapi.Update
	err := json.NewDecoder(r.Body).Decode(&update)
	if err != nil {
		http.Error(w, "Failed to parse update", http.StatusBadRequest)
		return
	}

	if update.Message != nil && update.Message.Chat.IsGroup() {
		log.Printf("Message received: %s", update.Message.Text)

		if update.Message.IsCommand() && update.Message.Command() == "start" {
			msg := tgbotapi.NewMessage(update.Message.Chat.ID, "Hello! I'm here to assist.")
			bot.Send(msg)
		}
	}
	w.WriteHeader(http.StatusOK)
}

func setWebhook() {
	webhookURL := "https://yourdomain.com/webhook" // Replace with your actual webhook URL
	_, err := bot.SetWebhook(tgbotapi.NewWebhook(webhookURL))
	if err != nil {
		log.Fatalf("Error setting webhook: %s", err)
	}
	log.Printf("Webhook set: %s", webhookURL)
}

func main() {
	initBot()
	setWebhook()

	http.HandleFunc("/webhook", webhookHandler)
	log.Fatal(http.ListenAndServe(":8080", nil))
}
```

### Key Points

- **Webhook URL**: Must be accessible via HTTPS.
- **JSON Parsing**: Processes incoming updates in a structured format.
- **Web Server**: Listens for incoming requests from Telegram.

---

## Choosing the Right Approach

- **Polling**: Ideal for small-scale or experimental bots due to its simplicity.
- **Webhooks**: Preferred for production environments, as it reduces server load and latency.

---

## Conclusion

Building a Telegram bot with Go is a powerful way to automate tasks and integrate with modern deployment pipelines. Whether you choose polling for simplicity or webhooks for scalability, Telegram’s API makes it straightforward to get started. Try creating a bot today to enhance your projects!

---
