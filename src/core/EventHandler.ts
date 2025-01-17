import { ClientEvents, Collection, MessageEmbed } from "discord.js";
import { DiscordEvent } from "../types/event";
import { requireDirectory } from "../utils/requireDirectory";
import BotClient from "./Client";

const EVENTS_DIR = "./src/events";

export const registerEventHandler = (client: BotClient) => {
  const eventsCollection = new Collection<string, DiscordEvent>();

  requireDirectory(EVENTS_DIR, (event: DiscordEvent) => {
    client.client.on(event.name, (...args) => {
      if (
        event.name !== "messageCreate" ||
        (event.name === "messageCreate" &&
          !(args as ClientEvents["messageCreate"])[0].interaction)
      )
        event.execute(client, ...args);
    });
    eventsCollection.set(event.name, event);
  });

  return eventsCollection;
};
