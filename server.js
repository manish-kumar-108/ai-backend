// Trick Gradio into thinking it's in a browser
global.window = global;

import express from 'express';
import cors from 'cors';
import { client, handle_file } from '@gradio/client';

const app = express();
app.use(cors());
app.use(express.json());

app.post('/generate', async (req, res) => {
  try {
    const imageUrl = req.body.image_url;

    // Connect to Microsoft's free TRELLIS AI model
    const hf = await client("trellis-community/TRELLIS");

    // Use handle_file() so Gradio processes the URL as a downloaded image
    const result = await hf.predict(0, [ handle_file(imageUrl) ]);

    // Extract the .glb file URL and send it back to SketchUp
    const fileUrl = result.data[0].url; 
    res.json({ success: true, model_url: fileUrl });
  } catch (error) {
    console.error("Gradio API Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(process.env.PORT || 3000, () => console.log('Server running!'));
