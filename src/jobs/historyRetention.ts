import { NoteHistoryServices } from "../modules/noteHistory/noteHistory.service";
import { connection } from "mongoose";

export const purgeOldHistory = async () => {
  await NoteHistoryServices.deleteOldHistory(7);
};

export const startHistoryRetentionJob = () => {
  const run = async () => {
    if (connection.readyState === 1) {
      try { await purgeOldHistory(); } catch {}
    }
  };
  setInterval(run, 6 * 60 * 60 * 1000); // every 6 hours
  run();
};
