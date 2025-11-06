# SimpleWebServer

최소한의 웹서버 - 기본 사용자 인증 기능 (회원가입/로그인/로그아웃)을 갖춘 로컬 실행 가능한 웹 애플리케이션

## 📋 프로젝트 개요

SimpleWebServer는 사용자 인증 기능을 갖춘 최소한의 웹서버 구현입니다. 이메일과 비밀번호를 사용한 회원가입/로그인 시스템을 제공하며, 향후 기능 확장이 용이한 모듈형 아키텍처로 설계되었습니다.

## ✨ 주요 기능

- ✅ 이메일/비밀번호 기반 회원가입
- ✅ 이메일/비밀번호 로그인
- ✅ 로그아웃 기능
- ✅ 세션 기반 인증
- ✅ bcrypt를 사용한 안전한 비밀번호 해싱
- ✅ 입력 검증 (이메일 형식, 비밀번호 최소 8자)
- ✅ Rate Limiting (브루트포스 공격 방지)
- ✅ 보호된 대시보드 페이지
- ✅ HTTP-only 쿠키를 사용한 세션 보안

## 🛠 기술 스택

- **런타임**: Node.js
- **웹 프레임워크**: Express.js
- **템플릿 엔진**: EJS
- **데이터베이스**: SQLite (better-sqlite3)
- **세션 관리**: express-session
- **비밀번호 해싱**: bcrypt
- **입력 검증**: express-validator
- **Rate Limiting**: express-rate-limit

## 📁 프로젝트 구조

```
SimpleWebServer/
├── src/
│   ├── app.js                  # Express 애플리케이션 진입점
│   ├── db/
│   │   └── database.js         # SQLite 데이터베이스 초기화
│   ├── middleware/
│   │   ├── auth.js             # 인증 미들웨어
│   │   ├── validation.js       # 입력 검증 미들웨어
│   │   └── rateLimiter.js      # Rate limiting 미들웨어
│   ├── routes/
│   │   ├── index.js            # 메인/대시보드 라우트
│   │   └── auth.js             # 인증 라우트 (signup/login/logout)
│   ├── services/
│   │   └── userService.js      # 사용자 관리 서비스
│   └── views/
│       ├── index.ejs           # 랜딩 페이지
│       ├── login.ejs           # 로그인 페이지
│       ├── signup.ejs          # 회원가입 페이지
│       └── main.ejs            # 대시보드 페이지
├── public/
│   └── css/
│       └── style.css           # 스타일시트
├── data/
│   └── database.sqlite         # SQLite 데이터베이스 (자동 생성)
├── .env                        # 환경 변수
├── .env.example                # 환경 변수 템플릿
├── .gitignore                  # Git 제외 파일
├── package.json                # 프로젝트 의존성
└── README.md                   # 프로젝트 문서
```

## 🚀 빠른 시작

### 필수 요구사항

- Node.js (LTS 버전 권장)
- npm

### 설치 및 실행

1. **의존성 설치**
   ```bash
   npm install
   ```

2. **환경 변수 설정** (선택사항)
   ```bash
   # .env 파일이 이미 포함되어 있습니다
   # 필요시 .env 파일을 수정하여 포트나 시크릿 키를 변경할 수 있습니다
   ```

3. **서버 실행**
   ```bash
   npm run dev
   ```

4. **브라우저에서 접속**
   ```
   http://localhost:3000
   ```

## 📝 사용 방법

### 1. 회원가입
- 홈페이지에서 "회원가입" 클릭
- 이메일과 비밀번호(최소 8자) 입력
- 회원가입 완료 후 자동으로 로그인되어 대시보드로 이동

### 2. 로그인
- 홈페이지에서 "로그인" 클릭
- 등록된 이메일과 비밀번호 입력
- 로그인 성공 시 대시보드로 이동

### 3. 대시보드
- 인증된 사용자만 접근 가능
- 환영 메시지와 위젯 표시
- 향후 기능 확장 가능한 구조

### 4. 로그아웃
- 대시보드에서 "로그아웃" 버튼 클릭
- 세션이 종료되고 홈페이지로 이동

## 🔒 보안 기능

- **비밀번호 해싱**: bcrypt를 사용한 단방향 해싱 (Salt Rounds: 10)
- **세션 보안**: HTTP-only 쿠키로 XSS 공격 방지
- **Rate Limiting**:
  - 로그인: IP당 분당 5회
  - 회원가입: IP당 15분당 3회
- **입력 검증**: 이메일 형식 및 비밀번호 길이 검증
- **일반화된 오류 메시지**: 보안을 위해 구체적인 오류 정보 숨김

## 🗄️ 데이터베이스 스키마

### users 테이블
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## 🌐 API 엔드포인트

### 공개 라우트
- `GET /` - 랜딩 페이지
- `GET /login` - 로그인 페이지
- `POST /login` - 로그인 처리
- `GET /signup` - 회원가입 페이지
- `POST /signup` - 회원가입 처리

### 보호된 라우트 (인증 필요)
- `GET /main` - 대시보드
- `POST /logout` - 로그아웃

## 🔧 환경 변수

`.env` 파일에서 다음 변수를 설정할 수 있습니다:

```env
PORT=3000                              # 서버 포트
NODE_ENV=development                   # 실행 환경
SESSION_SECRET=your-secret-key         # 세션 시크릿 키
DB_PATH=./data/database.sqlite         # 데이터베이스 경로
```

## 🎯 향후 확장 가능한 기능

- 이메일 인증
- 비밀번호 재설정
- 소셜 로그인 (OAuth)
- 역할 기반 접근 제어 (RBAC)
- 사용자 프로필 관리
- 대시보드 위젯 추가
- 알림 시스템
- 감사 로그

## 🧪 테스트

```bash
npm test
```

현재는 기본 테스트 스크립트가 설정되어 있지 않습니다. 향후 Jest나 Mocha를 사용한 테스트를 추가할 수 있습니다.

## 📄 라이선스

MIT License

## 👤 개발자

SimpleWebServer 프로젝트

## 🙏 기여

이 프로젝트는 학습 및 데모 목적으로 제작되었습니다. 개선 사항이나 버그 리포트는 환영합니다!

---

**참고**: 이 프로젝트는 로컬 개발 환경에서 사용하도록 설계되었습니다. 프로덕션 환경에서 사용하려면 추가적인 보안 조치가 필요합니다.
