// this is the real version of the openAi code
// // Import dependencies

const express = require("express");
const cors = require("cors");
const { OpenAI } = require("openai");
require("dotenv").config();

const app = express();
const PORT = 5000;

app.use(express.json());
app.use(cors());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/generate-recipes", async (req, res) => {
  const { ingredients } = req.body;

  if (!ingredients || ingredients.trim() === "") {
    return res.status(400).json({ error: "Ingredients are required" });
  }

  try {
    console.log("Generating recipe and image in parallel...");

    // Define prompts
    const recipePrompt = `Create a gourmet recipe using: ${ingredients}. Include:
    - Title
    - Ingredients list
    - 3-5 simple preparation steps
    - Cooking instructions
    - Optional tips. Keep it under 900 tokens.`;

    // Directly create the image prompt (removing the need for a second GPT call)
    const imagePrompt = `A high-end food photography image of a gourmet dish made from: ${ingredients}.
The dish is plated on a modern ceramic plate with vibrant textures and elegant styling. 
Natural lighting, blurred background with fresh ingredients and spices.
Photorealistic and suitable for a Michelin-star restaurant presentation.`;

    // Run Recipe & Image requests in parallel
    const [recipeResponse, imageResponse] = await Promise.all([
      openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          { role: "system", content: "You are an expert recipe generator." },
          { role: "user", content: recipePrompt },
        ],
        max_tokens: 900,
        temperature: 0.3,
      }),

      openai.images.generate({
        model: "dall-e-3",
        prompt: imagePrompt,
        n: 1,
        size: "1024x1024",
      }),
    ]);

    // Extract responses
    const generatedRecipe = recipeResponse.choices[0].message.content;
    const imageUrl = imageResponse.data[0].url;

    console.log("Generated Recipe:", generatedRecipe);
    console.log("Generated Image URL:", imageUrl);

    // Send response immediately
    res.json({
      recipes: [
        {
          id: 1,
          title: "Generated Recipe",
          instructions: generatedRecipe,
          image: imageUrl,
        },
      ],
    });
  } catch (error) {
    console.error("OpenAI API Error:", error.message);
    res
      .status(500)
      .json({
        error: "Failed to generate recipes or images. Please try again later.",
      });
  }
});

app.listen(PORT, () => {
  console.log(`Backend Server is running on http://localhost:${PORT}`);
});

// this code is woking perfectly, I gust want to add the speed process if somthing goes on
// just stay with this code
// const express = require("express");
// const cors = require("cors");
// const { OpenAI } = require("openai");
// require("dotenv").config();

// const app = express();
// const PORT = 5000;

// app.use(express.json());
// app.use(cors());

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// app.post("/generate-recipes", async (req, res) => {
//   const { ingredients } = req.body;

//   if (!ingredients || ingredients.trim() === "") {
//     console.error("No ingredients provided");
//     return res.status(400).json({ error: "Ingredients are required" });
//   }

//   try {
//     console.log("Generating recipe and image in parallel...");

//     // Construct prompts
//     const recipePrompt = `Create a concise and detailed recipe using these ingredients: ${ingredients}.

// Include:
// - Title
// - Ingredients list
// - 3-5 clear preparation steps
// - Cooking instructions
// - Any optional tips.`;

//     const dishDescriptionPrompt = `Describe a visually stunning gourmet dish made with: ${ingredients}.
// Mention its plating style, textures, colors, and high-end presentation in 2-3 sentences.`;

//     // Run both API requests in parallel
//     const [recipeResponse, dishResponse] = await Promise.all([
//       openai.chat.completions.create({
//         model: "gpt-4",
//         messages: [
//           { role: "system", content: "You are an expert recipe generator." },
//           { role: "user", content: recipePrompt },
//         ],
//         max_tokens: 900, // Reduced for speed
//         temperature: 0.3,
//       }),

//       openai.chat.completions.create({
//         model: "gpt-4",
//         messages: [
//           { role: "system", content: "You are an expert food stylist and chef." },
//           { role: "user", content: dishDescriptionPrompt },
//         ],
//         max_tokens: 100, // Reduced to a quick description
//         temperature: 0.5,
//       }),
//     ]);

//     // Extract responses
//     const generatedRecipe = recipeResponse.choices[0].message.content;
//     const dishDescription = dishResponse.choices[0].message.content;

//     console.log("Generated Recipe:", generatedRecipe);
//     console.log("Generated Dish Description:", dishDescription);

//     // Generate the image using dish description (executed in parallel to reduce delay)
//     const imagePrompt = `A high-end food photography image of a gourmet dish: ${dishDescription}.
// The dish is plated on a modern ceramic plate with vibrant textures and elegant styling.
// Natural lighting, blurred background with fresh ingredients and spices.
// Photorealistic and suitable for a Michelin-star restaurant presentation.`;

//     const imageResponse = await openai.images.generate({
//       model: "dall-e-3",
//       prompt: imagePrompt,
//       n: 1,
//       size: "1024x1024",
//     });

//     if (!imageResponse.data || imageResponse.data.length === 0) {
//       throw new Error("No image generated by OpenAI/DALL-E");
//     }

//     const imageUrl = imageResponse.data[0].url;
//     console.log("Generated Image URL:", imageUrl);

//     // Send response
//     res.json({
//       recipes: [
//         {
//           id: 1,
//           title: "Generated Recipe",
//           instructions: generatedRecipe,
//           image: imageUrl,
//         },
//       ],
//     });
//   } catch (error) {
//     console.error("OpenAI API Error:", error.message);
//     res.status(500).json({ error: "Failed to generate recipes or images. Please try again later." });
//   }
// });

