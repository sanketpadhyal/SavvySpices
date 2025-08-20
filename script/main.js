   const chatBox = document.getElementById("chatBox");
    const chatForm = document.getElementById("chatForm");
    const userInput = document.getElementById("userInput");

    const API_URL = "YOUR_BACKEND_URL/api/ask-ai";

    // Map emojis to images
    function replaceEmojisWithImages(text) {
      const emojiMap = {
        "👩‍🍳": "assets/male-cook.png",
        "🤔": "assets/speech_balloon (2).png",
        "⚠️": "assets/warning.png",
        "🍴": "assets/emoji/forkknife.png",
        "🍕": "assets/emoji/pizza.png",
        "🧑": "assets/bust_in_silhouette (1).png"
      };

      Object.keys(emojiMap).forEach(emoji => {
        const imgTag = `<img src="${emojiMap[emoji]}" alt="${emoji}" class="emoji">`;
        text = text.replaceAll(emoji, imgTag);
      });

      return text;
    }

    chatForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const message = userInput.value.trim();
      if (!message) return;

      // Show user message
      appendMessage("🧑 You", message, "user-msg");

      userInput.value = "";

      // Show AI thinking indicator
      appendMessage("👩‍🍳 SavvySpices AI", "🤔 Typing... ", "ai-msg", "loading");

      try {
        const res = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: message })
        });
        const data = await res.json();

        // Remove the thinking indicator
        document.querySelector(".loading").remove();

        appendMessage(
          "👩‍🍳 SavvySpices AI",
          data.reply || "Sorry, I couldn’t think of a recipe.",
          "ai-msg"
        );
      } catch (err) {
        document.querySelector(".loading")?.remove();
        appendMessage(
          "👩‍🍳 SavvySpices AI",
          "Unable to connect to server ⚠️",
          "ai-msg"
        );
      }
    });

    function appendMessage(sender, text, className, extraClass = "") {
      const msgDiv = document.createElement("div");
      msgDiv.className = `message ${className} ${extraClass}`;
      msgDiv.innerHTML = `<strong>${replaceEmojisWithImages(sender)}:</strong> ${replaceEmojisWithImages(text)}`;
      chatBox.appendChild(msgDiv);
      chatBox.scrollTop = chatBox.scrollHeight;
    }