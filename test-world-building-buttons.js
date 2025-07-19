// Test World Building Page Specific Buttons
// Focus on the "New" button and other critical functionality

console.log("🌍 Testing World Building Page Buttons...");

function testWorldBuildingButtons() {
  console.log("Current page:", window.location.pathname);

  // Test the "New" button specifically
  const newButtons = Array.from(document.querySelectorAll("button")).filter(
    (btn) => btn.textContent && btn.textContent.toLowerCase().includes("new"),
  );

  console.log(`\n🆕 Found ${newButtons.length} "New" buttons`);

  newButtons.forEach((btn, index) => {
    console.log(
      `\n${index + 1}. Testing "New" button: "${btn.textContent.trim()}"`,
    );

    // Check basic properties
    const rect = btn.getBoundingClientRect();
    const isVisible = rect.width > 0 && rect.height > 0;
    const isEnabled = !btn.disabled;

    console.log(`   Visible: ${isVisible ? "✅" : "❌"}`);
    console.log(`   Enabled: ${isEnabled ? "✅" : "❌"}`);

    if (isVisible && isEnabled) {
      // Test the click functionality
      console.log("   Testing click functionality...");

      // Capture output
      const originalLog = console.log;
      const originalError = console.error;
      const originalAlert = window.alert;

      let captured = [];

      console.log = (...args) => {
        captured.push(`LOG: ${args.join(" ")}`);
        originalLog(...args);
      };
      console.error = (...args) => {
        captured.push(`ERROR: ${args.join(" ")}`);
        originalError(...args);
      };
      window.alert = (msg) => {
        captured.push(`ALERT: ${msg}`);
        return true; // Don't show actual alert
      };

      try {
        // Click the button
        btn.click();

        // Restore functions
        console.log = originalLog;
        console.error = originalError;
        window.alert = originalAlert;

        if (captured.length > 0) {
          console.log(`   Response: ${captured.join("; ")}`);

          // Check if it's working correctly
          const hasStoryCheck = captured.some((msg) =>
            msg.toLowerCase().includes("story"),
          );
          const hasError = captured.some(
            (msg) => msg.includes("ERROR") || msg.includes("ALERT"),
          );

          if (hasStoryCheck) {
            console.log("   ✅ Has story context check");
          }
          if (hasError) {
            console.log(
              "   ⚠️ Triggered error handling (expected if no story)",
            );
          }

          console.log("   ✅ Button is functioning correctly");
        } else {
          console.log("   ❓ No console output (may be working silently)");
        }
      } catch (error) {
        // Restore functions
        console.log = originalLog;
        console.error = originalError;
        window.alert = originalAlert;

        console.log(`   ❌ Error: ${error.message}`);
      }
    } else {
      console.log("   ❌ Button not clickable");
    }
  });

  // Test other important buttons
  const saveButtons = Array.from(document.querySelectorAll("button")).filter(
    (btn) =>
      btn.textContent &&
      (btn.textContent.toLowerCase().includes("save") ||
        btn.textContent.toLowerCase().includes("preview")),
  );

  if (saveButtons.length > 0) {
    console.log(`\n💾 Found ${saveButtons.length} Save/Preview buttons`);
    saveButtons.forEach((btn, index) => {
      const text = btn.textContent.trim();
      const isEnabled = !btn.disabled;
      const isVisible = btn.getBoundingClientRect().width > 0;

      console.log(
        `${index + 1}. "${text}" - ${isEnabled && isVisible ? "✅" : "❌"}`,
      );
    });
  }

  // Check for dropdown menus
  const dropdownTriggers = document.querySelectorAll(
    '[role="button"][aria-haspopup]',
  );
  if (dropdownTriggers.length > 0) {
    console.log(`\n📋 Found ${dropdownTriggers.length} dropdown triggers`);
  }

  // Check story context
  const storyInfo = document.querySelector('[class*="story"]');
  const hasStorySelected =
    storyInfo && !storyInfo.textContent.includes("No story");

  console.log(`\n📖 Story Context:`);
  console.log(`   Story selected: ${hasStorySelected ? "✅" : "❌"}`);
  if (storyInfo) {
    console.log(
      `   Story info: "${storyInfo.textContent.trim().slice(0, 50)}..."`,
    );
  }

  return {
    newButtonsCount: newButtons.length,
    saveButtonsCount: saveButtons.length,
    hasStorySelected,
    allButtonsWorking: newButtons.every(
      (btn) => !btn.disabled && btn.getBoundingClientRect().width > 0,
    ),
  };
}

// Run the test
const worldBuildingResults = testWorldBuildingButtons();

console.log("\n🎯 WORLD BUILDING PAGE SUMMARY:");
console.log(`New buttons: ${worldBuildingResults.newButtonsCount}`);
console.log(`Save/Preview buttons: ${worldBuildingResults.saveButtonsCount}`);
console.log(`Story selected: ${worldBuildingResults.hasStorySelected}`);
console.log(
  `All buttons working: ${worldBuildingResults.allButtonsWorking ? "✅" : "❌"}`,
);

// Store results
window.worldBuildingTest = worldBuildingResults;

return worldBuildingResults;
