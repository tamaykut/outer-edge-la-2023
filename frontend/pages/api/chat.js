import { Configuration, OpenAIApi } from 'openai';
import { ChatGPTAPI } from 'chatgpt';


const chat = async (req, res) => {
  const api = new ChatGPTAPI({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
    completionParams: {
      temperature: 0.5,
      top_p: 0.8
    },
    role: 'user',
  });
  console.log(req.body.userInput)
  const output = await api.sendMessage(req.body.userInput)
  console.log(res.text)

  res.status(200).json({ output: output });
};

export default chat;