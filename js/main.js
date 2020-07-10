//MIT License
//
//Copyright (c) 2020 Daniel Davison - HMI - University of Twente
//
//Permission is hereby granted, free of charge, to any person obtaining a copy
//of this software and associated documentation files (the "Software"), to deal
//in the Software without restriction, including without limitation the rights
//to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
//copies of the Software, and to permit persons to whom the Software is
//furnished to do so, subject to the following conditions:
//
//The above copyright notice and this permission notice shall be included in all
//copies or substantial portions of the Software.
//
//THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
//IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
//FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
//AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
//LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
//OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
//SOFTWARE.

//Inspired by code snippets found here: https://stackoverflow.com/questions/50773528/google-cloud-text-to-speech-the-server-responded-with-a-status-of-403

//holds the list of all voices after they are retrieved from the Google API
var voices = [];

var apiKeyInput = document.getElementById("api-key");
apiKeyInput.value = defaultApiKey; //set it to the default value defined in api-key.js

var languageSelect = document.getElementById("languages");
var gendersSelect = document.getElementById("genders");
var voicesSelect = document.getElementById("voices");
var textToSpeak = document.getElementById("text-to-speak");

//returns the api key that was entered, or shows an alert when the input is empty
function getApiKey(){
    let apiKey = apiKeyInput.value;
    if(apiKey === ""){
        alert("Please enter an API key!");
        return false;
    }
    return apiKey;
}

//retrieves the available voices from the Google cloud TTS and populates the various dropdown selection boxes
function init(){
    if(!getApiKey()) return;
    retrieveAvailableVoices().then(data => {
        //store globally for later use in the other functions
        voices = data.voices;

        populateLanguages();
        populateGenders();
        populateVoices();
    });
}

async function retrieveAvailableVoices(){
    const response = await fetch('https://texttospeech.googleapis.com/v1/voices', {
        headers: {
            'Content-Type': 'application/json',
            "x-goog-api-key": getApiKey()
            // 'Content-Type': 'application/x-www-form-urlencoded',
          }
    });
    return response.json();
}

function populateLanguages(){
    //remove all current languages from the select
    while(languageSelect.options.length > 0){
        languageSelect.remove(0);
    }

    //make a list of the unique language codes
    let uniqueLanguageCodes = [];
    for(let voice of voices){
        for(let languageCode of voice.languageCodes){
            if(!uniqueLanguageCodes.includes(languageCode)){
                uniqueLanguageCodes.push(languageCode);
            }
        }
    }

    //populate with language codes
    uniqueLanguageCodes.sort();
    for(let languageCode of uniqueLanguageCodes){
        let languageOption = document.createElement("option");
        languageOption.text = languageCode;
        languageOption.value = languageCode;
        languageSelect.add(languageOption);
        
        //make english the default
        if(languageCode === "en-GB"){
            languageSelect.value = languageCode;
        }
    }
}

function populateGenders(){
    //remove all current genders from the select
    while(gendersSelect.options.length > 0){
        gendersSelect.remove(0);
    }

    //make a list of all unique genders for the selected language
    let uniqueGenders = [];
    let selectedLanguageCode = languageSelect.options[languageSelect.selectedIndex].value;
    for(let voice of voices){
        if(voice.languageCodes.includes(selectedLanguageCode) && !uniqueGenders.includes(voice.ssmlGender)){
            uniqueGenders.push(voice.ssmlGender);
        }
    }

    //populate with the available genders
    for(let gender of uniqueGenders){
        let genderOption = document.createElement("option");
        genderOption.value = gender;
        genderOption.text = gender;
        gendersSelect.add(genderOption);
    }
}

function populateVoices(){
    //remove all current voices from the select
    while(voicesSelect.options.length > 0){
        voicesSelect.remove(0);
    }

    //filter the voices that belong to the selected language and gender and add them to the select
    let selectedLanguageCode = languageSelect.options[languageSelect.selectedIndex].value;
    let selectedGender = gendersSelect.options[gendersSelect.selectedIndex].value;
    for(let voice of voices){
        if(voice.languageCodes.includes(selectedLanguageCode) && voice.ssmlGender === selectedGender){
            let voiceOption = document.createElement("option");
            voiceOption.value = voice.name;
            voiceOption.text = voice.name;
            voicesSelect.add(voiceOption);
        }
    }
}

//do a call to the Google cloud synthesise API and play the retrieved audio clip
function speak(){
    if(!getApiKey()) return;
    retrieveSpeechAudio(textToSpeak.value).then(data => {
        let sound = new Audio("data:audio/wav;base64,"+data.audioContent);
        sound.play();
    });
}

//retrieves the actual audio clip for the given text, using the configured laguage, gender and voice
//the returned audio is base64 encoded WAV format
async function retrieveSpeechAudio(textToSpeak){
    let selectedLanguageCode = languageSelect.options[languageSelect.selectedIndex].value;
    let selectedGender = gendersSelect.options[gendersSelect.selectedIndex].value;
    let selectedVoice = voicesSelect.options[voicesSelect.selectedIndex].value;

    let requestPayload = {
            input:{
              text:textToSpeak
            },
            voice:{
              languageCode:selectedLanguageCode,
              name:selectedVoice,
              ssmlGender:selectedGender
            },
            audioConfig:{
              audioEncoding:"MP3"
            }
    };

    const response = await fetch('https://texttospeech.googleapis.com/v1/text:synthesize', {
        method: "POST",
        cache: "no-cache",
        headers: {
            'Content-Type': 'application/json',
            "x-goog-api-key": getApiKey()
          },
        body: JSON.stringify(requestPayload)
    });

    return response.json();
}

