 // FitBuddy - AI Fitness Plan Generator using Gemini Models
// Full-Stack JavaScript Project
// Backend: Node.js + Express
// AI: Google Gemini API
// Frontend: HTML + CSS + JavaScript

// ============================
// package.json
// ============================

{
  "name": "fitbuddy-ai",
  "version": "1.0.0",
  "description": "AI Fitness Plan Generator using Gemini Models",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "node server.js"
  },
  "dependencies": {
    "dotenv": "^16.4.5",
    "express": "^4.21.1",
    "@google/generative-ai": "^0.21.0"
  }
}


// ============================
// .env
// ============================

GEMINI_API_KEY=YOUR_GEMINI_API_KEY
PORT=3000


// ============================
// server.js
// ============================

const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const { GoogleGenerativeAI } = require("@google/generative-ai");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash"
});

app.post("/api/generate-plan", async (req, res) => {
  try {
    const {
      name,
      age,
      gender,
      height,
      weight,
      goal,
      fitnessLevel,
      workoutDays,
      equipment,
      diet,
      medicalConditions
    } = req.body;

    if (!age || !height || !weight || !goal) {
      return res.status(400).json({
        error: "Please provide age, height, weight and fitness goal."
      });
    }

    const prompt = `
You are FitBuddy, an AI fitness planning assistant.

Create a practical and beginner-friendly fitness plan based on the following information.

User Information:
Name: ${name || "User"}
Age: ${age}
Gender: ${gender || "Not specified"}
Height: ${height} cm
Weight: ${weight} kg
Fitness Goal: ${goal}
Fitness Level: ${fitnessLevel || "Beginner"}
Workout Days Per Week: ${workoutDays || 3}
Available Equipment: ${equipment || "No equipment"}
Diet Preference: ${diet || "No preference"}
Medical Conditions/Injuries: ${medicalConditions || "None reported"}

Generate:

1. Fitness goal summary
2. Weekly workout schedule
3. Each day's exercises
4. Sets, repetitions and rest time
5. Warm-up routine
6. Cool-down routine
7. General nutrition guidance
8. Hydration guidance
9. Sleep and recovery guidance
10. Weekly progress tracking
11. Safety precautions

Important:
- Make the plan realistic.
- Do not recommend dangerous exercises.
- Do not diagnose medical conditions.
- If the user reports a medical condition or injury, advise consulting a qualified healthcare professional before exercising.
- Avoid extreme calorie restriction.
- Clearly state that this is general educational guidance and not a substitute for professional medical advice.

Return the result in clean JSON using exactly this structure:

{
  "summary": "",
  "weeklyPlan": [
    {
      "day": "",
      "focus": "",
      "exercises": [
        {
          "name": "",
          "sets": "",
          "reps": "",
          "rest": ""
        }
      ]
    }
  ],
  "warmup": [],
  "cooldown": [],
  "nutrition": [],
  "hydration": "",
  "recovery": [],
  "progressTracking": [],
  "safety": []
}
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;

    let text = response.text();

    text = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    let plan;

    try {
      plan = JSON.parse(text);
    } catch (error) {
      return res.status(500).json({
        error: "AI returned an invalid response.",
        raw: text
      });
    }

    res.json(plan);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Unable to generate fitness plan.",
      details: error.message
    });
  }
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`FitBuddy running at http://localhost:${PORT}`);
});


// ============================
// public/index.html
// ============================

<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <title>FitBuddy - AI Fitness Plan Generator</title>

  <link rel="stylesheet" href="style.css">
</head>

<body>

  <header>
    <div class="logo">💪 FitBuddy</div>
    <p>AI Fitness Plan Generator</p>
  </header>

  <main>

    <section class="hero">
      <h1>Build Your Personalized Fitness Plan</h1>
      <p>
        Tell FitBuddy about yourself and Gemini AI will create
        a personalized workout and wellness plan.
      </p>
    </section>

    <section class="card">

      <h2>👤 Personal Information</h2>

      <div class="grid">

        <div>
          <label>Name</label>
          <input id="name" type="text" placeholder="Enter your name">
        </div>

        <div>
          <label>Age</label>
          <input id="age" type="number" placeholder="Age">
        </div>

        <div>
          <label>Gender</label>
          <select id="gender">
            <option value="">Select</option>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>
        </div>

        <div>
          <label>Height (cm)</label>
          <input id="height" type="number" placeholder="Height">
        </div>

        <div>
          <label>Weight (kg)</label>
          <input id="weight" type="number" placeholder="Weight">
        </div>

        <div>
          <label>Fitness Goal</label>
          <select id="goal">

            <option value="Weight Loss">
              Weight Loss
            </option>

            <option value="Muscle Gain">
              Muscle Gain
            </option>

            <option value="General Fitness">
              General Fitness
            </option>

            <option value="Strength">
              Strength
            </option>

            <option value="Endurance">
              Endurance
            </option>

          </select>
        </div>

        <div>
          <label>Fitness Level</label>

          <select id="fitnessLevel">

            <option>Beginner</option>
            <option>Intermediate</option>
            <option>Advanced</option>

          </select>

        </div>

        <div>
          <label>Workout Days / Week</label>

          <select id="workoutDays">

            <option value="2">2 Days</option>
            <option value="3" selected>3 Days</option>
            <option value="4">4 Days</option>
            <option value="5">5 Days</option>
            <option value="6">6 Days</option>

          </select>

        </div>

      </div>

      <h2>🏋️ Workout Preferences</h2>

      <label>Available Equipment</label>

      <input
        id="equipment"
        type="text"
        placeholder="Example: Dumbbells, resistance bands, gym"
      >

      <label>Diet Preference</label>

      <select id="diet">

        <option>No preference</option>
        <option>Vegetarian</option>
        <option>Vegan</option>
        <option>Non-Vegetarian</option>
        <option>High Protein</option>

      </select>

      <label>Medical Conditions / Injuries</label>

      <textarea
        id="medicalConditions"
        placeholder="Mention any condition or injury, or type None"
      ></textarea>

      <button id="generateBtn" onclick="generatePlan()">
        ✨ Generate My Fitness Plan
      </button>

      <div id="loading" class="loading">
        🤖 FitBuddy is creating your plan...
      </div>

    </section>

    <section id="result" class="result">

    </section>

  </main>

  <footer>
    <p>FitBuddy © 2026 | Powered by Gemini AI</p>
  </footer>

  <script src="script.js"></script>

</body>

</html>


// ============================
// public/style.css
// ============================

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: Arial, sans-serif;
  background: #f2f7f5;
  color: #222;
}

