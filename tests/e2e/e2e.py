"""End-to-end browser tests for Neuron Quest (Playwright, Python).

Run against a production build:
    npm run build && python3 tests/e2e/e2e.py
Set BASE_URL to test an already-running or deployed site, e.g.
    BASE_URL=https://your-site.vercel.app python3 tests/e2e/e2e.py
"""
import os
import re
import socket
import subprocess
import sys
import time
from pathlib import Path

from playwright.sync_api import Page, expect, sync_playwright

ROOT = Path(__file__).resolve().parents[2]
SHOTS = ROOT / "tests" / "e2e" / "screenshots"
SHOTS.mkdir(parents=True, exist_ok=True)

ROUTES = [
    "/",
    "/learn",
    "/learn/fundamentals",
    "/learn/tools",
    "/learn/ethics",
    "/learn/fundamentals/what-is-ai",
    "/learn/fundamentals/how-machines-learn",
    "/learn/fundamentals/neural-networks-llms",
    "/learn/tools/ai-toolbox",
    "/learn/tools/prompting",
    "/learn/tools/study-and-verify",
    "/learn/ethics/bias-fairness",
    "/learn/ethics/academic-integrity",
    "/learn/ethics/privacy-deepfakes",
    "/dashboard",
    "/glossary",
    "/about",
    "/references",
    "/work-log",
    "/signin",
    "/this-page-does-not-exist",
]

results: list[tuple[str, bool, str]] = []


def check(name: str):
    def deco(fn):
        def run(*a, **kw):
            try:
                fn(*a, **kw)
                results.append((name, True, ""))
                print(f"  PASS  {name}")
            except Exception as e:  # noqa: BLE001
                results.append((name, False, str(e).splitlines()[0][:300]))
                print(f"  FAIL  {name}: {str(e).splitlines()[0][:300]}")
        return run
    return deco


def fresh(page: Page, base: str, path: str = "/"):
    page.goto(base + "/")
    page.evaluate("localStorage.clear()")
    page.goto(base + path)
    page.wait_for_load_state("networkidle")


def open_practice(page: Page):
    """Walk the lesson stepper: answer each quick check correctly, press Continue, until the activity shows."""
    for _ in range(12):
        if page.get_by_test_id("activity").count():
            return
        cps = page.get_by_test_id("checkpoint")
        if cps.count():
            cp = cps.last
            if cp.get_attribute("data-answered") != "true":
                choices = cp.locator(".choice")
                for i in range(choices.count()):
                    choices.nth(i).click()
                    if cp.get_attribute("data-answered") == "true":
                        break
        page.get_by_test_id("continue").click()
    expect(page.get_by_test_id("activity")).to_be_visible()


def xp_pill(page: Page) -> str:
    return page.locator(".xp-pill").first.inner_text()


# ---------------------------------------------------------------- tests
@check("every route renders an h1 with no console errors (desktop + mobile)")
def t_routes(browser, base):
    for vw, vh, tag in [(1280, 900, "desktop"), (375, 812, "mobile")]:
        ctx = browser.new_context(viewport={"width": vw, "height": vh})
        page = ctx.new_page()
        errors: list[str] = []
        page.on("console", lambda m: errors.append(m.text) if m.type == "error" else None)
        page.on("pageerror", lambda e: errors.append(str(e)))
        for r in ROUTES:
            page.goto(base + r)
            page.wait_for_load_state("networkidle")
            expect(page.locator("h1").first).to_be_visible()
            overflow = page.evaluate("document.documentElement.scrollWidth - window.innerWidth")
            assert overflow <= 1, f"{tag} {r}: horizontal overflow {overflow}px"
            name = (r.strip("/").replace("/", "_") or "home")
            if tag == "desktop" or r in ("/", "/learn/tools/prompting", "/dashboard"):
                page.screenshot(path=str(SHOTS / f"{tag}_{name}.png"), full_page=True)
        assert not errors, f"{tag} console errors: {errors[:3]}"
        ctx.close()


@check("home links to 3+ separate pages")
def t_home_links(page, base):
    fresh(page, base)
    for href in ["/learn", "/dashboard", "/glossary", "/about", "/references", "/work-log"]:
        assert page.locator(f'a[href="{href}"]').count() > 0, f"missing link {href}"
    page.get_by_role("link", name=re.compile("Start learning")).click()
    expect(page).to_have_url(re.compile("/learn/fundamentals/what-is-ai$"))


