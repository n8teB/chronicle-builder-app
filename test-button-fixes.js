// Test Script to Verify Button Fixes
// Run this in the browser console to test the fixed buttons

console.log("🧪 Testing Button Fixes...");

// Test all "New" buttons on current page
function testNewButtonsFixed() {
  console.log("🆕 Testing New Buttons...");

  const newButtons = Array.from(document.querySelectorAll("button")).filter(
    (btn) => btn.textContent && btn.textContent.toLowerCase().includes("new"),
  );

  console.log(`Found ${newButtons.length} "New" buttons to test`);

  newButtons.forEach((btn, index) => {
    console.log(
      `\n🔍 Testing Button ${index + 1}: "${btn.textContent.trim()}"`,
    );

    // Create a click event to test the handler
    try {
      const clickEvent = new MouseEvent("click", {
        bubbles: true,
        cancelable: true,
        view: window,
      });

      // Capture console output to see if our error handling works
      const originalConsoleLog = console.log;
      const originalConsoleError = console.error;
      const originalAlert = window.alert;

      let logMessages = [];
      let errorMessages = [];
      let alertMessages = [];

      console.log = (...args) => {
        logMessages.push(args.join(" "));
        originalConsoleLog(...args);
      };

      console.error = (...args) => {
        errorMessages.push(args.join(" "));
        originalConsoleError(...args);
      };

      window.alert = (message) => {
        alertMessages.push(message);
        originalAlert(message);
      };

      // Trigger the click
      btn.dispatchEvent(clickEvent);

      // Restore original functions
      console.log = originalConsoleLog;
      console.error = originalConsoleError;
      window.alert = originalAlert;

      // Report results
      console.log(`✅ Button clicked successfully`);
      if (logMessages.length > 0) {
        console.log(`📝 Log messages:`, logMessages);
      }
      if (errorMessages.length > 0) {
        console.log(`❌ Error messages:`, errorMessages);
      }
      if (alertMessages.length > 0) {
        console.log(`🚨 Alert messages:`, alertMessages);
      }
    } catch (error) {
      console.error(`❌ Error testing button: ${error.message}`);
    }
  });
}

// Test Save buttons
function testSaveButtons() {
  console.log("\n💾 Testing Save Buttons...");

  const saveButtons = Array.from(document.querySelectorAll("button")).filter(
    (btn) =>
      btn.textContent &&
      (btn.textContent.toLowerCase().includes("save") ||
        btn.textContent.toLowerCase().includes("publish")),
  );

  console.log(`Found ${saveButtons.length} Save/Publish buttons to test`);

  saveButtons.forEach((btn, index) => {
    console.log(
      `\n💾 Testing Save Button ${index + 1}: "${btn.textContent.trim()}"`,
    );

    try {
      const clickEvent = new MouseEvent("click", {
        bubbles: true,
        cancelable: true,
        view: window,
      });

      // Test the button click
      btn.dispatchEvent(clickEvent);
      console.log(`✅ Save button clicked successfully`);
    } catch (error) {
      console.error(`❌ Error testing save button: ${error.message}`);
    }
  });
}

// Check current story context
function checkStoryContext() {
  console.log("\n📖 Checking Story Context...");

  // Try to find story selector or indicators
  const storyIndicators = [
    document.querySelector('[data-testid="current-story"]'),
    document.querySelector(".story-title"),
    document.querySelector('[class*="story"]'),
    ...Array.from(document.querySelectorAll("*"))
      .filter(
        (el) =>
          el.textContent && el.textContent.toLowerCase().includes("story"),
      )
      .slice(0, 3),
  ].filter(Boolean);

  console.log(`Found ${storyIndicators.length} story context indicators`);

  storyIndicators.forEach((indicator, index) => {
    console.log(
      `📖 Story Indicator ${index + 1}:`,
      indicator.textContent?.trim() || "No text",
    );
  });

  // Check if we're on a page that requires story context
  const currentPath = window.location.pathname;
  const storyPages = ["/writing/", "/story/"];
  const requiresStory = storyPages.some((page) => currentPath.includes(page));

  console.log(`Current page: ${currentPath}`);
  console.log(`Requires story context: ${requiresStory}`);

  return { indicators: storyIndicators, requiresStory, currentPath };
}

// Run all tests
function runAllButtonTests() {
  console.log("🚀 Running Complete Button Test Suite...");
  console.log("Current page:", window.location.pathname);
  console.log("Timestamp:", new Date().toISOString());

  const storyContext = checkStoryContext();
  testNewButtonsFixed();
  testSaveButtons();

  console.log("\n📊 Test Summary:");
  console.log("- Story context checked");
  console.log("- New buttons tested");
  console.log("- Save buttons tested");
  console.log("✅ All button tests completed!");

  return {
    storyContext,
    timestamp: new Date().toISOString(),
    page: window.location.pathname,
  };
}

// Make functions available globally
window.testNewButtonsFixed = testNewButtonsFixed;
window.testSaveButtons = testSaveButtons;
window.checkStoryContext = checkStoryContext;
window.runAllButtonTests = runAllButtonTests;

// Auto-run the tests
const testResults = runAllButtonTests();
window.buttonTestResults = testResults;

console.log("\n✅ Button fix tests completed!");
console.log(
  "Available functions: testNewButtonsFixed(), testSaveButtons(), checkStoryContext(), runAllButtonTests()",
);
console.log("Results stored in window.buttonTestResults");
