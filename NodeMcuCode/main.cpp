//Smart Flood Detection System
//MCA 4th semester

//Testing how to read sensor data and perform action on given condition

#define echo 2
#define trig 3

float  distance; //oneway distance travelled by the pulse
float  duration; //time taken by the pulse to return back

void setup() {  
    pinMode(trig, OUTPUT);
    pinMode(echo, INPUT);
    Serial.begin(9600);
}
  
void loop() {
    time_Measurement();
    //calculate the oneway distance travelled by the pulse
    distance = duration * (0.0343) / 2;    
    display_distance();
}
  
//function to measure the time taken by the pulse to return back
void time_Measurement() { 
    digitalWrite(trig, LOW);
    delayMicroseconds(2);
    digitalWrite(trig, HIGH);
    delayMicroseconds(10);
    digitalWrite(trig, LOW);
    duration = pulseIn(echo, HIGH);
}

//function to display the distance on LCD/Serial Monitor
void display_distance() {
  	if(distance < 100)
    	Serial.println("Flood");  
    Serial.println(distance);
}