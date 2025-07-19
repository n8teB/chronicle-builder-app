import jsPDF from "jspdf";
import { Story } from "@/components/StoryManager";

interface Chapter {
  id: number;
  title: string;
  wordCount: number;
  status: string;
  lastEdited: string;
  summary: string;
  content?: string;
}

// Get chapter content - tries to get real content, falls back to sample
const getChapterContent = (chapter: Chapter): string => {
  // Try to get actual chapter content from localStorage if available
  try {
    const chapterContentData = localStorage.getItem(
      "chronicle-builder-chapter-content",
    );
    if (chapterContentData) {
      const parsedData = JSON.parse(chapterContentData);
      if (parsedData[chapter.id]) {
        return parsedData[chapter.id];
      }
    }
  } catch (error) {
    console.warn("Could not load chapter content from localStorage:", error);
  }

  // If chapter has no content or is just a draft, return appropriate message
  if (chapter.wordCount === 0 || chapter.status === "draft") {
    return `[Chapter "${chapter.title}" - No content written yet]

This chapter is still in ${chapter.status} status and doesn't have content yet.
${chapter.summary ? `\nPlanned summary: ${chapter.summary}` : ""}`;
  }

  // Return rich sample content for demo chapters
  return `# ${chapter.title}

The morning sun filtered through the ancient oak trees, casting dancing shadows across the cobblestone path. Elena had walked this route countless times before, but today felt different. The air itself seemed to hum with an energy she couldn't quite place.

She adjusted the leather satchel across her shoulder, feeling the weight of the mysterious letter she'd received the night before. The elegant script had been written in a language she didn't recognize, yet somehow she understood every word.

*"The time has come for you to know the truth about who you really are."*

Those words had haunted her dreams, filling her sleep with visions of distant lands and forgotten magic. Now, as she approached the old library where the letter had instructed her to go, her heart raced with a mixture of excitement and fear.

The library stood before her like a sleeping giant, its Gothic spires reaching toward the cloudy sky. She had always loved this place, but had never noticed the intricate symbols carved into the stone archway above the entrance. Today, they seemed to glow with a faint, otherworldly light.

Taking a deep breath, Elena pushed open the heavy wooden doors and stepped inside, unaware that this single action would change the course of her life forever.

As she moved through the familiar corridors, the very air seemed to whisper secrets she was only now beginning to understand. This was the moment everything would change - the moment her ordinary life would give way to something extraordinary.`;
};

// Get chapters for a specific story - this tries to access real data first
const getStoryChapters = (storyId: string): Chapter[] => {
  // Try to get chapters from localStorage if they exist
  try {
    const storyChaptersData = localStorage.getItem(
      "chronicle-builder-chapters",
    );
    if (storyChaptersData) {
      const parsedData = JSON.parse(storyChaptersData);
      if (parsedData[storyId]) {
        return parsedData[storyId];
      }
    }
  } catch (error) {
    console.warn("Could not load chapter data from localStorage:", error);
  }

  // Fallback to mock data for "The Script Reader's Legacy"
  const mockChapters = [
    {
      id: 1,
      title: "The Beginning",
      wordCount: 2847,
      status: "completed",
      lastEdited: "2 hours ago",
      summary:
        "Introduction to the main character and the world they live in. Sets up the conflict.",
    },
    {
      id: 2,
      title: "A Strange Discovery",
      wordCount: 3201,
      status: "completed",
      lastEdited: "1 day ago",
      summary: "The protagonist discovers something that changes everything.",
    },
    {
      id: 3,
      title: "The First Challenge",
      wordCount: 2156,
      status: "in-progress",
      lastEdited: "2 days ago",
      summary: "First major obstacle that tests the protagonist's resolve.",
    },
    {
      id: 4,
      title: "Allies and Enemies",
      wordCount: 0,
      status: "draft",
      lastEdited: "Never",
      summary: "",
    },
  ];

  // For "The Script Reader's Legacy" return mock chapters, for others return empty
  if (storyId === "story-1") {
    return mockChapters;
  }

  // For other stories, return empty array (in real app, would fetch from database)
  return [];
};

