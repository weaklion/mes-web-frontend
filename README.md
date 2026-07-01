# MES IoT Frontend

Vue 3, TypeScript, Tailwind CSS 기반 MES/IoT 모니터링 프론트엔드입니다.

백엔드의 REST API와 SSE(Server-Sent Events)를 사용해 생산계획, 기준정보, 검사 결과 요약을 조회하고, Line Simulator UI로 가상 설비 동작을 실행합니다.

## 역할

프론트는 MQTT Broker에 직접 접속하지 않습니다.

```text
Vue Dashboard
-> Spring REST API 호출
-> Spring MQTT publish
-> Mosquitto
-> Spring MQTT subscriber
-> DB 저장
-> SSE
-> Vue Dashboard 갱신
```

프론트는 다음 역할만 담당합니다.

- 모니터링 요약 표시
- Line Simulator 애니메이션 표시 (공장이라고 가정한 가상 simulator)
- Start / Stop으로 반복 검사 트리거
- SSE 수신 후 OK/FAIL 수량과 성공률 갱신
- 기준정보와 생산계획 조회

## 기술 스택

- Vue 3
- TypeScript
- Vite
- axios
- Tailwind CSS
- EventSource(SSE)

## 실행 방법

```bash
npm install
npm run dev
```

기본 주소:

```text
http://localhost:5173
```

## 백엔드 연결

API base URL:

```text
http://localhost:8080/api
```

관련 파일:

```text
src/lib/api.ts
```

SSE endpoint:

```text
GET http://localhost:8080/api/monitoring/{schIdx}/events
```

수신 이벤트:

```text
connected
monitoring-summary
```

## 주요 화면

### Monitoring

- 생산계획별 모니터링 요약 조회
- 설비 시뮬레이터 실행
- OK/FAIL 수량 표시
- 성공률 표시
- SSE 연결 상태 표시

### Master Data

- 기준정보 조회
- 생산계획 조회

## Start / Stop 동작

### Start

`Start` 버튼을 누르면 Line Simulator가 반복 실행됩니다.

```text
Start 클릭
-> /api/monitoring/{schIdx}/start
-> loadTime 동안 moving
-> /api/simulator/inspection-results/mqtt
-> 백엔드가 MQTT publish
-> 백엔드가 MQTT subscribe로 재수신
-> DB 저장
-> SSE로 summary 수신
-> 화면 갱신
-> 다음 cycle 반복
```

## 중요 구현 포인트

프론트는 검사 결과 수량을 직접 증가시키지 않습니다.

OK/FAIL 카운트와 성공률은 백엔드가 SSE로 보내는 `monitoring-summary` 이벤트를 기준으로 갱신됩니다.

```ts
eventSource.addEventListener("monitoring-summary", (event) => {
  summary.value = JSON.parse(event.data) as MonitoringSummary;
});
```

시뮬레이터 검사는 다음 API를 호출합니다.

```http
POST /api/simulator/inspection-results/mqtt
```

요청 예:

```json
{
  "scheduleId": 1,
  "clientId": "IOT01",
  "result": "OK"
}
```

## 빌드 확인

```bash
npm run build
```

## 관련 백엔드 프로젝트

```text
C:\Users\weakl\git\mes-web-backend\mes-web-backend
```
