
export const getGeminiResponse = async (userMessage: string) => {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: userMessage }),
    });

    const contentType = response.headers.get('content-type');
    if (!response.ok) {
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        const message = data?.details || data?.error || `Server returned ${response.status}`;
        throw new Error(message);
      }

      const text = await response.text();
      throw new Error(text || `Server returned ${response.status}`);
    }

    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      return data.reply || "I'm sorry, I couldn't process that request right now. How else can I help you with your brand?";
    }

    return "I'm sorry, I couldn't process that request right now. How else can I help you with your brand?";
  } catch (error) {
    console.error("Chat API Error:", error);
    return "I'm experiencing a bit of a technical glitch. Feel free to contact us directly at hello@reallygreatsite.com!";
  }
};