export const downloadStoryAsTxt = (story: Story): void => {
  const chapters = getStoryChapters(story.id);

  if (chapters.length === 0) {
    alert("No chapters found for this story.");
    return;
  }

  let content = `${story.title}\n`;
  content += `By ${story.genre} Author\n`;
  content += `Generated on ${new Date().toLocaleDateString()}\n`;
  content += `\n${"=".repeat(50)}\n\n`;

  chapters.forEach((chapter, index) => {
    content += `Chapter ${index + 1}: ${chapter.title}\n`;
    content += `Status: ${chapter.status} | Word Count: ${chapter.wordCount}\n`;
    content += `Last Edited: ${chapter.lastEdited}\n\n`;

    if (chapter.summary) {
      content += `Summary: ${chapter.summary}\n\n`;
    }

    // Add chapter content
    content += getChapterContent(chapter);
    content += `\n\n${"=".repeat(50)}\n\n`;
  });

  // Create and download the file
  const blob = new Blob([content], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${story.title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}_draft.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const downloadStoryAsPdf = (story: Story): void => {
  const chapters = getStoryChapters(story.id);

  if (chapters.length === 0) {
    alert("No chapters found for this story.");
    return;
  }

  const pdf = new jsPDF();
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 20;
  const lineHeight = 6;
  let currentY = margin;

  // Helper function to add text with word wrapping
  const addTextWithWrapping = (
    text: string,
    fontSize: number = 12,
    isBold: boolean = false,
  ): void => {
    pdf.setFontSize(fontSize);
    if (isBold) {
      pdf.setFont(undefined, "bold");
    } else {
      pdf.setFont(undefined, "normal");
    }

    const textWidth = pageWidth - margin * 2;
    const lines = pdf.splitTextToSize(text, textWidth);

    lines.forEach((line: string) => {
      if (currentY + lineHeight > pageHeight - margin) {
        pdf.addPage();
        currentY = margin;
      }
      pdf.text(line, margin, currentY);
      currentY += lineHeight;
    });
  };

  // Helper function to add space
  const addSpace = (space: number = lineHeight): void => {
    currentY += space;
    if (currentY > pageHeight - margin) {
      pdf.addPage();
      currentY = margin;
    }
  };

  // Title page
  pdf.setFontSize(24);
  pdf.setFont(undefined, "bold");
  const titleLines = pdf.splitTextToSize(story.title, pageWidth - margin * 2);
  titleLines.forEach((line: string, index: number) => {
    pdf.text(line, pageWidth / 2, 100 + index * 12, { align: "center" });
  });

  pdf.setFontSize(14);
  pdf.setFont(undefined, "normal");
  pdf.text(
    `${story.genre} | ${story.currentWordCount.toLocaleString()} words`,
    pageWidth / 2,
    140,
    { align: "center" },
  );
  pdf.text(
    `Generated on ${new Date().toLocaleDateString()}`,
    pageWidth / 2,
    160,
    { align: "center" },
  );

  // Add new page for content
  pdf.addPage();
  currentY = margin;

  // Table of contents
  addTextWithWrapping("Table of Contents", 18, true);
  addSpace(10);

  chapters.forEach((chapter, index) => {
    addTextWithWrapping(`Chapter ${index + 1}: ${chapter.title}`, 12);
  });

  addSpace(20);

  // Chapters content
  chapters.forEach((chapter, index) => {
    // Chapter title
    addTextWithWrapping(`Chapter ${index + 1}: ${chapter.title}`, 16, true);
    addSpace(10);

    // Chapter metadata
    addTextWithWrapping(
      `Status: ${chapter.status} | Word Count: ${chapter.wordCount} | Last Edited: ${chapter.lastEdited}`,
      10,
    );
    addSpace(8);

    // Chapter summary
    if (chapter.summary) {
      addTextWithWrapping(`Summary: ${chapter.summary}`, 11, true);
      addSpace(8);
    }

    // Chapter content
    const chapterContent = getChapterContent(chapter);
    addTextWithWrapping(chapterContent, 11);
    addSpace(20);
  });

  // Save the PDF
  const fileName = `${story.title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}_published.pdf`;
  pdf.save(fileName);
};
