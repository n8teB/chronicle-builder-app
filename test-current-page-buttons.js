// Test Current Page Buttons - World Building Page
// Run in browser console to identify failing buttons and their importance

console.log("🧪 Testing buttons on current page:", window.location.pathname);

function testCurrentPageButtons() {
  const results = {
    page: window.location.pathname,
    critical: [],
    important: [],
    minor: [],
    working: [],
    details: {
      totalButtons: 0,
      totalFailing: 0,
      hasStorySelected: false,
    },
  };

  // Check if story is selected
  const storyText = document.querySelector(
    '[data-loc*="StoryManager"]',
  )?.textContent;
  results.details.hasStorySelected =
    storyText &&
    !storyText.includes("Select") &&
    !storyText.includes("No story");

  console.log(
    `📖 Story selected: ${results.details.hasStorySelected ? "✅" : "❌"}`,
  );
  if (storyText) console.log(`Current story: "${storyText}"`);

  // Get all clickable elements
  const clickableElements = document.querySelectorAll(
    'button, [role="button"], a[href], [onclick], input[type="button"], input[type="submit"]',
  );

  results.details.totalButtons = clickableElements.length;
  console.log(`🔍 Found ${clickableElements.length} clickable elements`);

  clickableElements.forEach((element, index) => {
    const text = getElementText(element);
    const rect = element.getBoundingClientRect();

    const buttonInfo = {
      index: index + 1,
      text: text.slice(0, 40),
      tag: element.tagName,
      type: element.type || "N/A",
      visible:
        rect.width > 0 &&
        rect.height > 0 &&
        getComputedStyle(element).display !== "none",
      enabled:
        !element.disabled && element.getAttribute("aria-disabled") !== "true",
      hasHandler: hasClickHandler(element),
      reasons: [],
      element: element,
    };

    // Determine if failing
    const isFailing =
      !buttonInfo.visible || !buttonInfo.enabled || !buttonInfo.hasHandler;

    if (isFailing) {
      results.details.totalFailing++;

      if (!buttonInfo.visible) buttonInfo.reasons.push("not visible");
      if (!buttonInfo.enabled) buttonInfo.reasons.push("disabled");
      if (!buttonInfo.hasHandler) buttonInfo.reasons.push("no handler");

      // Categorize by importance based on text content
      const lowerText = text.toLowerCase();

      if (isCriticalButton(lowerText)) {
        results.critical.push(buttonInfo);
      } else if (isImportantButton(lowerText)) {
        results.important.push(buttonInfo);
      } else {
        results.minor.push(buttonInfo);
      }
    } else {
      results.working.push(buttonInfo);
    }
  });

  return results;
}

function getElementText(element) {
  return (
    element.textContent?.trim() ||
    element.getAttribute("aria-label") ||
    element.getAttribute("title") ||
    element.getAttribute("alt") ||
    element.value ||
    `${element.tagName}`
  );
}

function hasClickHandler(element) {
  // Check for obvious handlers
  if (element.onclick || element.getAttribute("onclick")) return true;
  if (element.href) return true;
  if (element.type === "submit" || element.type === "button") return true;

  // Check for React event listeners (harder to detect, assume buttons have them)
  if (element.tagName === "BUTTON") return true;
  if (element.getAttribute("role") === "button") return true;

  return false;
}

function isCriticalButton(text) {
  const criticalKeywords = [
    "new",
    "save",
    "create",
    "delete",
    "publish",
    "submit",
  ];
  return criticalKeywords.some((keyword) => text.includes(keyword));
}

function isImportantButton(text) {
  const importantKeywords = [
    "edit",
    "preview",
    "export",
    "import",
    "copy",
    "duplicate",
    "upload",
  ];
  return importantKeywords.some((keyword) => text.includes(keyword));
}

