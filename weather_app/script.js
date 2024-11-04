const days=[
    "Sunday",
    "Monday",
    "Tuesday",
    "Thursday",
    "Friday",
    "Saturday"
];

// display day
const dayEl = document.querySelector(".default_day");
const day = new Date()
const dayName = days[day.getDay()];
dayEl.textContent = dayName

// display date
const dateEl = document.querySelector(".default_date");
let month = day.toLocaleString("default",{month:"long"});
let date = day.getDate();
let year= day.getFullYear();
dateEl.textContent= `${date} ${month} ${year}`

// add event
const btnEl= document.querySelector(".btn_search");
const inputEl= document.querySelector(".input_field");


btnEl.addEventListener("click",(event)=>{
    event.preventDefault();

    if(inputEl.value !==""){
        const search =inputEl.value
        inputEl.value="";

        Place(search);

    }
});

// ***API***
const apiKey="9f5818d1b8766c339789d03bee2b195f";
const iconsContainer = document.querySelector('.icons');
const dayinfo= document.querySelector('.day_info')
iconsContainer.innerHTML=""

async function Place(name){
    iconsContainer.innerHTML=""
    dayinfo.innerHTML=""
    const apiUrl=`https://api.openweathermap.org/data/2.5/weather?q=${name}&appid=${apiKey}`;
    const data = await fetch(apiUrl)
    const result= await data.json();
    console.log(result);

    if(result.cod !== "404"){

        // dislay left side content
        const leftCont = leftSideContent(result);
        setTimeout(()=>{
            iconsContainer.insertAdjacentHTML('afterbegin',leftCont);
            iconsContainer.classList.add("fadeIn");
        },1100);


        //  dislay left side content
        const rightCont = rightSideContent(result);
        setTimeout(()=>{
            dayinfo.insertAdjacentHTML('afterbegin',rightCont);
                 
        },1100);


        // display forecast
        foreCast(result.coord.lat,result.coord.lon)

    }else{
        const error=`<h2 class="weather_temp">${result.cod}</h2>
        <h3 class="cloudtxt">${result.message}</h3>`;

        iconsContainer.insertAdjacentHTML('afterbegin',error);
    }

}
// function of  left side content
function leftSideContent(data){
    return `<img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="">
    <h2 class="weather_temp">${Math.round(data.main.temp-275.15)}°C</h2>
    <h3 class="cloudtxt">${data.weather[0].description}</h3>`
}
// function of right side content
function  rightSideContent(data){
    return `<div class="content">
            <p class="title">NAME</p>
            <span class="value">${data.name}</span>
        </div>
        <div class="content">
            <p class="title">TEMP</p>
            <span class="value">${Math.round(data.main.temp-275.15)}°C</span>
        </div>
        <div class="content">
            <p class="title">HUMIDITY</p>
            <span class="value">${data.main.humidity}%</span>
        </div>
        <div class="content">
            <p class="title">WIND SPEED</p>
            <span class="value">${data.wind.speed} km/h</span>
        </div>`
}
const listcontent = document.querySelector('.list_content ul')

async function foreCast(lat,lon){
    listcontent.innerHTML="";
    const weekApi=`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`
    const data =await fetch(weekApi);
    const result =await data.json();

    const days =[];
    const weekDays=result.list.filter((D)=>{
    const daysDate= new Date(D.dt_txt).getDate();
        if(!days.includes(daysDate)){
            return days.push(daysDate)
        }
    
    });
    console.log(weekDays);

    weekDays.forEach((content,index) => {
    
        if (index<=6){
          listcontent.insertAdjacentHTML('afterbegin',dayList(content));
        }
    });

}
// display week days
function dayList(data) {
    const day=new Date(data.dt_txt);
    const dayName= days[day.getDay()];
    const splitday=dayName.split("",3)
    const joinday=splitday.join("")
    console.log(joinday);
    
    return `
    <li>
        <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png">
        <span>${joinday}</span>
        <span class="day_temp">${Math.round(data.main.temp-275.15)}°C</span>
    </li>`
}