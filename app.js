const express = require('express');
const multer = require('multer');
const fs = require('fs');
const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");

const app = express();
const upload = multer({ dest: 'uploads/' }); 

const MODEL_NAME = "gemini-pro-vision";
const API_KEY = "AIzaSyDpvpSYZeAWCkyCLAiCGJoDU3qwW5RQJtI";

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: MODEL_NAME });

const updatedPrompt = `
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
`;

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.post('/upload', upload.single('image'), async (req, res) => {
  try {
    const image = req.file;
    if (!image) {
      return res.status(400).send('No image uploaded');
    }
    
    const parts = [
      {
        text: updatedPrompt
      },
      {
        inlineData: {
          mimeType: "image/jpeg",
          data: fs.readFileSync(image.path).toString("base64")
        }
      },
    ];

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

    const result = await model.generateContent({
      contents: [{ role: "user", parts }],
      generationConfig,
      safetySettings,
    });

    const response = result.response;
    const code = response.text();
    const formattedCode = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Generated Code</title>
        <style>
          .card {
            width: 600px;
            height: 800px;
            margin: 0 auto;
            margin-top: 50px;
            background-color: #24233b;
            border-radius: 8px;
            z-index: 1;
            box-shadow: 0px 10px 10px rgb(73, 70, 92);
            transition: 0.5s;
          }

          .card:hover {
            transform: translateY(-7px);
            box-shadow: 0px 10px 10px black;
          }

          .top {
            display: flex;
            align-items: center;
            padding-left: 10px;
          }

          .circle {
            padding: 0 4px;
          }

          .circle2 {
            display: inline-block;
            align-items: center;
            width: 10px;
            height: 10px;
            padding: 1px;
            border-radius: 5px;
          }

          .red {
            background-color: #ff605c;
          }

          .yellow {
            background-color: #ffbd44;
          }

          .green {
            background-color: #00ca4e;
          }

          .header {
            margin: 5px;
            margin-top: 5px;
            border-radius: 5px;
          }

          #title2 {
            color: white;
            padding-left: 50px;
            font-size: 15px;
          }

          .code-container {
            text-align: center;
          }

          #code {
            width: 560px;
            height: 715px;
            resize: none;
            background-color: rgb(73, 70, 92);
            border-radius: 5px;
            border: none;
            color: white;
            padding: 10px;
            margin-left: 5px;
            margin-right: 5px;
            margin-bottom: 5px;
          }

          #code:focus {
            outline: none !important;
          }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="header">
            <div class="top">
              <div class="circle"><span class="red circle2"></span></div>
              <div class="circle"><span class="yellow circle2"></span></div>
              <div class="circle"><span class="green circle2"></span></div>
              <div class="title"><p id="title2">Your Code</p></div>
            </div>
          </div>
          <div class="code-container">
            <textarea readonly name="code" id="code" class="area">${code}</textarea>
          </div>
        </div>
      </body>
      </html>
    `;

    res.send(formattedCode);
  } catch (error) {
    console.error('Error processing image:', error);
    res.status(500).send('Error processing image');
  } finally {
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
  }
});

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
