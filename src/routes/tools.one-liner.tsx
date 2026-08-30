import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/tools/one-liner")({
  head: () => ({
    meta: [
      { title: "OneLiner Quotes — SlashKits" },
      {
        name: "description",
        content:
          "Browse 500+ aesthetic one-liner quotes. Copy or download as clean black PNG. 27 categories, 3 fonts.",
      },
    ],
  }),
  component: OneLiner,
});

/* ── Quote data ─────────────────────────────────────────────── */

const CATEGORIES = [
  "All",
  "Love",
  "Heartbreak",
  "Happy",
  "Sad",
  "Lonely",
  "Healing",
  "Confident",
  "Savage",
  "Soft",
  "Motivated",
  "Anxious",
  "Calm",
  "Grateful",
  "Angry",
  "Self-Love",
  "Attitude",
  "Broken",
  "Overthinking",
  "Dreams",
  "Fake Friends",
  "Success",
  "Hope",
  "Memories",
  "Crush",
  "Life",
  "Peace",
] as const;

type Category = (typeof CATEGORIES)[number];

const QUOTES: { text: string; category: Exclude<Category, "All"> }[] = [
  { text: "you felt like home, not a house.", category: "Love" },
  { text: "i found love where i stopped looking.", category: "Love" },
  { text: "your laugh is my favorite notification.", category: "Love" },
  { text: "in a world of maybe, you were always.", category: "Love" },
  { text: "i like you more than morning coffee.", category: "Love" },
  { text: "you make ordinary feel like a movie.", category: "Love" },
  { text: "i fell for your soul first.", category: "Love" },
  { text: "with you, silence feels full.", category: "Love" },
  { text: "you're my favorite hello.", category: "Love" },
  { text: "i want to be your favorite thought.", category: "Love" },
  { text: "you are calm in my chaos.", category: "Love" },
  { text: "loving you was my favorite accident.", category: "Love" },
  { text: "you still give me butterflies, still.", category: "Love" },
  { text: "i knew it was you, instantly.", category: "Love" },
  { text: "your hand was made for mine.", category: "Love" },
  { text: "you love me so softly.", category: "Love" },
  { text: "you make my heart louder.", category: "Love" },
  { text: "i'd choose you in every timeline.", category: "Love" },
  { text: "my favorite what-if came true.", category: "Love" },
  { text: "addicted to the way you exist.", category: "Love" },
  { text: "you feel like my favorite song.", category: "Love" },
  { text: "love looks better on you.", category: "Love" },
  { text: "you turned maybe into definitely.", category: "Love" },
  { text: "i memorize you without trying.", category: "Love" },
  { text: "you're why my camera roll is full.", category: "Love" },
  { text: "i love you in every version.", category: "Love" },
  { text: "waiting for you feels worth it.", category: "Love" },
  { text: "you're my favorite place to get lost.", category: "Love" },
  { text: "let's grow old and still flirt.", category: "Love" },
  { text: "you're my soft place to land.", category: "Love" },
  { text: "your name feels like a prayer.", category: "Love" },
  { text: "i fall for you daily, quietly.", category: "Love" },
  { text: "you're my always in maybe world.", category: "Love" },
  { text: "i saw forever in your pause.", category: "Love" },
  { text: "love is you, simply you.", category: "Love" },
  { text: "you're my favorite distraction and focus.", category: "Love" },
  { text: "i loved you in every language, you left speechless.", category: "Heartbreak" },
  { text: "you left but your scent stayed longer.", category: "Heartbreak" },
  { text: "we were a story that skipped ending.", category: "Heartbreak" },
  { text: "deleted your number, not your memory.", category: "Heartbreak" },
  { text: "you were my favorite goodbye.", category: "Heartbreak" },
  { text: "i still check your last seen.", category: "Heartbreak" },
  { text: "you taught love, then how to lose.", category: "Heartbreak" },
  { text: "we broke, my heart still rings.", category: "Heartbreak" },
  { text: "still learning to unlove you.", category: "Heartbreak" },
  { text: "your absence louder than presence.", category: "Heartbreak" },
  { text: "i kept promises, you kept hoodie.", category: "Heartbreak" },
  { text: "we ended before we began.", category: "Heartbreak" },
  { text: "you left me on read and pieces.", category: "Heartbreak" },
  { text: "i hear your name in random songs.", category: "Heartbreak" },
  { text: "you became a lesson unasked.", category: "Heartbreak" },
  { text: "i loved idea more than you loved me.", category: "Heartbreak" },
  { text: "you were my almost, always almost.", category: "Heartbreak" },
  { text: "healing from love that never healed me.", category: "Heartbreak" },
  { text: "you left holes shaped like you.", category: "Heartbreak" },
  { text: "i type your name then delete it.", category: "Heartbreak" },
  { text: "you made me feel everything then nothing.", category: "Heartbreak" },
  { text: "our photos smile, we don't.", category: "Heartbreak" },
  { text: "i was your maybe, you my everything.", category: "Heartbreak" },
  { text: "you ghosted but your ghost stayed.", category: "Heartbreak" },
  { text: "i loved you harder than you held.", category: "Heartbreak" },
  { text: "closure never came, i became it.", category: "Heartbreak" },
  { text: "you left me with unfinished sentences.", category: "Heartbreak" },
  { text: "i still save seats for you.", category: "Heartbreak" },
  { text: "you moved on, i moved in circles.", category: "Heartbreak" },
  { text: "hardest part was watching you stop caring.", category: "Heartbreak" },
  { text: "we were almost, and almost hurts.", category: "Heartbreak" },
  { text: "you forgot us faster than i can.", category: "Heartbreak" },
  { text: "i loved you at your worst, silently.", category: "Heartbreak" },
  { text: "your goodbye still echoes in me.", category: "Heartbreak" },
  { text: "i miss us, not just you.", category: "Heartbreak" },
  { text: "love left, habits stayed.", category: "Heartbreak" },
  { text: "happiness looks good on you, keep it.", category: "Happy" },
  { text: "i smiled today without forcing it.", category: "Happy" },
  { text: "joy found me in small things.", category: "Happy" },
  { text: "heart light, coffee strong.", category: "Happy" },
  { text: "today feels like a soft exhale.", category: "Happy" },
  { text: "happy and i don't need reason.", category: "Happy" },
  { text: "laughed until cheeks hurt.", category: "Happy" },
  { text: "good days are here, i feel it.", category: "Happy" },
  { text: "sunshine lives in my chest today.", category: "Happy" },
  { text: "glowing from the inside today.", category: "Happy" },
  { text: "little wins, big smiles.", category: "Happy" },
  { text: "chose joy and it chose me back.", category: "Happy" },
  { text: "heart doing cartwheels today.", category: "Happy" },
  { text: "happy looks natural on you.", category: "Happy" },
  { text: "finally where i wanted to be.", category: "Happy" },
  { text: "good day to be alive.", category: "Happy" },
  { text: "happiness homemade today.", category: "Happy" },
  { text: "soul is sunbathing today.", category: "Happy" },
  { text: "dancing in my kitchen again.", category: "Happy" },
  { text: "peace + laughter = current status.", category: "Happy" },
  { text: "happy is quiet but real.", category: "Happy" },
  { text: "found gold in ordinary day.", category: "Happy" },
  { text: "today heart is full, not heavy.", category: "Happy" },
  { text: "joy is my new habit.", category: "Happy" },
  { text: "woke up happy, that's enough.", category: "Happy" },
  { text: "everything feels lighter today.", category: "Happy" },
  { text: "my smile is back, no filter.", category: "Happy" },
  { text: "today i choose light.", category: "Happy" },
  { text: "my happy era has started.", category: "Happy" },
  { text: "sun on skin, peace within.", category: "Happy" },
  { text: "happy looks like this moment.", category: "Happy" },
  { text: "smiling but soul is tired.", category: "Sad" },
  { text: "heavy heart, quiet mouth.", category: "Sad" },
  { text: "miss who i was before sadness.", category: "Sad" },
  { text: "tears i didn't cry live inside.", category: "Sad" },
  { text: "sad in language i can't translate.", category: "Sad" },
  { text: "heart feels like rainy monday.", category: "Sad" },
  { text: "i'm okay is my practiced lie.", category: "Sad" },
  { text: "sadness visits without knocking.", category: "Sad" },
  { text: "carry sadness like second skin.", category: "Sad" },
  { text: "tired of being strong and sad.", category: "Sad" },
  { text: "eyes tired of holding tears.", category: "Sad" },
  { text: "sad but still trying.", category: "Sad" },
  { text: "hurts in places i can't point.", category: "Sad" },
  { text: "learning to sit with sadness.", category: "Sad" },
  { text: "sad days don't mean sad life.", category: "Sad" },
  { text: "heart aches in lowercase.", category: "Sad" },
  { text: "not okay, but still here.", category: "Sad" },
  { text: "crying in hd, no filter.", category: "Sad" },
  { text: "soul needs nap from sadness.", category: "Sad" },
  { text: "sad and that's allowed.", category: "Sad" },
  { text: "heart bruised, not broken.", category: "Sad" },
  { text: "sad music understands me tonight.", category: "Sad" },
  { text: "sad not broken just human.", category: "Sad" },
  { text: "heart is cloudy today.", category: "Sad" },
  { text: "not apologizing for being sad.", category: "Sad" },
  { text: "my chest holds unsaid goodbyes.", category: "Sad" },
  { text: "i'm sad but soft about it.", category: "Sad" },
  { text: "tears fall when no one watches.", category: "Sad" },
  { text: "sadness taught me softness.", category: "Sad" },
  { text: "i hide sadness behind playlists.", category: "Sad" },
  { text: "alone in room full of notifications.", category: "Lonely" },
  { text: "lonely in a crowded timeline.", category: "Lonely" },
  { text: "phone full, heart empty.", category: "Lonely" },
  { text: "talk to ceiling more than people.", category: "Lonely" },
  { text: "lonely is loud at 2am.", category: "Lonely" },
  { text: "miss people who never missed me.", category: "Lonely" },
  { text: "surrounded but not seen.", category: "Lonely" },
  { text: "bed big, circle small.", category: "Lonely" },
  { text: "everyone's contact, no one's comfort.", category: "Lonely" },
  { text: "lonely hits different when healing.", category: "Lonely" },
  { text: "learning to be alone not lonely.", category: "Lonely" },
  { text: "making plans with my thoughts now.", category: "Lonely" },
  { text: "loneliest place is my head.", category: "Lonely" },
  { text: "alone but not asking to be saved.", category: "Lonely" },
  { text: "favorite company is becoming myself.", category: "Lonely" },
  { text: "lonely nights teach real names.", category: "Lonely" },
  { text: "lonely but loyal to my peace.", category: "Lonely" },
  { text: "sitting with myself, finally.", category: "Lonely" },
  { text: "alone but peace is loud.", category: "Lonely" },
  { text: "lonely is season not identity.", category: "Lonely" },
  { text: "alone time healing not hiding.", category: "Lonely" },
  { text: "lonely but won't beg for presence.", category: "Lonely" },
  { text: "alone and learning to like it.", category: "Lonely" },
  { text: "i check on everyone, who checks me?", category: "Lonely" },
  { text: "lonely but growing through it.", category: "Lonely" },
  { text: "alone not lonely just selective.", category: "Lonely" },
  { text: "midnight feels longer when alone.", category: "Lonely" },
  { text: "lonely doesn't mean unloved.", category: "Lonely" },
  { text: "empty chats, full mind.", category: "Lonely" },
  { text: "lonely taught me to hold myself.", category: "Lonely" },
  { text: "healing is messy but i'm doing it.", category: "Healing" },
  { text: "stitching myself back softly.", category: "Healing" },
  { text: "scars turning into stories.", category: "Healing" },
  { text: "healing looks good on me finally.", category: "Healing" },
  { text: "choosing myself daily.", category: "Healing" },
  { text: "let go of what reopened me.", category: "Healing" },
  { text: "peace is my new priority.", category: "Healing" },
  { text: "blooming after the storm.", category: "Healing" },
  { text: "healing not linear and okay.", category: "Healing" },
  { text: "gentle with parts that hurt.", category: "Healing" },
  { text: "becoming closure i needed.", category: "Healing" },
  { text: "release what no longer holds me.", category: "Healing" },
  { text: "healing out loud, quietly.", category: "Healing" },
  { text: "heart learning to trust again.", category: "Healing" },
  { text: "healing is my soft full-time job.", category: "Healing" },
  { text: "watering myself again.", category: "Healing" },
  { text: "boundaries are my healing.", category: "Healing" },
  { text: "proud of how far quietly came.", category: "Healing" },
  { text: "healing in rooms no one sees.", category: "Healing" },
  { text: "unlearning to relearn myself.", category: "Healing" },
  { text: "healing is choosing me again.", category: "Healing" },
  { text: "softer now because healed harder.", category: "Healing" },
  { text: "healing doesn't need audience.", category: "Healing" },
  { text: "becoming whole not half.", category: "Healing" },
  { text: "healing is love language to me.", category: "Healing" },
  { text: "allowed to heal slowly.", category: "Healing" },
  { text: "peace cost people, worth it.", category: "Healing" },
  { text: "healing not hiding.", category: "Healing" },
  { text: "healing made me softer and stronger.", category: "Healing" },
  { text: "i am the standard not option.", category: "Confident" },
  { text: "confidence is my quietest flex.", category: "Confident" },
  { text: "know my worth, no discount.", category: "Confident" },
  { text: "walk like i own my story.", category: "Confident" },
  { text: "not lucky, i'm worthy.", category: "Confident" },
  { text: "energy speaks before i do.", category: "Confident" },
  { text: "i am blueprint not copy.", category: "Confident" },
  { text: "don't chase, attract and select.", category: "Confident" },
  { text: "presence is my power.", category: "Confident" },
  { text: "too expensive for cheap energy.", category: "Confident" },
  { text: "don't dim, dominate softly.", category: "Confident" },
  { text: "confidence is favorite outfit.", category: "Confident" },
  { text: "not for everyone and that's power.", category: "Confident" },
  { text: "own every room i enter.", category: "Confident" },
  { text: "aura does the talking.", category: "Confident" },
  { text: "built different, thank healing.", category: "Confident" },
  { text: "i am the moment.", category: "Confident" },
  { text: "standards are non-negotiable.", category: "Confident" },
  { text: "rare not regular.", category: "Confident" },
  { text: "confidence not up for debate.", category: "Confident" },
  { text: "i am prize not game.", category: "Confident" },
  { text: "i walk in like i belong.", category: "Confident" },
  { text: "i know who i am now.", category: "Confident" },
  { text: "my no is powerful too.", category: "Confident" },
  { text: "confidence looks good on me.", category: "Confident" },
  { text: "not my circus, not my clowns.", category: "Savage" },
  { text: "your opinion didn't pay my bills.", category: "Savage" },
  { text: "nice until you test peace.", category: "Savage" },
  { text: "keep fake love, i'm good.", category: "Savage" },
  { text: "not heartless, just over it.", category: "Savage" },
  { text: "i'm reason you check phone.", category: "Savage" },
  { text: "cute face, savage case.", category: "Savage" },
  { text: "you lost me, that's karma.", category: "Savage" },
  { text: "sweet but bite if needed.", category: "Savage" },
  { text: "your loss, my upgrade.", category: "Savage" },
  { text: "stay mad, i stay peaceful.", category: "Savage" },
  { text: "unbothered, moisturized, thriving.", category: "Savage" },
  { text: "i'm closure you'll never get.", category: "Savage" },
  { text: "not backup plan, i'm plan.", category: "Savage" },
  { text: "kindness is not weakness.", category: "Savage" },
  { text: "too savage for soft games.", category: "Savage" },
  { text: "don't beg, replace.", category: "Savage" },
  { text: "keep drama, i kept peace.", category: "Savage" },
  { text: "karma you didn't see coming.", category: "Savage" },
  { text: "reason your therapist busy.", category: "Savage" },
  { text: "soft heart, savage boundaries.", category: "Savage" },
  { text: "i match energy, not excuses.", category: "Savage" },
  { text: "your vibe expired, i upgraded.", category: "Savage" },
  { text: "i don't chase, i delete.", category: "Savage" },
  { text: "no access after disrespect.", category: "Savage" },
  { text: "i love softly, deeply, quietly.", category: "Soft" },
  { text: "softness is my strength.", category: "Soft" },
  { text: "soft but not fragile.", category: "Soft" },
  { text: "choose gentleness in hard world.", category: "Soft" },
  { text: "heart soft, boundaries firm.", category: "Soft" },
  { text: "soft like sunday mornings.", category: "Soft" },
  { text: "love in lowercase, fully.", category: "Soft" },
  { text: "softness is superpower.", category: "Soft" },
  { text: "soft soul in loud world.", category: "Soft" },
  { text: "cry easily because feel deeply.", category: "Soft" },
  { text: "soft heart still beats for kindness.", category: "Soft" },
  { text: "soft not weak, difference.", category: "Soft" },
  { text: "love with whole soft heart.", category: "Soft" },
  { text: "softness survived everything.", category: "Soft" },
  { text: "bloom softly not loudly.", category: "Soft" },
  { text: "soft like worn-in sweaters.", category: "Soft" },
  { text: "keep heart soft, standards high.", category: "Soft" },
  { text: "soft eyes, strong soul.", category: "Soft" },
  { text: "soft, sacred, still standing.", category: "Soft" },
  { text: "softness is my rebellion.", category: "Soft" },
  { text: "soft but don't fold.", category: "Soft" },
  { text: "love like quiet poem.", category: "Soft" },
  { text: "soft to touch, hard to break.", category: "Soft" },
  { text: "soft era is power era.", category: "Soft" },
  { text: "soft, slow, sincere.", category: "Soft" },
  { text: "soft heart, wild mind, brave.", category: "Soft" },
  { text: "stay soft, world stays hard.", category: "Soft" },
  { text: "i choose soft over bitter.", category: "Soft" },
  { text: "soft doesn't mean silent.", category: "Soft" },
  { text: "discipline is love letter to future me.", category: "Motivated" },
  { text: "do it tired, scared, anyway.", category: "Motivated" },
  { text: "not waiting motivation, i'm moving.", category: "Motivated" },
  { text: "small steps still move mountains.", category: "Motivated" },
  { text: "future self watching, won't flop.", category: "Motivated" },
  { text: "building life i don't need escape from.", category: "Motivated" },
  { text: "consistency beats motivation every time.", category: "Motivated" },
  { text: "obsessed with my own growth.", category: "Motivated" },
  { text: "work while they watch.", category: "Motivated" },
  { text: "goals don't have snooze buttons.", category: "Motivated" },
  { text: "no excuses, just receipts.", category: "Motivated" },
  { text: "building empire quietly.", category: "Motivated" },
  { text: "do it for woman i'm becoming.", category: "Motivated" },
  { text: "progress over perfection always.", category: "Motivated" },
  { text: "not stopping until proud.", category: "Motivated" },
  { text: "dreams need me to show up.", category: "Motivated" },
  { text: "turn can't into done.", category: "Motivated" },
  { text: "hard in silence, flex in peace.", category: "Motivated" },
  { text: "CEO of getting it done.", category: "Motivated" },
  { text: "make moves not excuses.", category: "Motivated" },
  { text: "discipline louder than doubt.", category: "Motivated" },
  { text: "creating life i used to want.", category: "Motivated" },
  { text: "motivated by my own potential.", category: "Motivated" },
  { text: "rewriting story with action.", category: "Motivated" },
  { text: "dream big, work bigger.", category: "Motivated" },
  { text: "i show up even tired.", category: "Motivated" },
  { text: "no pause until proud.", category: "Motivated" },
  { text: "mind runs marathons uninvited.", category: "Anxious" },
  { text: "overthinking is unpaid internship.", category: "Anxious" },
  { text: "anxious but still showing up.", category: "Anxious" },
  { text: "chest tight with unsaid things.", category: "Anxious" },
  { text: "breathe, panic, breathe again.", category: "Anxious" },
  { text: "thoughts loud at 1:37am.", category: "Anxious" },
  { text: "anxiety whispers, i hum louder.", category: "Anxious" },
  { text: "tired from thinking so much.", category: "Anxious" },
  { text: "brain 100 tabs, one frozen.", category: "Anxious" },
  { text: "anxious not broken.", category: "Anxious" },
  { text: "rehearse conversations never happen.", category: "Anxious" },
  { text: "heart beats like it's late.", category: "Anxious" },
  { text: "learning to breathe through storm.", category: "Anxious" },
  { text: "anxiety visitor not identity.", category: "Anxious" },
  { text: "anxious but still here.", category: "Anxious" },
  { text: "overthink therefore feel too much.", category: "Anxious" },
  { text: "thoughts race, feet stay grounded.", category: "Anxious" },
  { text: "anxious but not giving up.", category: "Anxious" },
  { text: "anxiety lies, heart knows truth.", category: "Anxious" },
  { text: "holding breath without knowing.", category: "Anxious" },
  { text: "worries loud, hope louder.", category: "Anxious" },
  { text: "anxious but loved anyway.", category: "Anxious" },
  { text: "brain needs mute button.", category: "Anxious" },
  { text: "anxious but trusting time.", category: "Anxious" },
  { text: "thoughts spiral, i return to breath.", category: "Anxious" },
  { text: "anxious not weak.", category: "Anxious" },
  { text: "i worry because i care deeply.", category: "Anxious" },
  { text: "anxious heart, brave soul though.", category: "Anxious" },
  { text: "breathe in peace, out chaos.", category: "Calm" },
  { text: "calm is my new currency.", category: "Calm" },
  { text: "soul on do not disturb.", category: "Calm" },
  { text: "calm not quiet, difference.", category: "Calm" },
  { text: "peace lives in chest today.", category: "Calm" },
  { text: "soft, slow, steady.", category: "Calm" },
  { text: "calm is my comeback.", category: "Calm" },
  { text: "choose calm over chaos daily.", category: "Calm" },
  { text: "nervous system feels safe today.", category: "Calm" },
  { text: "calm like water after rain.", category: "Calm" },
  { text: "slow mornings, soft heart, calm mind.", category: "Calm" },
  { text: "at peace with not knowing.", category: "Calm" },
  { text: "calm looks good on me.", category: "Calm" },
  { text: "breathing slowly on purpose.", category: "Calm" },
  { text: "peace non-negotiable now.", category: "Calm" },
  { text: "calm in way healed people are.", category: "Calm" },
  { text: "heart quiet, finally.", category: "Calm" },
  { text: "calm, centered, coming home to me.", category: "Calm" },
  { text: "peace is favorite filter.", category: "Calm" },
  { text: "calm not numb just clear.", category: "Calm" },
  { text: "soul exhaled today.", category: "Calm" },
  { text: "calm like sunday with no plans.", category: "Calm" },
  { text: "rooted not rushing.", category: "Calm" },
  { text: "calm is superpower now.", category: "Calm" },
  { text: "mind clear, heart light.", category: "Calm" },
  { text: "peace over panic always.", category: "Calm" },
  { text: "calm is earned not given.", category: "Calm" },
  { text: "quiet mind, soft heart.", category: "Calm" },
  { text: "calm after chaos feels holy.", category: "Calm" },
  { text: "i choose calm, again and again.", category: "Calm" },
  { text: "grateful for small things that feel big.", category: "Grateful" },
  { text: "thank you life for trying again with me.", category: "Grateful" },
  { text: "grateful for peace i prayed for.", category: "Grateful" },
  { text: "heart says thank you in lowercase.", category: "Grateful" },
  { text: "grateful for soft days and real people.", category: "Grateful" },
  { text: "thankful for what stayed and left.", category: "Grateful" },
  { text: "grateful for mornings i begged for.", category: "Grateful" },
  { text: "count blessings not followers.", category: "Grateful" },
  { text: "grateful for healing i can't post.", category: "Grateful" },
  { text: "thank you body for holding me.", category: "Grateful" },
  { text: "grateful for love that feels calm.", category: "Grateful" },
  { text: "life small but so full.", category: "Grateful" },
  { text: "grateful for people who get silence.", category: "Grateful" },
  { text: "thank you to me for not quitting.", category: "Grateful" },
  { text: "grateful for growth i didn't plan.", category: "Grateful" },
  { text: "thankful for peace over drama.", category: "Grateful" },
  { text: "heart full of quiet thank yous.", category: "Grateful" },
  { text: "grateful for today exactly as is.", category: "Grateful" },
  { text: "thank you time for healing me.", category: "Grateful" },
  { text: "grateful for love that stays.", category: "Grateful" },
  { text: "grateful for who i'm becoming.", category: "Grateful" },
  { text: "thank you past me for trying.", category: "Grateful" },
  { text: "grateful for calm after chaos.", category: "Grateful" },
  { text: "thankful for my own company now.", category: "Grateful" },
  { text: "gratitude is my glow.", category: "Grateful" },
  { text: "grateful even when it's hard.", category: "Grateful" },
  { text: "angry because i cared too much.", category: "Angry" },
  { text: "anger valid not too much.", category: "Angry" },
  { text: "mad not mean, difference.", category: "Angry" },
  { text: "anger taught boundaries.", category: "Angry" },
  { text: "not angry, done explaining.", category: "Angry" },
  { text: "anger quiet but there.", category: "Angry" },
  { text: "mad at version that settled.", category: "Angry" },
  { text: "angry but handling with grace.", category: "Angry" },
  { text: "anger is map to values.", category: "Angry" },
  { text: "angry because know worth now.", category: "Angry" },
  { text: "anger healing not harmful.", category: "Angry" },
  { text: "mad that had to learn this way.", category: "Angry" },
  { text: "angry not bitter just clear.", category: "Angry" },
  { text: "angry but won't become cruel.", category: "Angry" },
  { text: "mad at how easy you left.", category: "Angry" },
  { text: "angry at apologies never got.", category: "Angry" },
  { text: "anger is inner child speaking.", category: "Angry" },
  { text: "mad but still kind.", category: "Angry" },
  { text: "angry because finally see it.", category: "Angry" },
  { text: "anger not drama, it's data.", category: "Angry" },
  { text: "angry but choosing peace anyway.", category: "Angry" },
  { text: "anger proof i still feel.", category: "Angry" },
  { text: "angry and allowed to be.", category: "Angry" },
  { text: "mad not broken just awakened.", category: "Angry" },
  { text: "my anger made me honest.", category: "Angry" },
  { text: "i choose me, every single time.", category: "Self-Love" },
  { text: "i am my own home now.", category: "Self-Love" },
  { text: "loving myself is full-time job.", category: "Self-Love" },
  { text: "i am enough, exactly as i am.", category: "Self-Love" },
  { text: "i pour into me first now.", category: "Self-Love" },
  { text: "my love for me is non-negotiable.", category: "Self-Love" },
  { text: "i am my own favorite person.", category: "Self-Love" },
  { text: "i choose me without guilt.", category: "Self-Love" },
  { text: "my own soulmate finally.", category: "Self-Love" },
  { text: "i love me loudly and softly.", category: "Self-Love" },
  { text: "i am becoming someone i love.", category: "Self-Love" },
  { text: "i stay loyal to me now.", category: "Self-Love" },
  { text: "my heart belongs to me first.", category: "Self-Love" },
  { text: "i am my own closure and peace.", category: "Self-Love" },
  { text: "i am soft with myself today.", category: "Self-Love" },
  { text: "i give myself what i needed.", category: "Self-Love" },
  { text: "i am proud of how i love me.", category: "Self-Love" },
  { text: "my self-love is my superpower.", category: "Self-Love" },
  { text: "i hold myself like i matter.", category: "Self-Love" },
  { text: "i am my own safe space.", category: "Self-Love" },
  { text: "i am worthy even on bad days.", category: "Self-Love" },
  { text: "i choose me over chaos.", category: "Self-Love" },
  { text: "i am my own love story.", category: "Self-Love" },
  { text: "i am whole all by myself.", category: "Self-Love" },
  { text: "i am mine before anyone else's.", category: "Self-Love" },
  { text: "i am rooting for myself hard.", category: "Self-Love" },
  { text: "i am gentle with my becoming.", category: "Self-Love" },
  { text: "i love my own softness.", category: "Self-Love" },
  { text: "not everyone gets front row to my life.", category: "Attitude" },
  { text: "my vibe is expensive, not for sale.", category: "Attitude" },
  { text: "i don't chase, i replace and upgrade.", category: "Attitude" },
  { text: "my attitude is based on yours.", category: "Attitude" },
  { text: "take me as i am or watch me go.", category: "Attitude" },
  { text: "my silence is my attitude.", category: "Attitude" },
  { text: "my vibe speaks, i don't.", category: "Attitude" },
  { text: "not rude, just honest about boundaries.", category: "Attitude" },
  { text: "my life, my rules, my peace.", category: "Attitude" },
  { text: "i keep it real, always.", category: "Attitude" },
  { text: "my attitude is my shield.", category: "Attitude" },
  { text: "don't mistake kindness for weakness.", category: "Attitude" },
  { text: "i am limited edition, not for everyone.", category: "Attitude" },
  { text: "my energy is my introduction.", category: "Attitude" },
  { text: "i don't need your approval.", category: "Attitude" },
  { text: "my peace costs your access.", category: "Attitude" },
  { text: "i am not cold, just clear.", category: "Attitude" },
  { text: "i don't argue, i set boundaries.", category: "Attitude" },
  { text: "i am too real for fake vibes.", category: "Attitude" },
  { text: "i am selective with my energy.", category: "Attitude" },
  { text: "i don't explain, i just exit.", category: "Attitude" },
  { text: "my vibe can't be copied.", category: "Attitude" },
  { text: "my attitude is earned, not given.", category: "Attitude" },
  { text: "my presence is privilege, remember that.", category: "Attitude" },
  { text: "i'm broken but still beautiful.", category: "Broken" },
  { text: "pieces of me still love you.", category: "Broken" },
  { text: "broken but still breathing, still trying.", category: "Broken" },
  { text: "i'm broken in places you can't see.", category: "Broken" },
  { text: "my heart broke quietly that day.", category: "Broken" },
  { text: "broken people still love deeply.", category: "Broken" },
  { text: "i'm not broken, i'm becoming.", category: "Broken" },
  { text: "broken crayons still color.", category: "Broken" },
  { text: "my broken parts still beat for you.", category: "Broken" },
  { text: "broken but not done.", category: "Broken" },
  { text: "i collect my pieces every morning.", category: "Broken" },
  { text: "broken heart, still soft though.", category: "Broken" },
  { text: "broken trust hits different.", category: "Broken" },
  { text: "i broke but i didn't shatter completely.", category: "Broken" },
  { text: "my pieces still make art.", category: "Broken" },
  { text: "broken but worthy of love.", category: "Broken" },
  { text: "i'm broken but not bitter.", category: "Broken" },
  { text: "broken promises hurt more than lies.", category: "Broken" },
  { text: "broken hearts still love loudly.", category: "Broken" },
  { text: "broken but rebuilding daily.", category: "Broken" },
  { text: "i'm broken and still here.", category: "Broken" },
  { text: "broken pieces still reflect light.", category: "Broken" },
  { text: "broken but not destroyed.", category: "Broken" },
  { text: "broken soul, soft heart still.", category: "Broken" },
  { text: "broken but choosing to heal.", category: "Broken" },
  { text: "i broke into better pieces.", category: "Broken" },
  { text: "my heart broke but didn't stop loving.", category: "Broken" },
  { text: "my mind never clocks out.", category: "Overthinking" },
  { text: "overthinking is my unpaid internship.", category: "Overthinking" },
  { text: "100 thoughts, 0 peace at 2am.", category: "Overthinking" },
  { text: "i think too much, feel too much.", category: "Overthinking" },
  { text: "overthinking ruined what could've been.", category: "Overthinking" },
  { text: "my mind replays everything twice.", category: "Overthinking" },
  { text: "overthinking is my second language.", category: "Overthinking" },
  { text: "i overthink even my overthinking.", category: "Overthinking" },
  { text: "mind busy, heart tired.", category: "Overthinking" },
  { text: "overthinking at 3am hits hardest.", category: "Overthinking" },
  { text: "i create problems that don't exist yet.", category: "Overthinking" },
  { text: "overthinking but still hopeful.", category: "Overthinking" },
  { text: "my brain has no off switch.", category: "Overthinking" },
  { text: "overthinking makes small things huge.", category: "Overthinking" },
  { text: "i overthink because i care.", category: "Overthinking" },
  { text: "my mind is loud tonight.", category: "Overthinking" },
  { text: "overthinking every text i sent.", category: "Overthinking" },
  { text: "i think in circles until dizzy.", category: "Overthinking" },
  { text: "overthinking is exhausting, still do it.", category: "Overthinking" },
  { text: "my thoughts need a curfew.", category: "Overthinking" },
  { text: "overthinking stole my sleep again.", category: "Overthinking" },
  { text: "my brain writes stories untrue.", category: "Overthinking" },
  { text: "i overthink, therefore i worry.", category: "Overthinking" },
  { text: "my mind never rests, even tired.", category: "Overthinking" },
  { text: "overthinking is my toxic trait.", category: "Overthinking" },
  { text: "my thoughts race faster than heart.", category: "Overthinking" },
  { text: "overthinking killed my peace tonight.", category: "Overthinking" },
  { text: "my mind invents worst endings.", category: "Overthinking" },
  { text: "overthinking but trying to breathe.", category: "Overthinking" },
  { text: "my brain is loudest at night.", category: "Overthinking" },
  { text: "dreams cost sleep, but worth it.", category: "Dreams" },
  { text: "i'm building what i once dreamed.", category: "Dreams" },
  { text: "my dreams are louder than fears.", category: "Dreams" },
  { text: "dream big, work harder quietly.", category: "Dreams" },
  { text: "my dreams don't have expiry date.", category: "Dreams" },
  { text: "dreams keep me awake and alive.", category: "Dreams" },
  { text: "my dreams are my compass.", category: "Dreams" },
  { text: "chasing dreams, not people.", category: "Dreams" },
  { text: "dreams feel closer today.", category: "Dreams" },
  { text: "my dreams need me to show up.", category: "Dreams" },
  { text: "i dream with eyes open.", category: "Dreams" },
  { text: "dreams turned into plans.", category: "Dreams" },
  { text: "my dreams scare me a little.", category: "Dreams" },
  { text: "dreams are my favorite escape.", category: "Dreams" },
  { text: "dreams don't work unless i do.", category: "Dreams" },
  { text: "my dreams keep me soft and strong.", category: "Dreams" },
  { text: "dreaming big feels like rebellion.", category: "Dreams" },
  { text: "my dreams are valid, even quiet.", category: "Dreams" },
  { text: "i dream of peace and purpose.", category: "Dreams" },
  { text: "dreams make nights worth staying awake.", category: "Dreams" },
  { text: "my dreams know me better.", category: "Dreams" },
  { text: "dream until it feels real.", category: "Dreams" },
  { text: "my dreams are bigger than doubt.", category: "Dreams" },
  { text: "dreams are my midnight fuel.", category: "Dreams" },
  { text: "dreams are my favorite what-if.", category: "Dreams" },
  { text: "my dreams are coming, i feel it.", category: "Dreams" },
  { text: "dream softly but chase loudly.", category: "Dreams" },
  { text: "dreams look good on me.", category: "Dreams" },
  { text: "my dreams don't need permission.", category: "Dreams" },
  { text: "dreams are proof i still hope.", category: "Dreams" },
  { text: "loyalty is rare, i notice everything.", category: "Fake Friends" },
  { text: "fake love looks real until you need it.", category: "Fake Friends" },
  { text: "cut off season, no hard feelings.", category: "Fake Friends" },
  { text: "fake friends like shadows, leave when dark.", category: "Fake Friends" },
  { text: "i saw real colors when life got hard.", category: "Fake Friends" },
  { text: "fake friends talk, real ones show up.", category: "Fake Friends" },
  { text: "not everyone clapping is happy for you.", category: "Fake Friends" },
  { text: "fake love is loudest in public.", category: "Fake Friends" },
  { text: "i keep circle small, peace bigger.", category: "Fake Friends" },
  { text: "fake friends left, peace stayed.", category: "Fake Friends" },
  { text: "loyalty over royalty, always.", category: "Fake Friends" },
  { text: "fake friends switch sides quickly.", category: "Fake Friends" },
  { text: "energy never lies, people do.", category: "Fake Friends" },
  { text: "fake friends love gossip not growth.", category: "Fake Friends" },
  { text: "i lost friends, found peace.", category: "Fake Friends" },
  { text: "fake friends disappear when you glow.", category: "Fake Friends" },
  { text: "real friends don't keep score.", category: "Fake Friends" },
  { text: "fake friends jealous of your healing.", category: "Fake Friends" },
  { text: "i watch actions not captions.", category: "Fake Friends" },
  { text: "fake friends only around when convenient.", category: "Fake Friends" },
  { text: "fake love fades fast.", category: "Fake Friends" },
  { text: "real is rare, fake is everywhere.", category: "Fake Friends" },
  { text: "i learned who is who, thank pain.", category: "Fake Friends" },
  { text: "fake friends copy, real support.", category: "Fake Friends" },
  { text: "fake friends love your downfall story.", category: "Fake Friends" },
  { text: "my circle small but solid.", category: "Fake Friends" },
  { text: "fake friends show face, not heart.", category: "Fake Friends" },
  { text: "fake friends only clap when you fall.", category: "Fake Friends" },
  { text: "real friends stay when fake leave.", category: "Fake Friends" },
  { text: "quiet moves, loud results.", category: "Success" },
  { text: "my grind is private, glow is public.", category: "Success" },
  { text: "success is my revenge, softly.", category: "Success" },
  { text: "work silent, success will speak.", category: "Success" },
  { text: "success tastes better after struggle.", category: "Success" },
  { text: "my success doesn't need announcement.", category: "Success" },
  { text: "success is built in lonely nights.", category: "Success" },
  { text: "small wins lead to big success.", category: "Success" },
  { text: "success loves consistency.", category: "Success" },
  { text: "my success is my peace now.", category: "Success" },
  { text: "success is quiet, failure loud.", category: "Success" },
  { text: "i hustle in private, shine in public.", category: "Success" },
  { text: "success needs no validation.", category: "Success" },
  { text: "success is best answer.", category: "Success" },
  { text: "i am my own success story.", category: "Success" },
  { text: "success is when you stop explaining.", category: "Success" },
  { text: "success is peace plus purpose.", category: "Success" },
  { text: "success is staying soft while winning.", category: "Success" },
  { text: "my success is slow but real.", category: "Success" },
  { text: "success doesn't need to be loud.", category: "Success" },
  { text: "success is showing up daily.", category: "Success" },
  { text: "my success glows differently.", category: "Success" },
  { text: "success is doing what scares you.", category: "Success" },
  { text: "i built success from scraps.", category: "Success" },
  { text: "success looks good on healed me.", category: "Success" },
  { text: "my success is mine, quietly earned.", category: "Success" },
  { text: "success is my favorite closure.", category: "Success" },
  { text: "success is not luck, it's work.", category: "Success" },
  { text: "success is when soul feels rich.", category: "Success" },
  { text: "even darkest night ends with sunrise.", category: "Hope" },
  { text: "hope is only thing i keep watering.", category: "Hope" },
  { text: "maybe tomorrow will be kinder.", category: "Hope" },
  { text: "hope keeps me soft in hard world.", category: "Hope" },
  { text: "i still believe in good days.", category: "Hope" },
  { text: "hope is my quiet rebellion.", category: "Hope" },
  { text: "even small hope is hope.", category: "Hope" },
  { text: "i hold hope like candle in wind.", category: "Hope" },
  { text: "hope lives even when tired.", category: "Hope" },
  { text: "i hope you heal and stay soft.", category: "Hope" },
  { text: "hope is proof i still care.", category: "Hope" },
  { text: "tomorrow might surprise me gently.", category: "Hope" },
  { text: "hope is my favorite maybe.", category: "Hope" },
  { text: "hope makes waiting feel lighter.", category: "Hope" },
  { text: "even broken, i still hope.", category: "Hope" },
  { text: "hope is how i survive.", category: "Hope" },
  { text: "i hope we both heal.", category: "Hope" },
  { text: "hope is my daily prayer.", category: "Hope" },
  { text: "hope is my soft anchor.", category: "Hope" },
  { text: "hope makes me try again.", category: "Hope" },
  { text: "hope is not naive, it's brave.", category: "Hope" },
  { text: "hope is light that stays.", category: "Hope" },
  { text: "i hope love finds me softly.", category: "Hope" },
  { text: "hope keeps my heart beating.", category: "Hope" },
  { text: "hope is my favorite habit.", category: "Hope" },
  { text: "hope is small but mighty.", category: "Hope" },
  { text: "hope is my comeback story.", category: "Hope" },
  { text: "hope is my kind of magic.", category: "Hope" },
  { text: "some memories never leave, just fade.", category: "Memories" },
  { text: "you live in my old playlists.", category: "Memories" },
  { text: "memories hurt more than reality.", category: "Memories" },
  { text: "i live in memories more than present.", category: "Memories" },
  { text: "memories keep you here somehow.", category: "Memories" },
  { text: "some memories feel like yesterday.", category: "Memories" },
  { text: "memories don't ask before visiting.", category: "Memories" },
  { text: "memories make me smile then ache.", category: "Memories" },
  { text: "you're my favorite memory, still.", category: "Memories" },
  { text: "i replay memories like favorite song.", category: "Memories" },
  { text: "memories never really leave.", category: "Memories" },
  { text: "some memories smell like you.", category: "Memories" },
  { text: "memories hit at random hours.", category: "Memories" },
  { text: "memories are soft and sharp both.", category: "Memories" },
  { text: "old memories feel like home.", category: "Memories" },
  { text: "memories keep me company at night.", category: "Memories" },
  { text: "memories are proof we lived.", category: "Memories" },
  { text: "memories live rent-free in mind.", category: "Memories" },
  { text: "i hold memories gently now.", category: "Memories" },
  { text: "memories make me who i am.", category: "Memories" },
  { text: "our memories still laugh together.", category: "Memories" },
  { text: "memories are my favorite ghost.", category: "Memories" },
  { text: "memories fade but feelings stay.", category: "Memories" },
  { text: "memories are my midnight visitors.", category: "Memories" },
  { text: "memories teach me what mattered.", category: "Memories" },
  { text: "your laugh lives in my memories.", category: "Memories" },
  { text: "you're my favorite notification.", category: "Crush" },
  { text: "i like you more than i planned.", category: "Crush" },
  { text: "my heart does extra beats for you.", category: "Crush" },
  { text: "you're my favorite distraction.", category: "Crush" },
  { text: "i get shy when you notice me.", category: "Crush" },
  { text: "you're my favorite thought at 2am.", category: "Crush" },
  { text: "i like you in every lowercase way.", category: "Crush" },
  { text: "you make me nervous in good way.", category: "Crush" },
  { text: "my crush on you is showing.", category: "Crush" },
  { text: "you're my favorite what-if.", category: "Crush" },
  { text: "i smile when your name pops.", category: "Crush" },
  { text: "you live in my mind rent-free.", category: "Crush" },
  { text: "i like you more than coffee today.", category: "Crush" },
  { text: "you're my soft little secret.", category: "Crush" },
  { text: "my heart skips when you text.", category: "Crush" },
  { text: "i think about you more than should.", category: "Crush" },
  { text: "you're my favorite accidental thought.", category: "Crush" },
  { text: "you're my favorite daydream.", category: "Crush" },
  { text: "you're my kind of trouble.", category: "Crush" },
  { text: "i like you quietly, loudly inside.", category: "Crush" },
  { text: "you make my day just by existing.", category: "Crush" },
  { text: "you're my favorite maybe.", category: "Crush" },
  { text: "i like you, no filter needed.", category: "Crush" },
  { text: "my heart whispers your name daily.", category: "Crush" },
  { text: "you're my favorite coincidence.", category: "Crush" },
  { text: "i like you more than yesterday.", category: "Crush" },
  { text: "life is too short to be boring.", category: "Life" },
  { text: "life taught me to choose peace.", category: "Life" },
  { text: "i'm learning life as i live it.", category: "Life" },
  { text: "life is soft and sharp both.", category: "Life" },
  { text: "life keeps teaching, i keep learning.", category: "Life" },
  { text: "life is better with soft heart.", category: "Life" },
  { text: "life happened while i was healing.", category: "Life" },
  { text: "life is too short for fake love.", category: "Life" },
  { text: "life is messy, i like it.", category: "Life" },
  { text: "life goes on, so do i.", category: "Life" },
  { text: "life is about peace not perfection.", category: "Life" },
  { text: "life taught me to let go softly.", category: "Life" },
  { text: "life is short, love loudly.", category: "Life" },
  { text: "life feels lighter when i'm honest.", category: "Life" },
  { text: "life is my favorite teacher.", category: "Life" },
  { text: "life is not race, it's rhythm.", category: "Life" },
  { text: "life is too short to hold grudges.", category: "Life" },
  { text: "life is better when you choose you.", category: "Life" },
  { text: "life keeps moving, i move softer.", category: "Life" },
  { text: "life is made of small moments.", category: "Life" },
  { text: "life is quiet now and i like it.", category: "Life" },
  { text: "life is about who stays.", category: "Life" },
  { text: "life taught me boundaries are love.", category: "Life" },
  { text: "life is too short for maybe love.", category: "Life" },
  { text: "life is what you make peaceful.", category: "Life" },
  { text: "life is better with real ones.", category: "Life" },
  { text: "life is soft when you let it.", category: "Life" },
  { text: "life is happening now, not later.", category: "Life" },
  { text: "life is about finding your own pace.", category: "Life" },
  { text: "life is too short to not try.", category: "Life" },
  { text: "life is my favorite art project.", category: "Life" },
  { text: "life is calm after storm.", category: "Life" },
  { text: "life is teaching me to stay soft.", category: "Life" },
  { text: "life is better when i say no.", category: "Life" },
  { text: "life is short, make it soft.", category: "Life" },
  { text: "my peace is non-negotiable now.", category: "Peace" },
  { text: "peace over drama, always.", category: "Peace" },
  { text: "i protect my peace like gold.", category: "Peace" },
  { text: "peace looks good on me.", category: "Peace" },
  { text: "my peace cost me people, worth it.", category: "Peace" },
  { text: "peace is my favorite flex.", category: "Peace" },
  { text: "i choose peace over being right.", category: "Peace" },
  { text: "my peace is my power.", category: "Peace" },
  { text: "peace is my new love language.", category: "Peace" },
  { text: "i found peace in letting go.", category: "Peace" },
  { text: "peace lives in my boundaries.", category: "Peace" },
  { text: "my peace is quiet but strong.", category: "Peace" },
  { text: "peace over chaos, every time.", category: "Peace" },
  { text: "i keep my peace sacred.", category: "Peace" },
  { text: "peace is my kind of luxury.", category: "Peace" },
  { text: "my peace is my comeback.", category: "Peace" },
  { text: "peace is my favorite feeling.", category: "Peace" },
  { text: "i protect my peace daily.", category: "Peace" },
  { text: "peace is my priority now.", category: "Peace" },
  { text: "my peace is earned, not given.", category: "Peace" },
  { text: "peace feels like coming home.", category: "Peace" },
  { text: "i choose peace even when hard.", category: "Peace" },
  { text: "peace is my soft armor.", category: "Peace" },
  { text: "my peace is loud in silence.", category: "Peace" },
  { text: "peace is my favorite habit.", category: "Peace" },
  { text: "i found peace after losing everything.", category: "Peace" },
  { text: "peace is my daily practice.", category: "Peace" },
  { text: "my peace is my glow.", category: "Peace" },
  { text: "peace is my forever mood.", category: "Peace" },
  { text: "i breathe peace, exhale drama.", category: "Peace" },
  { text: "peace is my kind of wealth.", category: "Peace" },
  { text: "my peace is my anchor.", category: "Peace" },
  { text: "i keep peace over everything.", category: "Peace" },
  { text: "peace is my soft revolution.", category: "Peace" },
  { text: "my peace is finally mine.", category: "Peace" },
];

