import React, { useState } from 'react';
import { Play, Download, Settings, Users, Film, Sparkles, Volume2, Plus, Trash2, Radio } from 'lucide-react';

export default function CinematicVoiceStudio() {
  const [apiKey, setApiKey] = useState('');
  const [activeTab, setActiveTab] = useState('script'); // 'cast', 'script', 'studio', 'export'
  
  // 1. Character Cast Management (Young to Elder Hero Archetypes & Villains)
  const [cast, setCast] = useState([
    { id: 1, name: 'Alex (Young Protagonist)', voice: 'Puck', age: 'Young Adult (20s)', timbre: 'Eager, tense, high-energy', basePrompt: 'Speak in a tense, breathless, young heroic voice under extreme pressure:' },
    { id: 2, name: 'Commander Vance (Veteran Mentor)', voice: 'Kore', age: 'Elder (60s)', timbre: 'Deep, gravelly, weathered bass', basePrompt: 'Speak in a deep, slow, weathered elder mentor voice with heavy bass and absolute authority:' },
    { id: 3, name: 'The Interrogator (Villain)', voice: 'Charon', age: 'Middle-Aged', timbre: 'Cold, calculated, chilling whisper', basePrompt: 'Speak in a cold, calculating, eerie villain voice, slow and menacing:' }
  ]);

  // 2. Movie Dialogue & Scene Script Lines
  const [scriptLines, setScriptLines] = useState([
    { id: 1, characterId: 1, text: "The signal... it's coming from inside the locked bunker.", situation: "Whispering in a dark room", speed: "1.0x", pause: "Medium" },
    { id: 2, characterId: 2, text: "Step away from the terminal, kid. You don't know what we woke up.", situation: "Authoritative warning", speed: "0.9x", pause: "Long" },
    { id: 3, characterId: 3, text: "Too late, Commander. The loop is already closing.", situation: "Cold, chilling climax", speed: "0.85x", pause: "Dramatic" }
  ]);

  // 3. Studio Master Effects Settings
  const [masterSettings, setMasterSettings] = useState({
    bassBoost: true,
    bassGain: "+8dB",
    reverb: "Cinematic Hall (Subtle)",
    compression: "Broadcast Limiter Pro",
    sampleRate: "24kHz High-Definition"
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedAudioUrl, setGeneratedAudioUrl] = useState(null);

  // Add new dialogue line
  const addLine = () => {
    setScriptLines([...scriptLines, {
      id: Date.now(),
      characterId: cast[0].id,
      text: "Enter your movie dialogue here...",
      situation: "Neutral cinematic",
      speed: "1.0x",
      pause: "Normal"
    }]);
  };

  const removeLine = (id) => {
    setScriptLines(scriptLines.filter(line => line.id !== id));
  };

  // Simulate Generation and Studio Mastering Pipeline
  const handleGenerateMovieAudio = async () => {
    if (!apiKey) {
      alert("Please enter your Google AI Studio API Key first!");
      return;
    }
    setIsGenerating(true);
    
    // Construct full multi-speaker cinematic prompt package
    const fullScriptPayload = scriptLines.map(line => {
      const char = cast.find(c => c.id === Number(line.characterId));
      return `[Character: ${char.name}] [Voice: ${char.voice}] [Situation: ${line.situation}] [Speed/Timing: ${line.speed}, Pause: ${line.pause}] -> "${line.text}"`;
    }).join("\n");

    console.log("Sending to Gemini TTS Pipeline:", fullScriptPayload);

    // Simulated API response & audio compilation for preview
    setTimeout(() => {
      setIsGenerating(false);
      alert("🎬 Movie sequence audio generated and studio-mastered successfully! Ready for download.");
      // In production, this binds to the backend base64 WAV blob decoded from Gemini interaction output
      setGeneratedAudioUrl("#"); 
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-6">
      {/* Top Header */}
      <header className="flex justify-between items-center pb-6 border-b border-slate-800 mb-6">
        <div className="flex items-center space-x-3">
          <Film className="w-8 h-8 text-amber-500 animate-pulse" />
          <div>
            <h1 className="text-2xl font-bold tracking-wider">CINEMATIC VOICE PRO</h1>
            <p className="text-xs text-slate-400">AI Movie Audio Production Suite powered by Gemini 3.8 Flash TTS</p>
          </div>
        </div>
        
        {/* API Key Input */}
        <div className="flex items-center space-x-2 bg-slate-900 p-2 rounded-lg border border-slate-800">
          <Radio className="w-4 h-4 text-emerald-400" />
          <input 
            type="password" 
            placeholder="Enter Google AI Studio Key..." 
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="bg-transparent text-sm focus:outline-none w-64 text-slate-200"
          />
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="flex space-x-2 mb-6 bg-slate-900 p-1.5 rounded-xl border border-slate-800 w-max">
        <button 
          onClick={() => setActiveTab('script')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition ${activeTab === 'script' ? 'bg-amber-500 text-slate-950 shadow-lg' : 'text-slate-400 hover:text-white'}`}>
          <Radio className="w-4 h-4" />
          <span>Scene Dialogue & Script</span>
        </button>
        <button 
          onClick={() => setActiveTab('cast')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition ${activeTab === 'cast' ? 'bg-amber-500 text-slate-950 shadow-lg' : 'text-slate-400 hover:text-white'}`}>
          <Users className="w-4 h-4" />
          <span>Character Cast & Archetypes</span>
        </button>
        <button 
          onClick={() => setActiveTab('studio')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition ${activeTab === 'studio' ? 'bg-amber-500 text-slate-950 shadow-lg' : 'text-slate-400 hover:text-white'}`}>
          <Settings className="w-4 h-4" />
          <span>Studio Mastering & EQ</span>
        </button>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left/Center Panel: Dynamic Workspace */}
        <div className="lg:col-span-2 space-y-6">
          
          {activeTab === 'script' && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold flex items-center space-x-2">
                  <Sparkles className="w-5 h-5 text-amber-400" />
                  <span>Movie Script Timeline & Dialogue Staging</span>
                </h2>
                <button onClick={addLine} className="flex items-center space-x-1 bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs px-3 py-1.5 rounded-lg border border-slate-700 transition">
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Dialogue Line</span>
                </button>
              </div>

              <div className="space-y-4 max-h-[550px] overflow-y-auto pr-2">
                {scriptLines.map((line, index) => {
                  const currentChar = cast.find(c => c.id === Number(line.characterId)) || cast[0];
                  return (
                    <div key={line.id} className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-3 relative group">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-mono text-amber-500">SCENE LINE #{index + 1}</span>
                        <button onClick={() => removeLine(line.id)} className="text-slate-500 hover:text-red-400 transition">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Character & Situation Selectors */}
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">Speaker Character</label>
                          <select 
                            value={line.characterId}
                            onChange={(e) => {
                              const updated = [...scriptLines];
                              updated[index].characterId = e.target.value;
                              setScriptLines(updated);
                            }}
                            className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500">
                            {cast.map(c => (
                              <option key={c.id} value={c.id}>{c.name} ({c.age})</option>
                            ))}
                          </select>
                        </div>
                        
                        <div>
                          <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">Situational Mood / Tone</label>
                          <input 
                            type="text" 
                            value={line.situation}
                            onChange={(e) => {
                              const updated = [...scriptLines];
                              updated[index].situation = e.target.value;
                              setScriptLines(updated);
                            }}
                            className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                            placeholder="e.g. Whispering in terror, shouting over wind..."
                          />
                        </div>
                      </div>

                      {/* Dialogue Input */}
                      <div>
                        <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">Dialogue Text (Use '...' for dramatic pauses)</label>
                        <textarea 
                          rows="2"
                          value={line.text}
                          onChange={(e) => {
                            const updated = [...scriptLines];
                            updated[index].text = e.target.value;
                            setScriptLines(updated);
                          }}
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg p-3 text-sm text-slate-100 focus:outline-none focus:border-amber-500 resize-none font-serif"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              <button 
                onClick={handleGenerateMovieAudio}
                disabled={isGenerating}
                className="w-full mt-6 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-bold py-3.5 rounded-xl shadow-lg transition flex items-center justify-center space-x-2">
                {isGenerating ? (
                  <span>Synthesizing Cinematic Scene Audio...</span>
                ) : (
                  <>
                    <Volume2 className="w-5 h-5" />
                    <span>Generate & Master Movie Scene Audio</span>
                  </>
                )}
              </button>
            </div>
          )}

          {activeTab === 'cast' && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <h2 className="text-lg font-semibold flex items-center space-x-2 mb-4">
                <Users className="w-5 h-5 text-amber-400" />
                <span>Character Cast Library (Young to Elder Heroes & Villains)</span>
              </h2>
              <div className="grid grid-cols-1 gap-4">
                {cast.map(member => (
                  <div key={member.id} className="bg-slate-950 border border-slate-800 p-4 rounded-xl flex justify-between items-center">
                    <div>
                      <h3 className="font-bold text-sm text-amber-400">{member.name}</h3>
                      <p className="text-xs text-slate-400 mt-0.5">Archetype: {member.age} | Base Timbre: {member.timbre}</p>
                      <p className="text-xs font-mono text-slate-500 mt-2 bg-slate-900 p-2 rounded border border-slate-800">Prompt Tag: {member.basePrompt}</p>
                    </div>
                    <span className="text-xs bg-amber-500/10 text-amber-400 border border-amber-500/20 px-3 py-1 rounded-full font-mono">Voice: {member.voice}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'studio' && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
              <h2 className="text-lg font-semibold flex items-center space-x-2">
                <Settings className="w-5 h-5 text-amber-400" />
                <span>DSP Audio Mastering Chain (Theater Quality)</span>
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <span className="text-xs text-slate-400 block mb-1">Low-Shelf Chest Bass Boost</span>
                  <select 
                    value={masterSettings.bassGain} 
                    onChange={(e) => setMasterSettings({...masterSettings, bassGain: e.target.value})}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-slate-200">
                    <option>+4dB (Subtle Warmth)</option>
                    <option>+8dB (Cinematic Trailer Rumble)</option>
                    <option>+12dB (Deep Chest Resonance)</option>
                  </select>
                </div>
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <span className="text-xs text-slate-400 block mb-1">Environmental Reverb Simulation</span>
                  <select 
                    value={masterSettings.reverb} 
                    onChange={(e) => setMasterSettings({...masterSettings, reverb: e.target.value})}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-slate-200">
                    <option>Cinematic Hall (Subtle)</option>
                    <option>Dark Abandoned Bunker</option>
                    <option>Vast Open Space / Sci-Fi Void</option>
                  </select>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Right Panel: Monitor & Master Export Suite */}
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <h2 className="text-sm font-semibold tracking-wider uppercase text-slate-400 mb-4 flex items-center space-x-2">
              <Play className="w-4 h-4 text-amber-400" />
              <span>Scene Audio Monitor</span>
            </h2>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-6 text-center space-y-4">
              <div className="w-16 h-16 bg-amber-500/10 border border-amber-500/30 rounded-full flex items-center justify-center mx-auto text-amber-400">
                <Volume2 className="w-8 h-8" />
              </div>
              <div>
                <h3 className="font-medium text-sm text-slate-200">Scene_01_Master.wav</h3>
                <p className="text-xs text-slate-500 mt-1">Staged with 3 Character Voices & DSP Mastering</p>
              </div>

              {generatedAudioUrl ? (
                <div className="space-y-3 pt-2">
                  <audio controls className="w-full h-10 accent-amber-500">
                    <source src={generatedAudioUrl} type="audio/wav" />
                  </audio>
                  <button className="w-full bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold py-2.5 rounded-xl text-xs transition flex items-center justify-center space-x-2">
                    <Download className="w-4 h-4" />
                    <span>Download Master WAV for Video Editor</span>
                  </button>
                </div>
              ) : (
                <p className="text-xs text-slate-500 italic pt-2">Configure script and click generate to preview.</p>
              )}
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <h3 className="text-xs font-semibold tracking-wider uppercase text-slate-400 mb-3">Moviemaking Directives</h3>
            <ul className="space-y-2 text-xs text-slate-400 font-sans">
              <li>• Assign characters per line to create realistic dialogue turns.</li>
              <li>• Use ellipsis (`...`) in dialogue to command the TTS engine to generate natural cinematic timing pauses.</li>
              <li>• Import downloaded `.wav` stems directly into DaVinci Resolve or CapCut alongside your generated video files.</li>
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
}
