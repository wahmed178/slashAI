/**
 * Smoke test for the cricket games.
 *
 * Plays thousands of simulated deliveries through the pure match logic in
 * lib/games/cricket-2 and checks the invariants a real innings has to hold:
 * runs stay in range, an innings can never lose more than WICKETS wickets or
 * bowl more balls than the format allows, milestones fire exactly once, and a
 * generated bracket never hands you the same opponent twice.
 *
 * These are the failures that are invisible on screen until they happen
 * mid-match, so they are worth pinning down here.
 *
 * Run: bun scripts/cricket:smoke
 */
let failures = 0;
const ok = (cond, msg) => {
  if (cond) return;
  console.log(`  ❌ ${msg}`);
  failures++;
};

const L = await import("../src/lib/games/cricket-2.ts");

const teams = L.INTERNATIONAL_TEAMS;
const [batTeam, bowlTeam] = teams;

/* ── one delivery always resolves to a legal outcome ─────────────────── */

const tally = { dot: 0, one: 0, two: 0, three: 0, four: 0, six: 0, wicket: 0 };
for (const d of L.DIFFICULTIES) {
  const ctx = {
    overs: 5,
    difficulty: d.id,
    innings: 1,
    userAction: "bat",
    first: L.emptyInnings(),
    second: L.emptyInnings(),
    batting: batTeam,
    bowling: bowlTeam,
  };
  for (const shot of L.SHOTS) {
    for (const bowl of L.BOWLS) {
      for (let i = 0; i < 250; i++) {
        const o = L.rollOutcome(ctx, shot, bowl, true);
        ok(o.runs >= 0 && o.runs <= 6, `illegal run value ${o.runs}`);
        ok(!(o.six && o.runs !== 6), "six flagged on a non-six");
        ok(!(o.four && o.runs !== 4), "four flagged on a non-four");
        ok(!(o.wicket && o.runs !== 0), "wicket credited with runs");
        if (o.wicket) tally.wicket++;
        else if (o.six) tally.six++;
        else if (o.four) tally.four++;
        else if (o.runs === 0) tally.dot++;
        else if (o.runs === 1) tally.one++;
        else if (o.runs === 2) tally.two++;
        else if (o.runs === 3) tally.three++;
        else ok(false, `unhandled run value ${o.runs}`);
      }
    }
  }
}
const total = Object.values(tally).reduce((a, b) => a + b, 0);
ok(total > 0, "no deliveries were simulated");
console.log(
  `  delivery mix: ${Object.entries(tally)
    .map(([k, v]) => `${k} ${((v / total) * 100).toFixed(1)}%`)
    .join(" · ")}`,
);

/* ── an innings always terminates inside the format's limits ─────────── */

for (const fmt of L.FORMATS) {
  for (const diff of L.DIFFICULTIES) {
    const limit = fmt.overs * 6;
    for (let m = 0; m < 40; m++) {
      for (const innings of [1, 2]) {
        let inn = L.newInnings(batTeam, bowlTeam);
        while (inn.balls < limit && inn.wickets < L.WICKETS) {
          const ctx = {
            overs: fmt.overs,
            difficulty: diff.id,
            innings,
            userAction: "bat",
            first: inn,
            second: L.emptyInnings(),
            batting: batTeam,
            bowling: bowlTeam,
          };
          const bowl = L.aiBowl(ctx);
          const shot = L.aiShot(ctx, bowl);
          const o = L.rollOutcome(ctx, shot, bowl, true);
          inn = {
            ...inn,
            runs: inn.runs + o.runs,
            wickets: inn.wickets + (o.wicket ? 1 : 0),
            balls: inn.balls + 1,
            events: [...inn.events, o],
          };
        }
        ok(inn.wickets <= L.WICKETS, `${fmt.overs}ov ${diff.id}: too many wickets`);
        ok(inn.balls <= limit, `${fmt.overs}ov ${diff.id}: over-bowled`);
        ok(inn.balls === inn.events.length, `${fmt.overs}ov ${diff.id}: event log desynced`);
        ok(inn.balls > 0, `${fmt.overs}ov ${diff.id}: innings ended without a ball`);
      }
    }
  }
}

/* ── the batting order can cover a full five-wicket collapse ─────────── */

/*
 * Regression: the match reducer sets the next striker to `wickets + 1`, so
 * the order has to reach index WICKETS. Squads only carry five players, and
 * slicing to WICKETS + 1 used to hand back five slots, which left the sixth
 * undefined and crashed the delivery after the fourth wicket.
 */
for (const t of [...Object.values(L.LEAGUE_TEAMS).flat(), ...L.INTERNATIONAL_TEAMS]) {
  for (const opp of [batTeam, bowlTeam]) {
    const order = L.newInnings(t, opp).batsmen;
    ok(
      order.length >= L.WICKETS + 1,
      `${t.id}: only ${order.length} batting slots, reducer reaches index ${L.WICKETS}`,
    );
    for (let i = 0; i <= L.WICKETS; i++) {
      ok(order[i] !== undefined, `${t.id}: batting slot ${i} is undefined`);
    }
    ok(new Set(order.map((b) => b.name)).size === order.length, `${t.id}: duplicate batting slot`);
  }
}
ok(L.newInnings(batTeam, bowlTeam).bowlers.length > 0, "no bowlers picked");

/* ── milestones fire once, in order ──────────────────────────────────── */

