// Chronicle Builder - Browser Console Button Testing Script
// Paste this into your browser console (F12) to test all buttons on any page

(function () {
  console.log("🚀 Chronicle Builder Button Tester Loaded");

  // Test all buttons on current page
  const testAllButtons = () => {
    console.log("🧪 Testing all buttons on current page...");

    const buttons = document.querySelectorAll(
      'button, [role="button"], a[href], [onclick]',
    );
    const results = [];

    buttons.forEach((button, index) => {
      const text =
        button.textContent?.trim() ||
        button.getAttribute("aria-label") ||
        button.getAttribute("title") ||
        `Button ${index}`;

      const rect = button.getBoundingClientRect();
      const isVisible =
        rect.width > 0 &&
        rect.height > 0 &&
        window.getComputedStyle(button).display !== "none";

      const isEnabled =
        !button.disabled && button.getAttribute("aria-disabled") !== "true";

      const hasHandler = !!(
        button.onclick ||
        button.getAttribute("onclick") ||
        button.getAttribute("href") ||
        button.hasAttribute("role")
      );

      const result = {
        index: index + 1,
        text: text.slice(0, 30),
        visible: isVisible,
        enabled: isEnabled,
        hasHandler: hasHandler,
        element: button,
      };

      results.push(result);
    });

    console.table(results);

    const summary = {
      total: results.length,
      visible: results.filter((r) => r.visible).length,
      enabled: results.filter((r) => r.enabled).length,
      withHandlers: results.filter((r) => r.hasHandler).length,
    };

    console.log("📊 Summary:", summary);

    return results;
  };

  // Test specific pages
  const testPage = (pageName) => {
    console.log(`🔍 Testing ${pageName} page...`);
    const results = testAllButtons();

    // Store results for comparison
    window.testResults = window.testResults || {};
    window.testResults[pageName] = results;

    return results;
  };

  // Highlight all clickable elements
  const highlightButtons = () => {
    const buttons = document.querySelectorAll(
      'button, [role="button"], a[href], [onclick]',
    );

    buttons.forEach((button, index) => {
      button.style.outline = "2px solid red";
      button.style.outlineOffset = "2px";

      // Add index number
      const label = document.createElement("div");
      label.textContent = index + 1;
      label.style.cssText = `
        position: absolute;
        background: red;
        color: white;
        font-size: 12px;
        padding: 2px 4px;
        border-radius: 2px;
        z-index: 9999;
        pointer-events: none;
      `;

      const rect = button.getBoundingClientRect();
      label.style.left = rect.left + window.scrollX + "px";
      label.style.top = rect.top + window.scrollY - 20 + "px";

      document.body.appendChild(label);
    });

    console.log(`🎯 Highlighted ${buttons.length} clickable elements`);
  };

  // Remove highlights
  const clearHighlights = () => {
    document
      .querySelectorAll('button, [role="button"], a[href], [onclick]')
      .forEach((button) => {
        button.style.outline = "";
        button.style.outlineOffset = "";
      });

    // Remove labels
    document.querySelectorAll("div").forEach((div) => {
      if (div.style.position === "absolute" && div.style.background === "red") {
        div.remove();
      }
    });

    console.log("✨ Highlights cleared");
  };

  // Test button click simulation
  const testButtonClick = (buttonIndex) => {
    const buttons = document.querySelectorAll(
      'button, [role="button"], a[href], [onclick]',
    );
    const button = buttons[buttonIndex - 1];

    if (!button) {
      console.error(`❌ Button ${buttonIndex} not found`);
      return;
    }

    console.log(
      `🖱️ Testing click on button ${buttonIndex}: "${button.textContent?.trim()}"`,
    );

    try {
      // Create click event
      const clickEvent = new MouseEvent("click", {
        bubbles: true,
        cancelable: true,
        view: window,
      });

      button.dispatchEvent(clickEvent);
      console.log(`✅ Click event dispatched successfully`);
    } catch (error) {
      console.error(`❌ Error clicking button:`, error);
    }
  };

  // Navigate to page and test
  const navigateAndTest = async (path) => {
    console.log(`🧭 Navigating to ${path}...`);

    // If it's a relative path, navigate using pushState
    if (path.startsWith("/")) {
      window.history.pushState({}, "", path);

      // Trigger navigation event
      window.dispatchEvent(new PopStateEvent("popstate", { state: {} }));

      // Wait for page to load
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    return testAllButtons();
  };

  // Comprehensive test suite for all pages
  const runFullTest = async () => {
    console.log("🎯 Running comprehensive button test suite...");

    const pages = [
      "/",
      "/stories",
      "/writing/chapters",
      "/writing/scenes",
      "/writing/notes",
      "/story/characters",
      "/story/world",
      "/story/timeline",
    ];

    const allResults = {};

    for (const page of pages) {
      console.log(`\n📄 Testing page: ${page}`);

      try {
        const results = await navigateAndTest(page);
        allResults[page] = results;

        console.log(`✅ ${page}: ${results.length} buttons tested`);
      } catch (error) {
        console.error(`❌ Error testing ${page}:`, error);
        allResults[page] = { error: error.message };
      }
    }

    console.log("\n📊 Full Test Results:");
    console.table(
      Object.keys(allResults).map((page) => ({
        page,
        buttonCount: Array.isArray(allResults[page])
          ? allResults[page].length
          : "Error",
        status: Array.isArray(allResults[page]) ? "✅" : "❌",
      })),
    );

    window.fullTestResults = allResults;
    return allResults;
  };

  // Export functions to global scope
  window.testAllButtons = testAllButtons;
  window.testPage = testPage;
  window.highlightButtons = highlightButtons;
  window.clearHighlights = clearHighlights;
  window.testButtonClick = testButtonClick;
  window.navigateAndTest = navigateAndTest;
  window.runFullTest = runFullTest;

  console.log(`
🎯 Chronicle Builder Button Tester Ready!

Available Commands:
- testAllButtons()       - Test all buttons on current page
- highlightButtons()     - Highlight all clickable elements
- clearHighlights()      - Remove highlights
- testButtonClick(n)     - Test click on button number n
- runFullTest()          - Test all pages comprehensively

Example usage:
  testAllButtons()       // Test current page
  highlightButtons()     // Show all buttons
  testButtonClick(1)     // Click first button
  runFullTest()          // Test entire app
`);
})();
