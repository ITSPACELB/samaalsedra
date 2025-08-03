<script setup lang="ts">
import { ref, nextTick } from "vue";
import { PhWhatsappLogo, PhArrowRight } from "@phosphor-icons/vue";

const girlBotImg = "https://api.dicebear.com/8.x/adventurer-neutral/svg?seed=TsunaLady&hair=longFrida,ponytail,longStraight&hairColor=ffd580,ffeec4,fff0a3&skinColor=light01";

const chatOpen = ref(false);
const messages = ref([
  {
    from: "ai",
    text: "مرحبا انا سما",
  },
]);
const userInput = ref("");
const isLoading = ref(false);

const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

async function sendMessage() {
  if (!userInput.value.trim() || isLoading.value) return;
  const question = userInput.value.trim();
  messages.value.push({ from: "user", text: question });
  userInput.value = "";
  isLoading.value = true;

  const sysPrompt = `
أنت سما، روبوت ذكاء اصطناعي عراقي خاص بشركة "سما السدرة"، وكيل حصري لأهم الشركات العالمية في مجال الطاقة الشمسية والطاقة المستدامة في العراق.
تقدم استشارات في: الطاقة الشمسية، البطاريات، ربط وصيانة المنظومات، خصوصاً لظروف العراق (حرارة مرتفعة وانقطاعات متكررة).
تكلم بلغة بسيطة أو لهجة عراقية، وادفع الزبون للتواصل مع قسم الصيانة أو الدعم عبر واتساب 009647749992888 بطريقة ذكية وغير مباشرة.
الشركات التي تمثلها:
Itel – Cos Power – SOFAR – Dyness – Risen Energy – Chint – Easun
لا تجب على أسئلة خارج هذا المجال.
`;

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: sysPrompt },
          ...messages.value
            .filter((msg) => msg.from === "user" || msg.from === "ai")
            .map((msg) => ({
              role: msg.from === "user" ? "user" : "assistant",
              content: msg.text,
            })),
          { role: "user", content: question },
        ],
        max_tokens: 800,
        temperature: 0.5,
      }),
    });
    const data = await res.json();
    const answer = data?.choices?.[0]?.message?.content?.trim() || "عذراً، صار خطأ، حاول مرة ثانية.";
    messages.value.push({ from: "ai", text: answer });
  } catch (e) {
    messages.value.push({ from: "ai", text: "صار خطأ بالإتصال، جرب بعدين." });
  } finally {
    isLoading.value = false;
    await nextTick();
    scrollToEnd();
  }
}

function scrollToEnd() {
  setTimeout(() => {
    const box = document.querySelector("#sama-chat-messages");
    if (box) box.scrollTop = box.scrollHeight;
  }, 100);
}

function openChat() {
  chatOpen.value = true;
  nextTick(() => scrollToEnd());
}
</script>

<template>
  <button
    class="sama-floating-btn"
    @click="openChat"
    v-show="!chatOpen"
    aria-label="دردش مع سما"
  >
    <img :src="girlBotImg" class="sama-float-avatar" alt="Sama Bot" />
  </button>

  <transition name="fadeUp">
    <div v-if="chatOpen" class="sama-chatbox-glass">
      <div class="sama-chatbox-header-glass">
        <img :src="girlBotImg" class="sama-header-avatar" alt="Sama Bot" />
        <span class="sama-header-title">Sama GPT</span>
        <button class="sama-close" @click="chatOpen = false">×</button>
      </div>
      <div id="sama-chat-messages" class="sama-chatbox-messages-glass">
        <div
          v-for="(msg, idx) in messages"
          :key="idx"
          :class="['sama-msg-row-glass', msg.from === 'ai' ? 'ai' : 'user']"
        >
          <img
            v-if="msg.from === 'ai'"
            :src="girlBotImg"
            class="sama-msg-avatar-glass"
            alt="Sama Bot"
          />
          <div :class="['sama-msg-bubble-glass', msg.from]">
            {{ msg.text }}
          </div>
        </div>
        <div v-if="isLoading" class="text-center py-1">
          <span class="spinner-border spinner-border-sm text-primary"></span>
        </div>
      </div>
      <form class="sama-chatbox-input-glass" @submit.prevent="sendMessage" autocomplete="off">
        <textarea
          v-model="userInput"
          class="sama-input-glass"
          :disabled="isLoading"
          placeholder="اكتب سؤالك لسما..."
          rows="1"
          @input="nextTick(() => scrollToEnd())"
        ></textarea>
        <button type="submit" class="sama-send-glass" :disabled="isLoading">
          <PhArrowRight size="20" />
        </button>
      </form>
      <div class="sama-chatbox-wa-glass">
        <a
          href="https://wa.me/009647749992888"
          class="sama-wa-btn-glass"
          target="_blank"
          rel="noopener"
        >
          <PhWhatsappLogo size="18" class="mb-1" /> تواصل واتساب مباشرة
        </a>
      </div>
    </div>
  </transition>
