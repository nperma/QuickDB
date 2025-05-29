import { world,system } from "@minecraft/server";
import { QuickDB } from "./database.js";

const PlayerDB = new QuickDB("player-db");

world.afterEvents.playerSpawn.subscribe(({initialSpawn:spawn,player}) => {
  if (spawn && PlayerDB.has(player.id)) system.run(() => {
    PlayerDB.set(player.id, {
      date: Date.now(),
      spawn: { location: player.location, dimension: player.dimension.id }
    });
    player.sendMessage("Registered");
  });
})
