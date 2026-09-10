# Assets — drop your real media here

Every media path on the site is defined once in **`src/data/media.ts`** (and
event/gallery arrays there). Components read from that file, so to replace a
placeholder you just drop a file here with the matching name — no component
edits. Missing files render a clean placeholder tile instead of a broken image.

## images/ — expected filenames

| File                              | Used on            | Notes                          |
| --------------------------------- | ------------------ | ------------------------------ |
| `profile-placeholder.jpg`         | Connect hero       | Portrait (tall crop works best)|
| `about-poster-placeholder.jpg`    | About bg video     | Poster/first frame             |
| `tabla-placeholder.jpg`           | Musical section    | Photo of you at the tabla      |
| `tabla-poster-placeholder.jpg`    | Musical section    | Tabla video poster             |
| `event-placeholder.jpg`           | Founders events    | Shared event fallback          |
| `events/<event-id>/cover.jpg`     | Event card/cover   | See `foundersEvents.ts` ids    |
| `fun/fun-1.jpg` … `fun-12.jpg`    | Fun at Founders    | Infinite gallery               |
| `reels/reel-1.jpg` … `reel-10.jpg`| Closing reels      | Reel gallery                   |

## videos/ — expected filenames

| File                                 | Used on         |
| ------------------------------------ | --------------- |
| `about-background-placeholder.mp4`   | About hero bg   |
| `tabla-video-placeholder.mp4`        | Musical section |

> Tip: keep videos short, compressed (H.264/MP4), and provide a poster image so
> mobile shows a still instead of downloading the whole file.
