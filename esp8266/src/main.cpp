#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClientSecure.h>
#include <DHT.h>

#define DHTPIN D2
#define DHTTYPE DHT11



DHT dht(DHTPIN, DHTTYPE);

// 1. 와이파이 설정
const char* ssid = "ksj";
const char* password = "12345678";

// 2. dothome 서버의 upload.php (https)
const char* serverUrl = "https://kbu1.dothome.co.kr/upload.php";

// 3. 대시보드 '장치 관리'에 등록된 장치 ID와 반드시 똑같아야 함
const char* DEVICE_ID = "D1-005";

void setup() {
  Serial.begin(115200);
  dht.begin();

  WiFi.begin(ssid, password);
  Serial.print("Wi-Fi 연결 중");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWi-Fi 연결 성공!");
}

void loop() {
  if (WiFi.status() == WL_CONNECTED) {
    float temp = dht.readTemperature();
    float hum = dht.readHumidity();

    // 센서 읽기 실패 시 재시도
    if (isnan(temp) || isnan(hum)) {
      Serial.println("DHT 센서 읽기 실패!");
      delay(2000);
      return;
    }

    Serial.print("온도: ");
    Serial.print(temp);
    Serial.print(" °C | 습도: ");
    Serial.print(hum);
    Serial.println(" %");

    // https 접속 (인증서 검증 생략: 학습/데모용)
    WiFiClientSecure client;
    client.setInsecure();

    HTTPClient http;
    http.begin(client, serverUrl);
    http.setFollowRedirects(HTTPC_STRICT_FOLLOW_REDIRECTS);
    http.addHeader("Content-Type", "application/json");

    // upload.php가 읽는 JSON 형식: id, temperature, humidity
    String body = "{\"id\":\"" + String(DEVICE_ID) + "\"," +
                  "\"temperature\":" + String(temp, 1) + "," +
                  "\"humidity\":" + String(hum, 1) + "," +
                  "\"airQuality\":0}"; // 공기질 센서 없음 -> 숫자 0 (서버 컬럼이 숫자형)

    int httpResponseCode = http.POST(body);

    Serial.print("HTTP Response code: ");
    Serial.println(httpResponseCode);
    if (httpResponseCode > 0) {
      Serial.println(http.getString());
    }

    http.end();
  }

  delay(3000); // 3초마다 전송
}