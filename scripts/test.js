import { world,system } from "@minecraft/server";
import { QuickDB } from "./database.js";

world.afterEvents.playerSpawn.subscribe(({initialSpawn:spawn,player}) => {
  if (spawn && PlayerDB.has(player.id)) system.run(() => {
    const PlayerDB = new QuickDB("player-db");
    PlayerDB.set(player.id, {
      date: Date.now(),
      spawn: { location: player.location, dimension: player.dimension.id }
    });
    player.sendMessage("Registered");
  });
})
