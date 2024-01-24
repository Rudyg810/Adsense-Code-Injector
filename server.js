const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

let injectedCode = '';
let link = 'www.example.com';

// Middleware to parse JSON in the request body
app.use(bodyParser.json());

app.get('/', (req, res) => {
  const headContent = injectedCode ? `${injectedCode}` : '';
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Injected Code Example</title>
      ${headContent}
      <style>
        body {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100vh;
            margin: 0;
        }

        button {
            font-size: 16px;
            padding: 10px 20px;
            cursor: pointer;
        }
      </style>
      <script>
        let clickCount = 0;
        let popup;

        function handleButtonClick() {
            clickCount++;

            if (clickCount === 1) {
                // First click: Open a popup (replace the placeholder with your content)
                const popupContent = 'This is the popup content. Replace it with your AdSense code or other content.';
                popup = window.open('', 'Popup', 'width=300,height=200');
                popup.document.write(popupContent);
            } else if (clickCount === 2) {
                // Second click: Redirect to www.example.com
                window.location.href = '${link}';
            }
        }

        // Close the popup when the main window is closed
        window.onbeforeunload = function () {
            if (clickCount === 1 && popup && !popup.closed) {
                popup.close();
            }
        };
      </script>
    </head>
    <body>
      <button onclick="handleButtonClick()">Apply For Internship</button>
    </body>
    </html>
  `;
  res.send(html);
});

// API endpoint to handle injected code
app.post('/inject', (req, res) => {
    const { code } = req.body;
    injectedCode = code;
    res.send({ success: true, injectedCode });
});

app.post('/link', (req, res) => {
    const { code } = req.body;
    link = code;
    res.send({ success: true, link });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
