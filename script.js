async function getFromAPI(){
    const response= await fetch("https://api.openweathermap.org/data/2.5/weather?lat=33.9911&lon=-6.8401&units=metric&appid=1825054a3f2ae5db2186b167318fb06c");
    const weatherObj= await response.json();
    return weatherObj;
}
async function cleanData(){
    const apiData= await getFromAPI();
    /**
     * main temp
     * clouds description
     * high/low
     * Humidity
     * pressure
     * visibility
     * wind
     */
    let cleanWObj={main:{},cloud:{}};
    //main
    cleanWObj.main.temp=apiData.main.temp;
    cleanWObj.main.feels_like=apiData.main.feels_like;
    cleanWObj.main.temp_max=apiData.main.temp_max;
    cleanWObj.main.temp_min=apiData.main.temp_min;
    //cloud desc
    cleanWObj.cloud.desc=apiData.weather[0].description;
    cleanWObj.cloud.icon=apiData.weather[0].icon;
    //humidity pressure
    cleanWObj.humidity=apiData.main.humidity;
    cleanWObj.pressure=apiData.main.pressure;
    //visibility wind speed
    cleanWObj.visibility=apiData.visibility*0.001;
    cleanWObj.wind=apiData.wind.speed*(18/5);
    console.log(cleanWObj);
}
cleanData();