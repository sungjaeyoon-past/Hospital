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

void setup() {
    pinMode(ledPin , OUTPUT);
    pinMode(buttonPin , INPUT);
    Serial.begin(115200);
    while (!Serial); // wait for serial port to connect
    Ethernet.begin(mac_addr);
    Serial.println("Connecting...");
    if (conn.connect(server_addr, Port, user, password)) {
      delay(1000);
      Serial.println("Connection Successed.");
    }
    else
      Serial.println("Connection failed.");
}

void loop(){
    int nBtn4 = digitalRead(buttonPin );
    if (nBtn4 == LOW) {
      digitalWrite(ledPin,LOW);
    } else {
        digitalWrite(ledPin, HIGH);
        MySQL_Cursor *cur_mem = new MySQL_Cursor(&conn);
        cur_mem->execute(UPDATE_SQL);
        delete cur_mem;
    }
}