function simulateButtonClicks(buttons, maxClicks = 3) {
  console.log(
    `\n🖱️ Testing ${Math.min(buttons.length, maxClicks)} critical buttons with simulated clicks...`,
  );

  buttons.slice(0, maxClicks).forEach((buttonInfo, index) => {
    try {
      console.log(`\n${index + 1}. Testing "${buttonInfo.text}"`);

      // Capture console output
      const originalLog = console.log;
      const originalError = console.error;
      const originalAlert = window.alert;

      let logs = [];

      console.log = (...args) => {
        logs.push(`LOG: ${args.join(" ")}`);
        originalLog(...args);
      };
      console.error = (...args) => {
        logs.push(`ERROR: ${args.join(" ")}`);
        originalError(...args);
      };
      window.alert = (msg) => {
        logs.push(`ALERT: ${msg}`);
        return true;
      };

      // Click the button
      const clickEvent = new MouseEvent("click", {
        bubbles: true,
        cancelable: true,
      });
      buttonInfo.element.dispatchEvent(clickEvent);

      // Restore
      console.log = originalLog;
      console.error = originalError;
      window.alert = originalAlert;

      if (logs.length > 0) {
        console.log(`   Response: ${logs.join("; ")}`);
      } else {
        console.log(`   No console output (may be working via React)`);
      }
    } catch (error) {
      console.error(`   Error: ${error.message}`);
    }
  });
}

// Run the test
console.log("🚀 Starting Current Page Button Test...");
const testResults = testCurrentPageButtons();

// Report results
console.log("\n📊 TEST RESULTS:");
console.log(`Page: ${testResults.page}`);
console.log(`Total buttons: ${testResults.details.totalButtons}`);
console.log(`Working buttons: ${testResults.working.length}`);
console.log(`Failing buttons: ${testResults.details.totalFailing}`);

if (testResults.critical.length > 0) {
  console.log(
    `\n🔴 CRITICAL FAILING BUTTONS (${testResults.critical.length}):`,
  );
  testResults.critical.forEach((btn) => {
    console.log(`  ❌ "${btn.text}" - ${btn.reasons.join(", ")}`);
  });

  simulateButtonClicks(testResults.critical);
}

if (testResults.important.length > 0) {
  console.log(
    `\n🟡 IMPORTANT FAILING BUTTONS (${testResults.important.length}):`,
  );
  testResults.important.forEach((btn) => {
    console.log(`  ⚠️ "${btn.text}" - ${btn.reasons.join(", ")}`);
  });
}

if (testResults.minor.length > 0) {
  console.log(`\n⚫ MINOR FAILING BUTTONS (${testResults.minor.length}):`);
  testResults.minor.forEach((btn) => {
    console.log(`  • "${btn.text}" - ${btn.reasons.join(", ")}`);
  });
}

console.log(`\n✅ WORKING BUTTONS (${testResults.working.length}):`);
testResults.working
  .filter(
    (btn) =>
      isCriticalButton(btn.text.toLowerCase()) ||
      isImportantButton(btn.text.toLowerCase()),
  )
  .forEach((btn) => {
    console.log(`  ✅ "${btn.text}"`);
  });

// Final recommendation
console.log("\n💡 RECOMMENDATION:");
if (testResults.critical.length > 0) {
  console.log("🔴 FIX CRITICAL BUTTONS - Core functionality is broken!");
} else if (testResults.important.length > 0) {
  console.log(
    "🟡 Consider fixing important buttons - Secondary features affected",
  );
} else {
  console.log(
    "✅ All critical buttons working - Only minor UI elements failing",
  );
}

console.log("\n🎯 SUMMARY:");
console.log(`Critical buttons failing: ${testResults.critical.length}`);
console.log(`Important buttons failing: ${testResults.important.length}`);
console.log(`Minor elements failing: ${testResults.minor.length}`);

// Store results
window.currentPageButtonTest = testResults;
console.log("Results stored in window.currentPageButtonTest");

return testResults;