// app.listen(PORT, () => {
//   console.log(`Backend Server is running on http://localhost:${PORT}`);
// });

// this is the previous code before doing changes to the image quality of Dall-e
// const express = require("express");
// const cors = require("cors"); // to allow cross sharing from different domains
// const { OpenAI } = require("openai"); // to interact with openai
// require("dotenv").config(); // to get the environment variables

// const app = express();
// const PORT = 5000;

// // for middleware
// app.use(express.json()); // to convert the data into json
// app.use(cors());

// // this is to initialize openai
// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// // this is the route
// app.post("/generate-recipes", async (req, res) => {
//   const { ingredients } = req.body;

//   // this is the input validation
//   if (!ingredients || ingredients.trim() === "") {
//     console.error("No ingredients provided");
//     return res.status(400).json({ error: "Ingredients are required" });
//   }

//   try {
//     // this is what i'm telling AI to generate or construct the recipe prompt
//     const recipePrompt = `Create a detailed and complete recipe using the following ingredients: ${ingredients}.

// Please include the title, ingredients list, preparation steps, cooking instructions, and any additional tips or variations.`;

//     // to check the recipe output in the log
//     console.log("Recipe Prompt:", recipePrompt);

//     // generating the recipe using chat this is the prompt and API
//     const recipeResponse = await openai.chat.completions.create({
//       model: "gpt-4", // gpt-4 with default 8k token limit
//       messages: [
//         { role: "system", content: "You are an expert recipe generator." },
//         { role: "user", content: recipePrompt },
//       ],
//       max_tokens: 3500, // for the response i only need a maximum token to control cost
//       temperature: 0.7, // i adjust the randomness for better creativity
//     });

//     // handles missing ai response
//     if (!recipeResponse.choices || recipeResponse.choices.length === 0) {
//       throw new Error("No recipe generated by OpenAI");
//     }

//       // this will extract the recipe from AI and response and logs
//     const generatedRecipe = recipeResponse.choices[0].message.content;
//     console.log("Generated Image:", generatedRecipe);

//     // this is generating images using DALL-E
//     const imagePrompt = `A professional high-quality photo of a delicious dish made with these ingredients: ${ingredients}.
//     The dish should be beautifully plated on a clean, elegant background with professional lighting.
//     The photo should look vibrant, appetizing, and suitable for a fine-dining restaurant menu. Make it look small`;

//     // to get the image response
//     const imageResponse = await openai.images.generate({
//       prompt: imagePrompt,
//       n: 1, // generate 3 variations for better selection
//       size: "1024x1024", // for high quality resolution
//     });
//     // validating the response
//     if (!imageResponse.data || imageResponse.data.length === 0) {
//       throw new Error("No image generated by OpenAI/Dall-E");
//     }

//     // extracting the image and logging it
//     // this is to select the first image (or any preferred logic to pick the best)
//     const imageUrl = imageResponse.data[0].url;
//     console.log("Generated Image URL:", imageUrl);

//     // formatting and sending the final response to the frontend
//     const recipes = [
//       {
//         id: 1,
//         title: "Generated Image",
//         instructions: generatedRecipe,
//         image: imageUrl,
//       },
//     ];

//     res.json({ recipes }); // sending recipes as an array
//   } catch (error) {
//     console.error("OpenAI API Error:", error.message);
//     res
//       .status(500)
//       .json({ error: "Failed to generate recipes or images. Please try again later." });
//   }
// });

// // starting the server
// app.listen(PORT, () => {
//   console.log(`Backend Server is running on http://localhost:${PORT}`);
// });

// this code is the mock version so I can test without hitting the limit

// const express = require('express');
// const axios = require('axios');
// const nock = require('nock'); // Import Nock for mocking API requests

// const app = express();
// const PORT = 3001;

// app.use(express.json());

// // Check if it's a local environment or production
// const isLocalEnv = process.env.NODE_ENV === 'development';

// // If in local environment, mock OpenAI API responses
// if (isLocalEnv) {
//   nock('https://api.openai.com') // Target OpenAI API URL
//     .post('/v1/completions')
//     .reply(200, {
//       choices: [{
//         text: 'Mocked recipe response with ingredient: chicken, rice, and broccoli.'
//       }]
//     });
// }

// // Endpoint to interact with OpenAI API
// app.post('/generateRecipe', async (req, res) => {
//   const { ingredients } = req.body;

//   if (isLocalEnv) {
//     // Mocked response in development mode
//     return res.json({
//       recipe: 'Mocked recipe response for ingredients: ' + ingredients.join(', ')
//     });
//   }

//   app.post('/generateRecipe', async (req, res) => {
//       const { ingredients } = req.body;
//       console.log('Received ingredients:', ingredients);  // Log incoming data

//       try {
//         const response = await axios.post(
//           'https://api.openai.com/v1/completions',
//           {
//             model: 'text-davinci-003',  // Example OpenAI model
//             prompt: `Create a recipe using these ingredients: ${ingredients.join(', ')}`,
//             max_tokens: 200
//           },
//           {
//             headers: {
//               'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
//             }
//           }
//         );
//         console.log('Received OpenAI response:', response.data);  // Log OpenAI response
//         res.json(response.data);
//       } catch (error) {
//         console.error('Error during OpenAI API call:', error.message);  // Log the error message
//         console.error('Error details:', error.response ? error.response.data : error);  // Log full error details
//         res.status(500).send('Error generating recipe');
//       }
//     });

// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });
