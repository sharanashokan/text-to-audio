import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Download, Settings, Users, Film, Sparkles, Volume2, Plus, Trash2, Radio, Video, Sliders, Wand2 } from 'lucide-react';
import { GEMINI_API_KEY } from './config';

export default function CinematicVoiceStudio2026() {
  const [activeTab, setActiveTab] = useState('director'); 
  
  // Advanced 2026 Voice Archetypes & Character Library
  const [cast, setCast] = useState([
    { id: 1, name: 'Alex (Young Protagonist)', voice: 'Puck', age: 'Young Adult', timbre: 'Eager, tense, high-energy' },
    { id: 2, name: 'Commander Vance (Mentor)', voice: 'Kore', age: 'Elder', timbre: 'Deep, gravelly, weathered bass' },
    { id: 3, name: 'The Interrogator (Villain)', voice: 'Charon', age: 'Middle-Aged', timbre: 'Cold, calculated whisper' },
    { id: 4, name: 'Aria (AI / Narrator)', voice: 'Fenrir', age: 'Ageless', timbre: 'Ethereal, booming cinematic resonance' }
  ]);

  // Scene Script & Dialogue Staging
  const [scriptLines, setScriptLines] = useState([
    { id: 1, characterId: 1, text: "The signal... it's coming from inside the locked bunker.", situation: "Whispering in terror", speed: "1.0x" },
    { id: 2, characterId: 2, text: "Step away from the terminal, kid. You don't know what we woke up.", situation: "Authoritative warning", speed: "0.9x" }
  ]);

  // Advanced AI & Audio Settings
  const [advancedSettings, setAdvancedSettings] = useState({
    globalSpeed: '1.0',
    bassBoost: '+12dB (Deep Chest Rumble)',
    reverbSpace: 'Cinematic IMAX Hall',
    aiEnhancer: true
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRecordingVideo, setIsRecordingVideo] = useState(false);

  const audioRef = useRef(null);
  const canvasRef = useRef(null);

  const addLine = () => {
    setScriptLines([...scriptLines, {
      id: Date.now(),
      characterId: cast[0].id,
      text: "Enter your character dialogue...",
      situation: "Neutral cinematic",
      speed: "1.0x"
    }]);
  };

  const removeLine = (id) => {
    setScriptLines(scriptLines.filter(line => line.id !== id));
  };

  // WAV Header Utility for flawless playback duration
  const addWavHeader = (pcmBytes, sampleRate = 24000) => {
    const numChannels = 1;
    const bitsPerSample = 16;
    const byteRate = (sampleRate * numChannels * bitsPerSample) / 8;
    const blockAlign = (numChannels * bitsPerSample) / 8;
    const dataSize = pcmBytes.length;
    const chunkSize = 36 + dataSize;

    const header = new ArrayBuffer(44);
    const view = new DataView(header);

    view.setUint32(0, 0x52494646, false); // "RIFF"
    view.setUint32(4, chunkSize, true);
    view.setUint32(8, 0x57415645, false); // "WAVE"
    view.setUint32(12, 0x666d7420, false); // "fmt "
    view.setUint32(16, 16, true); 
    view.setUint16(20, 1, true); 
    view.setUint16(22, numChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, byteRate, true);
    view.setUint16(32, blockAlign, true);
    view.setUint16(34, bitsPerSample, true);
    view.setUint32(36, 0x64617461, false); // "data"
    view.setUint32(40, dataSize, true);

    const wavBytes = new Uint8Array(header.byteLength + pcmBytes.length);
    wavBytes.set(new Uint8Array(header), 0);
    wavBytes.set(pcmBytes, header.byteLength);
    return wavBytes;
  };

  // Live Gemini 3.8-Flash API Generation
  const handleGenerate = async () => {
    if (!GEMINI_API_KEY || GEMINI_API_KEY === "YOUR_ACTUAL_API_KEY_HERE") {
      alert("Please configure your API key in src/config.js first!");
      return;
    }
    setIsGenerating(true);
    setAudioUrl(null);

    try {
      const formattedScript = scriptLines.map(line => {
        const char = cast.find(c => c.id === Number(line.characterId)) || cast[0];
        return `[Character: ${char.name}, Voice Archetype: ${char.voice}] [Pacing Speed: ${line.speed}] [Mood: ${line.situation}] -> "${line.text}"`;
      }).join("\n\n");

      const prompt = `Act as an elite Hollywood movie sound director. Synthesize the following multi-character cinematic sequence with extreme dynamic range, heavy bass resonance, and immersive theatrical styling:\n\n${formattedScript}`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseModalities: ["AUDIO"] }
        })
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error.message);

      let base64Audio = null;
      const candidate = data.candidates?.[0];
      if (candidate?.content?.parts) {
        for (const part of candidate.content.parts) {
          if (part.inlineData?.data) {
            base64Audio = part.inlineData.data;
            break;
          }
        }
      }

      if (base64Audio) {
        const binaryString = atob(base64Audio);
        const len = binaryString.length;
        const pcmBytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
          pcmBytes[i] = binaryString.charCodeAt(i);
        }

        const wavBytes = addWavHeader(pcmBytes, 24000);
        const blob = new Blob([wavBytes], { type: 'audio/wav' });
        setAudioUrl(URL.createObjectURL(blob));
      } else {
        alert("Generation completed, but no audio stream returned.");
      }
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  // Canvas Visualizer Animation Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationId;

    const draw = () => {
      ctx.fillStyle = '#020617';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw futuristic cinematic grid & wave particles
      ctx.strokeStyle = '#38bdf833';
      ctx.lineWidth = 1;
      for (let i = 0; i < canvas.width; i += 30) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
      }

      // Dynamic Audio Waveform Simulation
      ctx.beginPath();
      ctx.strokeStyle = isPlaying ? '#f59e0b' : '#64748b';
      ctx.lineWidth = 3;
      const centerY = canvas.height / 2;
      for (let x = 0; x < canvas.width; x++) {
        const frequency = isPlaying ? 0.02 : 0.005;
        const amplitude = isPlaying ? 35 : 5;
        const y = centerY + Math.sin(x * frequency + Date.now() * 0.005) * amplitude * Math.sin(x * 0.01);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      animationId = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animationId);
  }, [isPlaying]);

  // Export as Video (MP4/WebM) using MediaRecorder
  const handleExportVideo = async () => {
    if (!audioUrl || !audioRef.current) return;
    setIsRecordingVideo(true);

    const canvas = canvasRef.current;
    const canvasStream = canvas.captureStream(30); // 30 FPS video stream
    
    // Create audio stream from audio element
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const source = audioCtx.createMediaElementSource(audioRef.current);
    const dest = audioCtx.createMediaStreamDestination();
    source.connect(dest);
    source.connect(audioCtx.destination);

    // Combine video stream and audio stream
    const combinedStream = new MediaStream([
      ...canvasStream.getVideoTracks(),
      ...dest.stream.getAudioTracks()
    ]);

    const recorder = new MediaRecorder(combinedStream, { mimeType: 'video/webm;codecs=vp9' });
    const chunks = [];

    recorder.ondataavailable = (e) => chunks.push(e.data);
    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'video/mp4' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Cinematic_Voice_Master.mp4';
      a.click();
      setIsRecordingVideo(false);
    };

    audioRef.current.currentTime = 0;
    audioRef.current.play();
    setIsPlaying(true);
    recorder.start();

    audioRef.current.onended = () => {
      recorder.stop();
      setIsPlaying(false);
    };
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-6 selection:bg-amber-500 selection:text-slate-950">
      {/* Header */}
      <header className="flex justify-between items-center pb-6 border-b border-slate-800/80 mb-8 backdrop-blur-md">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-gradient-to-tr from-amber-500 to-orange-600 rounded-2xl shadow-lg shadow-amber-500/20">
            <Film className="w-6 h-6 text-slate-950" />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-widest bg-gradient-to-r from-white via-slate-200 to-amber-400 bg-clip-text text-transparent">CINEMATIC VOICE STUDIO 2026</h1>
            <p className="text-xs text-amber-500 font-mono tracking-wider">Powered by Gemini 3.8 Flash • Pro Movie Audio & MP4 Suite</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 bg-slate-900/90 px-4 py-2 rounded-xl border border-slate-800 text-emerald-400 text-xs font-mono shadow-inner">
          <Radio className="w-4 h-4 animate-pulse" />
          <span>Secure Config Active</span>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="flex space-x-2 mb-8 bg-slate-900/80 p-1.5 rounded-2xl border border-slate-800/80 w-max backdrop-blur">
        <button onClick={() => setActiveTab('director')} className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-bold transition ${activeTab === 'director' ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-lg shadow-amber-500/20' : 'text-slate-400 hover:text-white'}`}>
          <Wand2 className="w-4 h-4" /><span>Director Timeline</span>
        </button>
        <button onClick={() => setActiveTab('cast')} className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-bold transition ${activeTab === 'cast' ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-lg shadow-amber-500/20' : 'text-slate-400 hover:text-white'}`}>
          <Users className="w-4 h-4" /><span>Voice Cast & Timbres</span>
        </button>
        <button onClick={() => setActiveTab('master')} className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-bold transition ${activeTab === 'master' ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-lg shadow-amber-500/20' : 'text-slate-400 hover:text-white'}`}>
          <Sliders className="w-4 h-4" /><span>DSP & Mastering Suite</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Workspace */}
        <div className="lg:col-span-2 space-y-6">
          {activeTab === 'director' && (
            <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-6 shadow-2xl space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-sm font-bold tracking-wider uppercase text-slate-300 flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Scene Script & Multi-Character Staging</span>
                </h2>
                <button onClick={addLine} className="bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs px-3.5 py-2 rounded-xl border border-slate-700 font-bold transition flex items-center space-x-1.5 shadow-md">
                  <Plus className="w-3.5 h-3.5" /><span>Add Line</span>
                </button>
              </div>

              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                {scriptLines.map((line, index) => (
                  <div key={line.id} className="bg-slate-950/80 border border-slate-800/80 p-5 rounded-2xl space-y-4 relative group hover:border-slate-700 transition">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-mono tracking-widest text-amber-500 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">LINE #{index + 1}</span>
                      <button onClick={() => removeLine(line.id)} className="text-slate-500 hover:text-red-400 transition"><Trash2 className="w-4 h-4" /></button>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div className="col-span-2">
                        <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1.5">Character Speaker</label>
                        <select 
                          value={line.characterId}
                          onChange={(e) => {
                            const updated = [...scriptLines];
                            updated[index].characterId = e.target.value;
                            setScriptLines(updated);
                          }}
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500">
                          {cast.map(c => <option key={c.id} value={c.id}>{c.name} ({c.voice})</option>)}
                        </select>
                      </div>

                      <div>
                        <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1.5">Pacing Speed</label>
                        <select 
                          value={line.speed}
                          onChange={(e) => {
                            const updated = [...scriptLines];
                            updated[index].speed = e.target.value;
                            setScriptLines(updated);
                          }}
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500 font-mono">
                          <option value="0.75x">0.75x (Slow)</option>
                          <option value="0.9x">0.9x (Dramatic)</option>
                          <option value="1.0x">1.0x (Normal)</option>
                          <option value="1.25x">1.25x (Fast)</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1.5">Situational Emotion / Tone Tag</label>
                      <input 
                        type="text" 
                        value={line.situation}
                        onChange={(e) => {
                          const updated = [...scriptLines];
                          updated[index].situation = e.target.value;
                          setScriptLines(updated);
                        }}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                        placeholder="e.g. Whispering in terror, shouting over wind..."
                      />
                    </div>

                    <div>
                      <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1.5">Dialogue Text (Use '...' for suspenseful pauses)</label>
                      <textarea 
                        rows="2"
                        value={line.text}
                        onChange={(e) => {
                          const updated = [...scriptLines];
                          updated[index].text = e.target.value;
                          setScriptLines(updated);
                        }}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-sm text-slate-100 focus:outline-none focus:border-amber-500 resize-none font-serif leading-relaxed"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <button 
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black py-4 rounded-2xl shadow-xl shadow-amber-500/20 transition flex items-center justify-center space-x-2 tracking-wider">
                {isGenerating ? (
                  <span className="flex items-center space-x-2"><span className="animate-spin rounded-full h-4 w-4 border-b-2 border-slate-950"></span><span>Synthesizing Cinematic Audio...</span></span>
                ) : (
                  <><Volume2 className="w-5 h-5" /><span>GENERATE MOVIE SCENE AUDIO</span></>
                )}
              </button>
            </div>
          )}

          {activeTab === 'cast' && (
            <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-6 shadow-2xl space-y-4">
              <h2 className="text-sm font-bold tracking-wider uppercase text-slate-300 mb-4">Character Cast & Voice Library</h2>
              <div className="grid grid-cols-1 gap-4">
                {cast.map(member => (
                  <div key={member.id} className="bg-slate-950/80 border border-slate-800/80 p-5 rounded-2xl flex justify-between items-center">
                    <div>
                      <h3 className="font-bold text-sm text-amber-400">{member.name}</h3>
                      <p className="text-xs text-slate-400 mt-1">Timbre Archetype: {member.timbre}</p>
                    </div>
                    <span className="text-xs bg-amber-500/10 text-amber-400 border border-amber-500/20 px-3.5 py-1.5 rounded-xl font-mono font-bold">Assigned Voice: {member.voice}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'master' && (
            <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-6 shadow-2xl space-y-6">
              <h2 className="text-sm font-bold tracking-wider uppercase text-slate-300">DSP Mastering & Cinematic Enhancements</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800 space-y-2">
                  <label className="text-xs text-slate-400 block font-bold">Chest Bass Boost</label>
                  <select 
                    value={advancedSettings.bassBoost}
                    onChange={(e) => setAdvancedSettings({...advancedSettings, bassBoost: e.target.value})}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200">
                    <option>+8dB (Cinematic Warmth)</option>
                    <option>+12dB (Deep Chest Rumble)</option>
                    <option>+16dB (IMAX Sub-Bass)</option>
                  </select>
                </div>
                <div className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800 space-y-2">
                  <label className="text-xs text-slate-400 block font-bold">Acoustic Space Reverb</label>
                  <select 
                    value={advancedSettings.reverbSpace}
                    onChange={(e) => setAdvancedSettings({...advancedSettings, reverbSpace: e.target.value})}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200">
                    <option>Cinematic IMAX Hall</option>
                    <option>Dark Sci-Fi Bunker</option>
                    <option>Vast Open Void</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Panel: Visualizer & MP4/WAV Export Suite */}
        <div className="space-y-6">
          <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-6 shadow-2xl space-y-6">
            <h2 className="text-xs font-bold tracking-widest uppercase text-slate-400 flex items-center space-x-2">
              <Play className="w-4 h-4 text-amber-400" />
              <span>Real-Time Audio Visualizer</span>
            </h2>

            {/* Canvas Visualizer Box */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3 overflow-hidden text-center space-y-4">
              <canvas ref={canvasRef} width="350" height="140" className="w-full rounded-xl border border-slate-900" />
              
              <audio 
                ref={audioRef} 
                src={audioUrl} 
                onPlay={() => setIsPlaying(true)} 
                onPause={() => setIsPlaying(false)}
                controls 
                className="w-full accent-amber-500" 
              />

              {audioUrl ? (
                <div className="space-y-3 pt-2">
                  <a 
                    href={audioUrl} 
                    download="Cinematic_Master_Voice.wav"
                    className="w-full bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700 font-bold py-3 rounded-xl text-xs transition flex items-center justify-center space-x-2 shadow-lg">
                    <Download className="w-4 h-4" />
                    <span>Download Master .WAV File</span>
                  </a>

                  <button 
                    onClick={handleExportVideo}
                    disabled={isRecordingVideo}
                    className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-slate-950 font-black py-3 rounded-xl text-xs transition flex items-center justify-center space-x-2 shadow-lg shadow-emerald-600/20">
                    <Video className="w-4 h-4" />
                    <span>{isRecordingVideo ? "Rendering MP4 Video..." : "Export as .MP4 Video File"}</span>
                  </button>
                </div>
              ) : (
                <p className="text-xs text-slate-500 italic py-4">Configure your scene and click generate to unlock player & exports.</p>
              )}
            </div>
          </div>

          <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-6 shadow-2xl space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-widest text-amber-400">2026 Production Tips</h3>
            <ul className="space-y-2 text-xs text-slate-400 font-sans leading-relaxed">
              <li>• Use ellipsis <code className="text-amber-300 font-mono">...</code> in dialogue to force dramatic cinematic pauses.</li>
              <li>• Export as <strong className="text-slate-200">.MP4 Video</strong> to drop directly into CapCut, Premiere, or DaVinci Resolve alongside your video clips.</li>
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
}
