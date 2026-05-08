import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles } from 'lucide-react';

const AIChat = () => {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! I'm your LogiTrack AI Assistant. you can ask question related to your order status.... so how can i help you today?", sender: 'ai' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { id: Date.now(), text: input, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      let aiResponseText =
        "🤖 I'm your AI Logistics Assistant. Ask me about deliveries, drivers, traffic conditions, routes, or warehouse updates.";

      const lowerInput = userMessage.text.toLowerCase();

      if (
        (lowerInput.includes("closest") || lowerInput.includes("nearest")) &&
        lowerInput.includes("ord-42")
      ) {
        aiResponseText = `
        🚚 Driver Assignment Analysis Complete
        ✅ Closest Driver: Driver A
        📍 Distance from ORD-42: 2.3 km
        🕒 Estimated Arrival Time: 11 minutes
        📦 Vehicle Status: Active
        🛣 Current Route: Downtown Express Route
        Recommendation:Assign Driver A for the fastest delivery completion.`;
      } else if (
        lowerInput.includes("delayed") ||
        lowerInput.includes("pending")
      ) {
        aiResponseText = `
        ⚠ Delivery Status Report
        You currently have 2 delayed/pending orders:
        1️⃣ ORD-43 — Jane Smith
        📍 Location: City Center
        ⏳ Delay: 18 minutes
        2️⃣ ORD-44 — Bob Johnson
        📍 Location: North Avenue
        ⏳ Status: Awaiting driver assignment
        Suggestion:Reassign nearby available drivers to reduce delays.`;
      } else if (
        lowerInput.includes("optimal route") ||
        lowerInput.includes("best route") ||
        lowerInput.includes("traffic")
      ) {
        aiResponseText = `
        🛣 AI Route Optimization Result
        🚦 Heavy traffic detected on 5th Avenue.
        ✅ Suggested Alternative: Broadway Route
        ⏱ Estimated Time Saved: 12 minutes
        ⛽ Fuel Efficiency Improvement: 8%
        📍 Congestion Level: Moderate
        💡 Recommendation:Automatically reroute Driver A via Broadway.`;
      } else if (lowerInput.includes("warehouse")) {
        aiResponseText = `
        🏬 Warehouse Insights
        📦 Active Warehouses: 3
        ⚠ Low Stock Alerts: 2 items
        🚚 Pending Dispatch Orders: 14
        Nearest Warehouse for ORD-42:
        ➡ Central Distribution Hub
        📍 Distance: 5.1 km`;
      } else if (lowerInput.includes("driver performance")) {
        aiResponseText = `📊 Driver Performance Analytics
        🏆 Top Performer Today: Driver Rahul
        ✅ Deliveries Completed: 24
        ⭐ Customer Rating: 4.9/5
        ⛽ Fuel Efficiency Score: Excellent
        ⚠ Driver Needing Attention:
        Driver C has 3 delayed deliveries today.`;
      } else {
        aiResponseText = `🤖 I can help you with:
        🚚 Live order tracking
        🛣 Route optimization
        📦 Delivery status
        👨‍✈ Driver assignment
        🏬 Warehouse monitoring
        📊 Logistics analytics
        ⚠ Delay prediction
        Try asking:
        • "Who is closest to ORD-42?"
        • "Show delayed deliveries"
        • "Suggest optimal route"
        • "Warehouse status"
        • "Driver performance"`;}

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          text: aiResponseText,
          sender: "ai",
        },
      ]);

      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-full bg-slate-900">
      <div className="p-6 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-10 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Sparkles className="text-indigo-400" /> AI Insights
          </h2>
          <p className="text-slate-400 text-sm mt-1">Ask questions about your fleet and logistics</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex gap-4 max-w-[80%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${msg.sender === 'user' ? 'bg-indigo-600' : 'bg-slate-700'}`}>
                {msg.sender === 'user' ? <User size={20} className="text-white" /> : <Bot size={20} className="text-indigo-400" />}
              </div>
              <div className={`p-4 rounded-2xl ${msg.sender === 'user' ? 'bg-indigo-600 text-white rounded-tr-sm' : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-tl-sm shadow-md'}`}>
                <p className="leading-relaxed">{msg.text}</p>
              </div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center shrink-0">
                <Bot size={20} className="text-indigo-400" />
              </div>
              <div className="bg-slate-800 p-4 rounded-2xl rounded-tl-sm border border-slate-700 flex items-center gap-2">
                <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></span>
                <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-6 bg-slate-900 border-t border-slate-800">
        <form onSubmit={handleSend} className="max-w-4xl mx-auto relative">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about drivers, routes, or orders..."
            className="w-full bg-slate-800 border border-slate-700 rounded-full py-4 pl-6 pr-16 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow shadow-lg"
          />
          <button 
            type="submit"
            disabled={!input.trim() || isTyping}
            className="absolute right-2 top-2 bottom-2 bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-full transition-colors disabled:opacity-50 flex items-center justify-center w-12"
          >
            <Send size={20} className="ml-1" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default AIChat;
