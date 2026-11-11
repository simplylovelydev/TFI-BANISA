# 🎬 Guess the Movie – Picture Challenge

An interactive, browser-based quiz game where players identify iconic movies from picture clues. Built as **Project 7** for **BOSSCODER – School of Technology**.

Players pick a genre, study the scene images, and choose the correct movie title from four options before a 20-second timer runs out.

---

## ✨ Features

- **Picture clues** – every question has two images; switch between them with the *Alternate Picture* button.
- **Genre selection** – choose between **Action** and **Comedy** categories.
- **20-second timer** – each question is timed; running out of time counts as unanswered.
- **Hint system** – reveal a text hint for a 5-point penalty.
- **Audio reactions** – distinct sounds for correct answers, wrong answers, and game completion.
- **Live scoring** – score updates after every answer.
- **Results summary** – total questions, correct, incorrect, unanswered, accuracy, and total points.
- **Play Again / Categories** – replay the same genre or go back and pick another.
- **Responsive, accessible markup** – semantic HTML (`figure`, `fieldset`, `dl`, `output`, `time`, ARIA roles and live regions).

---

## 🎮 How to Play

1. Click **Start Game** on the welcome screen.
2. Select a category (Action or Comedy).
3. Look at the picture clue and choose the movie you think it represents.
4. Use **Get Hint** or **Alternate Picture** if you need extra help.
5. Click **Next** to move on until all questions are done.
6. View your final score and accuracy on the results screen.

### Scoring

| Outcome | Points |
|---|---|
| Correct answer (no hint) | **10** |
| Correct answer (hint used) | **5** |
| Incorrect answer | **0** |
| Timed out | **0** |

---

## 📁 Project Structure

```
guess-the-movie/
├── index.html    # Page structure and screens
├── style.css     # Styling, layout, animations
├── script.js     # Game logic, data, timer, scoring
└── README.md
```

---

## 🛠️ Tech Stack

- **HTML5** – semantic structure
- **CSS3** – custom properties, flexbox, grid, animations
- **Vanilla JavaScript (ES6)** – no frameworks or libraries
- **[Font Awesome 6.4](https://fontawesome.com/)** – icons (via CDN)
- **Unsplash** – clue images (hotlinked)
- **Mixkit** – sound effects (hotlinked)

---

## 🚀 Getting Started

No build step or installation is needed.

1. Download or clone the project:
   ```bash
   git clone <your-repository-url>
   cd guess-the-movie
   ```
2. Open `index.html` in any modern browser.

> **Note:** An internet connection is required, as icons, images, and audio are loaded from external CDNs.

---

## 🧩 Customizing the Game

All questions live in the `moviesDatabase` object at the top of `script.js`. To add a question, append an entry to a genre array:

```js
{
  title: "Movie Title",
  images: ["image-url-1", "image-url-2"],
  hint: "A short hint about the movie.",
  options: ["Option A", "Movie Title", "Option C", "Option D"]
}
```

To add a new genre, create a new key in `moviesDatabase` and add a matching entry to the `genres` array inside `renderCategories()`.

---

## 👥 Team

| Member | Role | Responsibility |
|---|---|---|
| **Sohail** | HTML & README| Page structure, semantic markup, screens and layout skeleton |
| **Varshitha** | CSS & RESEARCH | Visual design, responsive layout, colors, animations |
| **Dinesh** | Team Lead & JavaScript | Game logic, question data, timer, scoring, audio, screen navigation |

---

## 📄 License

Created for educational purposes as part of the BOSSCODER School of Technology curriculum.
