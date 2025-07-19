// Chronicle Builder - Automated Button Testing Utility

interface ButtonTestResult {
  id: string;
  text: string;
  location: string;
  isVisible: boolean;
  isEnabled: boolean;
  hasClickHandler: boolean;
  testResult: "pass" | "fail" | "warning";
  errorMessage?: string;
}

export class ButtonTester {
  private results: ButtonTestResult[] = [];
  private currentPage: string = "";

  constructor() {
    this.currentPage = window.location.pathname;
  }

  // Test all buttons on current page
  async testAllButtons(): Promise<ButtonTestResult[]> {
    console.log(`🧪 Testing buttons on page: ${this.currentPage}`);

    const buttons = this.getAllClickableElements();
    this.results = [];

    for (let i = 0; i < buttons.length; i++) {
      const button = buttons[i];
      const result = await this.testButton(button, i);
      this.results.push(result);
    }

    this.printResults();
    return this.results;
  }

  // Get all clickable elements
  private getAllClickableElements(): HTMLElement[] {
    const selectors = [
      "button",
      '[role="button"]',
      "a[href]",
      "[onclick]",
      ".cursor-pointer",
    ];

    const elements: HTMLElement[] = [];

    selectors.forEach((selector) => {
      const found = document.querySelectorAll(
        selector,
      ) as NodeListOf<HTMLElement>;
      found.forEach((el) => {
        if (!elements.includes(el)) {
          elements.push(el);
        }
      });
    });

    return elements;
  }

  // Test individual button
  private async testButton(
    button: HTMLElement,
    index: number,
  ): Promise<ButtonTestResult> {
    const text = this.getButtonText(button);
    const id = button.id || `button-${index}`;

    const result: ButtonTestResult = {
      id,
      text,
      location: this.currentPage,
      isVisible: this.isVisible(button),
      isEnabled: this.isEnabled(button),
      hasClickHandler: this.hasClickHandler(button),
      testResult: "pass",
    };

    try {
      // Test visibility
      if (!result.isVisible) {
        result.testResult = "warning";
        result.errorMessage = "Button is not visible";
        return result;
      }

      // Test if disabled
      if (!result.isEnabled) {
        result.testResult = "warning";
        result.errorMessage = "Button is disabled";
        return result;
      }

      // Test if has click handler
      if (!result.hasClickHandler) {
        result.testResult = "fail";
        result.errorMessage = "No click handler found";
        return result;
      }

      // Simulate click test (without actually clicking)
      const clickEvent = new MouseEvent("click", {
        bubbles: true,
        cancelable: true,
        view: window,
      });

      // Test if click would work
      const rect = button.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) {
        result.testResult = "warning";
        result.errorMessage = "Button has no dimensions";
        return result;
      }

      result.testResult = "pass";
    } catch (error) {
      result.testResult = "fail";
      result.errorMessage = `Error testing button: ${error}`;
    }

    return result;
  }

  // Helper methods
  private getButtonText(button: HTMLElement): string {
    // Try different methods to get button text
    const text =
      button.textContent?.trim() ||
      button.getAttribute("aria-label") ||
      button.getAttribute("title") ||
      button.getAttribute("alt") ||
      button.tagName;

    return text.slice(0, 50); // Limit length
  }

  private isVisible(element: HTMLElement): boolean {
    const style = getComputedStyle(element);
    return (
      style.display !== "none" &&
      style.visibility !== "hidden" &&
      style.opacity !== "0" &&
      element.offsetParent !== null
    );
  }

  private isEnabled(element: HTMLElement): boolean {
    if (element instanceof HTMLButtonElement) {
      return !element.disabled;
    }

    const disabled =
      element.getAttribute("disabled") || element.getAttribute("aria-disabled");

    return disabled !== "true" && disabled !== "";
  }

  private hasClickHandler(element: HTMLElement): boolean {
    // Check for various types of click handlers
    const hasOnClick = !!(element as any).onclick;
    const hasEventListener = this.hasEventListeners(element);
    const hasHref = element.getAttribute("href") !== null;
    const hasRole = element.getAttribute("role") === "button";

    return hasOnClick || hasEventListener || hasHref || hasRole;
  }

  private hasEventListeners(element: HTMLElement): boolean {
    // This is a simplified check - in practice, we can't easily detect all event listeners
    const events = ["click", "mousedown", "mouseup"];
    return events.some((event) => {
      const handler = (element as any)[`on${event}`];
      return typeof handler === "function";
    });
  }

  // Print results to console
  private printResults(): void {
    console.log("\n🧪 Button Test Results:");
    console.log("========================");

    const summary = {
      total: this.results.length,
      passed: this.results.filter((r) => r.testResult === "pass").length,
      failed: this.results.filter((r) => r.testResult === "fail").length,
      warnings: this.results.filter((r) => r.testResult === "warning").length,
    };

    console.log(`Total buttons: ${summary.total}`);
    console.log(`✅ Passed: ${summary.passed}`);
    console.log(`❌ Failed: ${summary.failed}`);
    console.log(`⚠️ Warnings: ${summary.warnings}`);
    console.log("\nDetailed Results:");

    this.results.forEach((result, index) => {
      const status =
        result.testResult === "pass"
          ? "✅"
          : result.testResult === "fail"
            ? "❌"
            : "⚠️";

      console.log(
        `${status} ${index + 1}. "${result.text}" - ${result.testResult}`,
      );
      if (result.errorMessage) {
        console.log(`   Error: ${result.errorMessage}`);
      }
    });
  }

  // Get test results
  getResults(): ButtonTestResult[] {
    return this.results;
  }

  // Generate test report
  generateReport(): string {
    const summary = {
      total: this.results.length,
      passed: this.results.filter((r) => r.testResult === "pass").length,
      failed: this.results.filter((r) => r.testResult === "fail").length,
      warnings: this.results.filter((r) => r.testResult === "warning").length,
    };

    let report = `# Button Test Report\n\n`;
    report += `**Page:** ${this.currentPage}\n`;
    report += `**Date:** ${new Date().toISOString()}\n\n`;
    report += `## Summary\n\n`;
    report += `- Total Buttons: ${summary.total}\n`;
    report += `- ✅ Passed: ${summary.passed}\n`;
    report += `- ❌ Failed: ${summary.failed}\n`;
    report += `- ⚠️ Warnings: ${summary.warnings}\n\n`;
    report += `## Detailed Results\n\n`;

    this.results.forEach((result, index) => {
      const status =
        result.testResult === "pass"
          ? "✅"
          : result.testResult === "fail"
            ? "❌"
            : "⚠️";

      report += `${status} **${result.text}**\n`;
      report += `   - Status: ${result.testResult}\n`;
      if (result.errorMessage) {
        report += `   - Error: ${result.errorMessage}\n`;
      }
      report += `   - Visible: ${result.isVisible}\n`;
      report += `   - Enabled: ${result.isEnabled}\n`;
      report += `   - Has Handler: ${result.hasClickHandler}\n\n`;
    });

    return report;
  }
}

// Global function for easy access in console
declare global {
  interface Window {
    testButtons: () => Promise<ButtonTestResult[]>;
    buttonTester: ButtonTester;
  }
}

// Make available globally for console testing
if (typeof window !== "undefined") {
  window.buttonTester = new ButtonTester();
  window.testButtons = () => window.buttonTester.testAllButtons();
}

export default ButtonTester;