@check("complete lesson 1.1: XP, completion, badges, and persistence after reload")
def t_lesson_flow(page, base):
    fresh(page, base, "/learn/fundamentals/what-is-ai")
    open_practice(page)
    assert "0 XP" in xp_pill(page)
    act = page.get_by_test_id("activity")
    items = act.get_by_test_id("sort-item")
    for i, bucket in enumerate(["AI", "Not AI", "AI", "Not AI", "AI", "Not AI"]):
        items.nth(i).get_by_role("button", name=bucket, exact=True).click()
    act.get_by_role("button", name="Check answers").click()
    expect(act.get_by_text("6 / 6 correct.")).to_be_visible()
    expect(page.locator(".xp-pill")).to_contain_text("30 XP")

    quiz = page.get_by_test_id("quiz")
    for ans in [1, 2, 0]:
        quiz.get_by_role("radio").nth(ans).click()
        quiz.get_by_role("button", name="Check answer").click()
        expect(quiz.get_by_text("Correct!")).to_be_visible()
        quiz.get_by_role("button", name=re.compile("Next question|See results")).click()
    expect(quiz.get_by_text("3 / 3")).to_be_visible()
    expect(page.get_by_test_id("lesson-complete")).to_be_visible()
    expect(page.locator(".xp-pill")).to_contain_text("60 XP")
    expect(page.locator(".toasts")).to_contain_text("Badge unlocked")
    page.screenshot(path=str(SHOTS / "flow_lesson_complete.png"), full_page=False)

    page.reload()
    page.wait_for_load_state("networkidle")
    expect(page.locator(".xp-pill")).to_contain_text("60 XP")
    expect(page.get_by_test_id("lesson-complete")).to_be_visible()

    page.goto(base + "/dashboard")
    expect(page.get_by_test_id("xp-total")).to_have_text("60 XP")
    expect(page.get_by_test_id("badge-first-steps")).to_have_attribute("data-unlocked", "true")
    expect(page.get_by_test_id("badge-perfect-score")).to_have_attribute("data-unlocked", "true")
    expect(page.get_by_test_id("badge-portal-master")).to_have_attribute("data-unlocked", "false")
    expect(page.get_by_test_id("dash-module-fundamentals")).to_contain_text("1 of 3 lessons done")


@check("failing a quiz (1/3) does not complete the lesson, and retry keeps the best score")
def t_quiz_fail(page, base):
    fresh(page, base, "/learn/ethics/bias-fairness")
    open_practice(page)
    quiz = page.get_by_test_id("quiz")
    for ans in [0, 0, 1]:  # correct answers are 1,1,1 -> only the last is right
        quiz.get_by_role("radio").nth(ans).click()
        quiz.get_by_role("button", name="Check answer").click()
        quiz.get_by_role("button", name=re.compile("Next question|See results")).click()
    expect(quiz.get_by_text("1 / 3")).to_be_visible()
    expect(quiz.get_by_text(re.compile("You need 2 correct"))).to_be_visible()
    expect(page.get_by_test_id("lesson-complete")).to_have_count(0)
    expect(page.locator(".xp-pill")).to_contain_text("10 XP")


@check("prompt builder: flawless prompt unlocks Prompt Pro; trap parts are flagged")
def t_prompt(page, base):
    fresh(page, base, "/learn/tools/prompting")
    open_practice(page)
    act = page.get_by_test_id("activity")
    act.get_by_role("button", name=re.compile("Then write my 5-paragraph essay")).click()
    act.get_by_role("button", name="Check my prompt").click()
    expect(act.locator(".feedback.bad")).to_contain_text("Deliverable")
    act.get_by_role("button", name="Edit prompt").click()
    act.get_by_role("button", name=re.compile("Then write my 5-paragraph essay")).click()  # remove trap
    for label in ["Act as a history tutor", "Help me understand the three", "I have a quiz Friday", "Explain in a short bulleted"]:
        act.get_by_role("button", name=re.compile(label)).click()
    act.get_by_role("button", name="Check my prompt").click()
    expect(act.get_by_text("Flawless prompt!")).to_be_visible()
    page.goto(base + "/dashboard")
    expect(page.get_by_test_id("badge-prompt-pro")).to_have_attribute("data-unlocked", "true")


