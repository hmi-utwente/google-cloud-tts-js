
# Description
A simple demo that uses the [Google Cloud Text-To-Speech API](https://cloud.google.com/text-to-speech) in JavaScript.
[Try it out!](https://hmi-utwente.github.io/google-cloud-tts-js/)
(Tested in Firefox)

# Setup
1. [Create your personal Google Could API key](https://cloud.google.com/docs/authentication/api-keys). Make sure billing is enabled on your account (there should be a 12-month trial with some free credits if you sign up for the first time).
1. Optional: Add your API key to `js/api-key.js` to have it automatically filled in the input field. WARNING - Do not commit your API key in git! Make sure you tell git to ignore changes to this file: `git update-index --skip-worktree js/api-key.js`

# Using the demo
1. Clone this repo, open the `index.html` in a browser.
1. Enter the API key in the web page and press the "Submit" button.
1. Select the preferred language, gender and voice (WaveNet voices typically sound better than Standard voices).
1. Enter some text and press the "Speak" button.
1. You should now hear the spoken audio.

# Using this code in your project
We use the [REST API](https://cloud.google.com/text-to-speech/docs/reference/rest).
There are two asynchronous functions in `scripts/main.js` that actually make the REST calls:
1. `retrieveAvailableVoices()` -> This requests the available voices 
1. `retrieveSpeechAudio(textToSpeak)` -> This requests the synthesised audio for the given text and selected voice. Audio is returned as MP3 encoded as base64. There are also options for [setting the pitch and speed](https://cloud.google.com/text-to-speech/docs/reference/rest/v1/text/synthesize#AudioConfig). The API also supports [SSML](https://cloud.google.com/text-to-speech/docs/ssml) instead of basic text. 

You are free to use code from this demo in your project according to the MIT license.
