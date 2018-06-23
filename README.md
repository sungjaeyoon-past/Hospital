# TeamProject

npm install -g express-generator
npm install -g nodemon
npm install 

Can't not find 에러시 각 모듈마다 npm install (없는모듈)

app.js 가 메인함수라고 보면 됩니다.
request가 들어오면 app.js부터  route 부분에 맞는 url을 캐치하려 
route폴더에 있는 ~~~.js로 해당 request를 넘깁니다. 
route에서는 해당 rq를 처리하고 views 폴더에 있는 pug 파일을 랜더링하도록 합니다.

app.js -> /routes/~~~.js -> /views/~~~.pug