@check("train-spam: correct labels give 4/4; wrong labels reduce accuracy")
def t_spam(page, base):
    fresh(page, base, "/learn/fundamentals/how-machines-learn")
    open_practice(page)
    act = page.get_by_test_id("activity")
    msgs = act.get_by_test_id("train-msg")
    truth = [True, False, True, False, True, False, True, False]
    for i, spam in enumerate(truth):
        msgs.nth(i).get_by_role("button", name="Spam" if spam else "Not spam", exact=True).click()
    act.get_by_role("button", name="Train my model").click()
    expect(act.get_by_text("Test accuracy: 4 / 4.")).to_be_visible()
    act.get_by_role("button", name="Change labels and retrain").click()
    for i, spam in enumerate(truth):
        msgs.nth(i).get_by_role("button", name="Not spam" if spam else "Spam", exact=True).click()
    act.get_by_role("button", name="Train my model").click()
    expect(act.get_by_text("Test accuracy: 0 / 4.")).to_be_visible()
    expect(act.get_by_text(re.compile("Garbage in, garbage out"))).to_be_visible()


@check("spot-the-hallucination and scenario activities complete")
def t_spot_scenario(page, base):
    fresh(page, base, "/learn/tools/study-and-verify")
    open_practice(page)
    act = page.get_by_test_id("activity")
    for i in [2, 4, 5]:
        act.locator(".sentence").nth(i).click()
    act.get_by_role("button", name="Check my picks").click()
    expect(act.get_by_text("6 / 6 sentences judged correctly.")).to_be_visible()

    page.goto(base + "/learn/ethics/privacy-deepfakes")
    open_practice(page)
    act = page.get_by_test_id("activity")
    act.get_by_role("button", name=re.compile("Check the school")).click()
    expect(act.get_by_text("Great call.")).to_be_visible()
    act.get_by_role("button", name="Next situation").click()
    act.get_by_role("button", name=re.compile("Upload it. It")).click()
    expect(act.get_by_text("Think again.")).to_be_visible()
    act.get_by_role("button", name="Finish").click()
    expect(act.get_by_text("1 / 2 best choices.")).to_be_visible()
    expect(page.locator(".xp-pill")).to_contain_text("60 XP")  # 30 (spot) + 30 (scenario)


@check("next-token game shows probabilities and finishes")
def t_next_token(page, base):
    fresh(page, base, "/learn/fundamentals/neural-networks-llms")
    open_practice(page)
    act = page.get_by_test_id("activity")
    for w in ["jelly", "Armstrong", "lunch"]:
        act.get_by_role("button", name=w, exact=True).click()
        expect(act.locator(".prob-row")).to_have_count(4)
        act.get_by_role("button", name=re.compile("Next sentence|Finish")).click()
    expect(act.get_by_text(re.compile("2 / 3 matched"))).to_be_visible()


@check("dashboard reset requires confirmation and clears progress")
def t_reset(page, base):
    fresh(page, base, "/learn/tools/ai-toolbox")
    open_practice(page)
    act = page.get_by_test_id("activity")
    answers = [0, 1, 2, 0, 1, 2]
    names = ["Chat assistant", "AI search / research", "Speech & accessibility"]
    items = act.get_by_test_id("sort-item")
    for i, a in enumerate(answers):
        items.nth(i).get_by_role("button", name=names[a], exact=True).click()
    act.get_by_role("button", name="Check answers").click()
    page.goto(base + "/dashboard")
    expect(page.get_by_test_id("xp-total")).to_have_text("30 XP")
    page.get_by_role("button", name="Reset my progress").click()
    page.get_by_role("button", name="Cancel").click()
    expect(page.get_by_test_id("xp-total")).to_have_text("30 XP")
    page.get_by_role("button", name="Reset my progress").click()
    page.get_by_role("button", name="Yes, reset everything").click()
    expect(page.get_by_test_id("xp-total")).to_have_text("0 XP")
    page.reload()
    expect(page.get_by_test_id("xp-total")).to_have_text("0 XP")


@check("glossary search filters and shows an empty state")
def t_glossary(page, base):
    fresh(page, base, "/glossary")
    page.get_by_label("Search terms").fill("token")
    expect(page.get_by_test_id("term").filter(has=page.get_by_role("heading", name="Token", exact=True))).to_have_count(1)
    page.get_by_label("Search terms").fill("zzzzqqq")
    expect(page.get_by_text('No terms match "zzzzqqq".')).to_be_visible()
    page.get_by_role("button", name="Clear search").click()
    assert page.get_by_test_id("term").count() >= 20


@check("corrupted saved progress is ignored instead of crashing")
def t_corrupt(page, base):
    page.goto(base + "/")
    page.evaluate("localStorage.setItem('neuronquest.progress.v1', '{not json')")
    page.goto(base + "/dashboard")
    expect(page.get_by_test_id("xp-total")).to_have_text("0 XP")


