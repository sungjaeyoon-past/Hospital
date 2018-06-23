# TeamProject

본 프로젝트는 목적은 아래와 같은 특징을 지니는 병원 관리 시스템 웹사이트의 구현이다.<br/>

• 아두이노를 통하여 환자의 실시간 정보를 웹사이트에서 모니터링 할 수 있다.<br/>
• 의사 및 간호사는 환자의 기본정보를 열람 할 수 있다.<br/>
• 의사 및 간호사는 병실의 입원내역, 병실상태, 환자내원유무를 확인 할 수 있다.<br/>
• 의사 및 간호사는 근무일정, 수술일정등을 확인 할 수 있다.<br/>
• 환자 및 보호자는 웹사이트를 통해 진료예약이 가능하다.<br/>
• 환자 및 보호자는 의사 및 간호사를 웹사이트를 통해 호출 할 수 있다.<br/>
• 응급상황 발생 시 의사 및 간호사에게 알림을 보낼 수 있다.<br/>
• 본 웹사이트는 반응형 웹 디자인으로 모바일 기기에서도 이용할 수 있다.<br/>

<hr/>

시스템 구성
1. DB:Mysql
2. IOT:Arduino + EthernetShield + other sensor..
3. Server:NodeJS+Express

페이지 구성
1. 소개 페이지
2. 환자 관리(Arduino정보 확인) + 카드형식으로 환자 정보 분석
3. 일정 관리(Google Caleder API)
4. 예약 및 확인

페이지 외 기능 구성
1. 로그인
2. 개인정보 수정
3. 환자 알람(링거, 기저귀 교체 시기)
4. 보호자 알람(환자 위급시 카카오톡 전송)

이외의 해야할 것은 TODO참조

<hr/>
Quick start<br/>
Npm install 순서
1. npm install -g express-generator
2. npm install -g nodemon
3. npm install express-session
4. npm install 
5. npm install 

Can't not find 에러시 각 모듈마다 npm install (없는모듈)<br/>
Modul require시 npm install 순서 수정후 카카오톡 통지<br/>
<br/>
app.js 가 메인함수라고 보면 됩니다.<br/>
request가 들어오면 app.js부터  route 부분에 맞는 url을 캐치하려 
route폴더에 있는 ~~~.js로 해당 request를 넘깁니다.<br/> 
route에서는 해당 rq를 처리하고 views 폴더에 있는 pug 파일을 랜더링하도록 합니다.<br/>

구성:app.js -> /routes/~~~.js -> /views/~~~.pug
<hr/>

푸시 하기 전에 해야할 것
1. 카카오톡으로 알림
2. 허락 후에 페치 후 풀당기기
3. 컨플릭트가 없다면 푸쉬
4. 푸쉬 후에 카카오톡으로 알림
