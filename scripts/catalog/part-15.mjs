export default [
  {
    category: "Image & Vision",
    type: "image",
    icon: "Camera",
    groups: [
      {
        variants: ["chatgpt", "gemini", "claude", "perplexity", "copilot", "deepseek"],
        verbs: [
          ["GlowUp", "Enhancement", "fix lighting, colour and clarity in one pass for", "Attach the photo and say the platform it's for (feed, DP, marketplace).", "the enhanced image plus a note on what changed"],
          ["SkinReal", "Retouching", "retouch skin so it still looks like skin for", "Attach the portrait. Say how far to go: cleanup only, or full polish.", "a natural retouch with texture kept, no plastic"],
          ["BgSwap", "Backgrounds", "swap the background of", "Attach the photo and name the new setting. Match the original lighting or flag the mismatch.", "the composite with edge cleanup and lighting notes"],
          ["ThumbStop", "Thumbnails", "design three thumbnail concepts that earn the click for", "Describe the video and the audience. Say what emotion should hit in 0.3 seconds.", "three concepts with text overlay under 4 words each"],
          ["FeedGrid", "Aesthetics", "plan a 9-grid feed layout around", "Share your last 9 posts and the vibe you want (calm, loud, minimal).", "a grid plan: which post goes where and why"],
          ["StorySplit", "Stories", "split a long image or text into clean story frames for", "Paste the content and pick the platform (IG, WhatsApp status).", "frame-by-frame layout with safe zones marked"],
          ["ProductShot", "Products", "turn a phone snap into a marketplace-ready product photo for", "Attach the photo. Say the platform (Amazon, Instagram, WhatsApp catalogue).", "the cleaned image with shadow, white background and a square crop"],
          ["ColourGrade", "Grading", "grade a photo or video still toward a specific mood for", "Attach the image and name the mood: warm film, teal night, clean bright.", "the graded image with a 3-slider recipe to repeat it"],
          ["MemeCraft", "Memes", "caption a meme so it lands for", "Attach the template and say the audience (office, gym, exam season).", "three captions ranked, with the punchline placement marked"],
          ["Restyle", "Styles", "restyle a photo as art for", "Attach the photo and pick the style: anime, watercolour, 90s film, poster.", "the restyled image with a prompt you can reuse"],
        ],
        objects: [
          ["Selfie", "a selfie", "selfie, portrait, face", "front-camera snap, mixed lighting, for a profile picture"],
          ["InstaPost", "an Instagram post", "instagram, feed, post", "a travel shot for the grid, vertical 4:5"],
          ["YTVideo", "a YouTube video", "youtube, video, thumbnail", "a coding-tutorial video needing a thumbnail"],
          ["Reel", "a reel frame", "reels, cover, frame", "a cooking reel that needs a cover frame"],
          ["DP", "a display picture", "dp, profile, avatar", "a WhatsApp DP crop check, face must survive tiny circles"],
          ["Listing", "a marketplace listing", "listing, product, marketplace", "a pre-owned phone on OLX, needs trust"],
          ["FamilyPic", "a family photo", "family, group, photo", "12 people, one blinking, sunset backlight"],
          ["OldAlbum", "an old album scan", "album, restore, archive", "1990s prints, faded and scratched"],
          ["Logo", "a logo", "logo, brand, mark", "a bakery logo for Instagram highlight covers"],
          ["FestiveCard", "a festive card", "card, greeting, festive", "a Diwali card for a family WhatsApp group"],
        ],
      },
    ],
  },
];
