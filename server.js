const express = require('express');
const { exec } = require('child_process');
const { createProxyMiddleware } = require('http-proxy-middleware');
const path = require('path');
const app = express();
const port = 3000;

// Serve the Angular production build from dist/auth-app
app.use(express.static(path.join(__dirname, 'dist/auth-app/browser/')));

// Serve the Angular production app for any unmatched routes
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/auth-app/browser/index.csr.html'));
});

// Proxy /napa requests to Streamlit app running on port 8501
app.use('/napa', createProxyMiddleware({
  target: 'http://localhost:8501',  // Where Streamlit is running locally
  changeOrigin: true,
  pathRewrite: {
    '^/napa': '/',  // Strip /napa from the request URL before forwarding
  }
}));

app.use(express.json());  // To parse JSON body requests

// Endpoint to launch Streamlit app with email as username
app.post('/api/launch-streamlit', (req, res) => {
  const email = req.body.email;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  // Command to run Streamlit with the --username flag
  const scriptDir = path.resolve(__dirname, '../../napa');
  // Log the resolved path
  console.log(`Resolved Script Directory: ${scriptDir}`);

  // Check if directory exists
  const fs = require('fs');
  if (fs.existsSync(scriptDir)) {
    console.log(`Directory exists: ${scriptDir}`);
  } else {
    console.log(`Directory does not exist: ${scriptDir}`);
  }
  const streamlitCommand = `cross-env USERNAME=${email} streamlit run sl_chat.py`;

  // Execute the Streamlit command
  exec(streamlitCommand, { cwd: scriptDir }, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error launching Streamlit: ${error}`);
      return res.status(500).json({ error: 'Failed to launch Streamlit' });
    }

    console.log(`Streamlit launched with username: ${email}`);
    res.status(200).json({ message: `Streamlit launched with email: ${email}` });
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
