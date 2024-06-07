import React, { useState, useEffect } from 'react';
import axios from 'axios';

export const Voice = () => {
  const [inputText, setInputText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [sourceLang, setSourceLang] = useState('en');
  const [targetLang, setTargetLang] = useState('es');
  const [listening, setListening] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const [languages, setLanguages] = useState([]);

  useEffect(() => {
    // Fetch available languages
    const fetchLanguages = async () => {
      try {
        const response = await axios.get('https://libretranslate.com/languages');
       
        setLanguages(response.data);
      } catch (error) {
        console.error('Error fetching languages:', error);
      }
    };

    fetchLanguages();
  }, []);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      const speechRecognition = new window.webkitSpeechRecognition();
      speechRecognition.continuous = true;
      speechRecognition.interimResults = false;
      speechRecognition.lang = sourceLang;

      speechRecognition.onstart = () => {
        setListening(true);
      };

      speechRecognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
      };

      speechRecognition.onerror = (event) => {
        console.error('Error occurred in recognition: ', event.error);
      };

      speechRecognition.onend = () => {
        setListening(false);
      };

      setRecognition(speechRecognition);
    } else {
      console.error('Browser does not support Speech Recognition');
    }
  }, [sourceLang]);

  const handleTranslate = async () => {
    
    try {
      const response = await axios.get('https://api.mymemory.translated.net/get', {
        params: {
          q: inputText,
          langpair: `${sourceLang}|${targetLang}`,
        },
      });
      setTranslatedText(response.data.responseData.translatedText);

    //   console.log("hii")
    //   const params= new URLSearchParams()
    //   params.append('q',inputText);
    //   params.append('source',sourceLang);
    //   params.append('target',targetLang);
    //   params.append('api_key','xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx');
    //   const response = await axios.post('https://libretranslate.de/translate',params,{
    //       headers: {
    //         'accept':'application/json',
    //       'Content-Type': 'application/x-www-form-urlencoded',
    //     },
    //  } );
    //  console.log(response.data.translatedText)
    //   setTranslatedText(response.data.translatedText);
    } catch (error) {
      console.error('Error translating text:', error);
    }
  };

  const toggleListening = () => {
    if (listening) {
      recognition.stop();
    } else {
      recognition.start();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">Real-Time Translator</h1>
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="w-full p-2 border rounded mb-4"
          placeholder="Enter text to translate"
        />
        <div className="flex justify-between mb-4">
          <label>
            From:
            <select
              value={sourceLang}
              onChange={(e) => setSourceLang(e.target.value)}
              className="ml-2 p-2 border rounded"
            >
             {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            To:
            <select
              value={targetLang}
              onChange={(e) => setTargetLang(e.target.value)}
              className="ml-2 p-2 border rounded"
            >
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="flex justify-between">
          <button
            onClick={handleTranslate}
            className="bg-blue-500 text-white p-2 rounded"
          >
            Translate
          </button>
          <button
            onClick={toggleListening}
            className={`p-2 rounded ${listening ? 'bg-red-500' : 'bg-green-500'} text-white`}
          >
            {listening ? 'Stop Speech' : 'Start Speech'}
          </button>
        </div>
        <h2 className="text-xl font-bold mt-4">Translated Text:</h2>
        <p className="mt-2 p-2 border rounded">{translatedText}</p>
      </div>
    </div>
  );
}








