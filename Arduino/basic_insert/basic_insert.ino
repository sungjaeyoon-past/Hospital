#include <Ethernet.h>
#include <MySQL_Connection.h>
#include <MySQL_Cursor.h>
#define Port 3308

byte mac_addr[] = { 0xDE, 0xAD, 0xBE, 0xEF, 0xFE, 0xED };

IPAddress server_addr(58,123,136,107);  // IP of the MySQL *server* here
char user[] = "arduino";              // MySQL user login username
char password[] = "mju12345";        // MySQL user login password

// Sample query
char INSERT_SQL[] = "INSERT INTO sample.sample () VALUES (2,'Hi Arduino');";

EthernetClient client;
MySQL_Connection conn((Client *)&client);

void setup() {
  Serial.begin(115200);
  while (!Serial); // wait for serial port to connect
  Ethernet.begin(mac_addr);
  Serial.println("Connecting...");
  if (conn.connect(server_addr, Port, user, password)) {
    delay(1000);
  }
  else
    Serial.println("Connection failed.");
}


void loop() {
  delay(20000);

  Serial.println("Recording data.");

  // Initiate the query class instance
  MySQL_Cursor *cur_mem = new MySQL_Cursor(&conn);
  // Execute the query
  cur_mem->execute(INSERT_SQL);
  // Note: since there are no results, we do not need to read any data
  // Deleting the cursor also frees up memory used
  delete cur_mem;
}