</template>
<style scoped>
:root {
  --sama-green: #9FD456;
  --sama-green-dark: #30584C;
  --sama-white: #ffffff;
  --bubble-ai-bg: #f1f2f4;
  --bubble-user-bg: #ffffff;
  --bubble-user-border: #cfcfcf;
  --chat-font: "system-ui", sans-serif;
}
@keyframes softPulse {
  0% {
    box-shadow: 0 0 0 0 rgba(159, 212, 86, 0.6);
  }
  70% {
    box-shadow: 0 0 0 12px rgba(159, 212, 86, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(159, 212, 86, 0);
  }
}

.sama-floating-btn {
  position: fixed;
  bottom: 24px;
  right: 24px;
  width: 64px;
  height: 64px;
  background-color: var(--sama-white);
  border: 3px solid var(--sama-green);
  border-radius: 50%;
  box-shadow: 0 4px 16px rgba(0,0,0,0.1);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  cursor: pointer;
  transition: all 0.3s ease;
  animation: softPulse 3s ease-in-out infinite;

}
.sama-float-avatar {
  width: 52px;
  height: 52px;
  border-radius: 50%;
}
.sama-chatbox-glass {
  position: fixed;
  bottom: 24px;
  right: 24px;
  width: 400px;
  max-width: 100vw;
  height: 80vh;
  background-color: #ffffffee;
  backdrop-filter: blur(12px);
  border: 1.2px solid #e1e1e1;
  border-radius: 18px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  z-index: 99999;
  box-shadow: 0 10px 60px rgba(0,0,0,0.12);
  animation: fadeInUp 0.5s ease;
  font-family: var(--chat-font);
}
.sama-chatbox-header-glass {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  background: linear-gradient(to right, #f6f6f6, #e9f2eb);
  border-bottom: 1px solid #dddddd;
}
.sama-header-avatar {
  width: 38px;
  height: 38px;
  border-radius: 50%;
}
.sama-header-title {
  flex-grow: 1;
  text-align: center;
  font-weight: bold;
  font-size: 1rem;
  color: #1d1d1d;
}
.sama-close {
  background: none;
  border: none;
  font-size: 22px;
  color: #999;
  cursor: pointer;
}
.sama-chatbox-messages-glass {
  flex: 1;
  overflow-y: auto;
  padding: 16px 12px;
}
.sama-msg-row-glass {
  display: flex;
  margin-bottom: 10px;
}
.sama-msg-row-glass.ai {
  flex-direction: row;
}
.sama-msg-row-glass.user {
  flex-direction: row-reverse;
}
.sama-msg-avatar-glass {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  margin-inline-end: 8px;
}
.sama-msg-bubble-glass {
  max-width: 75%;
  padding: 10px 14px;
  border-radius: 16px;
  font-size: 0.98rem;
  line-height: 1.4;
  white-space: pre-line;
  word-break: break-word;
}
.sama-msg-bubble-glass.ai {
  background-color: var(--bubble-ai-bg);
  color: #333;
}
.sama-msg-bubble-glass.user {
  background-color: var(--bubble-user-bg);
  color: #000;
  border: 1px solid var(--bubble-user-border);
}
.sama-chatbox-input-glass {
  display: flex;
  align-items: center;
  padding: 10px 12px;
  border-top: 1px solid #eee;
  gap: 8px;
}
.sama-input-glass {
  flex: 1;
  resize: none;
  border: 1px solid #ccc;
  border-radius: 16px;
  padding: 10px 14px;
  font-size: 1rem;
  font-family: inherit;
  min-height: 38px;
  max-height: 120px;
  overflow-y: auto;
}
.sama-send-glass {
  width: 42px;
  height: 42px;
  background-color: #fdd835; /* أصفر شمس */
  color: white;
  border: none;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: background-color 0.25s ease;
}

.sama-send-glass:hover {
  background-color: #25D366; /* أخضر واتساب */
}
.sama-chatbox-wa-glass {
  padding: 10px;
  text-align: center;
  background-color: #f9f9f9;
  border-top: 1px solid #e1e1e1;
}
.sama-wa-btn-glass {
  background-color: #25D366;
  color: white;
  font-weight: bold;
  padding: 8px 18px;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  text-decoration: none;
  font-size: 0.95rem;
}
.sama-wa-btn-glass:hover {
  background-color: #20ba59;
}
@keyframes fadeInUp {
  0% {
    opacity: 0;
    transform: translateY(25px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
@media (max-width: 600px) {
  .sama-chatbox-glass {
    width: 96vw;
    right: 8px;
    bottom: 8px;
    height: 85vh;
  }
  .sama-floating-btn {
    right: 12px;
    bottom: 12px;
  }
}
</style>
