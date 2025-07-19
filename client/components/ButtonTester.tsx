import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Bug, CheckCircle, AlertTriangle, XCircle } from "lucide-react";

interface ButtonTestResult {
  id: string;
  text: string;
  isVisible: boolean;
  isEnabled: boolean;
  hasClickHandler: boolean;
  hasStoryContextCheck: boolean;
  testResult: "pass" | "fail" | "warning";
  errorMessage?: string;
  clickTestResult?: string;
}

export function ButtonTester() {
  const [results, setResults] = useState<ButtonTestResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isHighlighting, setIsHighlighting] = useState(false);
  const [testLogs, setTestLogs] = useState<string[]>([]);

  // Only show in development
  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  const testAllButtons = () => {
    const buttons = document.querySelectorAll(
      'button, [role="button"], a[href], [onclick]',
    );
    const testResults: ButtonTestResult[] = [];
    const logs: string[] = [];

    logs.push(
      `🧪 Testing ${buttons.length} buttons on ${window.location.pathname}`,
    );

    buttons.forEach((button, index) => {
      const text = getButtonText(button as HTMLElement);
      const id = (button as HTMLElement).id || `button-${index}`;
      const isNewButton = text.toLowerCase().includes("new");
      const isSaveButton =
        text.toLowerCase().includes("save") ||
        text.toLowerCase().includes("publish");

      const result: ButtonTestResult = {
        id,
        text,
        isVisible: isVisible(button as HTMLElement),
        isEnabled: isEnabled(button as HTMLElement),
        hasClickHandler: hasClickHandler(button as HTMLElement),
        hasStoryContextCheck: false,
        testResult: "pass",
      };

      // Test for story context check by simulating click (for New/Save buttons)
      if (
        (isNewButton || isSaveButton) &&
        result.isVisible &&
        result.isEnabled
      ) {
        const clickResult = testButtonClick(button as HTMLElement, text);
        result.clickTestResult = clickResult;
        result.hasStoryContextCheck =
          clickResult.includes("story") || clickResult.includes("Story");

        if (!result.hasStoryContextCheck && (isNewButton || isSaveButton)) {
          result.testResult = "warning";
          result.errorMessage = "May lack story context check";
        }
      }

      // Determine test result
      if (!result.isVisible) {
        result.testResult = "warning";
        result.errorMessage = "Not visible";
      } else if (!result.isEnabled) {
        result.testResult = "warning";
        result.errorMessage = "Disabled";
      } else if (!result.hasClickHandler) {
        result.testResult = "fail";
        result.errorMessage = "No click handler";
      }

      testResults.push(result);

      if (isNewButton || isSaveButton) {
        logs.push(
          `${result.testResult === "pass" ? "✅" : result.testResult === "fail" ? "❌" : "⚠️"} ${text}: ${result.errorMessage || "OK"}`,
        );
      }
    });

    setResults(testResults);
    setTestLogs(logs);
  };

  const highlightButtons = () => {
    if (isHighlighting) {
      clearHighlights();
      return;
    }

    const buttons = document.querySelectorAll(
      'button, [role="button"], a[href], [onclick]',
    );

    buttons.forEach((button, index) => {
      (button as HTMLElement).style.outline = "2px solid #ef4444";
      (button as HTMLElement).style.outlineOffset = "2px";
      (button as HTMLElement).setAttribute("data-test-highlighted", "true");

      // Add test index
      const label = document.createElement("div");
      label.textContent = (index + 1).toString();
      label.style.cssText = `
        position: absolute;
        background: #ef4444;
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
      label.setAttribute("data-test-label", "true");

      document.body.appendChild(label);
    });

    setIsHighlighting(true);
  };

  const clearHighlights = () => {
    document.querySelectorAll("[data-test-highlighted]").forEach((element) => {
      (element as HTMLElement).style.outline = "";
      (element as HTMLElement).style.outlineOffset = "";
      element.removeAttribute("data-test-highlighted");
    });

    document.querySelectorAll("[data-test-label]").forEach((label) => {
      label.remove();
    });

    setIsHighlighting(false);
  };

  const getStatusIcon = (result: ButtonTestResult) => {
    switch (result.testResult) {
      case "pass":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "fail":
        return <XCircle className="h-4 w-4 text-red-500" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusBadge = (result: ButtonTestResult) => {
    const variant =
      result.testResult === "pass"
        ? "default"
        : result.testResult === "fail"
          ? "destructive"
          : "secondary";

    return <Badge variant={variant}>{result.testResult}</Badge>;
  };

  // Test button click and capture console output
  const testButtonClick = (button: HTMLElement, buttonText: string): string => {
    const logs: string[] = [];

    // Capture console.log and console.error temporarily
    const originalLog = console.log;
    const originalError = console.error;
    const originalAlert = window.alert;

    console.log = (...args) => {
      logs.push(`LOG: ${args.join(" ")}`);
      originalLog(...args);
    };

    console.error = (...args) => {
      logs.push(`ERROR: ${args.join(" ")}`);
      originalError(...args);
    };

    window.alert = (message) => {
      logs.push(`ALERT: ${message}`);
      return; // Don't actually show the alert during testing
    };

    try {
      // Create and dispatch click event
      const clickEvent = new MouseEvent("click", {
        bubbles: true,
        cancelable: true,
        view: window,
      });

      button.dispatchEvent(clickEvent);
    } catch (error) {
      logs.push(`ERROR: Click failed - ${error}`);
    } finally {
      // Restore original functions
      console.log = originalLog;
      console.error = originalError;
      window.alert = originalAlert;
    }

    return logs.join("; ");
  };

  // Helper functions
  const getButtonText = (button: HTMLElement): string => {
    return (
      button.textContent?.trim() ||
      button.getAttribute("aria-label") ||
      button.getAttribute("title") ||
      button.tagName
    ).slice(0, 30);
  };

  const isVisible = (element: HTMLElement): boolean => {
    const style = getComputedStyle(element);
    return (
      style.display !== "none" &&
      style.visibility !== "hidden" &&
      style.opacity !== "0" &&
      element.offsetParent !== null
    );
  };

  const isEnabled = (element: HTMLElement): boolean => {
    if (element instanceof HTMLButtonElement) {
      return !element.disabled;
    }
    const disabled =
      element.getAttribute("disabled") || element.getAttribute("aria-disabled");
    return disabled !== "true" && disabled !== "";
  };

  const hasClickHandler = (element: HTMLElement): boolean => {
    return !!(
      (element as any).onclick ||
      element.getAttribute("onclick") ||
      element.getAttribute("href") ||
      element.getAttribute("role") === "button"
    );
  };

  const summary = {
    total: results.length,
    passed: results.filter((r) => r.testResult === "pass").length,
    failed: results.filter((r) => r.testResult === "fail").length,
    warnings: results.filter((r) => r.testResult === "warning").length,
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          variant="outline"
          className="fixed bottom-4 left-4 z-50"
        >
          <Bug className="h-4 w-4 mr-2" />
          Test Buttons
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bug className="h-5 w-5" />
            Button Testing Tool
          </DialogTitle>
        </DialogHeader>

        <div className="flex gap-2 mb-4">
          <Button onClick={testAllButtons} size="sm">
            Test All Buttons
          </Button>
          <Button
            onClick={highlightButtons}
            variant={isHighlighting ? "secondary" : "outline"}
            size="sm"
          >
            {isHighlighting ? "Clear Highlights" : "Highlight Buttons"}
          </Button>
        </div>

        {results.length > 0 && (
          <>
            <div className="grid grid-cols-4 gap-2 mb-4">
              <Card className="p-2">
                <div className="text-center">
                  <div className="text-lg font-bold">{summary.total}</div>
                  <div className="text-xs text-muted-foreground">Total</div>
                </div>
              </Card>
              <Card className="p-2">
                <div className="text-center">
                  <div className="text-lg font-bold text-green-600">
                    {summary.passed}
                  </div>
                  <div className="text-xs text-muted-foreground">Passed</div>
                </div>
              </Card>
              <Card className="p-2">
                <div className="text-center">
                  <div className="text-lg font-bold text-red-600">
                    {summary.failed}
                  </div>
                  <div className="text-xs text-muted-foreground">Failed</div>
                </div>
              </Card>
              <Card className="p-2">
                <div className="text-center">
                  <div className="text-lg font-bold text-yellow-600">
                    {summary.warnings}
                  </div>
                  <div className="text-xs text-muted-foreground">Warnings</div>
                </div>
              </Card>
            </div>

            {testLogs.length > 0 && (
              <Card className="mb-4 p-3">
                <div className="text-sm font-medium mb-2">Test Log:</div>
                <div className="text-xs space-y-1">
                  {testLogs.map((log, index) => (
                    <div key={index} className="text-muted-foreground">
                      {log}
                    </div>
                  ))}
                </div>
              </Card>
            )}

            <ScrollArea className="flex-1">
              <div className="space-y-2">
                {results.map((result, index) => (
                  <Card key={result.id} className="p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(result)}
                        <span className="font-medium">
                          {index + 1}. {result.text}
                        </span>
                      </div>
                      {getStatusBadge(result)}
                    </div>

                    <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
                      <span>Visible: {result.isVisible ? "✅" : "❌"}</span>
                      <span>Enabled: {result.isEnabled ? "✅" : "❌"}</span>
                      <span>
                        Handler: {result.hasClickHandler ? "✅" : "❌"}
                      </span>
                      <span>
                        Story Check: {result.hasStoryContextCheck ? "✅" : "❓"}
                      </span>
                    </div>

                    {result.clickTestResult && (
                      <div className="text-xs text-blue-600 mt-1 bg-blue-50 p-1 rounded">
                        Click Test: {result.clickTestResult}
                      </div>
                    )}

                    {result.errorMessage && (
                      <div className="text-sm text-red-600 mt-1">
                        Error: {result.errorMessage}
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </>
        )}

        {results.length === 0 && (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            Click "Test All Buttons" to start testing
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
