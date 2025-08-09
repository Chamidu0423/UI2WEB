const {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
  } = require("@google/generative-ai");
  const fs = require("fs");
  
  const MODEL_NAME = "gemini-pro-vision";
  const API_KEY = "";
  
  async function run() {
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });
  
    const generationConfig = {
      temperature: 1,
      topK: 32,
      topP: 1,
      maxOutputTokens: 4096,
    };
  
    const safetySettings = [
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
      },
    ];
  
    if (!fs.existsSync("image0.png")) {
      throw new Error("Could not find images in current directory.");
    }
  
    const parts = [
      {text: `
      Analyze the provided design image (link/file) and automatically generate responsive HTML/CSS code that brings it to life. Prioritize bug-free and accessible code using internal CSS in the head section. Consider all visual elements, including alignments, colors, fonts, border radius, spacing, interactivity (e.g., buttons), and responsiveness across different devices.
      
      If the provided image is a UI design screen or signup page image, ensure to include instructions or guidelines for processing these types of images effectively. Use techniques such as feature extraction, semantic analysis, and pattern recognition to identify key elements and layout structures.
      
      For UI design screens and signup pages:
      - Extract key components such as buttons, input fields, navigation bars, and headers.
      - Maintain consistency in styling and layout across the page.
      - Pay attention to details such as color schemes, font choices, and spacing.
      - Generate code that accommodates various screen sizes and devices.
      
      If the provided image is a form image:
      - Recognize form fields, labels, and submit buttons.
      - Ensure proper alignment and spacing between form elements.
      - Include accessibility features such as labels and aria attributes for screen readers.
      
      For all images:
      - Use dummy images with meaningful alt attributes instead of inline data URIs.
      - Ensure the generated code adheres to WCAG accessibility standards and reflects the following brand guidelines: [list colors, fonts, style preferences].
      
      By following these instructions, aim to generate code that accurately represents the provided design image while maintaining accessibility and adherence to brand guidelines.
      `
          },
      {
        inlineData: {
          mimeType: "image/png",
          data: Buffer.from(fs.readFileSync("image0.png")).toString("base64")
        }
      },
      {text: "\n ```html\n<!DOCTYPE html>\n<html lang=\"en\">\n\n<head>\n    <meta charset=\"UTF-8\">\n    <meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\">\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n    <title>Delivery</title>\n    <link rel=\"stylesheet\" href=\"style.css\">\n</head>\n\n<body>\n    <header>\n        <div class=\"container\">\n            <nav>\n                <a href=\"#\" class=\"logo\">Delivery</a>\n                <ul>\n                    <li><a href=\"#\">Home</a></li>\n                    <li><a href=\"#\">Menu</a></li>\n                    <li><a href=\"#\">Service</a></li>\n                    <li><a href=\"#\">Discount</a></li>\n                    <li><a href=\"#\">Contact</a></li>\n                    <li><a href=\"#\">Sign In</a></li>\n                </ul>\n            </nav>\n        </div>\n    </header>\n\n    <section class=\"hero\">\n        <div class=\"container\">\n            <div class=\"hero-text\">\n                <h1>We have faster delivery in your town</h1>\n                <p>We are most fastest and furiously food delivery service all over the world. Search for your favourite food or restaurant in your area.</p>\n                <form action=\"\">\n                    <input type=\"text\" placeholder=\"Type Your Location\">\n                    <button type=\"submit\">Search</button>\n                </form>\n            </div>\n            <div class=\"hero-image\">\n                <img src=\"images/hero-image.png\" alt=\"\">\n            </div>\n        </div>\n    </section>\n</body>\n\n</html>\n```\n\n```css\n/* Global Styles */\n\n* {\n    margin: 0;\n    padding: 0;\n    box-sizing: border-box;\n}\n\nbody {\n    font-family: 'Roboto', sans-serif;\n    color: #333;\n    line-height: 1.6;\n}\n\na {\n    text-decoration: none;\n    color: #333;\n}\n\nh1,\nh2,\nh3,\nh4,\nh5,\nh6 {\n    font-weight: bold;\n    margin-bottom: 10px;\n}\n\np {\n    margin-bottom: 15px;\n}\n\nimg {\n    max-width: 100%;\n    height: auto;\n    display: block;\n}\n\n/* Header Styles */\n\nheader {\n    background-color: #fff;\n    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);\n}\n\n.container {\n    max-width: 1170px;\n    margin: 0 auto;\n    padding: 0 15px;\n}\n\nnav {\n    display: flex;\n    justify-content: space-between;\n    align-items: center;\n    padding: 20px 0;\n}\n\n.logo {\n    font-size: 24px;\n    font-weight: bold;\n    color: #333;\n}\n\nnav ul {\n    display: flex;\n    list-style: none;\n}\n\nnav ul li {\n    margin-right: 20px;\n}\n\nnav ul li a {\n    font-size: 16px;\n    font-weight: 500;\n    color: #333;\n}\n\nnav ul li a:hover {\n    color: #000;\n}\n\n.sign-in {\n    background-color: #000;\n    color: #fff;\n    padding: 8px 16px;\n    border-radius: 4px;\n}\n\n/* Hero Section Styles */\n\n.hero {\n    background-color: #f2f2f2;\n    padding: 80px 0;\n}\n\n.hero-text {\n    max-width: 500px;\n    margin: 0 auto;\n    text-align: center;\n}\n\n.hero-text h1 {\n    font-size: 48px;\n    margin-bottom: 20px;\n}\n\n.hero-text p {\n    font-size: 18px;\n    margin-bottom: 30px;\n}\n\n.hero-text form {\n    display: flex;\n    align-items: center;\n}\n\n.hero-text input[type=\"text\"] {\n    width: 250px;\n    height: 50px;\n    padding: 10px 20px;\n    border: 1px solid #ccc;\n    border-radius: 4px;\n    outline: none;\n}\n\n.hero-text button[type=\"submit\"] {\n    background-color: #000;\n    color: #fff;\n    padding: 10px 20px;\n    border: 1px solid #000;\n    border-radius: 4px;\n    cursor: pointer;\n    outline: none;\n}\n\n.hero-text button[type=\"submit\"]:hover {\n    background-color: #333;\n}\n\n.hero-image {\n    text-align: center;\n    margin-top: 50px; }\n\n.hero-image img {\n    max-width: 300px;\n    height: 300px;\n    border-radius: 50%;\n}\n```"},
    ];
  
    const result = await model.generateContent({
      contents: [{ role: "user", parts }],
      generationConfig,
      safetySettings,
    });
  
    const response = result.response;
    console.log(response.text());
  }
  
  run();
