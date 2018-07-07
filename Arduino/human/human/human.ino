int sensor = 7;
// 인체감지 센서가 연결된 7번을 sensor 라는 변수로 선언한다.

void setup() {
  pinMode(sensor, INPUT);
  // 신호를 아두이노로 전달하는 것이므로 입력 핀으로 설정한다.
  Serial.begin(9600);
  // 시리얼 통신을 9600 의 통신속도로 시작한다.
}

void loop() {
  if(digitalRead(sensor) == 1)
  // 센서의 값이 1이라면(동작이 감지되었다면)
  {
    Serial.println("Motion Detected");
    // 시리얼 모니터 상에 Motion Detected 라는 문장을 출력시킨다.
  }
    delay(500);
    // 0.5초마다
}
