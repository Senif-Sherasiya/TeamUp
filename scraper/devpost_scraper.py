from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from pymongo import MongoClient
import time

# ======= USER INPUT RANGE =======
START_INDEX = 1
END_INDEX = 7
# ================================

# Setup Chrome
options = Options()
# options.add_argument("--headless")
driver = webdriver.Chrome(options=options)
wait = WebDriverWait(driver, 10)

# MongoDB setup
client = MongoClient("mongodb://localhost:27017/")
db = client["devmate"]
collection = db["hackathons"]

# Visit Devpost
driver.get("https://devpost.com/hackathons")
time.sleep(2)

# === SMART SCROLLING STRATEGY ===

def fast_scroll_to(driver, target_index, approx_tile_height=300):
    """Fast scrolls quickly to get near the target index"""
    scroll_target = target_index * approx_tile_height
    driver.execute_script(f"window.scrollTo(0, {scroll_target});")
    time.sleep(2)

def load_hackathon_links(driver, start_index, end_index, max_scrolls=50):
    """Load tiles in a target range efficiently"""
    tile_links = []
    seen_links = set()
    scroll_count = 0

    while len(tile_links) < (end_index - start_index) and scroll_count < max_scrolls:
        driver.execute_script("window.scrollBy(0, window.innerHeight);")
        time.sleep(1.5)

        tiles = driver.find_elements(By.CLASS_NAME, "hackathon-tile")
        for i in range(len(tiles)):
            if i >= start_index and i < end_index:
                try:
                    link = tiles[i].find_element(By.CSS_SELECTOR, "a.tile-anchor").get_attribute("href")
                    if link and link not in seen_links:
                        tile_links.append(link)
                        seen_links.add(link)
                except:
                    continue

        scroll_count += 1
    return tile_links

# Step 1: Fast scroll near START_INDEX
fast_scroll_to(driver, START_INDEX)

# Step 2: Slow scroll + collect links within range
tile_links = load_hackathon_links(driver, START_INDEX, END_INDEX)

print(f"✅ Collected {len(tile_links)} hackathon links between index {START_INDEX} and {END_INDEX}")

# Scrape details for each collected link
for url in tile_links:
    try:
        print(f"\n🔗 Visiting: {url}")
        driver.get(url)
        wait.until(EC.presence_of_element_located((By.ID, "introduction")))

        if collection.find_one({"url": url}):
            print("⚠️ Already exists in MongoDB. Skipping.")
            continue

        # === Safe field parsing with fallback ===
        def safe_find_text(selector, by=By.CSS_SELECTOR, attr=None):
            try:
                elem = driver.find_element(by, selector)
                return elem.get_attribute(attr).strip() if attr else elem.text.strip()
            except:
                return "N/A"

        def safe_find_all_texts(selector):
            try:
                elements = driver.find_elements(By.CSS_SELECTOR, selector)
                return [el.text.strip() for el in elements if el.text.strip()]
            except:
                return []

        intro = driver.find_element(By.ID, "introduction")
        title = safe_find_text("h1", by=By.CSS_SELECTOR)
        subtitle = safe_find_text("h3", by=By.CSS_SELECTOR)

        eligibility = safe_find_all_texts("#eligibility-list li")
        deadline = safe_find_text("#time-left", attr="title")
        host = safe_find_text(".host-label")

        info_blocks = driver.find_elements(By.CSS_SELECTOR, ".info-with-icon .info")
        location = info_blocks[0].text.strip() if len(info_blocks) > 0 else "N/A"
        visibility = info_blocks[1].text.strip() if len(info_blocks) > 1 else "N/A"

        participants = safe_find_text("td.nowrap strong")
        prize = safe_find_text(".prizes-link strong")
        themes = safe_find_all_texts(".theme-label")

        # === Save to MongoDB ===
        hackathon_data = {
            "title": title,
            "subtitle": subtitle,
            "url": url,
            "deadline": deadline,
            "location": location,
            "visibility": visibility,
            "host": host,
            "eligibility": eligibility,
            "participants": participants,
            "prize": prize,
            "themes": themes
        }

        collection.insert_one(hackathon_data)
        print("✅ Stored in MongoDB.")

    except Exception as e:
        print(f"❌ Error scraping {url}: {e}")

driver.quit()
