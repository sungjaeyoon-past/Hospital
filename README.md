# TeamProject

Npm install 순서
1. npm install -g express-generator
2. npm install -g nodemon
3. npm install 
4. npm install express-session

Can't not find 에러시 각 모듈마다 npm install (없는모듈)<br/>
Modul require시 npm install 순서 수정후 카카오톡 통지
<hr/>
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
