# Erin Discord Bot

[Innkeeper] discord bot

The bot is currently a Level 1 bot.

Discussing dev happens on the [Nanami Discord here](http://nanami.fr/discord)

## Features (skills)

Implemented right now :

- [Skill: Self-assignable roles]
- [Skill: User leaderboards] User XP/Level leaderboards

These are planned features, for now none are implemented (see issues)

- [Skill: Random welcome / leave messages] Custom and random welcome / leave messages for your users
- [Skill: User polls]
- [Chess Commentator] class
- [Skill: Currency management]
- [Skill: Rec Room] with different activities

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

## Commands

### Auto assignable roles

#### roleadd <role>

Add a role to yourself.

Aliases: `r`, `role`, `assign`

Example: `!roleadd Overwatch`

#### roleremove <role>

Remove a role from yourself.

Aliases: `unassign`

Example: `!roleremove Overwatch`

#### roles

List all roles available to join or leave.

#### roleregister <role>

Add a new role to the list of auto assignable roles.

Aliases: `register`

Example: `!roleregister Left4Dead`

#### roleunregister <role>

Remove role from the auto assignable list

Aliases: `unregister`

Example: `!roleunregister Left4Dead`

### Currency

#### money

Display your current money. If sent in a DM, will display the money you have on each server y ou and Erin have in common.

Aliases: `m`

### Levels

#### levels

Display the top 15 people on the server

Aliases: `lvl`

#### level

Display your level and class, as well as XP and messages

#### setClass <class>

Set your own class to whatever you'd like.

Aliases: `sc`, `class`

Example: `!setClass Innkeeper`
