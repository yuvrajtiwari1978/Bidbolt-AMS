import express from 'express';
import { exec } from 'child_process';
import path from 'path';

const router = express.Router();
const pythonScriptsDir = path.resolve('python_scripts');

// Endpoint to run data analysis script
router.get('/analyze-data', (req, res) => {
  const scriptPath = path.join(pythonScriptsDir, 'data_analysis.py');
  exec(`python "${scriptPath}"`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing data analysis: ${error.message}`);
      return res.status(500).json({ success: false, message: 'Data analysis failed', error: error.message });
    }
    if (stderr) {
      console.error(`Data analysis stderr: ${stderr}`);
    }
    res.json({ success: true, message: 'Data analysis completed', output: stdout });
  });
});

// Endpoint to train price prediction model
router.post('/train-model', (req, res) => {
  const scriptPath = path.join(pythonScriptsDir, 'price_prediction.py');
  exec(`python "${scriptPath}"`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error training model: ${error.message}`);
      return res.status(500).json({ success: false, message: 'Model training failed', error: error.message });
    }
    if (stderr) {
      console.error(`Model training stderr: ${stderr}`);
    }
    res.json({ success: true, message: 'Model training completed', output: stdout });
  });
});

// Endpoint to predict price (expects JSON body with auction details)
router.post('/predict-price', (req, res) => {
  const { startingBid, category, condition, durationDays, watchers } = req.body;

  if (
    startingBid === undefined ||
    !category ||
    !condition ||
    durationDays === undefined
  ) {
    return res.status(400).json({ success: false, message: 'Missing required fields' });
  }

  // Call a Python script or microservice for prediction
  // For simplicity, here we call a Python script with arguments and get output

  const scriptPath = path.join(pythonScriptsDir, 'predict_price_cli.py');

  // Build command with arguments
  const cmd = `python "${scriptPath}" --startingBid ${startingBid} --category "${category}" --condition "${condition}" --durationDays ${durationDays} --watchers ${watchers || 0}`;

  exec(cmd, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error predicting price: ${error.message}`);
      return res.status(500).json({ success: false, message: 'Price prediction failed', error: error.message });
    }
    if (stderr) {
      console.error(`Price prediction stderr: ${stderr}`);
    }
    try {
      const result = JSON.parse(stdout);
      res.json({ success: true, predictedPrice: result.predicted_price });
    } catch (parseError) {
      console.error('Failed to parse prediction output:', parseError);
      res.status(500).json({ success: false, message: 'Invalid prediction output' });
    }
  });
});

// Endpoint to generate wallet balance visualization
router.post('/wallet-visualization', (req, res) => {
  const { transactions } = req.body;

  if (!transactions || !Array.isArray(transactions)) {
    return res.status(400).json({ success: false, message: 'Transactions array is required' });
  }

  const scriptPath = path.join(pythonScriptsDir, 'wallet_visualization.py');

  // Pass transactions data via stdin to the Python script
  const child = exec(`python "${scriptPath}"`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error generating wallet visualization: ${error.message}`);
      return res.status(500).json({ success: false, message: 'Wallet visualization failed', error: error.message });
    }
    if (stderr) {
      console.error(`Wallet visualization stderr: ${stderr}`);
    }
    try {
      const result = JSON.parse(stdout);
      if (result.success) {
        res.json({ success: true, graph_base64: result.graph_base64 });
      } else {
        res.status(500).json({ success: false, message: 'Visualization generation failed', error: result.error });
      }
    } catch (parseError) {
      console.error('Failed to parse visualization output:', parseError);
      res.status(500).json({ success: false, message: 'Invalid visualization output' });
    }
  });

  // Send transactions data to Python script via stdin
  child.stdin.write(JSON.stringify(transactions));
  child.stdin.end();
});

export default router;
