import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Simple template engine that replaces {{variables}} with values
 * @param {string} template - Template string with {{variables}}
 * @param {Object} data - Data object with values to replace variables
 * @returns {string} - Rendered template
 */
const render = (template, data) => {
  // Process conditional blocks first
  let processed = template;
  const conditionalRegex = /\{\{#([^}]+)\}\}([\s\S]*?)\{\{\/\1\}\}/g;

  processed = processed.replace(conditionalRegex, (match, conditionKey, content) => {
    const conditionValue = data[conditionKey];
    if (conditionValue) {
      // Render the content inside the block with the same data
      return render(content, data);
    }
    return ""; // Return empty string if condition is falsy
  });

  // Then replace variables
  return processed.replace(/\{\{([^#\/][^}]*)\}\}/g, (match, key) => {
    return data[key] !== undefined ? data[key] : "";
  });
};

/**
 * Renders a template with given data
 * @param {string} templateName - Name of the template file without extension
 * @param {Object} data - Data to render in the template
 * @param {Object} options - Additional options like layout, title, etc.
 * @returns {string} - Rendered HTML
 */
export const renderTemplate = async (templateName, data = {}, options = {}) => {
  try {
    // Default options
    const defaultOptions = {
      layout: "layout.html",
      title: "Sample APIs",
      titleColor: "#15e3d9",
      contentBgColor: "rgba(255, 255, 255, 0.1)",
      heading: "Sample APIs",
    };

    // Merge options
    const mergedOptions = { ...defaultOptions, ...options };

    // Read the content template
    const contentPath = path.join(__dirname, `../views/reset/${templateName}.html`);
    const contentTemplate = await fs.promises.readFile(contentPath, "utf8");

    // Render the content
    const content = render(contentTemplate, data);

    // If no layout is specified, return just the content
    if (!mergedOptions.layout) {
      return content;
    }

    // Read the layout template
    const layoutPath = path.join(__dirname, `../views/reset/${mergedOptions.layout}`);
    const layoutTemplate = await fs.promises.readFile(layoutPath, "utf8");

    // Prepare layout data
    const layoutData = {
      ...mergedOptions,
      content,
    };

    // Render the layout with content
    return render(layoutTemplate, layoutData);
  } catch (error) {
    console.error("Error rendering template:", error);
    return `<html><body><h1>Error rendering template</h1><p>${error.message}</p></body></html>`;
  }
};

export default renderTemplate;
