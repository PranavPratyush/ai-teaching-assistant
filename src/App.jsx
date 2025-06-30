import React, { useState, useEffect, useCallback } from "react";
import axios from "axios"; // ADD THIS LINE BACK
import {
  BookText,
  FileUp,
  Languages,
  PencilLine,
  BotMessageSquare,
  Sparkles,
  Save,
} from "lucide-react";

// --- API Client Setup (THE FIX IS HERE) ---
// Remove "window." to use the imported axios module
const apiClient = axios.create({
  baseURL: "http://localhost:5001/api",
});

// --- Main App Component ---
export default function App() {
  const [activeFeature, setActiveFeature] = useState("editor");

  const featureComponents = {
    editor: <BilingualEditor />,
    quiz: <QuizGenerator />,
    summarizer: <TopicSummarizer />,
  };

  const featureInfo = {
    editor: {
      icon: PencilLine,
      name: "Bilingual Editor",
      bgColor: "bg-violet-50",
    },
    quiz: {
      icon: BotMessageSquare,
      name: "AI Quiz Generator",
      bgColor: "bg-green-50",
    },
    summarizer: {
      icon: BookText,
      name: "AI Topic Summarizer",
      bgColor: "bg-blue-50",
    },
  };

  return (
    <div
      className={`min-h-screen font-sans antialiased transition-colors duration-500 ${featureInfo[activeFeature].bgColor}`}
    >
      <div className="container mx-auto p-4 sm:p-6 md:p-8">
        <Header />
        <Nav
          activeFeature={activeFeature}
          setActiveFeature={setActiveFeature}
          featureInfo={featureInfo}
        />
        <main className="mt-8">{featureComponents[activeFeature]}</main>
      </div>
    </div>
  );
}

// --- Layout Components ---
const Header = () => (
  <header className="text-center mb-8">
    <h1 className="text-4xl sm:text-5xl font-bold text-gray-800 tracking-tight">
      AI Teaching Assistant
    </h1>
    <p className="mt-2 text-lg text-gray-600">
      Your all-in-one platform for intelligent lesson preparation
    </p>
  </header>
);
const Nav = ({ activeFeature, setActiveFeature, featureInfo }) => (
  <nav className="flex justify-center bg-white/60 backdrop-blur-sm p-2 rounded-xl shadow-md border border-gray-200">
    <div className="flex space-x-1 sm:space-x-2">
      {Object.keys(featureInfo).map((key) => {
        const { icon: Icon, name } = featureInfo[key];
        const isActive = activeFeature === key;
        return (
          <button
            key={key}
            onClick={() => setActiveFeature(key)}
            className={`flex items-center justify-center sm:justify-start space-x-2 px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg text-sm sm:text-base font-semibold transition-all duration-300 ${
              isActive
                ? `bg-gray-800 text-white shadow-lg`
                : `text-gray-600 hover:bg-gray-100`
            }`}
          >
            <Icon className="h-5 w-5" />{" "}
            <span className="hidden sm:inline">{name}</span>
          </button>
        );
      })}
    </div>
  </nav>
);

// --- Feature Components ---

