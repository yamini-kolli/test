import axios from "axios"
import userModel from "../models/userModel.js"
import FormData from "form-data"

export const generateImage = async (req, res) => {
  try {
    const { userId, prompt } = req.body;

    const user = await userModel.findById(userId);
    if (!user || !prompt) {
      return res.json({ success: false, message: "Missing Details" });
    }

    if (user.creditBalance <= 0) {
      return res.json({
        success: false,
        message: "No credit balance",
        creditBalance: user.creditBalance
      });
    }

    // 🔄 Prepare form data for ClipDrop API
    const formData = new FormData();
    formData.append("prompt", prompt);

    const { data } = await axios.post("https://clipdrop-api.co/text-to-image/v1", formData, {
      headers: {
        "x-api-key": process.env.CLIPDROP_API,
        ...formData.getHeaders()
      },
      responseType: "arraybuffer"
    });

    const base64Image = Buffer.from(data, "binary").toString("base64");
    const resultImage = `data:image/png;base64,${base64Image}`;

    // 👇 Fix starts here: use a properly defined variable
    const newCredits = user.creditBalance - 1;

    const updates = {
      creditBalance: newCredits
    };

    if (newCredits === 0) {
      updates.lastCreditUsedTime = new Date();
    }

    await userModel.findByIdAndUpdate(user._id, updates);

    res.json({
      success: true,
      message: "Image Generated",
      creditBalance: newCredits,
      resultImage
    });

  } catch (error) {
    console.log("Image Generation Error:", error.message);
    res.json({ success: false, message: error.message });
  }
};

