
//initialize and declare variables
const int led = 6; //led attached to this pin
const int button = 5; //push button attached to this pin
 
int buttonState = HIGH; //this variable tracks the state of the button, low if not pressed, high if pressed
int ledState = -1; //this variable tracks the state of the LED, negative if off, positive if on
 
long lastDebounceTime = 0;  // the last time the output pin was toggled
long debounceDelay = 5000;    // the debounce time; increase if the output flickers
 
 
void setup() {
 
  //set the mode of the pins...
  pinMode(led, OUTPUT);
  pinMode(button, INPUT);
 
  Serial.begin(9600);
  Serial.println("HX711 scale demo");

}//close void setup
  
int temp =0;
void loop() {
  buttonState = digitalRead(button);    //버튼 상태를 읽어들임
   
  if(buttonState == HIGH)        //버튼 상태가 로우(0V)일때 실행
  { 
    switch (temp) {
      case 0:
        digitalWrite(led, HIGH);  Serial.println("temp");Serial.println(temp);temp=1;
        break;
      case 1:
       digitalWrite(led, LOW);  Serial.println("buttonLow");Serial.println("temp");Serial.println(temp);temp=0;
        break;
    } 
  }
  delay(500);
  
}
