import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

crons.interval(
  "clear the files marked for deletion",
  { minutes: 5 }, // every 10 minutes
  internal.files.deleteFile
);

export default crons;