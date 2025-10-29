# 🎰 학업 운세 슬롯머신 (with Gemini AI)

대학생을 위한 재밌는 학업 운세 슬롯머신! Google Gemini AI가 매번 새롭고 창의적인 운세를 생성해줍니다.

## 🚀 설치 및 실행 방법

### 서버 실행

```bash
# 일반 실행
npm start

# 개발 모드 (자동 재시작)
npm run dev
```

### 4단계: 브라우저에서 열기

```
http://localhost:3000
```

## 📁 프로젝트 구조

```
slot-machine/
├── server.js          # Express 서버 + Gemini API
├── package.json       # 의존성 관리
├── .env              # API 키 (직접 생성 필요)
├── .env.example      # 환경 변수 예시
├── .gitignore        # Git 제외 파일
└── public/           # 정적 파일
    ├── index.html    # 메인 HTML
    ├── style.css     # 스타일
    └── script.js     # 프론트엔드 로직
```

## 🔑 Gemini API 키 발급 방법

1. [Google AI Studio](https://makersuite.google.com/app/apikey) 접속
2. "Get API Key" 클릭
3. 프로젝트 선택 또는 생성
4. API 키 복사 → `.env` 파일에 붙여넣기

## ✨ 주요 기능

- 🎲 3개 슬롯 랜덤 조합 (2,028가지)
- 🤖 Gemini AI 실시간 운세 생성
- 📱 모바일/태블릿 반응형 디자인
- 🎨 깔끔하고 세련된 UI

## 💡 사용 팁

- 매번 다른 해석이 나오니까 여러 번 돌려보세요!
- 서버가 꺼지면 작동 안 하니까 `npm start` 실행 상태 유지!

## 🛠 문제 해결

### "GEMINI_API_KEY is not defined"

→ `.env` 파일이 제대로 생성되었는지 확인

### "Cannot connect to server"

→ 서버가 실행 중인지 확인 (`npm start`)

### Port 3000이 이미 사용 중

→ `.env`에서 `PORT=3001`로 변경

## 📅 행사 정보

- 날짜: 2024년 11월 5일 점심시간
- 장소: 학생회관
- 주최: 교육위원회 학사수업개선 사업

---

🎉 행사 대박나세요! 궁금한 점 있으면 언제든 문의하세요.
