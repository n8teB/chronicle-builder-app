// Quick Button Failure Assessment Script
// Run this in browser console to identify which buttons are still failing

console.log("🔍 Checking for failing buttons...");

function assessButtonFailures() {
  const buttons = Array.from(
    document.querySelectorAll('button, [role="button"], a[href], [onclick]'),
  );

  const results = {
    total: buttons.length,
    failing: [],
    critical: [],
    important: [],
    minor: [],
  };

  buttons.forEach((btn, index) => {
    const text = btn.textContent?.trim() || "No text";
    const isVisible = btn.offsetParent !== null;
    const isEnabled =
      !btn.disabled && btn.getAttribute("aria-disabled") !== "true";
    const hasHandler = !!(
      btn.onclick ||
      btn.getAttribute("onclick") ||
      btn.getAttribute("href")
    );

    // Determine if button is failing
    const isFailing = !hasHandler || !isVisible || !isEnabled;

    if (isFailing) {
      const failure = {
        index: index + 1,
        text: text.slice(0, 40),
        visible: isVisible,
        enabled: isEnabled,
        hasHandler: hasHandler,
        element: btn,
        reasons: [],
      };

      if (!isVisible) failure.reasons.push("not visible");
      if (!isEnabled) failure.reasons.push("disabled");
      if (!hasHandler) failure.reasons.push("no click handler");

      results.failing.push(failure);

      // Categorize by importance
      const lowerText = text.toLowerCase();

      // Critical buttons (core functionality)
      if (
        lowerText.includes("new") ||
        lowerText.includes("save") ||
        lowerText.includes("create") ||
        lowerText.includes("publish") ||
        lowerText.includes("delete")
      ) {
        results.critical.push(failure);
      }
      // Important buttons (secondary functionality)
      else if (
        lowerText.includes("edit") ||
        lowerText.includes("preview") ||
        lowerText.includes("export") ||
        lowerText.includes("import") ||
        lowerText.includes("copy") ||
        lowerText.includes("duplicate")
      ) {
        results.important.push(failure);
      }
      // Minor buttons (UI elements, filters, etc.)
      else {
        results.minor.push(failure);
      }
    }
  });

  // Report results
  console.log("📊 Button Failure Assessment:");
  console.log(`Total buttons: ${results.total}`);
  console.log(`Failing buttons: ${results.failing.length}`);
  console.log(`🔴 Critical failures: ${results.critical.length}`);
  console.log(`🟡 Important failures: ${results.important.length}`);
  console.log(`⚫ Minor failures: ${results.minor.length}`);

  if (results.critical.length > 0) {
    console.log("\n🔴 CRITICAL failing buttons:");
    results.critical.forEach((btn) => {
      console.log(`- "${btn.text}" - ${btn.reasons.join(", ")}`);
    });
  }

  if (results.important.length > 0) {
    console.log("\n🟡 IMPORTANT failing buttons:");
    results.important.forEach((btn) => {
      console.log(`- "${btn.text}" - ${btn.reasons.join(", ")}`);
    });
  }

  if (results.minor.length > 0) {
    console.log("\n⚫ Minor failing buttons:");
    results.minor.forEach((btn) => {
      console.log(`- "${btn.text}" - ${btn.reasons.join(", ")}`);
    });
  }

  // Specific checks for known issues
  console.log("\n🧪 Specific Issue Checks:");

  // Check for buttons without proper React event handlers
  const reactButtons = buttons.filter(
    (btn) =>
      btn.tagName === "BUTTON" && !btn.onclick && !btn.getAttribute("onclick"),
  );

  console.log(`React buttons without visible handlers: ${reactButtons.length}`);
  if (reactButtons.length > 0) {
    console.log(
      "Note: These may have React event handlers that aren't visible in DOM inspection",
    );
  }

  return results;
}

// Run the assessment
const assessment = assessButtonFailures();
window.buttonAssessment = assessment;

console.log("\n💡 Recommendation:");
if (assessment.critical.length > 0) {
  console.log(
    "🔴 FIX CRITICAL BUTTONS IMMEDIATELY - Core functionality is broken",
  );
} else if (assessment.important.length > 0) {
  console.log(
    "🟡 Consider fixing important buttons - Secondary features affected",
  );
} else if (assessment.minor.length > 0) {
  console.log("⚫ Minor issues only - Low priority fixes");
} else {
  console.log("✅ No significant button failures detected");
}

console.log("Results stored in window.buttonAssessment");
