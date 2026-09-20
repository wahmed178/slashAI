import { useMemo, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";
import { ExternalLink, Search, Dices, Sparkles } from "lucide-react";
import { funCategoryColor } from "@/lib/category-colors";

export const Route = createFileRoute("/hub/fun")({
  head: () => ({
    meta: [
      { title: "Fun Sites Hub - 130+ Weird Websites, Curated | SlashAI" },
      {
        name: "description",
        content:
          "A hand-picked directory of 130+ of the most weirdly wonderful websites ever made: Infinite Craft, Asteroid Launcher, neal.fun, the Useless Web, Procatinator, Zoomquilt, Window Swap and more. All free, no signups — with in-app versions of the classics.",
      },
    ],
  }),
  component: FunSitesHub,
});

interface FunSite {
  name: string;
  url: string;
  emoji: string;
  category: string;
  desc: string;
  /** we also ship our own in-app version of this — deep-link to it */
  inApp?: { to: string; label: string };
}

const SITES: FunSite[] = [
  /* ── Random weird buttons & launchers ── */
  { name: "The Useless Web", url: "https://theuselessweb.com", emoji: "🌀", category: "Directory", desc: "One button, endless pointless websites. A legend of the old internet." },
  { name: "The Bored Button", url: "https://boredbutton.com", emoji: "🔴", category: "Directory", desc: "One click, instant boredom-cure roulette." },
  { name: "Bored.com", url: "https://www.bored.com", emoji: "🥱", category: "Directory", desc: "Hundreds of hand-picked fun websites, mini games and tools." },
  { name: "Neal.fun", url: "https://neal.fun", emoji: "🎈", category: "Directory", desc: "The internet's polished playground: tiny interactive masterpieces, one after another." },
  { name: "Neave Interactive", url: "https://neave.com", emoji: "🛰️", category: "Directory", desc: "A classic collection of web toys — telescope, stroop, bubble, lamp and more." },
  { name: "Wiki Roulette", url: "https://wikiroulette.co", emoji: "🎯", category: "Directory", desc: "Random Wikipedia pages for curious minds. Never know where you land.", inApp: { to: "/tools/wiki-speedrun", label: "Wiki Speedrun" } },
  { name: "MapCrunch", url: "https://www.mapcrunch.com", emoji: "🗺️", category: "Directory", desc: "Random Street View anywhere on Earth. Virtual travel roulette." },
  { name: "The Secret Door", url: "https://safestyle-windows.co.uk/the-secret-door/", emoji: "🚪", category: "Directory", desc: "Click a door, get teleported somewhere amazing on the planet." },
  { name: "Judge A Book By Its Cover", url: "https://alwaysjudgeabookbyitscover.com", emoji: "📚", category: "Directory", desc: "Random book covers that feel unreal. Judge away — it's encouraged." },
  { name: "Wikipedia: Unusual Articles", url: "https://en.wikipedia.org/wiki/Wikipedia:Unusual_articles", emoji: "📜", category: "Directory", desc: "A curated rabbit hole of genuinely real, genuinely strange articles." },
  { name: "Wayback Machine", url: "https://web.archive.org", emoji: "⏳", category: "Directory", desc: "Time travel for websites — and a way to revive dead links." },

  /* ── Pointless but weirdly satisfying ── */
  { name: "Pointer Pointer", url: "https://pointerpointer.com", emoji: "👆", category: "Weird", desc: "Point anywhere at the screen. A photo of someone pointing back appears. Uncanny." },
  { name: "Heeeeeeeey", url: "https://heeeeeeeey.com", emoji: "👋", category: "Weird", desc: "A single greeting, endless. That's it. That's the site." },
  { name: "Zombo", url: "https://zombo.com", emoji: "🧿", category: "Weird", desc: "The classic internet time sink. You can do anything at Zombo Com." },
  { name: "Cat Bounce", url: "https://cat-bounce.com", emoji: "🐱", category: "Weird", desc: "Bouncing cats, forever. Fling them with your cursor." },
  { name: "Eel Slap", url: "https://eelslap.com", emoji: "🐟", category: "Weird", desc: "Slap a man in the face with an eel by dragging your mouse. Exactly what it sounds like." },
  { name: "Bury Me With My Money", url: "https://burymewithmymoney.com", emoji: "💰", category: "Weird", desc: "Scrolling chaos with total commitment." },
  { name: "Paper Toilet", url: "https://papertoilet.com", emoji: "🧻", category: "Weird", desc: "Yes. It does that. Endlessly." },
  { name: "Long Doge Challenge", url: "https://longdogechallenge.com", emoji: "🐕", category: "Weird", desc: "Longer doge, longer scroll. How far can you go?" },
  { name: "Endless Horse", url: "https://endless.horse", emoji: "🐴", category: "Weird", desc: "Keep scrolling down. The horse continues. It never stops." },
  { name: "Corndog", url: "https://corndog.io", emoji: "🌭", category: "Weird", desc: "Press and hold for peak nonsense." },
  { name: "Make Everything OK", url: "https://make-everything-ok.com", emoji: "✅", category: "Weird", desc: "A button with a promise. Press it when the world is too much." },
  { name: "Is It Christmas?", url: "https://isitchristmas.com", emoji: "🎄", category: "Weird", desc: "A committed single-purpose answer. (We made our own multi-question version.)", inApp: { to: "/tools/is-it", label: "Is It…?" } },
  { name: "Is It Friday Yet?", url: "https://isitfridayyet.net", emoji: "🎉", category: "Weird", desc: "Another committed answer. Ask daily for best results.", inApp: { to: "/tools/is-it", label: "Is It…?" } },
  { name: "Patience Is A Virtue", url: "https://patience-is-a-virtue.org", emoji: "🐌", category: "Weird", desc: "The website equivalent of a lesson. Wait for it." },
  { name: "Scream Into The Void", url: "https://screamintothevoid.com", emoji: "🕳️", category: "Weird", desc: "Type a scream, watch it disappear. (Ours works offline too.)", inApp: { to: "/tools/void", label: "The Void" } },
  { name: "Staggering Beauty", url: "https://www.staggeringbeauty.com", emoji: "🖤", category: "Weird", desc: "A wiggling black worm that gets increasingly chaotic. Warning: flashing lights." },
  { name: "Koalas To The Max", url: "https://koalastothemax.com", emoji: "🐨", category: "Weird", desc: "Reveal a hidden koala by clicking dots that split into smaller dots." },
  { name: "Zoomquilt", url: "https://zoomquilt.org", emoji: "🖼️", category: "Weird", desc: "An infinite zooming painting that never ends. Hypnotic art." },
  { name: "Zoomquilt 2", url: "https://zoomquilt2.com", emoji: "🌌", category: "Weird", desc: "More endless zoom energy. Get lost in the loop." },
  { name: "Falling Falling", url: "https://fallingfalling.com", emoji: "⬇️", category: "Weird", desc: "Falling visuals, simple and hypnotic. Best with sound low." },
  { name: "OMFGDOGS", url: "https://omfgdogs.com", emoji: "🌈", category: "Weird", desc: "Loud, looping chaos. Turn the volume down first." },
  { name: "Checkbox Olympics", url: "https://checkboxolympics.com", emoji: "☑️", category: "Weird", desc: "Checkboxes as a sport. Tick at your own pace or watch them race." },
  { name: "One Million Checkboxes", url: "https://onemillioncheckboxes.com", emoji: "🧮", category: "Weird", desc: "Exactly what it sounds like — and everyone shares the same million." },
  { name: "Nyan Cat", url: "https://nyan.cat", emoji: "🌈", category: "Weird", desc: "Nostalgia, looped forever. Poptart power." },
  { name: "Don't Even Reply", url: "https://dontevenreply.com", emoji: "📧", category: "Weird", desc: "Absurd email conversations, archived for posterity." },
  { name: "The Library of Babel", url: "https://libraryofbabel.info", emoji: "📚", category: "Weird", desc: "The internet as an infinite bookshelf. Every possible book exists here." },
  { name: "Internet Artifacts", url: "https://www.internet-artifacts.com", emoji: "🏺", category: "Weird", desc: "A museum of web history — dig through the artefacts of the early internet." },
  { name: "Not Always Right", url: "https://notalwaysright.com", emoji: "💬", category: "Weird", desc: "Real customer stories that feel unreal." },
  { name: "Wait But Why", url: "https://waitbutwhy.com", emoji: "🖍️", category: "Weird", desc: "Deep dives with stick figures. Hours vanish here, productively." },
  { name: "SCP Foundation", url: "https://scp-wiki.wikidot.com", emoji: "🔒", category: "Weird", desc: "Collaborative fiction that gets very strange. Start with SCP-173." },
  { name: "Space Jam (1996)", url: "https://www.spacejam.com/1996", emoji: "🏀", category: "Weird", desc: "The iconic 1996 site, still alive. A time capsule that never aged." },
  { name: "The Quiet Place Project", url: "https://thequietplaceproject.xyz", emoji: "🤫", category: "Weird", desc: "Calm, minimal, and strange in a good way. Take the 90-second break." },
  { name: "How Many People Are In Space?", url: "https://howmanypeopleareinspacerightnow.com", emoji: "👨‍🚀", category: "Weird", desc: "Simple, oddly compelling. There's usually about 7." },
  { name: "WTF Should I Do With My Life", url: "https://wtfshouldidowithmylife.com", emoji: "🎭", category: "Weird", desc: "Click for career prompts. Honest, if blunt." },
  { name: "How Big Is The Internet", url: "https://howbigistheinternet.com", emoji: "🌐", category: "Weird", desc: "Make your brain feel small." },
  { name: "The Oatmeal", url: "https://theoatmeal.com", emoji: "🥣", category: "Weird", desc: "Internet comics, sometimes deeply weird, always funny." },

  /* ── Interactive art & visuals ── */
  { name: "Weave Silk", url: "https://weavesilk.com", emoji: "🧵", category: "Interactive", desc: "Draw symmetry art that feels like magic. (We built an in-app silk painter.)", inApp: { to: "/tools/silk", label: "Silk Painter" } },
  { name: "Patatap", url: "https://patatap.com", emoji: "🎹", category: "Interactive", desc: "Press any key for animated sounds and shapes. The keyboard becomes an instrument." },
  { name: "The Scale of the Universe", url: "https://htwins.net/scale2/", emoji: "🔬", category: "Interactive", desc: "Zoom from Planck length to the entire universe in one scrolling canvas." },
  { name: "Window Swap", url: "https://window-swap.com", emoji: "🪟", category: "Interactive", desc: "Open a random window somewhere in the world and see someone else's view." },
  { name: "Radio Garden", url: "http://radio.garden", emoji: "📻", category: "Interactive", desc: "Spin the globe and listen to live radio from thousands of cities." },
  { name: "FlightRadar24", url: "https://www.flightradar24.com", emoji: "✈️", category: "Interactive", desc: "Watch every plane in the sky, live, in real time." },
  { name: "EarthCam", url: "https://www.earthcam.com", emoji: "📹", category: "Interactive", desc: "Live public webcams from Times Square, Dublin pubs, zoos and beaches." },
  { name: "The Deep Sea", url: "https://neal.fun/deep-sea/", emoji: "🌊", category: "Interactive", desc: "Scroll 10,000 metres down past the creatures that live at every depth.", inApp: { to: "/tools/deep-sea", label: "Deep Sea" } },
  { name: "The Internet Map", url: "http://internet-map.net", emoji: "🪐", category: "Interactive", desc: "Websites as a galaxy you can explore. Find the biggest stars." },
  { name: "The Wilderness Downtown", url: "https://www.thewildernessdowntown.com", emoji: "🏙️", category: "Interactive", desc: "The iconic interactive Arcade Fire experience, built on Street View." },
  { name: "Cool Backgrounds", url: "https://coolbackgrounds.io", emoji: "🎨", category: "Interactive", desc: "Generates backgrounds that actually look good. Gradients, topo, particles." },
  { name: "AutoDraw", url: "https://www.autodraw.com", emoji: "✏️", category: "Interactive", desc: "Messy doodles become clean shapes. Google's drawing autocorrect." },
  { name: "CSS Zen Garden", url: "http://www.csszengarden.com", emoji: "🪷", category: "Interactive", desc: "One HTML file, endless designs. The demonstration that changed web design." },
  { name: "The Pudding", url: "https://pudding.cool", emoji: "🍮", category: "Interactive", desc: "Interactive data stories that feel like art." },
  { name: "Information Is Beautiful", url: "https://informationisbeautiful.net", emoji: "📊", category: "Interactive", desc: "Data visualizations you can get lost in." },
  { name: "The True Size Of...", url: "https://thetruesize.com", emoji: "🌍", category: "Interactive", desc: "Drag countries to compare their real scale. Greenland lies." },
  { name: "Every Time Zone", url: "https://everytimezone.com", emoji: "🕐", category: "Interactive", desc: "Time zones, but delightful." },
  { name: "Spend Billions (Neal)", url: "https://neal.fun/spend/", emoji: "💸", category: "Interactive", desc: "Oddly insightful money clicker. (Ours gives you $100B.)", inApp: { to: "/tools/spend-money", label: "Spend Billions" } },
  { name: "Size of Space (Neal)", url: "https://neal.fun/size-of-space/", emoji: "🚀", category: "Interactive", desc: "Brain expansion in scroll form. From an astronaut to the observable universe." },
  { name: "Where Does the Day Go? (Neal)", url: "https://neal.fun/where-does-the-day-go/", emoji: "⏰", category: "Interactive", desc: "Time goes fast — now it has charts to prove it." },
  { name: "Life Stats (Neal)", url: "https://neal.fun/life-stats/", emoji: "📈", category: "Interactive", desc: "Existential, but clean. (Ours counts heartbeats and blinks.)", inApp: { to: "/tools/life-stats", label: "Life in Numbers" } },

  /* ── Calm & ambient ── */
  { name: "A Soft Murmur", url: "https://asoftmurmur.com", emoji: "🌧️", category: "Calm", desc: "Mix rain, thunder, waves, fire and more into your perfect ambient soundscape." },
  { name: "Calm Sound", url: "https://calmsound.com", emoji: "🌊", category: "Calm", desc: "Nature sounds for sleep, study and relaxation." },
  { name: "Noisli", url: "https://www.noisli.com", emoji: "🎧", category: "Calm", desc: "Background noise and colour generator for focus and relaxation." },
  { name: "Rainy Mood", url: "https://www.rainymood.com", emoji: "☔", category: "Calm", desc: "Just rain. The purest rain sound on the internet since 2007." },
  { name: "This Is Sand", url: "https://thisissand.com", emoji: "🏖️", category: "Calm", desc: "Pour digital sand with your cursor and build layered landscapes. Weirdly meditative." },
  { name: "Pixel Thoughts", url: "https://www.pixelthoughts.co", emoji: "🌠", category: "Calm", desc: "A 60-second anxiety-cooling meditation. (Ours shrinks your worries too.)", inApp: { to: "/tools/pixel-thoughts", label: "Pixel Thoughts" } },
  { name: "The Zen Zone", url: "https://thezen.zone", emoji: "🧘", category: "Calm", desc: "Mouse-driven relaxing visuals. Move slowly." },
  { name: "The Nicest Place on the Internet", url: "https://thenicestplace.net", emoji: "🤗", category: "Calm", desc: "Instant wholesome overload. Strangers hugging you via webcam." },
  { name: "Music Map", url: "https://www.music-map.com", emoji: "🕸️", category: "Calm", desc: "Explore artists like a spiderweb. Type one, get the neighbourhood." },
  { name: "Gnoosic", url: "https://www.gnoosic.com", emoji: "🎵", category: "Calm", desc: "Type three artists you like, get music recommendations that click." },

  /* ── Mini games & browser challenges ── */
  { name: "Hacker Typer", url: "https://hackertyper.com", emoji: "💻", category: "Games", desc: "Type anything, look like a movie hacker. (We ship our own.)", inApp: { to: "/tools/hacker-typer", label: "Hacker Typer" } },
  { name: "The Wiki Game", url: "https://www.thewikigame.com", emoji: "🏁", category: "Games", desc: "Race from one Wikipedia page to another using only links.", inApp: { to: "/tools/wiki-speedrun", label: "Wiki Speedrun" } },
  { name: "Find The Invisible Cow", url: "https://findtheinvisiblecow.com", emoji: "🐄", category: "Games", desc: "Listen, hunt, repeat. Hotter… hotter… MOO." },
  { name: "Little Alchemy 2", url: "https://littlealchemy2.com", emoji: "⚗️", category: "Games", desc: "Combine things, discover nonsense. 700+ elements to unlock." },
  { name: "GeoGuessr", url: "https://www.geoguessr.com", emoji: "🌍", category: "Games", desc: "Street View guessing as a sport." },
  { name: "Playingcards.io", url: "https://playingcards.io", emoji: "🃏", category: "Games", desc: "Simple online tabletop rooms for any card game." },
  { name: "Akinator", url: "https://akinator.com", emoji: "🧞", category: "Games", desc: "It guesses what you're thinking. Twenty questions, uncanny results." },
  { name: "The Password Game (Neal)", url: "https://neal.fun/password-game/", emoji: "🔑", category: "Games", desc: "A password field turned into a boss fight. (Ours has 25 rules too.)", inApp: { to: "/play/password-game", label: "Password Game" } },
  { name: "Perfect Circle (Neal)", url: "https://neal.fun/perfect-circle/", emoji: "⭕", category: "Games", desc: "Draw a circle, get judged. (Ours judges just as hard.)", inApp: { to: "/play/perfect-circle", label: "Perfect Circle" } },
  { name: "2048", url: "https://play2048.co", emoji: "🔢", category: "Games", desc: "The original tile-sliding number puzzle that ate 2014. (In-app too.)", inApp: { to: "/play/2048", label: "2048" } },
  { name: "Quick, Draw!", url: "https://quickdraw.withgoogle.com", emoji: "🖍️", category: "Games", desc: "Google's neural net guesses your doodles in 20 seconds. Eerily good." },
  { name: "Skribbl.io", url: "https://skribbl.io", emoji: "🎨", category: "Games", desc: "Free multiplayer drawing and guessing, Pictionary-style." },
  { name: "Slither.io", url: "https://slither.io", emoji: "🐍", category: "Games", desc: "Massive multiplayer snake arena. Grow huge, avoid heads." },
  { name: "Cookie Clicker", url: "https://orteil.dashnet.org/cookieclicker/", emoji: "🍪", category: "Games", desc: "The idle game that started it all. Click cookies, buy grandmas." },
  { name: "Mini Metro (browser demo)", url: "https://dinopoloclub.com/minimetro", emoji: "🚇", category: "Games", desc: "Design subway maps under pressure — clean, elegant, addictive." },

  /* ── Oddly useful weird tools & rabbit holes ── */
  { name: "Time.is", url: "https://time.is", emoji: "⏱️", category: "Learning", desc: "Exact time, world clocks, satisfying UI." },
  { name: "Random.org", url: "https://www.random.org", emoji: "🎲", category: "Learning", desc: "Real randomness as a service — atmospheric noise, not algorithms." },
  { name: "Generated Photos", url: "https://generated.photos", emoji: "🧑", category: "Learning", desc: "AI faces that do not exist. Choose a face, any face." },
  { name: "This Person Does Not Exist", url: "https://thispersondoesnotexist.com", emoji: "🪞", category: "Learning", desc: "The classic AI face generator. Refresh for a new soul." },
  { name: "FutureMe", url: "https://www.futureme.org", emoji: "📬", category: "Learning", desc: "Write an email to your future self, delivered in 1, 3 or 5 years." },
  { name: "Hemingway Editor", url: "https://hemingwayapp.com", emoji: "🖋️", category: "Learning", desc: "It roasts your writing, helpfully." },
  { name: "The Most Dangerous Writing App", url: "https://www.themostdangerouswritingapp.com", emoji: "✍️", category: "Learning", desc: "Stop typing and you lose everything. (Ours deletes in 15s too.)", inApp: { to: "/tools/dangerous-writing", label: "Dangerous Writing" } },
  { name: "Diceware Passphrase Generator", url: "https://diceware.dmuth.org/", emoji: "🔐", category: "Learning", desc: "Strong passwords, charmingly nerdy. Roll the dice." },
  { name: "Zoom Earth", url: "https://zoom.earth", emoji: "🛰️", category: "Learning", desc: "Live weather visuals that feel sci-fi. Storms, fires, clouds, live." },
  { name: "Bored API", url: "https://www.boredapi.com", emoji: "😐", category: "Learning", desc: "An API that exists because boredom exists. Get an activity, instantly." },
  { name: "Every Noise at Once", url: "http://everynoise.com", emoji: "🎼", category: "Learning", desc: "An algorithmic map of 6,000+ music genres. Click anything to hear it." },
  { name: "The Secret Language of Birthdays", url: "https://personality.page", emoji: "🎂", category: "Learning", desc: "Personality snapshots by birthday — surprisingly accurate fun." },
  { name: "HyperPhysics", url: "http://hyperphysics.phy-astr.gsu.edu", emoji: "⚛️", category: "Learning", desc: "Looks ancient, still invaluable. The whole of physics as a concept map." },
  { name: "Internet Archive Texts", url: "https://archive.org/details/texts", emoji: "📖", category: "Learning", desc: "An endless reading rabbit hole. Millions of free books." },
  { name: "CodePen", url: "https://codepen.io", emoji: "🧪", category: "Learning", desc: "An endless stream of front-end experiments. Pick a pen, read the code." },
  { name: "Asteroid Launcher (Neal)", url: "https://neal.fun/asteroid-launcher/", emoji: "☄️", category: "Interactive", desc: "Pick an asteroid size and crash site. See the crater size, fireball, and shockwave damage in real-time." },
  { name: "Infinite Craft (Neal)", url: "https://neal.fun/infinite-craft/", emoji: "🔮", category: "Games", desc: "Combine Earth, Fire, Water, and Wind with AI to invent thousands of elements, celebrities, and concepts." },
  { name: "Procatinator", url: "https://procatinator.com", emoji: "😼", category: "Weird", desc: "A random animated cat matched with a perfectly suited looping music track. Peak internet procrastination." },
  { name: "Radiooooo", url: "https://radiooooo.com", emoji: "📻", category: "Interactive", desc: "The musical time machine. Pick any country on the world map and any decade from 1900 to today." },
  { name: "Drive & Listen", url: "https://driveandlisten.herokuapp.com", emoji: "🚗", category: "Calm", desc: "Drive through streets of Tokyo, Paris, New York, or Amsterdam while tuned to real local car radio stations." },
  { name: "Sandspiel", url: "https://sandspiel.club", emoji: "🏖️", category: "Interactive", desc: "Falling sand cellular automata physics game. Mix sand, water, fire, plant, acid, and oil in the browser." },
  { name: "WebGL Water", url: "https://madebyevan.com/webgl-water/", emoji: "💧", category: "Interactive", desc: "Incredible photorealistic water simulation in WebGL with raytraced caustics and a draggable floating sphere." },
  { name: "Line Rider", url: "https://www.linerider.com", emoji: "🛷", category: "Games", desc: "Draw hills, ramps, and loops for a little guy on a sled to ride. The eternal physics sandbox." },
  { name: "Museum of Endangered Sounds", url: "http://savethesounds.info", emoji: "📼", category: "Weird", desc: "Hear dial-up modems, dot matrix printers, rotary phones, and Windows 95 boot sounds before they are forgotten." },
  { name: "Do Nothing for 2 Minutes", url: "http://www.donothingfor2minutes.com", emoji: "🧘", category: "Calm", desc: "Just listen to ocean waves for 120 seconds. If you touch your mouse or keyboard, the timer fails." },
  { name: "Stellarium Web", url: "https://stellarium-web.org", emoji: "✨", category: "Interactive", desc: "A realistic 3D planetarium in your browser showing planets, constellations, and satellites in real time." },
  { name: "Bored Button", url: "https://www.boredbutton.com", emoji: "🔴", category: "Weird", desc: "Press the big red button to get teleported to a random fun or bizarre interactive mini-site." },
  { name: "Earth 2050", url: "https://2050.earth", emoji: "🌆", category: "Interactive", desc: "Kaspersky's interactive futuristic globe crowdsourcing concept art and predictions for cities in 2030, 2040, and 2050." },
  { name: "Geacron", url: "https://geacron.com", emoji: "🗺️", category: "Interactive", desc: "World history interactive geopolitical atlas. Change the year from 3000 BC to 2026 to watch empire borders shift." },
  { name: "Wonders of Street View (Neal)", url: "https://neal.fun/wonders-of-street-view/", emoji: "👀", category: "Interactive", desc: "Teleport to the weirdest, funniest, and most stunning hidden spots captured on Google Street View." },
  { name: "Design the Next iPhone (Neal)", url: "https://neal.fun/design-the-next-iphone/", emoji: "📱", category: "Interactive", desc: "Drag rotary dials, cup holders, 12 cameras, and HDMI ports onto a phone. Ridiculously entertaining." },
  { name: "Printing Money (Neal)", url: "https://neal.fun/printing-money/", emoji: "💵", category: "Interactive", desc: "Watch how fast Jeff Bezos, Apple, and US minimum-wage workers accumulate cash in real-time visual stacks." },
  { name: "A Good Movie to Watch", url: "https://agoodmovietowatch.com", emoji: "🍿", category: "Learning", desc: "Randomly pick highly-rated but little-known movies streaming on Netflix, Prime, and HBO." },
  { name: "MuscleWiki", url: "https://musclewiki.com", emoji: "💪", category: "Learning", desc: "Click any muscle on the human body diagram to see direct video tutorials for workouts targeting it." },
  { name: "Chordify", url: "https://chordify.net", emoji: "🎸", category: "Interactive", desc: "Turns any YouTube video, song, or sound file into synced guitar, piano, and ukulele chords automatically." },
  { name: "MapCrunch", url: "https://www.mapcrunch.com", emoji: "🌍", category: "Interactive", desc: "Random Street View teleportation. Press the button and guess where in the world you just landed." },
  { name: "Draw Logos From Memory (Neal)", url: "https://neal.fun/logos-from-memory/", emoji: "🎨", category: "Games", desc: "Try to accurately draw the Apple, Starbucks, or Adidas logos from pure memory." },
  { name: "Space Elevator (Neal)", url: "https://neal.fun/space-elevator/", emoji: "🛰️", category: "Interactive", desc: "Ride an elevator into orbit. Watch clouds, satellites, the aurora, and the exosphere roll past." },
  { name: "The Auction Game (Neal)", url: "https://neal.fun/auction-game/", emoji: "🏛️", category: "Games", desc: "Guess how much modern and classical art pieces sold for at Sotheby's auctions." },
];

const CATEGORIES = ["All", ...new Set(SITES.map((s) => s.category))];

function FunSitesHub() {
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const q = search.trim().toLowerCase();
  const navigate = useNavigate();

  const filtered = useMemo(
    () =>
      SITES.filter((s) => {
        if (category !== "All" && s.category !== category) return false;
        if (q && !`${s.name} ${s.desc} ${s.category}`.toLowerCase().includes(q)) return false;
        return true;
      }),
    [category, q],
  );

  const surprise = () => {
    const site = SITES[Math.floor(Math.random() * SITES.length)]!;
    window.open(site.url, "_blank", "noopener");
  };

  return (
    <AppShell title="Fun Sites Hub">
      <header className="mb-5">
        <h1 className="bg-gradient-to-r from-[#22d3ee] via-[#e879f9] to-[#fbbf24] bg-clip-text text-2xl font-bold tracking-tight text-transparent">🎪 Fun Sites Hub</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {SITES.length} of the weirdest, most delightful and gloriously pointless websites ever made.
          Every one free, no signup, safe to open at 2am — and the classics have in-app versions.
        </p>
      </header>

      <div className="mx-auto max-w-4xl space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative min-w-52 flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search sites..."
              className="h-10 w-full rounded-lg border border-border bg-surface pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none"
            />
          </div>
          <button
            onClick={surprise}
            className="flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-xs font-bold text-primary-foreground transition-opacity hover:opacity-90"
          >
            <Dices className="size-4" /> Surprise me
          </button>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {CATEGORIES.map((c) => {
            const cc = c === "All" ? undefined : funCategoryColor(c);
            const active = c === category;
            return (
              <button
                key={c}
                onClick={() => setCategory(c)}
                style={
                  active && cc
                    ? { background: cc.hex, borderColor: cc.hex, color: "oklch(0.15 0.02 255)" }
                    : undefined
                }
                className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                  active
                    ? "bg-primary text-primary-foreground"
                    : "border border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                {c}
                {c !== "All" && (
                  <span className="ml-1 opacity-70">{SITES.filter((s) => s.category === c).length}</span>
                )}
              </button>
            );
          })}
        </div>

        {q && (
          <p className="text-xs text-muted-foreground">
            {filtered.length} site{filtered.length === 1 ? "" : "s"} found
          </p>
        )}

        <div className="grid gap-2.5 sm:grid-cols-2">
          {filtered.map((site) => {
            const cc = funCategoryColor(site.category);
            return (
              <a
                key={site.name}
                href={site.url}
                target="_blank"
                rel="noreferrer noopener"
                style={{ "--cat": cc.hex } as React.CSSProperties}
                className="cat cat-glow group flex items-start gap-3 rounded-xl border bg-surface p-4"
              >
                <span className="cat-tile grid size-11 shrink-0 place-items-center rounded-lg text-xl">{site.emoji}</span>
                <div className="min-w-0 flex-1">
                  <p className="flex items-center gap-1.5 text-sm font-bold text-foreground">
                    {site.name}
                    <ExternalLink className="size-3 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                  </p>
                  <p className="cat-text mt-0.5 text-[11px] font-semibold uppercase tracking-wide">{site.category}</p>
                  <p className="mt-1 text-[12px] leading-snug text-muted-foreground">{site.desc}</p>
                  {site.inApp && (
                    <span
                      role="link"
                      tabIndex={0}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        void navigate({ to: site.inApp!.to });
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          e.stopPropagation();
                          void navigate({ to: site.inApp!.to });
                        }
                      }}
                      className="cat-chip mt-2 inline-flex cursor-pointer items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold"
                    >
                      <Sparkles className="size-3" /> Open in-app: {site.inApp.label}
                    </span>
                  )}
                </div>
              </a>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="rounded-xl border border-border bg-surface p-8 text-center">
            <p className="text-sm text-muted-foreground">Nothing matches that search.</p>
            <button
              onClick={() => { setSearch(""); setCategory("All"); }}
              className="mt-2 text-xs font-semibold text-primary hover:underline"
            >
              Clear filters
            </button>
          </div>
        )}

        <div className="rounded-xl border border-border bg-surface p-4 text-center">
          <p className="text-xs text-muted-foreground">
            Want games you can play right here instead? Head to{" "}
            <Link to="/play" className="font-semibold text-primary hover:underline">SlashPlay</Link> or browse{" "}
            <Link to="/tools" className="font-semibold text-primary hover:underline">SlashKits</Link>.
          </p>
        </div>
      </div>
    </AppShell>
  );
}
