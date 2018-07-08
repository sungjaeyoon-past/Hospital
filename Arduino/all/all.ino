#include <Ethernet.h>
#include <MySQL_Connection.h>
#include <MySQL_Cursor.h>
#define Port 3308
#define ledPin 10
#define buttonPin 4
byte mac_addr[] = { 0xDE, 0xAD, 0xBE, 0xEF, 0xFE, 0xED };
IPAddress server_addr(58,123,136,107);  // IP of the MySQL *server* here
char user[] = "arduino";              // MySQL user login username
char password[] = "mju12345";        // MySQL user login password
char UPDATE_SQL[] = "update medic.bed set is_empty=0,is_wet=0,weight_sensor=0 where bed_id=2;";
EthernetClient client;
MySQL_Connection conn((Client *)&client);
#include "HX711.h"

#define calibration_factor -7050.0 //This value is obtained using the SparkFun_HX711_Calibration sketch

#define DOUT  3
#define CLK  2

HX711 scale(DOUT, CLK);
int sensor = 7;
const int led = 6; //led attached to this pin
const int button = 5; //push button attached to this pin
 int ledState = LOW;
int buttonState = HIGH; //this variable tracks the st
void setup() {
  Serial.begin(9600);while (!Serial); // wait for serial port to connect
    Ethernet.begin(mac_addr);
    Serial.println("Connecting...");
    if (conn.connect(server_addr, Port, user, password)) {
      delay(1000);
      Serial.println("Connection Successed.");
    }
    else
      Serial.println("Connection failed."); 
 pinMode(led, OUTPUT);
  pinMode(button, INPUT);
  pinMode(sensor, INPUT);
  scale.set_scale(calibration_factor); //This value is obtained by using the SparkFun_HX711_Calibration sketch
  scale.tare(); //Assuming there is no weight on the scale at start up, reset the scale to 0

}
 
int temp =0;
float weight = 0;float weight2 = 0;
void loop() {

  buttonState = digitalRead(button);    //버튼 상태를 읽어들임
  ledState = digitalRead(led);
 //무게센서
/*  Serial.print(scale.get_units()); //scale.get_units() returns a float
         
          
    weight = (scale.get_units());
    
    weight2 = (scale.get_units());
         Serial.println(weight);
         delay(500);
         Serial.println();
          Serial.println(weight2);
          
         Serial.println();
        
    if(weight == weight2 && temp == 1){
     Serial.print("++++++++++++++++++++++SEND WET DATA");
        char UPDATE_SQL[] = "update medic.bed set is_empty=0,is_wet=0,weight_sensor=1 where bed_id=2;";
         MySQL_Cursor *cur_mem = new MySQL_Cursor(&conn);
        cur_mem->execute(UPDATE_SQL);
        delete cur_mem;
        delay(50000);
   }
   */
   //인체감지센서
   if(digitalRead(sensor) == 0&& temp == 1)
  // 센서의 값이 0이라면(동작이 감지되지 않는 다면)
  {
    Serial.println("Motion not Detected");
    // 시리얼 모니터 상에 Motion Detected 라는 문장을 출력시킨다.
     Serial.print("++++++++++++++++++++++SEND ISEMPTY DATA");
        char UPDATE_SQL[] = "update medic.bed set is_empty=0,is_wet=0,is_empty=1 where bed_id=2;";
         MySQL_Cursor *cur_mem = new MySQL_Cursor(&conn);
        cur_mem->execute(UPDATE_SQL);
        delete cur_mem;
        delay(50000);
  }
          /*
  if(ledState==HIGH){ 
       
    }*/
  if(buttonState == HIGH)        //버튼 상태가 로우(0V)일때 실행
  { 
    switch (temp) {
      case 0:
        digitalWrite(led, HIGH);  temp=1;Serial.println("temp");
        break;
      case 1:
       digitalWrite(led, LOW);  temp=0;Serial.println("buttonLow");
        break;
    } 
  } 
}