/* ── Helpers ────────────────────────────────────────────────── */

function shuffle(arr: number[]): number[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = a[i]!; a[i] = a[j]!; a[j] = tmp;
  }
  return a;
}

const FONT_MAP = {
  serif: '"Playfair Display", Georgia, serif',
  sans: '"Space Grotesk", Inter, sans-serif',
  mono: '"IBM Plex Mono", "JetBrains Mono", monospace',
} as const;

type FontKey = keyof typeof FONT_MAP;

/* ── Component ──────────────────────────────────────────────── */

function OneLiner() {
  const [category, setCategory] = useState<Category>("All");
  const [font, setFont] = useState<FontKey>("serif");
  const [size, setSize] = useState(28);
  const [indices, setIndices] = useState<number[]>([]);
  const [pos, setPos] = useState(0);
  const [fading, setFading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const isMobile = typeof navigator !== 'undefined' && /Android|iPhone|iPad/i.test(navigator.userAgent);
  const isWebView = typeof navigator !== 'undefined' && (/wv/.test(navigator.userAgent) || /Android.*Version\/[\d.]+.*Chrome\/[\d.]+/.test(navigator.userAgent));
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const filtered = useMemo(
    () =>
      category === "All"
        ? QUOTES
        : QUOTES.filter((q) => q.category === category),
    [category],
  );

  const counts = useMemo(() => {
    const m: Record<string, number> = { All: QUOTES.length };
    for (const q of QUOTES) m[q.category] = (m[q.category] ?? 0) + 1;
    return m;
  }, []);

  useEffect(() => {
    if (filtered.length === 0) return;
    setIndices(shuffle(Array.from({ length: filtered.length }, (_, i) => i)));
    setPos(0);
  }, [filtered.length]);

  useEffect(() => {
    const mobile = window.innerWidth < 768;
    setSize(mobile ? 22 : 28);
  }, []);

  /* load Google Fonts */
  useEffect(() => {
    const link = document.createElement("link");
    link.href =
      "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400&family=Space+Grotesk:wght@300;400;500&family=IBM+Plex+Mono:wght@300;400;500&family=Inter:wght@300;400;500;600&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  const current = useMemo(() => {
    if (!filtered.length || !indices.length)
      return { text: "", category: "All" as Category };
    const idx = indices[pos] ?? 0;
    const q = filtered[idx] ?? filtered[0];
    return q ? { text: q.text, category: q.category } : { text: "", category: "All" as Category };
  }, [filtered, indices, pos]);

  const goNext = useCallback(() => {
    if (fading) return;
    if (timerRef.current) clearTimeout(timerRef.current);
    setFading(true);
    timerRef.current = setTimeout(() => {
      setPos((p) => {
        if (p >= indices.length - 1) {
          const fresh = shuffle(Array.from({ length: filtered.length }, (_, i) => i));
          if (fresh[0] === indices[indices.length - 1] && fresh.length > 1) {
              const tmp = fresh[0]!; fresh[0] = fresh[1]!; fresh[1] = tmp;
            }
          setIndices((prev) => [...prev, ...fresh]);
          return p + 1;
        }
        return p + 1;
      });
      requestAnimationFrame(() => {
        timerRef.current = setTimeout(() => setFading(false), 60);
      });
    }, 200);
  }, [fading, indices, filtered.length]);

  const goPrev = useCallback(() => {
    if (fading || pos === 0) return;
    if (timerRef.current) clearTimeout(timerRef.current);
    setFading(true);
    timerRef.current = setTimeout(() => {
      setPos((p) => Math.max(0, p - 1));
      requestAnimationFrame(() => {
        timerRef.current = setTimeout(() => setFading(false), 60);
      });
    }, 200);
  }, [fading, pos]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        goPrev();
      } else if (e.key === "ArrowRight" || e.key === " " || e.code === "Space") {
        e.preventDefault();
        goNext();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [goNext, goPrev]);

  // Auto-dismiss close button
  useEffect(() => {
    const show = () => setShowControls(true);
    const hide = setTimeout(() => setShowControls(false), 3000);
    window.addEventListener("mousemove", show);
    window.addEventListener("touchstart", show);
    return () => {
      window.removeEventListener("mousemove", show);
      window.removeEventListener("touchstart", show);
      clearTimeout(hide);
    };
  }, []);

  const copyQuote = async () => {
    if (!current) return;
    try {
      await navigator.clipboard.writeText(current.text);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = current.text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  const renderCanvas = (): HTMLCanvasElement | null => {
    if (!current) return null;
    const canvas = document.createElement("canvas");
    canvas.width = 1080;
    canvas.height = 1920;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, 1080, 1920);

    const fontStr = FONT_MAP[font];
    let fontSize = Math.round((size / 28) * 58);
    fontSize = Math.max(36, Math.min(80, fontSize));
    const len = current.text.length;
    if (len > 70) fontSize = Math.round(fontSize * 0.7);
    else if (len > 50) fontSize = Math.round(fontSize * 0.8);
    else if (len > 30) fontSize = Math.round(fontSize * 0.9);
    fontSize = Math.max(30, fontSize);

    ctx.fillStyle = "#FFFFFF";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    const maxW = 900;
    ctx.font = `400 ${fontSize}px ${fontStr}`;
    const words = current.text.split(" ");
    const lines: string[] = [];
    let line = words[0] ?? "";
    for (let i = 1; i < words.length; i++) {
      const test = `${line} ${words[i]}`;
      if (ctx.measureText(test).width < maxW) {
        line = test;
      } else {
        lines.push(line);
        line = words[i] ?? "";
      }
    }
    if (line) lines.push(line);

    const lh = fontSize * 1.4;
    const totalH = lines.length * lh;
    let y = 960 - totalH / 2 + lh / 2;
    for (const l of lines) {
      ctx.fillText(l, 540, y);
      y += lh;
    }

    return canvas;
  };

  const downloadPNG = async () => {
    if (!current) return;
    setDownloading(true);
    const fileName = `oneliner-${category.toLowerCase().replace(/\s+/g, "-")}-${String(pos + 1).padStart(3, "0")}.png`;

    try {
      const canvas = renderCanvas();
      if (!canvas) {
        alert("Could not generate image. Please try again.");
        return;
      }
      const dataUrl = canvas.toDataURL("image/png");

      // METHOD 1: Web Share API (best for mobile — native share sheet)
      if (navigator.canShare && navigator.share) {
        try {
          const response = await fetch(dataUrl);
          const blob = await response.blob();
          const file = new File([blob], fileName, { type: "image/png" });
          if (navigator.canShare({ files: [file] })) {
            await navigator.share({
              files: [file],
              title: "SlashAI Quote",
              text: current.text,
            });
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
            return;
          }
        } catch (err) {
          if ((err as Error).name === "AbortError") {
            setDownloading(false);
            return;
          }
        }
      }

      // METHOD 2: Android WebView bridge
      if ((window as any).Android?.downloadImage) {
        try {
          (window as any).Android.downloadImage(dataUrl, fileName);
          setSaved(true);
          setTimeout(() => setSaved(false), 2000);
          return;
        } catch { /* fall through */ }
      }

      // METHOD 3: WebView — open in new tab for long-press save
      if (isWebView) {
        const w = window.open();
        if (w) {
          w.document.write(
            `<html><head><title>Save Quote</title>` +
            `<meta name="viewport" content="width=device-width,initial-scale=1">` +
            `<style>body{margin:0;background:#000;display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:100vh;font-family:sans-serif}img{max-width:100%;border-radius:8px}p{color:#fff;font-size:14px;margin:16px;text-align:center;opacity:0.7}</style></head>` +
            `<body><p>Long press the image and tap "Save image"</p>` +
            `<img src="${dataUrl}" alt="Quote" />` +
            `<p>Tap back when done</p></body></html>`
          );
          w.document.close();
          setSaved(true);
          setTimeout(() => setSaved(false), 2000);
          return;
        }
      }

      // METHOD 4: Standard browser download
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = fileName;
      a.style.cssText = "position:fixed;left:-9999px;top:-9999px;opacity:0";
      document.body.appendChild(a);
      await new Promise<void>((resolve) => {
        requestAnimationFrame(() => {
          a.click();
          setTimeout(() => { document.body.removeChild(a); resolve(); }, 300);
        });
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);

    } catch (err) {
      console.error("Download failed:", err);
      alert("Download failed. Try long-pressing the image to save.");
    } finally {
      setDownloading(false);
    }
  };
;

  const total = filtered.length;
  const cur = String(pos + 1).padStart(2, "0");
  const tot = String(total).padStart(2, "0");
  const atEnd = pos >= total - 1;

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background">

      {/* Auto-dismiss close button */}
      <div
        className={`fixed top-4 left-4 z-50 transition-opacity duration-500 ${
          showControls ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <button
          type="button"
          onClick={() => window.history.back()}
          className="rounded-lg border border-border bg-surface/80 backdrop-blur px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Close
        </button>
      </div>

      {/* Category pills — fixed top */}
      <div className="shrink-0 w-full overflow-x-auto pb-2 pt-2 px-4 scrollbar-none bg-background">
        <div className="flex items-center gap-2 w-max pr-4">
          {CATEGORIES.map((cat) => {
            const active = cat === category;
            const count = counts[cat] ?? 0;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  if (cat === category) {
                    setIndices(shuffle(Array.from({ length: filtered.length }, (_, i) => i)));
                    setPos(0);
                  } else {
                    setCategory(cat);
                  }
                }}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-xs tracking-wide border transition-all duration-150 ${
                  active
                    ? "bg-foreground text-background border-foreground"
                    : "bg-transparent text-muted-foreground border-border hover:border-[#484f58] hover:text-foreground"
                }`}
              >
                <span className="mr-1.5 opacity-70">{cat}</span>
                <span
                  className={`text-[10px] tabular-nums ${active ? "opacity-50" : "opacity-40"}`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Toasts */}
      <div className="pointer-events-none fixed top-20 right-5 z-30 flex flex-col items-end gap-2">
        <div
          className="transition-all duration-200"
          style={{ opacity: copied ? 1 : 0, transform: `translateY(${copied ? 0 : -6}px)` }}
        >
          <div className="rounded-full bg-foreground text-background px-3.5 py-1.5 text-[11px] font-medium">
            copied
          </div>
        </div>
        <div
          className="transition-all duration-200"
          style={{ opacity: saved ? 1 : 0, transform: `translateY(${saved ? 0 : -6}px)` }}
        >
          <div className="rounded-full bg-foreground text-background px-3.5 py-1.5 text-[11px] font-medium">
            saved · AMOLED black
          </div>
        </div>
      </div>

      {/* Quote display */}
      <div
        className="flex-1 flex flex-col items-center justify-center cursor-pointer w-full overflow-hidden px-6 bg-background"
        onClick={goNext}
      >
        <div className="w-full max-w-[720px] flex flex-col items-center justify-center">
          <div className="mb-6 flex items-center gap-2">
            <span className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground">
              {current.category}
            </span>
            <span className="h-px w-6 bg-border" />
            {atEnd && (
              <span className="flex items-center gap-1 text-[10px] tracking-wide text-muted-foreground/60">
                ∞ endless
              </span>
            )}
          </div>

          <h2
            className="text-center max-w-[720px] px-2 text-foreground"
            style={{
              fontFamily: FONT_MAP[font],
              fontSize: `clamp(20px, 3vw, ${size}px)`,
              fontWeight: font === "sans" ? 300 : 400,
              lineHeight: font === "mono" ? 1.35 : 1.2,
              opacity: fading ? 0 : 1,
              transform: `translateY(${fading ? "10px" : "0px"})`,
              transition:
                "opacity 280ms cubic-bezier(0.22,1,0.36,1), transform 280ms cubic-bezier(0.22,1,0.36,1)",
              textWrap: "balance" as const,
            }}
          >
            <span style={{ fontSize: `${size}px`, display: "inline-block", maxWidth: "100%" }}>
              {current.text}
            </span>
          </h2>

          <div className="mt-10 h-px w-12 bg-border" />
          <p className="mt-4 text-[10px] tracking-[0.16em] uppercase text-muted-foreground/60">
            tap to shuffle · ← → to navigate
          </p>
        </div>
      </div>

      {/* WebView download instruction */}
      {isWebView && (
        <div className="fixed bottom-[140px] left-4 right-4 z-30 rounded-lg border border-accent/20 bg-accent/5 px-4 py-2.5 text-[11px] text-muted-foreground text-center">
          On the Android app: tap Save → choose "Save to Photos" or "Download"
        </div>
      )}

      {/* Bottom controls */}
      <div className="shrink-0 fixed bottom-0 left-0 right-0 z-20 border-t border-border bg-background/90 backdrop-blur-xl">
        <div className="mx-auto max-w-[980px] px-4 md:px-8 py-3.5 flex flex-col gap-3.5">
          {/* Nav row */}
          <div className="flex items-center justify-between md:justify-center gap-4">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                goPrev();
              }}
              disabled={pos === 0}
              className={`h-9 px-4 rounded-full border flex items-center gap-2 text-xs tracking-wide transition ${
                pos === 0
                  ? "border-border text-muted-foreground/40 cursor-not-allowed"
                  : "border-border bg-surface text-muted-foreground hover:bg-surface-elevated hover:text-foreground active:scale-[0.98]"
              }`}
            >
              ← Prev
            </button>

            <div className="flex items-center gap-2.5 px-3 py-1 rounded-full bg-surface border border-border">
              <span className="text-xs tabular-nums tracking-wide text-muted-foreground">
                {cur} / {tot}
              </span>
              {atEnd && <span className="text-[10px] text-muted-foreground/50">∞</span>}
              <span className="text-[10px] text-muted-foreground/50 tracking-wide uppercase">
                {category}
              </span>
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                goNext();
              }}
              className="h-9 px-4 rounded-full border border-border bg-foreground text-background flex items-center gap-2 text-xs tracking-wide font-medium hover:opacity-90 transition active:scale-[0.98]"
            >
              Next →
            </button>
          </div>

          {/* Settings row */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 md:gap-6 pt-1 border-t border-border md:border-0">
            {/* Font picker */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] tracking-[0.16em] uppercase text-muted-foreground mr-1">
                Font
              </span>
              {(["serif", "sans", "mono"] as const).map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setFont(f);
                  }}
                  className={`h-8 px-3 rounded-full border text-xs flex items-center gap-1.5 transition ${
                    font === f
                      ? "bg-foreground text-background border-foreground"
                      : "border-border bg-surface text-muted-foreground hover:text-foreground hover:border-[#484f58]"
                  }`}
                >
                  <span
                    style={{
                      fontFamily:
                        f === "serif"
                          ? '"Playfair Display", serif'
                          : f === "sans"
                            ? '"Space Grotesk", sans-serif'
                            : '"IBM Plex Mono", monospace',
                    }}
                    className="text-[13px] leading-none"
                  >
                    Aa
                  </span>
                  {f === "serif" ? "Serif" : f === "sans" ? "Sans" : "Mono"}
                </button>
              ))}
            </div>

            {/* Size + actions */}
            <div className="flex items-center gap-2 md:gap-3 w-full md:w-auto">
              <span className="text-[10px] tracking-[0.16em] uppercase text-muted-foreground">
                Size
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSize((s) => Math.max(14, s - 2));
                }}
                className="h-8 w-8 rounded-full border border-border bg-surface flex items-center justify-center hover:bg-surface-elevated active:scale-95 text-muted-foreground"
              >
                −
              </button>
              <input
                type="range"
                min={14}
                max={72}
                value={size}
                onChange={(e) => setSize(parseInt(e.target.value))}
                onClick={(e) => e.stopPropagation()}
                className="flex-1 md:w-[160px] h-1 appearance-none bg-border rounded-full accent-foreground cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-foreground"
              />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSize((s) => Math.min(72, s + 2));
                }}
                className="h-8 w-8 rounded-full border border-border bg-surface flex items-center justify-center hover:bg-surface-elevated active:scale-95 text-muted-foreground"
              >
                +
              </button>
              <span className="ml-1 text-[11px] tabular-nums text-muted-foreground min-w-[36px]">
                {size}px
              </span>

              {/* Download */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  downloadPNG();
                }}
                disabled={downloading}
                className="h-8 px-3 rounded-full border border-border bg-surface flex items-center justify-center gap-1.5 hover:bg-surface-elevated active:scale-95 disabled:opacity-50"
                title={isMobile ? "Save / Share" : "Download PNG"}
              >
                {downloading ? (
                  <span className="text-muted-foreground text-xs">⏳</span>
                ) : saved ? (
                  <span className="text-green text-xs">✓</span>
                ) : (
                  <span className="text-muted-foreground text-xs">⬇</span>
                )}
                <span className="text-[11px] text-muted-foreground">{isMobile ? "Save" : "Download"}</span>
              </button>

              {/* Copy */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  copyQuote();
                }}
                className="h-8 w-8 rounded-full border border-border bg-surface flex items-center justify-center hover:bg-surface-elevated active:scale-95"
                title="Copy quote"
              >
                {copied ? (
                  <span className="text-green text-xs">✓</span>
                ) : (
                  <span className="text-muted-foreground text-xs">📋</span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
