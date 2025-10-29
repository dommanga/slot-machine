import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash-exp",
  generationConfig: {
    temperature: 1.2, // 더 창의적인 응답을 위해 높게 설정
    maxOutputTokens: 300,
  },
});

app.use(cors());
app.use(express.json());
app.use(express.static("public")); // 정적 파일 제공

// 운세 해석 엔드포인트
app.post("/api/fortune", async (req, res) => {
  try {
    const { slot1, slot2, slot3 } = req.body;

    if (!slot1 || !slot2 || !slot3) {
      return res.status(400).json({
        error: "모든 슬롯 값이 필요합니다",
      });
    }

    console.log(`🎰 운세 요청: ${slot1} × ${slot2} × ${slot3}`);

    const prompt = `당신은 대학생들을 위한 재치있고 유머러스한 학업 운세 해석가입니다.

학생이 뽑은 슬롯 결과:
- 카테고리: ${slot1}
- 상태: ${slot2}  
- 결과: ${slot3}

위 3가지 조합을 바탕으로 대학생의 학업 운세를 재밌고 공감가게 해석해주세요.

해석 가이드라인:
- 뽑힌 조합에 최대한 부합하는 창의적인 운세 풀이
- 대학생들이 공감할 수 있는 현실적이고 유머러스한 내용
- 2-3문장으로 간결하게
- 이모지 적절히 활용
- 긍정적이면서도 현실적인 톤
- 반말 사용, 조금 재밌게 킹받아도 됨 (친근한 톤)

예시 스타일:
"팀플이 카오스가 될 예정?!?! 🌪️ 하지만 다르게 생각해보면, 각자의 다양성이 도움이 될지도~🌈"

JSON 형식으로만 답변해줘:
{
  "fortune": "운세 해석 내용"
}`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    // Remove markdown code blocks if present
    const cleanText = text
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();

    const parsed = JSON.parse(cleanText);

    if (!parsed.fortune) {
      throw new Error("Invalid response structure");
    }

    console.log(`✅ 운세 생성 완료: ${parsed.fortune.substring(0, 50)}...`);

    res.json(parsed);
  } catch (error) {
    console.error("❌ Gemini API Error:", error.message);

    // Fallback 응답
    res.status(500).json({
      fortune: `${req.body.slot1}의 ${req.body.slot2} 기운이 느껴져! 예상치 못한 ${req.body.slot3}의 결과가 올 거야. 준비만 잘하면 문제없어! 💪`,
      error: true,
    });
  }
});

// Health check
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    message: "슬롯머신 서버 가동중 🎰",
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🎰 슬롯머신 API 서버 실행: http://localhost:${PORT}`);
  console.log(
    `✅ Gemini API Key: ${process.env.GEMINI_API_KEY ? "설정됨" : "⚠️  없음!"}`
  );
});
