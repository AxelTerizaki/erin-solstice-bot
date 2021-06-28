# Erin Discord Bot

[Innkeeper] discord bot

The bot is currently a Level 1 bot.

Discussing dev happens on the [Nanami Discord here](http://nanami.fr/discord)

## Features (skills)

Implemented right now :

- [Skill: Role Distribution] Auto-assignable roles
- [Skill: User Leaderboards] User XP/Level leaderboards
- [Skill: Perfect Reminder] Reminders

These are planned features, for now none are implemented (see issues)

- [Skill: Warm Welcome] Custom and random welcome / leave messages for your users
- [Skill: The Public Is Right] User polls
- [Chess Commentator] class
- [Skill: Currency management]
- [Inn: Rec Room] with different activities

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

### Reminders

#### remind <date> <text>

Ask Erin to remind you of something for later

`<date>` can either be a date, like `2021-06-05 12:01` or a number and unit. Like, to get reminded in 2 weeks, use `2w`. Valid time units are d, M, w, y, h, m, s.

Aliases: `reminder`, `remindme`

Example: `!remind 2h Go water the Faerie Flowers`

#### reminders

List your reminders with their IDs.

#### forgetreminder

Make Erin forget a reminder you previously set.

Aliases: `forget`, `delreminder`

Example: `!forgetreminder 26`

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