@check("mobile menu opens and navigates; skip link works")
def t_mobile_nav(browser, base):
    ctx = browser.new_context(viewport={"width": 375, "height": 812})
    page = ctx.new_page()
    page.goto(base + "/")
    page.wait_for_load_state("networkidle")
    page.keyboard.press("Tab")  # first Tab on a fresh load must reach the skip link
    expect(page.locator(".skip-link")).to_be_focused()
    expect(page.locator("#main-nav")).to_be_hidden()
    page.get_by_role("button", name="Menu").click()
    expect(page.locator("#main-nav")).to_be_visible()
    page.screenshot(path=str(SHOTS / "mobile_menu_open.png"))
    page.locator("#main-nav").get_by_role("link", name="Glossary").click()
    expect(page).to_have_url(re.compile("/glossary$"))
    expect(page.locator("#main-nav")).to_be_hidden()
    # after client-side navigation, focus moves to the new page's <main>
    expect(page.locator("#main")).to_be_focused()
    ctx.close()


@check("sign in: create profile, per-profile progress, sign out/in, leaderboard")
def t_profiles(page, base):
    fresh(page, base, "/learn/tools/ai-toolbox")
    open_practice(page)
    act = page.get_by_test_id("activity")
    names = ["Chat assistant", "AI search / research", "Speech & accessibility"]
    items = act.get_by_test_id("sort-item")
    for i, a in enumerate([0, 1, 2, 0, 1, 2]):
        items.nth(i).get_by_role("button", name=names[a], exact=True).click()
    act.get_by_role("button", name="Check answers").click()
    expect(page.locator(".xp-pill")).to_contain_text("30 XP")

    page.get_by_role("link", name="Sign in").first.click()
    expect(page).to_have_url(re.compile("/signin$"))
    page.get_by_label("Nickname").fill("a")
    expect(page.locator("#nick-err")).to_contain_text("at least 2")
    page.get_by_label("Nickname").fill("Nova")
    expect(page.get_by_text("will move into your new profile")).to_be_visible()
    page.locator(".avatar-opt").nth(2).click()
    page.get_by_role("button", name=re.compile("Create profile")).click()
    expect(page).to_have_url(re.compile("/dashboard$"))
    expect(page.get_by_role("heading", name="Hi, Nova!")).to_be_visible()
    expect(page.get_by_test_id("xp-total")).to_have_text("30 XP")  # guest XP carried over
    expect(page.get_by_test_id("leaderboard")).to_contain_text("Nova (you)")
    page.screenshot(path=str(SHOTS / "flow_dashboard_signed_in.png"), full_page=True)

    page.get_by_role("button", name="Account: Nova").click()
    page.get_by_role("menuitem", name="Sign out").click()
    expect(page.locator(".xp-pill")).to_contain_text("0 XP")

    page.goto(base + "/signin")
    page.get_by_role("tab", name="New profile").click()
    page.get_by_label("Nickname").fill("nova")
    expect(page.locator("#nick-err")).to_contain_text("already")
    page.get_by_label("Nickname").fill("Zed")
    page.get_by_role("button", name=re.compile("Create profile")).click()
    expect(page.get_by_test_id("xp-total")).to_have_text("0 XP")
    expect(page.get_by_test_id("leaderboard").locator("li")).to_have_count(2)
    expect(page.get_by_test_id("leaderboard").locator("li").first).to_contain_text("Nova")

    page.goto(base + "/signin")
    page.get_by_role("button", name="Sign in as Nova").click()
    expect(page.get_by_test_id("xp-total")).to_have_text("30 XP")
    page.reload()
    expect(page.get_by_test_id("xp-total")).to_have_text("30 XP")
    expect(page.get_by_role("button", name="Account: Nova")).to_be_visible()

    page.goto(base + "/signin")
    page.get_by_role("button", name="Delete profile Zed").click()
    page.get_by_role("button", name="Delete", exact=True).click()
    expect(page.get_by_test_id("profile-tile")).to_have_count(1)


@check("lesson stepper: quick check gates Continue; flip cards flip")
def t_stepper(page, base):
    fresh(page, base, "/learn/fundamentals/how-machines-learn")
    expect(page.get_by_test_id("activity")).to_have_count(0)
    cont = page.get_by_test_id("continue")
    expect(cont).to_be_disabled()
    cp = page.get_by_test_id("checkpoint").first
    cp.locator(".choice").nth(0).click()  # wrong
    expect(cp.get_by_text("Not quite")).to_be_visible()
    expect(cont).to_be_disabled()
    cp.locator(".choice").nth(1).click()  # right
    expect(cont).to_be_enabled()
    cont.click()
    expect(page.get_by_test_id("lesson-step")).to_have_count(2)
    card = page.get_by_test_id("flip-card").first
    card.click()
    expect(card).to_have_attribute("aria-pressed", "true")
    page.screenshot(path=str(SHOTS / "flow_stepper.png"))
    open_practice(page)
    expect(page.get_by_test_id("quiz")).to_be_visible()


