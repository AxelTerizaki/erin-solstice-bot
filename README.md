# Erin Discord Bot

[Innkeeper] discord bot

The bot is currently a Level 1 bot.

## Features (skills)

These are planned features, for now none are implemented (see issues)

- [Skill: Random welcome / leave messages] Custom and random welcome / leave messages for your users
- [Skill: User leaderboards] User XP/Level leaderboards
- [Skill: Self-assignable roles]

Later :

- [Skill: User polls]

## How to use

```sh
yarn install
```

Create a `data/config.json` file with the following JSON structure :

```JSON
{
  "token": "bot token here",
  "prefix": "!",
  "ownerID": "your discord ID"
}
```

Prefix is not used yet, and might not be used if we require slash commands.
