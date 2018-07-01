#include <Ethernet.h>
#include <MySQL_Connection.h>
#include <MySQL_Cursor.h>
#include<DHT.h>     //DHT.h 라이브러리 추가
#define Port 3308

DHT dht(8, DHT11); //DHT 설정 dht(핀, DHT종류)
byte mac_addr[] = { 0xDE, 0xAD, 0xBE, 0xEF, 0xFE, 0xED };
IPAddress server_addr(58,123,136,107);  // IP of the MySQL *server* here
char user[] = "arduino";              // MySQL user login username
char password[] = "mju12345";        // MySQL user login password
char sql[72];

EthernetClient client;
MySQL_Connection conn((Client *)&client);

void setup() {

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
    int tem = dht.readTemperature();
    int hum = dht.readHumidity();
    Serial.println(tem);
    Serial.println(hum);
    String iStrTem(tem);
    String iStrHum(hum);
    String update_sql="update medic.hospital_room set temperature="+iStrTem+",humidity="+iStrHum+" where room_no=1;";
    Serial.println(update_sql);
    Serial.println(update_sql.length());
    update_sql.toCharArray(sql,update_sql.length());
    MySQL_Cursor *cur_mem = new MySQL_Cursor(&conn);
    cur_mem->execute(sql);
    delete cur_mem;
    delay(50000);

}