const BilingualEditor = () => {
  const [englishNote, setEnglishNote] = useState(
    "The core AI uses Natural Language Processing (NLP)."
  );
  const [translatedNote, setTranslatedNote] = useState("");
  const [language, setLanguage] = useState("kn");
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState("");

  useEffect(() => {
    const simpleTranslate = (text, lang) => `[${lang.toUpperCase()}] ` + text;
    setTranslatedNote(simpleTranslate(englishNote, language));
  }, [englishNote, language]);

  const handleSaveNote = async () => {
    if (!englishNote || !translatedNote) {
      alert("Cannot save an empty note.");
      return;
    }
    setIsSaving(true);
    setSaveStatus("");
    try {
      const payload = {
        english_note: englishNote,
        translated_note: translatedNote,
        language: language,
      };
      const response = await apiClient.post("/save_note", payload);

      if (response.status === 201) {
        setSaveStatus("Note saved successfully!");
        setTimeout(() => setSaveStatus(""), 3000);
      }
    } catch (error) {
      console.error("Error saving note:", error);
      setSaveStatus("Failed to save note. Is the backend running?");
      setTimeout(() => setSaveStatus(""), 5000);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <FeatureCard>
      <FeatureHeader
        icon={PencilLine}
        title="Live Editor with Cross-Lingual Highlighting"
        gradient="from-violet-500 to-purple-500"
      />
      <div className="p-6">
        <div className="mb-4">
          <label
            htmlFor="language-select"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Translate to:
          </label>
          <select
            id="language-select"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-violet-500 focus:border-violet-500"
          >
            <option value="kn">Kannada</option>{" "}
            <option value="hi">Hindi</option> <option value="ta">Tamil</option>{" "}
            <option value="te">Telugu</option>
          </select>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <TextEditor
            label="English Note"
            value={englishNote}
            onChange={(e) => setEnglishNote(e.target.value)}
          />
          <TextEditor
            label="Translated Note"
            value={translatedNote}
            onChange={(e) => setTranslatedNote(e.target.value)}
            isReadOnly={true}
          />
        </div>
        <div className="mt-6 flex items-center justify-end space-x-4">
          {saveStatus && (
            <p
              className={`text-sm ${
                saveStatus.includes("Failed")
                  ? "text-red-600"
                  : "text-green-600"
              }`}
            >
              {saveStatus}
            </p>
          )}
          <ActionButton
            icon={isSaving ? Spinner : Save}
            text={isSaving ? "Saving..." : "Save Note"}
            gradient="from-violet-500 to-purple-500"
            onClick={handleSaveNote}
            disabled={isSaving}
          />
        </div>
      </div>
    </FeatureCard>
  );
};

const QuizGenerator = () => (
  <FeatureCard>
    <FeatureHeader
      icon={BotMessageSquare}
      title="AI Quiz Generator"
      gradient="from-green-500 to-emerald-500"
    />
    <div className="p-6 text-gray-500">
      Quiz Generator UI will be connected next.
    </div>
  </FeatureCard>
);
const TopicSummarizer = () => (
  <FeatureCard>
    <FeatureHeader
      icon={BookText}
      title="AI Topic Summarizer"
      gradient="from-blue-500 to-sky-500"
    />
    <div className="p-6 text-gray-500">
      Topic Summarizer UI will be connected next.
    </div>
  </FeatureCard>
);

// --- Reusable UI Components ---
const FeatureCard = ({ children }) => (
  <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
    {children}
  </div>
);
const FeatureHeader = ({ icon: Icon, title, gradient }) => (
  <div
    className={`p-4 sm:p-5 border-b border-gray-200 bg-gradient-to-r ${gradient}`}
  >
    <div className="flex items-center space-x-3">
      <Icon className="h-7 w-7 text-white" />
      <h2 className="text-xl sm:text-2xl font-bold text-white tracking-wide">
        {title}
      </h2>
    </div>
  </div>
);
const TextEditor = ({ label, value, onChange, isReadOnly = false }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <textarea
      value={value}
      onChange={onChange}
      readOnly={isReadOnly}
      className={`h-[250px] p-3 w-full border border-gray-300 rounded-md shadow-sm transition ${
        isReadOnly
          ? "bg-gray-100"
          : "focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
      }`}
      placeholder="Type your notes here..."
    />
  </div>
);
const ActionButton = ({
  icon: Icon,
  text,
  gradient,
  onClick,
  disabled = false,
  fullWidth = false,
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`inline-flex items-center justify-center space-x-2 px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-gradient-to-r ${gradient} hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
      fullWidth ? "w-full" : ""
    }`}
  >
    <Icon className="h-5 w-5" />
    <span>{text}</span>
  </button>
);
const Spinner = () => (
  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
);
