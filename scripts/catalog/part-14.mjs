export default [
  {
    category: "Home & Everyday",
    type: "general",
    icon: "Blocks",
    groups: [
      {
        variants: ["chatgpt", "gemini", "claude", "perplexity", "copilot", "deepseek"],
        verbs: [
          ["Bedtime", "Bedtime", "spin a calming bedtime story for", "Name the child's age, the hero and one gentle theme (sharing, first day, thunder).", "a 3-minute story with a soft ending and one picture idea per beat"],
          ["HomeworkHelper", "Homework", "coach homework without giving the answer for", "Paste the question and what the child already tried. Socratic mode, never just the answer.", "guided questions, a hint ladder and the full solution hidden at the end"],
          ["RainyDay", "Activities", "list 10 indoor activities for a rainy day using only", "Say the age and what you have at home: paper, cups, blankets, a torch.", "10 activities ranked by setup time, zero purchases"],
          ["ExplainKid", "Curiosity", "answer a curious kid question at age level for", "Give the exact question and the child's age. Honest when the answer is unknown.", "a 3-sentence answer, one analogy, one follow-up question to ask back"],
          ["ChoreChart", "Chores", "build a chore chart that actually gets done for", "List the kids' ages and the chores. Say what rewards are allowed.", "a weekly chart, fair rotation, and a Sunday review script"],
          ["ScreenTime", "Screen Time", "negotiate a screen-time deal that sticks for", "State the age, the current fight and what non-screen options exist.", "a written deal both sides sign, with a review date"],
          ["PartyPlan", "Parties", "plan a birthday party run-sheet for", "Say the age, the guest count, budget and whether it's at home.", "an hour-by-hour run sheet with a plan-B for meltdowns"],
          ["SiblingPeace", "Siblings", "defuse a recurring sibling fight pattern for", "Describe the fight: what starts it, what mom says, what escalates.", "a household script plus two games that teach turn-taking"],
          ["LearningGame", "Learning", "turn today's lesson into a living-room game for", "Say the topic (fractions, spelling, tables) and the age.", "a 10-minute game using household items, with scoring"],
          ["MannersCoach", "Manners", "teach one manners habit this week for", "Pick the habit (greetings, table, please/thank-you) and the age.", "a 7-day mini plan with a tiny daily win"],
        ],
        objects: [
          ["Age3", "a 3-year-old", "toddler, preschool, young", "tantrum at bedtime, loves dinosaurs"],
          ["Age5", "a 5-year-old", "kindergarten, early, young", "first school sports day, nervous"],
          ["Age8", "an 8-year-old", "primary, elementary, kid", "fractions homework, loves cricket"],
          ["Age10", "a 10-year-old", "primary, tween, kid", "wants a phone, friends have YouTube channels"],
          ["Age12", "a 12-year-old", "tween, middle-school, kid", "group projects, first social media pressure"],
          ["Age14", "a 14-year-old", "teen, high-school, teen", "exam stress, sleeps late, hockey"],
          ["Twins", "twins", "twins, siblings, pair", "same age, constant comparison"],
          ["Grandparents", "grandparents", "grandparents, family, bond", "visiting for a month, want one-on-one rituals"],
          ["WholeFamily", "the whole family", "family, together, ritual", "two working parents, one hour after dinner"],
          ["NeighbourKids", "the neighbourhood crew", "friends, playdate, group", "5-6 kids, mixed ages, one courtyard"],
        ],
      },
    ],
  },
];