header {
  background: #176b55;
  color: white;
  text-align: center;
  padding: 25px;
}

.logo {
  font-size: 30px;
  font-weight: bold;
}

header p {
  margin-top: 5px;
}

main {
  width: 90%;
  max-width: 1000px;
  margin: 30px auto;
}

.hero {
  text-align: center;
  margin-bottom: 25px;
}

.hero h1 {
  color: #176b55;
  margin-bottom: 10px;
}

.card {
  background: white;
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 5px 20px rgba(0,0,0,0.08);
}

.card h2 {
  margin: 20px 0;
  color: #176b55;
}

.grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 18px;
}

label {
  display: block;
  margin: 10px 0 7px;
  font-weight: bold;
}

input,
select,
textarea {
  width: 100%;
  padding: 13px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 15px;
}

textarea {
  min-height: 100px;
  resize: vertical;
}

button {
  width: 100%;
  margin-top: 25px;
  padding: 15px;
  background: #176b55;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 17px;
  font-weight: bold;
  cursor: pointer;
}

button:hover {
  background: #0e4d3d;
}

.loading {
  display: none;
  text-align: center;
  margin-top: 20px;
  font-weight: bold;
}

.result {
  margin-top: 30px;
}

.result-card {
  background: white;
  padding: 25px;
  margin-bottom: 20px;
  border-radius: 15px;
  box-shadow: 0 5px 20px rgba(0,0,0,0.08);
}

.result-card h2 {
  color: #176b55;
  margin-bottom: 15px;
}

.day {
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 15px;
  margin: 15px 0;
}

.day h3 {
  color: #176b55;
  margin-bottom: 10px;
}

.exercise {
  background: #f4f8f6;
  padding: 12px;
  margin: 8px 0;
  border-radius: 8px;
}

ul {
  margin-left: 20px;
  line-height: 1.8;
}

.disclaimer {
  background: #fff3cd;
  padding: 15px;
  border-radius: 8px;
  margin-top: 20px;
}

@media (max-width: 700px) {

  .grid {
    grid-template-columns: 1fr;
  }

  main {
    width: 95%;
  }

  .card {
    padding: 20px;
  }

}


// ============================
// public/script.js
// ============================