ok(L.nextMilestone(0, []) === null, "milestone fired at 0 runs");
ok(L.nextMilestone(49, []) === null, "milestone fired before it was reached");
ok(L.nextMilestone(50, []) === 50, "50 not offered at 50");
ok(L.nextMilestone(50, [50]) === null, "50 offered twice");
ok(L.nextMilestone(120, [50]) === 100, "100 not offered after 50");
ok(L.nextMilestone(210, [50, 100, 150, 200]) === null, "milestone past the last one");
for (let i = 1; i <= 220; i += 7) {
  const seen = [];
  let guard = 0;
  for (;;) {
    const m = L.nextMilestone(i, seen);
    if (m === null) break;
    ok(!seen.includes(m), `milestone ${m} repeated within one innings`);
    seen.push(m);
    if (++guard > 10) {
      ok(false, "milestone loop did not terminate");
      break;
    }
  }
}

/* ── overs notation ─────────────────────────────────────────────────── */

ok(L.oversText(0) === "0.0", `oversText(0) = ${L.oversText(0)}`);
ok(L.oversText(6) === "1.0", `oversText(6) = ${L.oversText(6)}`);
ok(L.oversText(7) === "1.1", `oversText(7) = ${L.oversText(7)}`);
ok(L.oversText(30) === "5.0", `oversText(30) = ${L.oversText(30)}`);

/* ── brackets are complete and free of duplicate opponents ───────────── */

for (const type of ["domestic", "international"]) {
  for (const league of L.LEAGUES) {
    if (type === "international" && league.id !== "intl") continue;
    const pool = L.poolFor(type, league);
    for (const p of pool) {
      for (const fmt of L.FORMATS) {
        for (let t = 0; t < 60; t++) {
          const ids = L.buildRounds(type, league, p.id, fmt).map((r) => r.opponentId);
          ok(
            ids.every((x) => x !== null),
            `${league.id} ${fmt.rounds.length}r: empty slot`,
          );
          ok(!ids.includes(p.id), `${league.id}: player listed as its own opponent`);
          const dupes = ids.filter((x, i) => ids.indexOf(x) !== i);
          ok(
            dupes.length === 0,
            `${league.id} ${fmt.rounds.length}r: same opponent twice (${dupes.join(",")})`,
          );
        }
      }
    }
  }
}

/* ── weighted picks always land on a real item ───────────────────────── */

for (let i = 0; i < 3000; i++) {
  const w = L.pickWeighted([1, 2, 3], (x) => (x === 2 ? 0 : 1));
  ok(w === 1 || w === 2 || w === 3, "pickWeighted returned an impossible item");
}

/* ── campaign scoring ────────────────────────────────────────────────── */

ok(L.campaignScore(100, 2, true) === 1000, "campaignScore with trophy");
ok(L.campaignScore(100, 2, false) === 500, "campaignScore without trophy");
ok(L.campaignScore(0, 0, false) === 0, "campaignScore of nothing");

/* ── player of the match comes from the real scorecards ──────────────── */

ok(
  L.playerOfTheMatch(L.emptyInnings(), L.emptyInnings()) === null,
  "star player of an empty match",
);

{
  // A big knock should beat a tidy-but-goalless spell.
  const a = L.emptyInnings();
  a.batsmen = [
    { name: "Big Hitter", role: "Batsman", runs: 74, balls: 40, fours: 9, sixes: 2, out: true },
  ];
  a.bowlers = [{ name: "Tidy", balls: 24, runs: 30, wickets: 0 }];
  const star = L.playerOfTheMatch(a, L.emptyInnings());
  ok(star?.name === "Big Hitter", `expected the big knock, got ${star?.name}`);
  ok(Number.isFinite(star?.impact ?? NaN), "impact is not a finite number");
}

{
  // And a five-for should beat a modest score. Regression: reading the bowler's
  // wicket field under the wrong name produced NaN, which never wins a `>`
  // comparison, so the spell was silently ignored and the scorer "won".
  const a = L.emptyInnings();
  a.batsmen = [
    { name: "Scratch", role: "Batsman", runs: 22, balls: 30, fours: 2, sixes: 0, out: true },
  ];
  a.bowlers = [{ name: "Wicket-taker", balls: 36, runs: 28, wickets: 5 }];
  const star = L.playerOfTheMatch(a, L.emptyInnings());
  ok(star?.name === "Wicket-taker", `expected the five-for, got ${star?.name}`);
  ok(star?.line === "5/28 from 6.0", `unexpected bowling line: ${star?.line}`);
}

{
  // It reads both innings, not just the first.
  const a = L.emptyInnings();
  const b = L.emptyInnings();
  a.batsmen = [
    {
      name: "First innings hero",
      role: "Batsman",
      runs: 40,
      balls: 30,
      fours: 5,
      sixes: 0,
      out: true,
    },
  ];
  b.batsmen = [
    {
      name: "Second innings star",
      role: "Batsman",
      runs: 91,
      balls: 42,
      fours: 11,
      sixes: 4,
      out: false,
    },
  ];
  const star = L.playerOfTheMatch(a, b);
  ok(star?.name === "Second innings star", `expected the second-innings star, got ${star?.name}`);
}

if (failures === 0) {
  console.log("\n✅ cricket: all checks passed");
} else {
  console.log(`\n❌ cricket: ${failures} check(s) failed`);
}
process.exit(failures ? 1 : 0);
