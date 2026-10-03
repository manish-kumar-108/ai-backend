import express from 'express';
import cors from 'cors';
import { fal } from '@fal-ai/client';

const app = express();
app.use(cors());
app.use(express.json());

app.post('/generate', async (req, res) => {
  try {
    const imageUrl = req.body.image_url;
    
    // Submit to the production TRELLIS server
    const result = await fal.subscribe("fal-ai/trellis", {
      input: { image_url: imageUrl }
    });
    
    // Extract the .glb file URL and send it back to SketchUp
    res.json({ success: true, model_url: result.data.model_glb.url });
  } catch (error) {
    console.error("API Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(process.env.PORT || 3000, () => console.log('Server running!'));
