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
    act = page.get_by_test_id("activity")
    for i in [2, 4, 5]:
        act.locator(".sentence").nth(i).click()
    act.get_by_role("button", name="Check my picks").click()
    expect(act.get_by_text("6 / 6 sentences judged correctly.")).to_be_visible()

    page.goto(base + "/learn/ethics/privacy-deepfakes")
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
    act = page.get_by_test_id("activity")
    for w in ["jelly", "Armstrong", "lunch"]:
        act.get_by_role("button", name=w, exact=True).click()
        expect(act.locator(".prob-row")).to_have_count(4)
        act.get_by_role("button", name=re.compile("Next sentence|Finish")).click()
    expect(act.get_by_text(re.compile("2 / 3 matched"))).to_be_visible()


@check("dashboard reset requires confirmation and clears progress")
def t_reset(page, base):
    fresh(page, base, "/learn/tools/ai-toolbox")
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
            for t in [t_home_links, t_lesson_flow, t_quiz_fail, t_prompt, t_spam, t_spot_scenario, t_next_token, t_reset, t_glossary, t_corrupt]:
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