async function generatePlan() {

  const button = document.getElementById("generateBtn");
  const loading = document.getElementById("loading");
  const result = document.getElementById("result");

  const data = {

    name: document.getElementById("name").value,

    age: document.getElementById("age").value,

    gender: document.getElementById("gender").value,

    height: document.getElementById("height").value,

    weight: document.getElementById("weight").value,

    goal: document.getElementById("goal").value,

    fitnessLevel:
      document.getElementById("fitnessLevel").value,

    workoutDays:
      document.getElementById("workoutDays").value,

    equipment:
      document.getElementById("equipment").value,

    diet:
      document.getElementById("diet").value,

    medicalConditions:
      document.getElementById("medicalConditions").value
  };

  if (!data.age || !data.height || !data.weight) {

    alert(
      "Please enter your age, height and weight."
    );

    return;
  }

  button.disabled = true;

  loading.style.display = "block";

  result.innerHTML = "";

  try {

    const response = await fetch(
      "/api/generate-plan",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify(data)
      }
    );

    const plan = await response.json();

    if (!response.ok) {
      throw new Error(
        plan.error || "Something went wrong."
      );
    }

    displayPlan(plan);

  } catch (error) {

    result.innerHTML = `
      <div class="result-card">
        <h2>❌ Error</h2>
        <p>${escapeHTML(error.message)}</p>
      </div>
    `;

  } finally {

    button.disabled = false;

    loading.style.display = "none";
  }
}


function displayPlan(plan) {

  const result = document.getElementById("result");

  let html = "";

  html += `
    <div class="result-card">

      <h2>🎯 Your Fitness Goal</h2>

      <p>${escapeHTML(plan.summary || "")}</p>

    </div>
  `;


  html += `
    <div class="result-card">

      <h2>📅 Weekly Workout Plan</h2>
  `;


  if (plan.weeklyPlan) {

    plan.weeklyPlan.forEach(day => {

      html += `
        <div class="day">

          <h3>
            ${escapeHTML(day.day)}
          </h3>

          <p>
            <strong>Focus:</strong>
            ${escapeHTML(day.focus)}
          </p>
      `;

      if (day.exercises) {

        day.exercises.forEach(exercise => {

          html += `
            <div class="exercise">

              <strong>
                ${escapeHTML(exercise.name)}
              </strong>

              <br>

              Sets:
              ${escapeHTML(exercise.sets)}

              |

              Reps:
              ${escapeHTML(exercise.reps)}

              |

              Rest:
              ${escapeHTML(exercise.rest)}

            </div>
          `;

        });

      }

      html += `</div>`;

    });

  }

  html += `</div>`;


  html += createListSection(
    "🔥 Warm-up",
    plan.warmup
  );

  html += createListSection(
    "🧘 Cool-down",
    plan.cooldown
  );

  html += createListSection(
    "🥗 Nutrition Guidance",
    plan.nutrition
  );


  html += `
    <div class="result-card">

      <h2>💧 Hydration</h2>

      <p>
        ${escapeHTML(plan.hydration || "")}
      </p>

    </div>
  `;


  html += createListSection(
    "😴 Recovery",
    plan.recovery
  );

  html += createListSection(
    "📈 Progress Tracking",
    plan.progressTracking
  );

  html += createListSection(
    "⚠️ Safety",
    plan.safety
  );


  html += `
    <div class="result-card disclaimer">

      <strong>Important:</strong>

      This AI-generated fitness plan is for
      general educational guidance only.
      It is not a substitute for advice from
      a qualified healthcare or fitness professional.
      Stop exercising if you experience unusual pain,
      dizziness, chest pain or difficulty breathing,
      and seek appropriate professional help.

    </div>
  `;


  result.innerHTML = html;

  window.scrollTo({
    top: result.offsetTop,
    behavior: "smooth"
  });
}


function createListSection(title, items) {

  if (!items || items.length === 0) {
    return "";
  }

  let html = `
    <div class="result-card">

      <h2>${title}</h2>

      <ul>
  `;

  items.forEach(item => {

    html += `
      <li>
        ${escapeHTML(item)}
      </li>
    `;

  });

  html += `
      </ul>

    </div>
  `;

  return html;
}


function escapeHTML(value) {

  if (value === undefined || value === null) {
    return "";
  }

  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}


// ============================
// RUN PROJECT
// ============================
//
// 1. Create a folder:
//
//    FitBuddy
//
// 2. Inside it create:
//
//    server.js
//    package.json
//    .env
//    public/index.html
//    public/style.css
//    public/script.js
//
// 3. Open terminal inside FitBuddy.
//
// 4. Install packages:
//
//    npm install
//
// 5. Add your Gemini API key to .env:
//
//    GEMINI_API_KEY=YOUR_GEMINI_API_KEY
//
// 6. Start:
//
//    npm start
//
// 7. Open:
//
//    http://localhost:3000
//
// ============================