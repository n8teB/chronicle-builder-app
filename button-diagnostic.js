// Chronicle Builder Button Diagnostic Script
// Run this in the browser console to identify failing buttons

console.log("🔍 Chronicle Builder Button Diagnostic Starting...");

// Test for story context availability
function checkStoryContext() {
  const storySelectElement =
    document.querySelector('[data-testid="story-select"]') ||
    document.querySelector("select") ||
    document.querySelector('[role="combobox"]');

  const hasStoryContext = !!window.React || !!window.StoryContext;

  console.log("📖 Story Context Check:");
  console.log("- Story selector element found:", !!storySelectElement);
  console.log("- React available:", !!window.React);
  console.log("- Story context available:", hasStoryContext);

  return {
    hasStorySelector: !!storySelectElement,
    hasReact: !!window.React,
    hasStoryContext,
  };
}

// Test specific "New" buttons
function testNewButtons() {
  const newButtons = Array.from(document.querySelectorAll("button")).filter(
    (btn) => btn.textContent && btn.textContent.toLowerCase().includes("new"),
  );

  console.log("🆕 New Button Analysis:");
  console.log(`Found ${newButtons.length} "New" buttons`);

  newButtons.forEach((btn, index) => {
    const rect = btn.getBoundingClientRect();
    const isVisible = rect.width > 0 && rect.height > 0;
    const isEnabled = !btn.disabled;
    const hasClickHandler = !!(
      btn.onclick ||
      btn.getAttribute("onclick") ||
      btn.addEventListener
    );

    console.log(`New Button ${index + 1}:`);
    console.log(`- Text: "${btn.textContent.trim()}"`);
    console.log(`- Visible: ${isVisible}`);
    console.log(`- Enabled: ${isEnabled}`);
    console.log(`- Has click handler: ${hasClickHandler}`);
    console.log(`- Element:`, btn);

    // Try to find React component
    const reactKey = Object.keys(btn).find(
      (key) =>
        key.startsWith("__reactInternalInstance") ||
        key.startsWith("_reactInternalFiber"),
    );
    if (reactKey) {
      console.log(`- React component attached: true`);
    }
  });

  return newButtons;
}

// Test for missing dependencies
function checkDependencies() {
  const errors = [];

  // Check for React
  if (!window.React) {
    errors.push("React not found in global scope");
  }

  // Check for common UI components
  const testSelectors = ["button", '[role="button"]', ".cursor-pointer"];

  console.log("🔧 Dependency Check:");
  testSelectors.forEach((selector) => {
    const elements = document.querySelectorAll(selector);
    console.log(`- ${selector}: ${elements.length} elements found`);
  });

  return errors;
}

// Test click handlers specifically
function testClickHandlers() {
  const clickableElements = document.querySelectorAll(
    'button, [role="button"], [onclick]',
  );
  const results = [];

  console.log("🖱️ Click Handler Analysis:");

  clickableElements.forEach((element, index) => {
    const text = element.textContent?.trim() || "No text";
    const hasOnClick = !!element.onclick;
    const hasOnClickAttr = !!element.getAttribute("onclick");
    const isButton = element.tagName === "BUTTON";
    const hasRole = element.getAttribute("role") === "button";

    // Check for React event listeners (harder to detect)
    const reactKeys = Object.keys(element).filter(
      (key) =>
        key.startsWith("__reactInternalInstance") ||
        key.startsWith("_reactInternalFiber") ||
        key.startsWith("__reactFiber"),
    );

    const result = {
      index: index + 1,
      text: text.slice(0, 30),
      hasOnClick,
      hasOnClickAttr,
      isButton,
      hasRole,
      hasReactListeners: reactKeys.length > 0,
      element,
    };

    results.push(result);

    // Log suspicious elements (buttons without handlers)
    if (isButton && !hasOnClick && !hasOnClickAttr && !reactKeys.length) {
      console.warn(
        `⚠️ Suspicious button ${index + 1}: "${text}" - No click handler detected`,
      );
    }
  });

  console.table(results);
  return results;
}

// Run all diagnostics
function runFullDiagnostic() {
  console.log("🚀 Starting Full Button Diagnostic...");
  console.log("Current page:", window.location.pathname);

  const storyContext = checkStoryContext();
  const newButtons = testNewButtons();
  const dependencies = checkDependencies();
  const clickHandlers = testClickHandlers();

  // Summary
  console.log("📊 Diagnostic Summary:");
  console.log("- Story context available:", storyContext.hasStoryContext);
  console.log("- New buttons found:", newButtons.length);
  console.log("- Dependency errors:", dependencies.length);
  console.log("- Total clickable elements:", clickHandlers.length);

  const suspiciousButtons = clickHandlers.filter(
    (ch) =>
      ch.isButton &&
      !ch.hasOnClick &&
      !ch.hasOnClickAttr &&
      !ch.hasReactListeners,
  );

  console.log("- Suspicious buttons (no handlers):", suspiciousButtons.length);

  if (suspiciousButtons.length > 0) {
    console.error("❌ Found buttons without click handlers:");
    suspiciousButtons.forEach((btn) => {
      console.error(`- "${btn.text}"`, btn.element);
    });
  }

  return {
    storyContext,
    newButtons,
    dependencies,
    clickHandlers,
    suspiciousButtons,
  };
}

// Auto-run the diagnostic
const diagnosticResults = runFullDiagnostic();

// Make functions available globally for manual testing
window.checkStoryContext = checkStoryContext;
window.testNewButtons = testNewButtons;
window.checkDependencies = checkDependencies;
window.testClickHandlers = testClickHandlers;
window.runFullDiagnostic = runFullDiagnostic;
window.diagnosticResults = diagnosticResults;

console.log(
  "✅ Button diagnostic complete. Results stored in window.diagnosticResults",
);
console.log(
  "Available functions: checkStoryContext(), testNewButtons(), checkDependencies(), testClickHandlers(), runFullDiagnostic()",
);
