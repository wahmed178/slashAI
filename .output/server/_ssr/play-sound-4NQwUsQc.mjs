//#region node_modules/.nitro/vite/services/ssr/assets/play-sound-4NQwUsQc.js
/**
* Tiny WebAudio click/whoosh generator so interactions feel tactile without
* shipping any audio assets. Silently no-ops on the server or when muted.
*/
var ctx = null;
function context() {
	if (typeof window === "undefined") return null;
	const Ctor = window.AudioContext ?? window.webkitAudioContext;
	if (!Ctor) return null;
	if (!ctx) ctx = new Ctor();
	ctx.resume();
	return ctx;
}
var MUTE_KEY = "slashai.sound.muted";
function isMuted() {
	if (typeof window === "undefined") return true;
	return window.localStorage.getItem(MUTE_KEY) === "1";
}
function setMuted(muted) {
	if (typeof window === "undefined") return;
	window.localStorage.setItem(MUTE_KEY, muted ? "1" : "0");
}
var TONES = {
	tap: {
		from: 520,
		to: 700,
		ms: 70,
		type: "triangle"
	},
	flip: {
		from: 300,
		to: 900,
		ms: 260,
		type: "sine"
	},
	roll: {
		from: 220,
		to: 480,
		ms: 200,
		type: "square"
	},
	win: {
		from: 660,
		to: 1320,
		ms: 380,
		type: "sine"
	}
};
function playTone(tone = "tap") {
	if (isMuted()) return;
	const ac = context();
	if (!ac) return;
	const { from, to, ms, type } = TONES[tone];
	const osc = ac.createOscillator();
	const gain = ac.createGain();
	const now = ac.currentTime;
	const end = now + ms / 1e3;
	osc.type = type;
	osc.frequency.setValueAtTime(from, now);
	osc.frequency.exponentialRampToValueAtTime(to, end);
	gain.gain.setValueAtTime(1e-4, now);
	gain.gain.exponentialRampToValueAtTime(.08, now + .015);
	gain.gain.exponentialRampToValueAtTime(1e-4, end);
	osc.connect(gain).connect(ac.destination);
	osc.start(now);
	osc.stop(end + .02);
}
/** Short haptic buzz on devices that support it. */
function buzz(ms = 12) {
	if (typeof navigator === "undefined" || !("vibrate" in navigator)) return;
	try {
		navigator.vibrate(ms);
	} catch {}
}
function feedback(tone = "tap") {
	playTone(tone);
	buzz(tone === "tap" ? 8 : 18);
}
//#endregion
export { isMuted as n, setMuted as r, feedback as t };
