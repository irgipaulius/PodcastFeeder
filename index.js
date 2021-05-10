import Podcast from "podcast-downloader";

import request from "request";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

process.env.FFMPEG_PATH = path.resolve(
  `__dirname`,
  "node_modules",
  "ffmetadata"
);

async function downloadImage(uri, dest) {
  new Promise((res, rej) => {
    request(uri)
      .pipe(fs.createWriteStream(dest))
      .on("error", rej)
      .on("close", res);
  });
}

async function start() {
  const config = JSON.parse(
    fs.readFileSync(path.resolve(__dirname, "config.json"), {
      encoding: "utf8",
    })
  );

  await Promise.all(
    config.podcasts.map(async (podcast) => {
      const destination = path.resolve(podcast.destination);

      await Podcast(podcast.url, destination, config.limit);

      /** eh, couldn't inject metadata */

      //   episodes.map(async (episode) => {
      //     if (episode.title && episode.image) {
      //       const image = path.resolve(__dirname, `${episode.title} Cover.jpeg`);
      //       await downloadImage(episode.image, path.resolve(destination, image));

      //       console.log(image);

      //       ffmetadata.write(
      //         path.resolve(destination, episode.title),
      //         {},
      //         // {
      //         //   artist: config.name,
      //         //   title: episode.title,
      //         //   description: episode.description,
      //         //   coverPath: image,
      //         //   date: episode.published,
      //         // },
      //         { attachments: [image] },
      //         (a) => {
      //           console.log(`ffa: ${JSON.stringify(a, undefined, " ")}`);
      //         }
      //       );
      //     }
      //   });
    })
  );
}

start();