@check("widgets: threshold, neuron, temperature, family tree, prompt compare, bias")
def t_widgets(page, base):
    fresh(page, base, "/learn/fundamentals/how-machines-learn")
    open_practice(page)
    w = page.get_by_test_id("widget-threshold")
    w.locator("input[type=range]").fill("4.5")
    expect(w.get_by_text(re.compile("best any single cut-off can do: 11/12"))).to_be_visible()
    w.get_by_role("button", name=re.compile("Test it on 6 new fruits")).click()
    expect(w.get_by_text("5/6")).to_be_visible()
    w.screenshot(path=str(SHOTS / "widget_threshold.png"))

    page.goto(base + "/learn/fundamentals/neural-networks-llms")
    open_practice(page)
    n = page.get_by_test_id("widget-neuron")
    n.locator("input[type=range]").nth(2).fill("-1.5")
    expect(n.get_by_text(re.compile("Solved!"))).to_be_visible()
    n.screenshot(path=str(SHOTS / "widget_neuron.png"))
    t = page.get_by_test_id("widget-temperature")
    t.locator("input[type=range]").fill("0.2")
    expect(t.locator(".prob-row").first).to_contain_text(re.compile(r"9\d%"))
    t.get_by_role("button", name="Generate 10").click()
    expect(t.locator(".chip")).to_have_count(10)

    page.goto(base + "/learn/fundamentals/what-is-ai")
    open_practice(page)
    f = page.get_by_test_id("widget-family-tree")
    # rings are nested, so a center click hits the inner ring by design; use the keyboard instead
    f.get_by_role("button", name="Machine learning").focus()
    page.keyboard.press("Enter")
    expect(f.get_by_role("heading", name="Machine learning")).to_be_visible()

    page.goto(base + "/learn/tools/prompting")
    open_practice(page)
    pc = page.get_by_test_id("widget-prompt-compare")
    pc.get_by_role("tab", name="Specific prompt").click()
    expect(pc.locator(".ans-line")).to_have_count(6)
    pc.screenshot(path=str(SHOTS / "widget_prompt.png"))

    page.goto(base + "/learn/ethics/bias-fairness")
    open_practice(page)
    b = page.get_by_test_id("widget-bias")
    expect(b.get_by_text(re.compile("-point gap"))).to_be_visible()
    b.locator("input[type=range]").fill("50")
    expect(b.get_by_text(re.compile("Balanced data"))).to_be_visible()


@check("home has marquees (duplicate copy hidden from screen readers) and page transitions")
def t_motion(page, base):
    fresh(page, base, "/")
    expect(page.locator(".marquee")).to_have_count(2)
    expect(page.locator(".marquee-group[aria-hidden=true]")).to_have_count(2)
    expect(page.locator(".page-enter")).to_have_count(1)
    page.get_by_role("link", name="Glossary").first.click()
    expect(page.locator(".page-enter h1")).to_have_text("AI glossary")


# ---------------------------------------------------------------- runner
def port_open(port: int) -> bool:
    with socket.socket() as s:
        return s.connect_ex(("127.0.0.1", port)) == 0


def main():
    base = os.environ.get("BASE_URL", "").rstrip("/")
    server = None
    if not base:
        port = 4173
        server = subprocess.Popen(
            ["npx", "vite", "preview", "--port", str(port), "--strictPort"],
            cwd=ROOT, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL,
        )
        for _ in range(60):
            if port_open(port):
                break
            time.sleep(0.5)
        base = f"http://localhost:{port}"
    try:
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True)
            t_routes(browser, base)
            t_mobile_nav(browser, base)
            for t in [t_home_links, t_lesson_flow, t_quiz_fail, t_prompt, t_spam, t_spot_scenario, t_next_token, t_reset, t_glossary, t_corrupt, t_profiles, t_stepper, t_widgets, t_motion]:
                ctx = browser.new_context(viewport={"width": 1280, "height": 900})
                page = ctx.new_page()
                page.set_default_timeout(5000)
                t(page, base)
                ctx.close()
            browser.close()
    finally:
        if server:
            server.terminate()
    failed = [r for r in results if not r[1]]
    print(f"\n{len(results) - len(failed)}/{len(results)} checks passed")
    sys.exit(1 if failed else 0)


if __name__ == "__main__":
    main()
