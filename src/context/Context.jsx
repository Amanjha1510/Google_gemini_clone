import { createContext, useState } from "react";
import runChat from "../config/gemini";  // ✅ Ensure gemini.js has `export default runChat`

export const Context = createContext();

const ContextProvider = (props) => {
    const [prevPrompts, setPrevPrompts] = useState([]);
    const [input, setInput] = useState("");
    const [recentPrompt, setRecentPrompt] = useState("");
    const [showResult, setShowResult] = useState(false);
    const [loading, setLoading] = useState(false);
    const [resultData, setResultData] = useState("");

    // ✅ Function to simulate typing effect
    function delayPara(index, nextWord) {
        setTimeout(() => {
            setResultData((prev) => prev + nextWord);
        }, 75 * index);
    }

    const onSent = async (prompt) => {
        setResultData("");
        setLoading(true);
        setShowResult(true);

        let response;
        if (prompt) {
            response = await runChat(prompt);
            setRecentPrompt(prompt);
        } else {
            setPrevPrompts((prev) => [...prev, input]);
            setRecentPrompt(input);
            response = await runChat(input);
        }

        // ✅ Handle empty or invalid response
        if (!response) {
            setResultData("⚠ Error: No response from AI.");
            setLoading(false);
            return;
        }

        // ✅ Convert Markdown-style bold `**text**` to HTML `<b>text</b>`
        let responseArray = response.split("**");
        let formattedResponse = "";
        for (let i = 0; i < responseArray.length; i++) {
            formattedResponse += i % 2 === 1 ? `<b>${responseArray[i]}</b>` : responseArray[i];
        }

        console.log("Formatted Response:", formattedResponse);

        // ✅ Replace `*` with line breaks and add spaces
        responseArray = formattedResponse.replace(/\*/g, "<br>").split(" ");

        // ✅ Simulate typing effect
        responseArray.forEach((word, i) => delayPara(i, word + " "));

        setLoading(false);
        setInput("");
    };

    const newChat = () => {
        setLoading(false);
        setShowResult(false);
    };

    const contextValue = {
        prevPrompts,
        setPrevPrompts,
        onSent,
        setRecentPrompt,
        recentPrompt,
        showResult,
        loading,
        resultData,
        input,
        setInput,
        newChat,
    };

    return <Context.Provider value={contextValue}>{props.children}</Context.Provider>;
};

export default ContextProvider;
