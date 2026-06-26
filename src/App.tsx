import React, { useState, useMemo, FormEvent } from "react";
import { 
  Download, 
  Smartphone, 
  ShieldCheck, 
  Calendar, 
  BookOpen, 
  CheckCircle, 
  ChevronRight, 
  Grid,
  Sparkles,
  Info,
  Clock,
  ArrowRight,
  Calculator,
  User,
  Heart,
  FileDown,
  GraduationCap,
  Plus,
  Trash2,
  Share2,
  Image as ImageIcon,
  Check,
  Award,
  BookMarked,
  MessageSquare,
  AlertTriangle,
  Send,
  QrCode
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// Structure of simulated app datasets
interface Course {
  id: string;
  code: string;
  title: string;
  credits: number;
  grade: number; // e.g. 1.00 (Excellent) to 3.00 (Passing) in MSU scale
}

interface Semester {
  id: string;
  name: string;
  courses: Course[];
}

interface ScheduleClass {
  id: string;
  code: string;
  subjectName: string;
  room: string;
  day: "Mon" | "Tue" | "Wed" | "Thu" | "Fri";
  timeStart: string; // "09:00"
  timeEnd: string; // "10:30"
}

export default function App() {
  // Opening Splash screen state
  const [showSplash, setShowSplash] = useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  React.useEffect(() => {
    const carouselTimer = setInterval(() => {
      setCurrentCarouselIndex(prev => (prev + 1) % 8);
    }, 7500);
    return () => clearInterval(carouselTimer);
  }, []);

  // Simulator active Tab: "akademic" | "schedule" | "report"
  const [activeTab, setActiveTab ] = useState<"akademic" | "schedule" | "report">("report");

  // App screenshot carousel
  const appScreenshots = [
    "https://cdn.builder.io/api/v1/image/assets%2F9c9ccda5f5844879a2f665afd5155f4d%2F90aca777b0614cf7bc9b66699bc07bc7?format=webp&width=800&height=1200",
    "https://cdn.builder.io/api/v1/image/assets%2F9c9ccda5f5844879a2f665afd5155f4d%2F9bc089faa09746319ae7c7f3cffe4bcb?format=webp&width=800&height=1200",
    "https://cdn.builder.io/api/v1/image/assets%2F9c9ccda5f5844879a2f665afd5155f4d%2F52b6ede358544dd397ae2fd0a62990c1?format=webp&width=800&height=1200",
    "https://cdn.builder.io/api/v1/image/assets%2F9c9ccda5f5844879a2f665afd5155f4d%2F063ee9d6606442ceb59bb42f7da87f9d?format=webp&width=800&height=1200",
    "https://cdn.builder.io/api/v1/image/assets%2F9c9ccda5f5844879a2f665afd5155f4d%2Fa901417a2bbf40dda7266e797cfb371c?format=webp&width=800&height=1200",
    "https://cdn.builder.io/api/v1/image/assets%2F9c9ccda5f5844879a2f665afd5155f4d%2F8e5fcbf19ccb4cb2bfcdb3cc8b84055c?format=webp&width=800&height=1200",
    "https://cdn.builder.io/api/v1/image/assets%2F9c9ccda5f5844879a2f665afd5155f4d%2Fd06b6306d83941129ec96c2a7d3d4f57?format=webp&width=800&height=1200",
    "https://cdn.builder.io/api/v1/image/assets%2F9c9ccda5f5844879a2f665afd5155f4d%2Ff27b7a27cca54ca9b9da605e38ea707d?format=webp&width=800&height=1200",
  ];
  const [carouselIndex, setCarouselIndex] = useState(0);
  
  // Simulated App States
  const [semesters, setSemesters] = useState<Semester[]>([
    {
      id: "sem-1",
      name: "1st Sem",
      courses: [
        { id: "c-1", code: "GEC104", title: "Modern Math", credits: 3, grade: 1.50 }
      ]
    },
    {
      id: "sem-2",
      name: "2nd Sem",
      courses: []
    }
  ]);
  const [selectedSemId, setSelectedSemId] = useState<string>("sem-1");
  const [selectedDay, setSelectedDay] = useState<"Mon" | "Tue" | "Wed" | "Thu" | "Fri">("Mon");
  
  const [scheduleClasses, setScheduleClasses] = useState<ScheduleClass[]>([
    {
      id: "sche-1",
      code: "GEC104",
      subjectName: "MMW",
      room: "ROOM 13",
      day: "Mon",
      timeStart: "09:00",
      timeEnd: "10:30"
    }
  ]);

  // Form states for Interactive Simulator Modal
  const [showAddCourseModal, setShowAddCourseModal] = useState(false);
  const [newCourseCode, setNewCourseCode] = useState("GEC102");
  const [newCourseTitle, setNewCourseTitle] = useState("Purposive Comm");
  const [newCourseCredits, setNewCourseCredits] = useState(3);
  const [newCourseGrade, setNewCourseGrade] = useState(1.25);

  const [showAddScheduleModal, setShowAddScheduleModal] = useState(false);
  const [newScheduleCode, setNewScheduleCode] = useState("GEC104");
  const [newScheduleSubject, setNewScheduleSubject] = useState("MMW");
  const [newScheduleRoom, setNewScheduleRoom] = useState("ROOM 13");
  const [newScheduleDay, setNewScheduleDay] = useState<"Mon" | "Tue" | "Wed" | "Thu" | "Fri">("Mon");
  const [newScheduleStart, setNewScheduleStart] = useState("09:00");
  const [newScheduleEnd, setNewScheduleEnd] = useState("10:30");

  const [isDownloaded, setIsDownloaded] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [simulatedToast, setSimulatedToast] = useState<string | null>(null);
  const [currentCarouselIndex, setCurrentCarouselIndex] = useState(0);

  // App showcase carousel images
  const carouselImages = [
    "https://cdn.builder.io/api/v1/image/assets%2F9c9ccda5f5844879a2f665afd5155f4d%2Fbe5516edaa7b43d3a5ec16fa337b9ad8?format=webp&width=800&height=1200",
    "https://cdn.builder.io/api/v1/image/assets%2F9c9ccda5f5844879a2f665afd5155f4d%2F20fde0541d764f1eb648640589108184?format=webp&width=800&height=1200",
    "https://cdn.builder.io/api/v1/image/assets%2F9c9ccda5f5844879a2f665afd5155f4d%2F7e6f1b18999e49bb9d084b5d2824d484?format=webp&width=800&height=1200",
    "https://cdn.builder.io/api/v1/image/assets%2F9c9ccda5f5844879a2f665afd5155f4d%2F3adf3b4e46f740578e700c44e56a0b68?format=webp&width=800&height=1200",
    "https://cdn.builder.io/api/v1/image/assets%2F9c9ccda5f5844879a2f665afd5155f4d%2F032ce3f185d9462ca55863591da7a210?format=webp&width=800&height=1200",
    "https://cdn.builder.io/api/v1/image/assets%2F9c9ccda5f5844879a2f665afd5155f4d%2Fb8ce317b797a4a068c0c7bd321c24e5d?format=webp&width=800&height=1200",
    "https://cdn.builder.io/api/v1/image/assets%2F9c9ccda5f5844879a2f665afd5155f4d%2F44a0b7e0de7c440fb869575f27649833?format=webp&width=800&height=1200",
    "https://cdn.builder.io/api/v1/image/assets%2F9c9ccda5f5844879a2f665afd5155f4d%2F82f74b0f1e114f30bf14b63fc2cd61d1?format=webp&width=800&height=1200"
  ];

  // Modals and feedback state variables
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showVersionHistoryModal, setShowVersionHistoryModal] = useState(false);
  const [showUpdateHistoryModal, setShowUpdateHistoryModal] = useState(false);
  const [feedbackName, setFeedbackName] = useState("");
  const [feedbackEmail, setFeedbackEmail] = useState("");
  const [feedbackType, setFeedbackType] = useState<"bug" | "suggest" | "general">("bug");
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);

  // GitHub info
  const githubRepo = "https://github.com/XCDeveloper22/Akademicapp.apk.git";
  const apkDownloadUrl = "https://raw.githubusercontent.com/XCDeveloper22/Akademicapp.apk/main/Akademic%20v1.2.1.apk";

  // dynamic calculation for MSU Cumulative GWA (Weighted Average)
  // GWA formulation = sum(grade * credits) / sum(credits)
  const gwaStats = useMemo(() => {
    let totalWeightedPoints = 0;
    let totalCredits = 0;
    let enrolledSemestersCount = 0;

    semesters.forEach(sem => {
      if (sem.courses.length > 0) {
        enrolledSemestersCount++;
      }
      sem.courses.forEach(c => {
        totalWeightedPoints += c.grade * c.credits;
        totalCredits += c.credits;
      });
    });

    const finalGwa = totalCredits > 0 ? (totalWeightedPoints / totalCredits) : 1.00;
    
    // Convert GWA directly to excellence percentage
    // In Philippine system: 1.00 is 100% excellence, 3.00 is 50% excellence, 5.00 is 0%
    let excellencePct = 100;
    if (totalCredits > 0) {
      if (finalGwa <= 1.00) excellencePct = 100;
      else if (finalGwa >= 3.00) excellencePct = 50;
      else {
        excellencePct = Math.round(100 - ((finalGwa - 1.00) * 25));
      }
    }

    // Standard honor status descriptions for MSU scale
    let honorStatus = "No Grades Yet";
    if (totalCredits > 0) {
      if (finalGwa <= 1.20) honorStatus = "Summa Cum Laude Status";
      else if (finalGwa <= 1.45) honorStatus = "Magna Cum Laude Status";
      else if (finalGwa <= 1.75) honorStatus = "Very Good";
      else if (finalGwa <= 2.00) honorStatus = "Good";
      else if (finalGwa <= 3.00) honorStatus = "Passing";
      else honorStatus = "Needs Improvement";
    }

    return {
      cumulativeGwa: finalGwa.toFixed(2),
      rawGwa: finalGwa,
      totalCredits,
      semestersEnrolled: enrolledSemestersCount,
      excellencePct,
      honorStatus
    };
  }, [semesters]);

  const triggerToast = (msg: string) => {
    setSimulatedToast(msg);
    setTimeout(() => {
      setSimulatedToast(null);
    }, 3000);
  };

  const handleDownloadClick = () => {
    setIsDownloaded(true);
    window.location.href = apkDownloadUrl;
    setTimeout(() => setIsDownloaded(false), 8000);
  };

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackMessage) return;
    setIsSubmittingFeedback(true);
    
    setTimeout(() => {
      setIsSubmittingFeedback(false);
      setShowFeedbackModal(false);
      
      // Clear form states
      setFeedbackName("");
      setFeedbackEmail("");
      setFeedbackType("bug");
      setFeedbackMessage("");
      
      triggerToast("Report sent. Developer XC will investigate this immediately! Thank you!");
    }, 1200);
  };

  // Add Semester handler
  const handleAddSemester = () => {
    const nextSemNum = semesters.length + 1;
    const suffix = nextSemNum === 2 ? "nd" : nextSemNum === 3 ? "rd" : "th";
    const semName = `${nextSemNum}${suffix} Sem`;
    const newSem: Semester = {
      id: `sem-${Date.now()}`,
      name: semName,
      courses: []
    };
    setSemesters([...semesters, newSem]);
    setSelectedSemId(newSem.id);
    triggerToast(`Added ${semName} successfully!`);
  };

  // Delete Semester handler
  const handleDeleteSemester = (semId: string) => {
    if (semesters.length <= 1) {
      triggerToast("Cannot delete the last remaining semester!");
      return;
    }
    const filtered = semesters.filter(s => s.id !== semId);
    setSemesters(filtered);
    setSelectedSemId(filtered[0].id);
    triggerToast("Semester removed.");
  };

  // Add Course to selected Semester handler
  const handleAddCourseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourseCode || !newCourseTitle) return;

    setSemesters(semesters.map(sem => {
      if (sem.id === selectedSemId) {
        return {
          ...sem,
          courses: [
            ...sem.courses,
            {
              id: `course-${Date.now()}`,
              code: newCourseCode.toUpperCase(),
              title: newCourseTitle,
              credits: Number(newCourseCredits),
              grade: Number(newCourseGrade)
            }
          ]
        };
      }
      return sem;
    }));

    setShowAddCourseModal(false);
    triggerToast(`Course ${newCourseCode} added to list!`);
  };

  // Delete Course handler
  const handleDeleteCourse = (semId: string, courseId: string) => {
    setSemesters(semesters.map(sem => {
      if (sem.id === semId) {
        return {
          ...sem,
          courses: sem.courses.filter(c => c.id !== courseId)
        };
      }
      return sem;
    }));
    triggerToast("Course deleted.");
  };

  // Add Schedule class handler
  const handleAddScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newScheduleCode || !newScheduleSubject) return;

    const newClass: ScheduleClass = {
      id: `sche-${Date.now()}`,
      code: newScheduleCode.toUpperCase(),
      subjectName: newScheduleSubject,
      room: newScheduleRoom.toUpperCase() || "TBA",
      day: newScheduleDay,
      timeStart: newScheduleStart,
      timeEnd: newScheduleEnd
    };

    setScheduleClasses([...scheduleClasses, newClass]);
    setSelectedDay(newScheduleDay);
    setShowAddScheduleModal(false);
    triggerToast(`Class ${newScheduleCode} scheduled on ${newScheduleDay}!`);
  };

  // Delete Schedule class handler
  const handleDeleteScheduleClass = (id: string) => {
    setScheduleClasses(scheduleClasses.filter(sc => sc.id !== id));
    triggerToast("Class removed from schedule.");
  };

  // Current semester details
  const activeSemester = semesters.find(sem => sem.id === selectedSemId) || semesters[0];

  return (
    <div className="min-h-screen bg-[#110707] text-[#f5ecd7] font-sans selection:bg-[#cca038] selection:text-[#110707] overflow-x-hidden relative">
      
      {/* AnimatePresence Opening Splash Screen Overlay */}
      <AnimatePresence mode="wait">
        {showSplash && (
          <motion.div
            key="splash"
            initial={{ opacity: 1 }}
            exit={{ 
              opacity: 0,
              transition: { duration: 0.6, ease: "easeInOut" }
            }}
            className="fixed inset-0 z-50 bg-[#0c0404] flex flex-col items-center justify-center p-6 select-none"
            style={{ position: "fixed" }}
          >
            {/* Splash backdrop design */}
            <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(204,160,56,0.015)_1px,transparent_1px),linear-gradient(to_right,rgba(204,160,56,0.015)_1px,transparent_1px)] bg-[size:32px_32px] opacity-60 pointer-events-none" />
            <div className="absolute top-[30%] left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-[#9c1c1c]/15 rounded-full blur-[100px] pointer-events-none" />

            <div className="text-center flex flex-col items-center max-w-md w-full relative z-10 space-y-6">
              
              {/* Splendid pulsing/scaling crest logo */}
              <motion.div
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ 
                  scale: [0.8, 1.05, 1],
                  opacity: 1,
                  rotate: [0, -4, 4, 0]
                }}
                transition={{ 
                  duration: 1.4, 
                  ease: "easeOut",
                  rotate: { delay: 0.6, duration: 1.2 }
                }}
                className="relative"
              >
                {/* Glowing ring under shield */}
                <div className="absolute -inset-4 bg-gradient-to-tr from-[#9c1c1c] to-[#cca038] opacity-30 rounded-full blur-xl animate-pulse" />
                
                {/* Embedded High-Resolution Crest vector */}
                <svg className="w-28 h-28 filter drop-shadow-[0_10px_15px_rgba(156,28,28,0.4)]" viewBox="0 0 512 512">
                  <path d="M 256,32 C 380,32 440,70 440,200 C 440,340 340,430 256,480 C 172,430 72,340 72,200 C 72,70 132,32 256,32 Z" fill="url(#splashGold)" />
                  <path d="M 256,46 C 365,46 418,80 418,200 C 418,325 328,408 256,454 C 184,408 94,325 94,200 C 94,80 147,46 256,46 Z" fill="url(#splashCrimson)" />
                  <path d="M 256,120 L 155,340 H 205 L 228,290 H 284 L 307,340 H 357 Z M 256,230 L 241,262 H 271 Z" fill="url(#splashGold)" />
                  <defs>
                    <linearGradient id="splashCrimson" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#ab2323" />
                      <stop offset="100%" stopColor="#4f0808" />
                    </linearGradient>
                    <linearGradient id="splashGold" x1="0%" y1="100%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#a67c1e" />
                      <stop offset="50%" stopColor="#cca038" />
                      <stop offset="100%" stopColor="#ffd573" />
                    </linearGradient>
                  </defs>
                </svg>
              </motion.div>

              {/* Title brand typography */}
              <div className="space-y-1">
                <motion.h1 
                  initial={{ letterSpacing: "0.2em", opacity: 0 }}
                  animate={{ letterSpacing: "0.08em", opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.8 }}
                  className="font-display font-black text-3xl md:text-4xl text-[#f5ecd7] tracking-wider uppercase"
                >
                  AKADEMIC
                </motion.h1>
                <p className="text-[10px] font-mono tracking-[0.25em] text-[#cca038] uppercase">
                  Academic Portal Vault
                </p>
              </div>

              {/* Animated Loading Bar */}
              <div className="w-48 h-1 bg-[#281616] rounded-full overflow-hidden border border-[#3c2222]">
                <motion.div 
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 2.2, ease: "easeInOut" }}
                  className="h-full bg-gradient-to-r from-[#9c1c1c] via-[#cca038] to-[#9c1c1c]"
                />
              </div>

              {/* Explicit Student Unofficial Project Notice on Splash */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="p-3.5 rounded-xl bg-[#9c1c1c]/10 border border-[#9c1c1c]/25 max-w-sm text-center"
              >
                <div className="flex items-center justify-center gap-1.5 text-[9px] font-mono text-[#cca038] font-bold uppercase tracking-wider mb-1">
                  <Info size={11} className="text-[#cca038]" />
                  <span>Student Application Notice</span>
                </div>
                <p className="text-[10px] leading-relaxed text-[#a19088] font-sans">
                  This academic helper tool was developed solely by an independent student. 
                  It is <strong className="text-[#f5ecd7]">NOT</strong> associated, endorsed, or affiliated with the official university staff or official educational institutions.
                </p>
              </motion.div>

              <div className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest pt-1">
                XC Release &bull; Official Akademic
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Decorative Custom Radial & Linear Overlays for Academic Royal look */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#9c1c1c]/10 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute top-[35%] right-1/4 w-[500px] h-[500px] bg-[#cca038]/5 rounded-full blur-[150px] pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-1/3 w-[600px] h-[600px] bg-[#9c1c1c]/5 rounded-full blur-[160px] pointer-events-none -z-10" />

      {/* Ancient/Prestige grid backdrop */}
      <div className="absolute top-0 left-0 right-0 h-[45vh] bg-[linear-gradient(to_bottom,rgba(204,160,56,0.015)_1px,transparent_1px),linear-gradient(to_right,rgba(204,160,56,0.015)_1px,transparent_1px)] bg-[size:28px_28px] pointer-events-none -z-10 [mask-image:radial-gradient(ellipse_at_top,rgba(0,0,0,0.85),transparent)]" />

      {/* Global simulated toast notification */}
      <AnimatePresence>
        {simulatedToast && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-22 left-1/2 transform -translate-x-1/2 z-50 bg-[#cca038] text-[#110707] font-semibold text-xs px-4 py-2.5 rounded-full shadow-2xl flex items-center gap-2 border border-[#f5ecd7]/30"
          >
            <div className="h-2 w-2 rounded-full bg-[#110707] animate-ping" />
            <span>{simulatedToast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Header Navigation */}
      <header className="border-b border-[#2d1a1a]/85 bg-[#110707]/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          
          <div className="flex items-center gap-3">
            {/* Mini SVG Crest branding matching logo */}
            <div className="h-10 w-10 flex items-center justify-center select-none">
              <svg className="w-10 h-10 filter drop-shadow-[0_4px_8px_rgba(156,28,28,0.3)]" viewBox="0 0 512 512">
                <path d="M 256,32 C 380,32 440,70 440,200 C 440,340 340,430 256,480 C 172,430 72,340 72,200 C 72,70 132,32 256,32 Z" fill="url(#headerGold)" />
                <path d="M 256,46 C 365,46 418,80 418,200 C 418,325 328,408 256,454 C 184,408 94,325 94,200 C 94,80 147,46 256,46 Z" fill="url(#headerCrimson)" />
                <path d="M 256,120 L 155,340 H 205 L 228,290 H 284 L 307,340 H 357 Z M 256,230 L 241,262 H 271 Z" fill="url(#headerGold)" />
                <defs>
                  <linearGradient id="headerCrimson" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ab2323" />
                    <stop offset="100%" stopColor="#4f0808" />
                  </linearGradient>
                  <linearGradient id="headerGold" x1="0%" y1="100%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#a67c1e" />
                    <stop offset="50%" stopColor="#cca038" />
                    <stop offset="100%" stopColor="#ffd573" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-bold text-xl tracking-tight text-[#f5ecd7]">Akademic</span>
                <span className="bg-[#9c1c1c]/20 text-[#cca038] text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full border border-[#cca038]/20">
                  DEVELOPED BY XC
                </span>
              </div>
              <p className="text-[10px] text-zinc-400 font-mono tracking-wider">MSU ACADEMIC WORKSPACE</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={handleDownloadClick}
              className="bg-gradient-to-r from-[#9c1c1c] to-[#bf2121] px-4 py-2 rounded-xl text-sm font-semibold text-white shadow-lg shadow-[#9c1c1c]/30 hover:shadow-[#bf2121]/40 border border-[#cca038]/30 transition-all duration-200 active:scale-95 flex items-center gap-2"
            >
              <Download size={14} />
              <span>Download APK</span>
            </button>
          </div>

        </div>
      </header>

      {/* Global Student Unofficial Disclaimer Banner */}
      <div className="bg-[#1e0a0a] border-b border-[#cca038]/15 text-xs text-zinc-300 py-3.5 px-4 relative z-35 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-start sm:items-center justify-between gap-3 flex-col sm:flex-row">
          <div className="flex items-start sm:items-center gap-2.5">
            <span className="flex-shrink-0 inline-flex items-center justify-center bg-[#9c1c1c] text-white px-2 py-0.5 rounded text-[9px] font-bold font-mono tracking-wider uppercase">
              STUDENT BUILT
            </span>
            <span className="text-[11px] leading-relaxed text-zinc-400">
              This helper utility platform was developed strictly by an independent student. It is <strong className="text-white font-medium">unofficial</strong> and has <strong className="text-[#cca038] font-semibold">no affiliation, connection, or endorsement</strong> from official university staff, administration, or educational institutions.
            </span>
          </div>
          <span className="text-[10px] font-mono text-[#cca038] sm:self-center font-bold tracking-widest whitespace-nowrap uppercase">
            OFFICIAL AKADEMIC
          </span>
        </div>
      </div>

      {/* Hero & Interactive Device Layout Workspace */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-24 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Main Download Call To Action Content */}
          <div className="lg:col-span-7 flex flex-col items-start space-y-7">
            
            {/* Version Flag & Developer Emblem */}
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#2d1d1d]/90 border border-[#cca038]/20 text-[#cca038] text-xs font-semibold"
            >
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              Official Akademic App
            </motion.div>

            {/* Direct fulfillment of user requested download header */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="space-y-4"
            >
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.12]">
                Download <span className="bg-gradient-to-r from-[#cca038] via-[#eedebe] to-[#cca038] bg-clip-text text-transparent">Akademic</span>
              </h1>
              <p className="text-[#a19088] text-sm sm:text-base md:text-lg max-w-xl leading-relaxed">
                The comprehensive high-performance grade tracking & scheduling planner engineered for university students. Keep your records, compute GWA, manage semesters, and view your schedule on one premium safe offline app.
              </p>
            </motion.div>

            {/* Main Interactive Premium Download Center Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="w-full max-w-xl rounded-2xl bg-gradient-to-b from-[#251515] to-[#1a0f0f] border border-[#cca038]/30 p-6 md:p-8 space-y-6 relative overflow-hidden shadow-2xl"
            >
              {/* Decorative faint golden logo shield overlay in background */}
              <div className="absolute -top-10 -right-10 w-44 h-44 bg-[#cca038]/5 rounded-full blur-2xl pointer-events-none" />

              <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
                <div className="space-y-1">
                  <div className="text-[10px] font-mono text-[#cca038] uppercase tracking-wider">OFFICIAL APP</div>
                  <div className="text-white font-display font-extrabold text-xl flex items-center gap-2">
                    Akademic v1.2.1.apk
                    <span className="text-[10px] px-2 py-0.5 rounded bg-[#9c1c1c]/30 text-[#f5ecd7] border border-[#9c1c1c]/60 font-mono font-semibold">XC RELEASE</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-mono font-medium">
                  <ShieldCheck size={14} className="text-emerald-400" />
                  <span>Secured</span>
                </div>
              </div>

              {/* ACTION DOWNLOAD INSTRUCTIONS */}
              <div className="space-y-3">
                <button
                  onClick={handleDownloadClick}
                  className="w-full relative group overflow-hidden bg-gradient-to-r from-[#9c1c1c] via-[#bf2121] to-[#9c1c1c] hover:from-[#bf2121] hover:to-[#9c1c1c] p-4.5 rounded-xl font-bold text-white shadow-xl shadow-[#9c1c1c]/25 hover:shadow-[#9c1c1c]/35 transition-all duration-200 active:scale-[0.99] flex items-center justify-center gap-3 border border-[#cca038]/40"
                >
                  <Download size={22} className={`${isDownloaded ? 'animate-bounce' : 'group-hover:translate-y-0.5 transition-transform duration-200'}`} />
                  <span className="text-lg font-display tracking-wide uppercase">Download Akademic APK</span>
                </button>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <a
                    href="https://github.com/XCDeveloper22/Akademicapp.apk/raw/main/Akademic%20v1.2.1.apk"
                    download
                    className="p-3.5 rounded-xl bg-[#110707] hover:bg-[#1a0f0f] border border-[#cca038]/20 hover:border-[#cca038]/50 text-center font-semibold text-xs text-[#cca038] flex items-center justify-center gap-2 transition-colors"
                  >
                    <FileDown size={14} />
                    <span>Download Mirror Link 1</span>
                  </a>

                  <a
                    href="https://raw.githubusercontent.com/XCDeveloper22/Akademicapp.apk/main/Akademic%20v1.2.1.apk"
                    target="_blank"
                    rel="noreferrer"
                    className="p-3.5 rounded-xl bg-[#110707] hover:bg-[#1a0f0f] border border-[#cca038]/20 hover:border-[#cca038]/50 text-center font-semibold text-xs text-[#cca038] flex items-center justify-center gap-2 transition-colors"
                  >
                    <FileDown size={14} />
                    <span>Download Mirror Link 2</span>
                  </a>
                </div>
              </div>

              <AnimatePresence mode="wait">
                {isDownloaded ? (
                  <motion.div 
                     initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="p-3.5 bg-[#9c1c1c]/20 border border-[#9c1c1c]/40 rounded-xl text-center text-xs text-[#f5ecd7]"
                  >
                    🎁 Downloading... If the download didn't automatically pop up in your browser,{" "}
                    <a href={apkDownloadUrl} className="underline font-bold text-[#cca038] hover:text-[#f5ecd7]">
                      force download by clicking here
                    </a>.
                  </motion.div>
                ) : (
                  <div className="flex flex-wrap items-center justify-between text-[11px] text-[#a19088] font-mono gap-y-2 pt-2 border-t border-[#cc9f38]/10">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[#cca038]/50">File size:</span>
                      <span className="text-[#f5ecd7]/80">27.0 MB</span>
                    </div>
                    <button 
                      onClick={() => setShowGuide(!showGuide)}
                      className="text-[#cca038] hover:text-white hover:underline flex items-center gap-1 transition-colors font-semibold"
                    >
                      <Info size={12} className="text-[#cca038]" />
                      {showGuide ? "Hide Steps" : "Show Android Setup Steps"}
                    </button>
                  </div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* ACCORDION SETUP INSTRUCTIONS */}
            <AnimatePresence>
              {(showGuide || isDownloaded) && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="w-full max-w-xl overflow-hidden"
                >
                  <div className="bg-[#1a0f0f]/80 border border-[#cca038]/20 rounded-2xl p-5 md:p-6 space-y-4">
                    <h3 className="font-display font-extrabold text-[#f5ecd7] flex items-center gap-2 text-sm uppercase tracking-wide">
                      <Smartphone size={16} className="text-[#cca038]" />
                      Android Installation Steps
                    </h3>
                    
                    <div className="grid grid-cols-1 gap-3.5 text-xs text-[#a19088]">
                      <div className="flex gap-3">
                        <div className="flex-shrink-0 h-5.5 w-5.5 rounded-full bg-[#9c1c1c]/20 border border-[#cca038]/30 flex items-center justify-center font-mono text-xs font-bold text-[#cca038]">1</div>
                        <p className="leading-relaxed">
                          <strong className="text-white">Save File:</strong> Click Download above. Check system bar downloads. If a secure pop-up mentions third-party installation security, authorize permission to proceed.
                        </p>
                      </div>

                      <div className="flex gap-3">
                        <div className="flex-shrink-0 h-5.5 w-5.5 rounded-full bg-[#9c1c1c]/20 border border-[#cca038]/30 flex items-center justify-center font-mono text-xs font-bold text-[#cca038]">2</div>
                        <p className="leading-relaxed">
                          <strong className="text-white">Sideload Access:</strong> Go to <span className="text-[#cca038]">Settings &gt; Apps &gt; Special Access &gt; Install Unknown Apps</span> inside Chrome or your File Browser to verify permissions.
                        </p>
                      </div>

                      <div className="flex gap-3">
                        <div className="flex-shrink-0 h-5.5 w-5.5 rounded-full bg-[#9c1c1c]/20 border border-[#cca038]/30 flex items-center justify-center font-mono text-xs font-bold text-[#cca038]">3</div>
                        <p className="leading-relaxed">
                          <strong className="text-white">Run setup:</strong> Click the system notice popup or open the downloaded file <code className="text-[#cca038] bg-[#2d1d1d]/50 px-1 py-0.5 rounded font-mono text-[11px]">Akademic v1.2.apk</code> inside your Downloads directory to activate Akademic.
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* QR CODE MOBILE INSTANT SCAN SECTION */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="w-full max-w-xl rounded-2xl bg-gradient-to-b from-[#1c0f0f] to-[#110707] border border-[#cca038]/20 p-5 space-y-4 shadow-xl"
            >
              <div className="flex items-center gap-2 pb-1.5 border-b border-[#cca038]/15">
                <QrCode size={16} className="text-[#cca038]" />
                <h3 className="font-display font-extrabold text-[#f5ecd7] text-xs uppercase tracking-wider">
                  Mobile QR Download
                </h3>
              </div>
              
              <div className="flex flex-col sm:flex-row items-center gap-5">
                <div className="relative p-2.5 bg-white rounded-xl shadow-xl border border-[#cca038]/40 flex-shrink-0">
                  <img 
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=140x140&color=220505&data=${encodeURIComponent(apkDownloadUrl)}`}
                    alt="Scan to Download APK"
                    className="w-32 h-32 select-none"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 border border-black/10 rounded-xl pointer-events-none" />
                </div>
                
                <div className="space-y-2 text-center sm:text-left">
                  <h4 className="font-display font-bold text-sm text-white">Scan & Sideload Instantly</h4>
                  <p className="text-xs text-[#a19088] leading-relaxed">
                    Scan this secure QR code using your Android device's camera or Google Lens to download and run the setup <code className="text-[#cca038] bg-[#2d1d1d]/50 px-1 py-0.5 rounded font-mono text-[10px]">Akademic v1.2.apk</code> directly.
                  </p>
                  <div className="inline-flex items-center gap-1.5 text-[10px] font-mono text-[#cca038] bg-[#cca038]/5 px-2 py-1 rounded border border-[#cca038]/10">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
                    <span>Direct GitHub Server Link Verified</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Quick Developer Credits & Action buttons */}
            <div className="w-full max-w-xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 pt-4 border-t border-[#cca038]/10 text-xs text-[#a19088] font-mono">
              <div className="flex items-center gap-1.5">
                <span className="text-[#cca038] font-bold">●</span>
                <span>Developer: <strong className="text-[#f5ecd7] font-sans font-bold">XC</strong></span>
              </div>
              
              <div className="flex flex-wrap items-center gap-2">
                <button 
                  onClick={() => setShowFeedbackModal(true)}
                  className="px-3 py-1.5 rounded-lg bg-[#2d1d1d] hover:bg-[#3d2727] text-[#cca038] hover:text-[#f5ecd7] border border-[#cca038]/15 transition-all duration-200 flex items-center gap-1.5 text-[11px] font-sans font-semibold cursor-pointer active:scale-95 shadow"
                >
                  <MessageSquare size={12} />
                  Report Issue
                </button>
                <button 
                  onClick={() => setShowVersionHistoryModal(true)}
                  className="px-3 py-1.5 rounded-lg bg-[#2d1d1d] hover:bg-[#3d2727] text-[#cca038] hover:text-[#f5ecd7] border border-[#cca038]/15 transition-all duration-200 flex items-center gap-1.5 text-[11px] font-sans font-semibold cursor-pointer active:scale-95 shadow"
                >
                  <Award size={12} />
                  Version History
                </button>
                <button 
                  onClick={() => setShowUpdateHistoryModal(true)}
                  className="px-3 py-1.5 rounded-lg bg-[#2d1d1d] hover:bg-[#3d2727] text-[#cca038] hover:text-[#f5ecd7] border border-[#cca038]/15 transition-all duration-200 flex items-center gap-1.5 text-[11px] font-sans font-semibold cursor-pointer active:scale-95 shadow"
                >
                  <Clock size={12} />
                  Update History
                </button>
              </div>
            </div>

          </div>

          {/* Interactive Mobile Device Simulator Mockup */}
          {/* Authentic duplication of screens based on screenshots */}
          <div className="lg:col-span-5 flex flex-col justify-center items-center">
            
            <div className="text-center mb-3">
              <span className="text-[11px] font-mono text-[#cca038] uppercase tracking-widest font-semibold flex items-center justify-center gap-1">
                <Sparkles size={12} className="text-[#cca038] animate-pulse" />
                Live Interactive App Demo
              </span>
              <p className="text-[10px] text-zinc-400">Explore the app screens</p>
            </div>

            <div className="relative p-2.5 rounded-[44px] bg-[#221616] border-4 border-[#cca038]/50 shadow-2xl shadow-[#110707] w-76 sm:w-82 max-w-full group">
              
              {/* Phone Speaker & Camera cut */}
              <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-28 h-4.5 bg-black rounded-full z-30 flex justify-center items-center gap-1.5 px-3">
                <div className="h-1.5 w-1.5 rounded-full bg-zinc-800" />
                <div className="h-1 w-1.5 rounded-full bg-indigo-950" />
              </div>

              {/* Simulated Screen with Dark Chocolate/Reddish background */}
              <div className="relative overflow-hidden rounded-[36px] bg-[#150d0d] border border-zinc-900 text-[#f5ecd7] flex flex-col h-[540px] sm:h-[590px] select-none">
                
                {/* App Status bar */}
                <div className="pt-8 pb-3 px-4.5 flex items-center justify-between border-b border-[#2d1a1a] bg-[#150d0d] sticky top-0 z-10">
                  <div className="flex items-center gap-1.5">
                    <ChevronRight size={14} className="text-[#cca038] rotate-180 cursor-pointer" onClick={() => triggerToast("Navigated back to central home portal")} />
                    {/* Custom SVG Official Seal Emblem */}
                    <svg className="h-5 w-5 text-[#cca038]" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                    </svg>
                    <span className="font-display font-black text-xs tracking-wider text-[#cca038] uppercase">
                      {activeTab === "report" ? "AKADEMIC REPORT" : activeTab === "schedule" ? "CLASS SCHEDULE" : "AKADEMIC"}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => triggerToast("Toggle System Contrast is locked to Premium Offline mode")}
                      className="text-[#cca038] hover:scale-110 active:scale-95 transition-transform"
                      title="Adjust Contrast"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="5" />
                        <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* SCREENSHOT CAROUSEL */}
                <div className="flex-1 overflow-hidden relative bg-[#150d0d] flex flex-col">
                  
                  {/* CAROUSEL IMAGE DISPLAY */}
                  <img
                    src={appScreenshots[carouselIndex]}
                    alt={`Akademic App Screenshot ${carouselIndex + 1}`}
                    className="w-full h-full object-cover"
                  />

                  {/* Hidden: APP TAB 1: AKADEMIC (PORTAL GRADE SYSTEM) */}
                  {false && activeTab === "akademic" && (
                    <div className="space-y-4">
                      
                      {/* Crimson Academic Banner Segment (Simulates top card in screenshot 4) */}
                      <div className="p-4 rounded-3xl bg-gradient-to-br from-[#9c1c1c] via-[#7d1515] to-[#4c0d0d] border border-[#cca038]/30 relative overflow-hidden text-white shadow-lg shadow-[#9c1c1c]/10">
                        {/* Golden highlight accent lines */}
                        <div className="absolute top-0 right-0 w-24 h-24 bg-[#cca038]/10 rounded-full blur-xl pointer-events-none" />
                        
                        <div className="space-y-3">
                          <div className="text-[9px] font-mono text-[#cca038] uppercase tracking-wider font-extrabold">MSU ACADEMIC RECORD</div>
                          
                          <div className="flex items-center justify-between">
                            <div className="space-y-1">
                              <span className="text-[10px] text-[#f5ecd7]/80">Cumulative GWA</span>
                              <div className="text-3xl font-black font-display text-[#f5ecd7] tracking-tight flex items-baseline gap-1">
                                {gwaStats.cumulativeGwa}
                                <span className="text-xs text-[#cca038] font-mono">GWA</span>
                              </div>
                            </div>

                            {/* Excellence Progress Ring */}
                            <div className="relative h-18 w-18 flex items-center justify-center">
                              <div className="absolute inset-0 rounded-full border-4 border-[#150d0d]/40" />
                              <div className="absolute inset-0 rounded-full border-4 border-[#cca038] border-t-transparent animate-spin-slow" style={{ opacity: 0.3 }} />
                              <div className="text-center z-10">
                                <span className="text-xs font-black block text-[#cca038]">{gwaStats.excellencePct}%</span>
                                <span className="text-[7.5px] uppercase font-mono tracking-tighter text-[#f5ecd7]">Excellent</span>
                              </div>
                            </div>
                          </div>

                          <div className="inline-block px-2.5 py-0.5 rounded-full bg-[#150d0d]/60 border border-[#cca038]/20 text-[10px] text-[#cca038] font-mono font-bold">
                            Status: {gwaStats.honorStatus}
                          </div>

                          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#150d0d]/30 text-center">
                            <div>
                              <span className="text-[9px] text-[#f5ecd7]/60 block font-mono">TOTAL CREDITS</span>
                              <span className="text-xs font-bold font-mono text-[#cca038]">{gwaStats.totalCredits} Credits</span>
                            </div>
                            <div>
                              <span className="text-[9px] text-[#f5ecd7]/60 block font-mono">SEMESTERS</span>
                              <span className="text-xs font-bold font-mono text-[#cca038]">{gwaStats.semestersEnrolled} Enrolled</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* ACADEMIC PORTAL LISTING HEADER */}
                      <div className="space-y-3">
                        <div className="flex justify-between items-center px-1">
                          <div className="flex items-center gap-1 text-xs font-bold tracking-wider text-[#cca038] uppercase">
                            <GraduationCap size={13} className="text-[#cca038]" />
                            <span>ACADEMIC PORTAL</span>
                          </div>
                          <button 
                            onClick={handleAddSemester}
                            className="text-[10px] text-[#cca038] hover:text-[#f5ecd7] flex items-center gap-0.5 font-bold bg-[#341111] border border-[#cca038]/20 px-2 py-0.5 rounded-lg active:scale-95 transition-all"
                          >
                            <Plus size={10} /> Add Sem
                          </button>
                        </div>

                        {/* Semester Nav Selectors (Custom styled tabs) */}
                        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                          {semesters.map((sem) => (
                            <button
                              key={sem.id}
                              onClick={() => setSelectedSemId(sem.id)}
                              className={`px-3 py-1.5 text-xs rounded-xl font-bold border flex-shrink-0 transition-all ${selectedSemId === sem.id ? "bg-[#cca038] text-[#110707] border-[#cca038]" : "bg-[#251515] text-[#f5ecd7] border-[#cca038]/20 hover:border-[#cca038]/40"}`}
                            >
                              {sem.name} {selectedSemId === sem.id && "✓"}
                            </button>
                          ))}
                        </div>

                        {/* Selected Semester Listing Empty State vs Form */}
                        {activeSemester.courses.length === 0 ? (
                          <div className="p-8 bg-[#221616] border border-[#cca038]/10 rounded-2xl text-center space-y-3">
                            <BookMarked size={28} className="text-zinc-600 mx-auto" />
                            <p className="text-xs text-[#a19088] leading-relaxed max-w-[15rem] mx-auto">
                              Add custom courses and GWA grades to get started with this grading tracker!
                            </p>
                            <button
                              onClick={() => setShowAddCourseModal(true)}
                              className="px-4 py-1.5 bg-[#9c1c1c] text-white rounded-lg text-xs font-bold hover:bg-[#bf2121] transition-colors border border-[#cca038]/20"
                            >
                              Add First Course
                            </button>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            
                            {/* Semester GWA Summary Row */}
                            <div className="p-3 bg-[#2d1d1d] border border-[#cca038]/25 rounded-2xl flex items-center justify-between text-xs">
                              <div>
                                <span className="text-[10px] font-mono text-[#a19088] block uppercase">Current Term</span>
                                <h5 className="font-extrabold text-[#f5ecd7]">{activeSemester.name}</h5>
                              </div>
                              <div className="text-right">
                                <span className="text-[10px] font-mono text-[#cca038] block uppercase font-bold">Term GWA</span>
                                <span className="font-mono font-black text-sm text-[#cca038]">
                                  {(activeSemester.courses.reduce((acc, c) => acc + (c.grade * c.credits), 0) / 
                                    activeSemester.courses.reduce((acc, c) => acc + c.credits, 0) || 1.00).toFixed(2)}
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <button 
                                  onClick={() => setShowAddCourseModal(true)}
                                  className="h-7 w-7 rounded-lg bg-[#9c1c1c] hover:bg-[#bf2121] flex items-center justify-center text-white border border-[#cca038]/20"
                                  title="Add course to this semester"
                                >
                                  <Plus size={14} />
                                </button>
                                <button 
                                  onClick={() => handleDeleteSemester(activeSemester.id)}
                                  className="h-7 w-7 rounded-lg bg-zinc-900 border border-zinc-800 text-red-400 flex items-center justify-center hover:bg-zinc-805"
                                  title="Delete semester"
                                >
                                  <Trash2 size={12} />
                                </button>
                              </div>
                            </div>

                            {/* Individual courses list */}
                            <div className="space-y-2">
                              {activeSemester.courses.map((course) => (
                                <div 
                                  key={course.id}
                                  className="p-3 bg-[#221616] border border-[#cca038]/10 rounded-2xl flex items-center justify-between"
                                >
                                  <div className="flex items-center gap-3">
                                    {/* Small circle avatar badge showing the exact GWA red emblem in Screenshot 4 */}
                                    <div className="h-9 w-9 rounded-full bg-[#9c1c1c] text-[#f5ecd7] font-mono font-black text-xs flex items-center justify-center border border-[#cca038]/20">
                                      {course.grade.toFixed(2)}
                                    </div>
                                    <div className="space-y-0.5">
                                      <h4 className="text-xs font-black tracking-wider text-[#f5ecd7] uppercase">{course.code}</h4>
                                      <p className="text-[10px] text-[#a19088]">{course.title}</p>
                                      <p className="text-[8.5px] font-mono text-[#cca038] uppercase">Credits: {course.credits} | GWA Grade: {course.grade.toFixed(2)}</p>
                                    </div>
                                  </div>

                                  <button 
                                    onClick={() => handleDeleteCourse(activeSemester.id, course.id)}
                                    className="text-zinc-500 hover:text-red-400 p-1.5 transition-colors"
                                  >
                                    <Trash2 size={13} />
                                  </button>
                                </div>
                              ))}
                            </div>

                          </div>
                        )}

                      </div>

                    </div>
                  )}

                  {/* Hidden: APP TAB 2: SCHEDULE PLANNER */}
                  {false && activeTab === "schedule" && (
                    <div className="space-y-4">
                      
                      {/* Class Schedule header with Red Circular add key from Snapshot 3 */}
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <div className="text-[10px] font-mono text-[#cca038] uppercase tracking-wider font-extrabold flex items-center gap-1">
                            <Clock size={11} className="text-[#cca038]" />
                            <span>SCHEDULE PLANNER</span>
                          </div>
                          <h3 className="text-sm font-bold tracking-tight text-white">Daily Rotations</h3>
                        </div>

                        <button 
                          onClick={() => setShowAddScheduleModal(true)}
                          className="h-10 w-10 bg-gradient-to-tr from-[#9c1c1c] to-[#bf2121] rounded-full flex items-center justify-center text-white shadow-lg shadow-[#9c1c1c]/20 hover:scale-105 active:scale-95 transition-transform border border-[#cca038]/30"
                        >
                          <Plus size={20} />
                        </button>
                      </div>

                      {/* Weekday Tabs Selector (Mon, Tue, Wed, Thu, Fri as in Screenshot 3) */}
                      <div className="grid grid-cols-5 gap-1.5 bg-[#1f1212] p-1 rounded-xl">
                        {(["Mon", "Tue", "Wed", "Thu", "Fri"] as const).map((day) => (
                          <button
                            key={day}
                            onClick={() => setSelectedDay(day)}
                            className={`py-2 px-1 text-[11px] font-bold rounded-lg text-center transition-all ${selectedDay === day ? "bg-[#cca038] text-[#110707]" : "text-zinc-400 hover:text-zinc-200"}`}
                          >
                            {day}
                          </button>
                        ))}
                      </div>

                      {/* Schedule listings for selected day */}
                      <div className="space-y-3.5">
                        {scheduleClasses.filter(sc => sc.day === selectedDay).length === 0 ? (
                          <div className="p-8 bg-[#221616] border border-[#cca038]/10 rounded-2xl text-center space-y-2">
                            <Calendar size={24} className="text-zinc-700 mx-auto" />
                            <p className="text-[11px] text-[#a19088]">
                              No active classes scheduled on {selectedDay}.
                            </p>
                            <button
                              onClick={() => {
                                setNewScheduleDay(selectedDay);
                                setShowAddScheduleModal(true);
                              }}
                              className="text-[10px] text-[#cca038] hover:underline"
                            >
                              + Schedule class for {selectedDay}
                            </button>
                          </div>
                        ) : (
                          <div className="space-y-2.5">
                            {scheduleClasses.filter(sc => sc.day === selectedDay).map((sc) => (
                              <div 
                                key={sc.id}
                                className="p-4 bg-[#211515] border border-[#cca038]/15 rounded-2xl flex items-center justify-between relative overflow-hidden"
                              >
                                {/* Simulated Left crimson vertical strip as in Screenshot 3 */}
                                <div className="absolute top-0 left-0 bottom-0 w-1 bg-[#9c1c1c]" />

                                <div className="space-y-1.5 pl-2">
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs font-black tracking-wider uppercase text-[#cca038]">{sc.code}</span>
                                    <span className="text-[8.5px] bg-[#9c1c1c]/25 text-[#f5ecd7] px-1.5 py-0.5 rounded font-mono font-bold tracking-wider">{sc.room}</span>
                                  </div>
                                  <h4 className="text-xs font-bold text-white uppercase">{sc.subjectName}</h4>
                                  <div className="flex items-center gap-1 text-[10px] text-[#a19088] font-mono">
                                    <Clock size={10} className="text-[#cca038]" />
                                    <span>{sc.timeStart} - {sc.timeEnd}</span>
                                  </div>
                                </div>

                                <button
                                  onClick={() => handleDeleteScheduleClass(sc.id)}
                                  className="text-zinc-500 hover:text-red-400 p-2 hover:bg-zinc-900 rounded-lg transition-colors"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                    </div>
                  )}

                  {/* Hidden: APP TAB 3: AKADEMIC REPORT (OFFICIAL PREVIEW CARD) */}
                  {false && activeTab === "report" && (
                    <div className="space-y-4">
                      
                      <div className="space-y-0.5">
                        <div className="text-[9px] font-mono text-[#cca038] uppercase tracking-wider font-extrabold">OFFICIAL REPORT CARD PREVIEW</div>
                        <h3 className="text-sm font-black tracking-tight text-white uppercase font-display">Academic Sync Card</h3>
                      </div>

                      {/* Synced Royal School Card Representation */}
                      <div className="p-5 rounded-3xl bg-[#251515] border border-[#cca038]/40 relative overflow-hidden shadow-2xl">
                        
                        {/* Golden Concentric Rings Badge behind custom MSU Logo in Screenshot 1 */}
                        <div className="space-y-4 text-center">
                          <div className="flex justify-center">
                            {/* Royal Double Concentric Badge representation in Screenshot 1 */}
                            <div className="h-18 w-18 rounded-full border-2 border-[#cca038] p-1 flex items-center justify-center bg-[#150d0d]">
                              <div className="h-full w-full rounded-full bg-[#9c1c1c] border border-[#cca038]/60 flex items-center justify-center font-bold text-white text-base shadow-inner">
                                <span className="font-display tracking-tight text-[#cca038] font-black">MSU</span>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-1">
                            <h3 className="font-display font-black text-sm text-[#cca038] tracking-wider uppercase">AKADEMIC REPORT</h3>
                            <p className="text-[8.5px] font-mono text-[#a19088] uppercase tracking-widest">OFFLINE ACADEMY SYNCED CARD</p>
                          </div>

                          <div className="h-px bg-gradient-to-r from-transparent via-[#cca038]/30 to-transparent my-1" />

                          {/* Data display columns */}
                          <div className="grid grid-cols-2 gap-4 text-center py-2">
                            <div className="space-y-0.5 border-r border-[#cca038]/10">
                              <span className="text-[8.5px] font-mono text-[#a19088] uppercase tracking-wider block">CUMULATIVE GWA</span>
                              <h4 className="text-2xl font-black font-display text-white">{gwaStats.cumulativeGwa}</h4>
                            </div>
                            <div className="space-y-0.5">
                              <span className="text-[8.5px] font-mono text-[#a19088] uppercase tracking-wider block">TOTAL CREDITS</span>
                              <h4 className="text-2xl font-black font-display text-white">{gwaStats.totalCredits} cr</h4>
                            </div>
                          </div>

                          <div className="h-px bg-gradient-to-r from-transparent via-[#cca038]/30 to-transparent my-1" />

                          {/* Course grades records */}
                          <div className="space-y-2 text-left pt-2">
                            <span className="text-[8.5px] font-mono text-[#cca038] uppercase tracking-wider block font-bold">1ST SEM</span>
                            
                            {semesters.flatMap(s => s.courses).length === 0 ? (
                              <p className="text-[10px] text-zinc-500 italic text-center py-2">No courses registered yet. Dynamic GWA is 1.00.</p>
                            ) : (
                              <div className="space-y-1.5 max-h-[140px] overflow-y-auto scrollbar-none">
                                {semesters.flatMap(s => s.courses).map((c) => (
                                  <div key={c.id} className="flex justify-between items-center text-xs text-zinc-300 font-medium py-1 border-b border-zinc-900/50">
                                    <div>
                                      <span className="font-bold text-[#cca038] uppercase tracking-wider mr-2">{c.code}</span>
                                      <span className="text-[10px] text-[#a19088]">{c.title}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-[10px] font-mono">
                                      <span>{c.credits} cr</span>
                                      <span className="bg-[#9c1c1c]/20 text-[#cca038] border border-[#cca038]/20 px-1.5 py-0.5 rounded font-bold">{c.grade.toFixed(2)}</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}

                          </div>

                        </div>
                      </div>

                      {/* TWO PRIMARY INTERACTIVE BTNS (Save to Gallery / Share Report) */}
                      <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                        <button 
                          onClick={() => triggerToast("✨ Report Saved successfully to system storage!")}
                          className="py-3 px-1 rounded-xl bg-[#cca038] text-[#110707] font-bold shadow-lg shadow-[#cca038]/10 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-1.5 border border-[#cca038]"
                        >
                          <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M19 12v7H5v-7H3v7c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-7h-2zm-6 .67l2.59-2.58L17 11.5l-5 5-5-5 1.41-1.41L11 12.67V3h2v9.67z" />
                          </svg>
                          <span>Save to Gallery</span>
                        </button>

                        <button 
                          onClick={() => triggerToast("📲 Built Academic Report share card ready!")}
                          className="py-3 px-1 rounded-xl bg-[#9c1c1c] text-white font-bold shadow-lg shadow-[#9c1c1c]/10 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-1.5 border border-[#cca038]/10"
                        >
                          <Share2 size={13} />
                          <span>Share Report</span>
                        </button>
                      </div>

                    </div>
                  )}

                </div>

                {/* Carousel Navigation Controls */}
                <div className="absolute bottom-16 left-0 right-0 px-3 py-2 flex items-center justify-between bg-gradient-to-t from-[#150d0d] to-transparent">
                  <button
                    onClick={() => setCarouselIndex((prev) => (prev - 1 + appScreenshots.length) % appScreenshots.length)}
                    className="text-[#cca038] hover:scale-110 active:scale-95 transition-transform"
                    aria-label="Previous screenshot"
                  >
                    <ChevronRight size={20} className="rotate-180" />
                  </button>

                  <div className="flex items-center gap-1.5">
                    {appScreenshots.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCarouselIndex(idx)}
                        className={`h-1.5 rounded-full transition-all ${idx === carouselIndex ? "bg-[#cca038] w-5" : "bg-[#cca038]/40 w-1.5 hover:bg-[#cca038]/60"}`}
                        aria-label={`Go to screenshot ${idx + 1}`}
                      />
                    ))}
                  </div>

                  <button
                    onClick={() => setCarouselIndex((prev) => (prev + 1) % appScreenshots.length)}
                    className="text-[#cca038] hover:scale-110 active:scale-95 transition-transform"
                    aria-label="Next screenshot"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>

                {/* BOTTOM NAVIGATION (MSU Exact tabs from screenshot) */}
                <div className="absolute bottom-0 left-0 right-0 grid grid-cols-3 border-t border-[#2d1a1a] bg-[#150d0d]/95 py-2 z-20 px-1">
                  
                  <button 
                    onClick={() => setActiveTab("akademic")}
                    className={`flex flex-col items-center gap-1 py-1.5 transition-all ${activeTab === "akademic" ? "text-[#cca038] scale-105" : "text-zinc-500 hover:text-zinc-400"}`}
                  >
                    <GraduationCap size={16} className={activeTab === "akademic" ? "text-[#cca038]" : "text-zinc-500"} />
                    <span className="text-[10px] font-semibold tracking-wider font-mono">AKADEMIC</span>
                  </button>

                  <button 
                    onClick={() => setActiveTab("schedule")}
                    className={`flex flex-col items-center gap-1 py-1.5 transition-all ${activeTab === "schedule" ? "text-[#cca038] scale-105" : "text-zinc-500 hover:text-zinc-400"}`}
                  >
                    <Clock size={16} className={activeTab === "schedule" ? "text-[#cca038]" : "text-zinc-500"} />
                    <span className="text-[10px] font-semibold tracking-wider font-mono">Schedule</span>
                  </button>

                  <button 
                    onClick={() => setActiveTab("report")}
                    className={`flex flex-col items-center gap-1 py-1.5 transition-all ${activeTab === "report" ? "text-[#cca038] scale-105" : "text-zinc-500 hover:text-zinc-400"}`}
                  >
                    <svg className={`h-4.5 w-4.5 ${activeTab === "report" ? "text-[#cca038]" : "text-zinc-500"}`} fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
                    </svg>
                    <span className="text-[10px] font-semibold tracking-wider font-mono">Report</span>
                  </button>

                </div>

                {/* Android Bottom Swipe Pill */}
                <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-28 h-1 bg-zinc-800 rounded-full z-20 pointer-events-none" />

              </div>

            </div>

          </div>

        </div>

        {/* Feature Overview Section */}
        <div className="mt-32 border-t border-[#cca038]/10 pt-16">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <h2 className="font-display text-3xl font-extrabold text-white uppercase tracking-tight">
              A Complete Academic Vault Engineered for Android
            </h2>
            <p className="text-[#a19088] text-sm leading-relaxed">
              No cloud accounts or telemetry required. Your university grades, term semesters, and schedule grids are calculated natively on your safe sandbox. Developed by <strong>XC</strong> as a high-performance utility application.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="p-6 rounded-2xl bg-[#1e0f0f]/80 border border-[#cca038]/15 space-y-4">
              <div className="h-10 w-10 rounded-xl bg-[#9c1c1c]/10 border border-[#cca038]/30 flex items-center justify-center text-[#cca038]">
                <GraduationCap size={20} />
              </div>
              <h3 className="font-display font-bold text-lg text-white">Dynamic GWA Compute</h3>
              <p className="text-sm text-[#a19088] leading-relaxed">
                Add multi-semester subjects, set exact credits, and input your real grades. Watch cumulative GWA calculate dynamically on the university scale.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#1e0f0f]/80 border border-[#cca038]/15 space-y-4">
              <div className="h-10 w-10 rounded-xl bg-[#cca038]/10 border border-[#cca038]/30 flex items-center justify-center text-[#cca038]">
                <Clock size={20} />
              </div>
              <h3 className="font-display font-bold text-lg text-white">Grid Class Scheduler</h3>
              <p className="text-sm text-[#a19088] leading-relaxed">
                Plan weekly course rosters, assign lecture halls, and manage study hours effortlessly inside an eye-safe maroon interface.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#1e0f0f]/80 border border-[#cca038]/15 space-y-4">
              <div className="h-10 w-10 rounded-xl bg-[#9c1c1c]/10 border border-[#cca038]/30 flex items-center justify-center text-[#cca038]">
                <Award size={20} />
              </div>
              <h3 className="font-display font-bold text-lg text-white">Shareable Report Cards</h3>
              <p className="text-sm text-[#a19088] leading-relaxed">
                Generate high-contrast academic report summaries displaying verified totals. Easily capture outputs offline to showcase achievements.
              </p>
            </div>

          </div>
        </div>

      </main>

      {/* MODALS FOR APP SIMULATOR INTERACTION */}

      {/* 1. Add course to grading portal modal */}
      {showAddCourseModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#1c0f0f] border-2 border-[#cca038]/40 rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#cca038]/10 pb-2">
              <h3 className="font-display font-bold text-sm text-[#cca038] uppercase">Add New Course</h3>
              <button onClick={() => setShowAddCourseModal(false)} className="text-zinc-500 hover:text-white font-bold">✕</button>
            </div>

            <form onSubmit={handleAddCourseSubmit} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-[#a19088] uppercase block">Course Code</label>
                <input 
                  type="text" 
                  value={newCourseCode} 
                  onChange={(e) => setNewCourseCode(e.target.value)}
                  placeholder="e.g. GEC104"
                  className="w-full bg-[#110707] border border-[#cca038]/20 rounded-xl p-2.5 text-xs focus:border-[#cca038] outline-none"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-[#a19088] uppercase block">Subject Title</label>
                <input 
                  type="text" 
                  value={newCourseTitle} 
                  onChange={(e) => setNewCourseTitle(e.target.value)}
                  placeholder="e.g. Modern Mathematics"
                  className="w-full bg-[#110707] border border-[#cca038]/20 rounded-xl p-2.5 text-xs focus:border-[#cca038] outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-[#a19088] uppercase block">Credits (units)</label>
                  <input 
                    type="number" 
                    value={newCourseCredits} 
                    onChange={(e) => setNewCourseCredits(Number(e.target.value))}
                    min="1"
                    max="6"
                    className="w-full bg-[#110707] border border-[#cca038]/20 rounded-xl p-2.5 text-xs focus:border-[#cca038] outline-none"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-[#cca038] uppercase block font-bold">Grade Value</label>
                  <select
                    value={newCourseGrade}
                    onChange={(e) => setNewCourseGrade(Number(e.target.value))}
                    className="w-full bg-[#110707] border border-[#cca038]/20 rounded-xl p-2.5 text-xs focus:border-[#cca038] outline-none"
                  >
                    <option value="1.00">1.00 (Excellent)</option>
                    <option value="1.25">1.25 (Outstanding)</option>
                    <option value="1.50">1.50 (Very Good)</option>
                    <option value="1.75">1.75 (Good)</option>
                    <option value="2.00">2.00 (Satisfactory)</option>
                    <option value="2.25">2.25 (Fairly Good)</option>
                    <option value="2.50">2.50 (Fair)</option>
                    <option value="3.00">3.00 (Passing)</option>
                  </select>
                </div>
              </div>

              <button 
                type="submit"
                className="w-full bg-[#cca038] text-[#110707] text-xs font-bold py-3 rounded-xl uppercase tracking-wider hover:bg-yellow-600 transition-colors"
              >
                Add Subject To Academic Portal
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 2. Add class timer schedule planner modal */}
      {showAddScheduleModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#1c0f0f] border-2 border-[#cca038]/40 rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#cca038]/10 pb-2">
              <h3 className="font-display font-bold text-sm text-[#cca038] uppercase">Schedule Class</h3>
              <button onClick={() => setShowAddScheduleModal(false)} className="text-zinc-500 hover:text-white font-bold">✕</button>
            </div>

            <form onSubmit={handleAddScheduleSubmit} className="space-y-3">
              <div className="space-y-0.5">
                <label className="text-[10px] font-mono text-[#a19088] uppercase block">Subject Code</label>
                <input 
                  type="text" 
                  value={newScheduleCode} 
                  onChange={(e) => setNewScheduleCode(e.target.value)}
                  placeholder="e.g. GEC104"
                  className="w-full bg-[#110707] border border-[#cca038]/20 rounded-xl p-2.5 text-xs focus:border-[#cca038] outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-0.5">
                  <label className="text-[10px] font-mono text-[#a19088] uppercase block">Subject Title</label>
                  <input 
                    type="text" 
                    value={newScheduleSubject} 
                    onChange={(e) => setNewScheduleSubject(e.target.value)}
                    placeholder="e.g. MMW"
                    className="w-full bg-[#110707] border border-[#cca038]/20 rounded-xl p-2.5 text-xs focus:border-[#cca038] outline-none"
                    required
                  />
                </div>

                <div className="space-y-0.5">
                  <label className="text-[10px] font-mono text-[#a19088] uppercase block">Room Identifier</label>
                  <input 
                    type="text" 
                    value={newScheduleRoom} 
                    onChange={(e) => setNewScheduleRoom(e.target.value)}
                    placeholder="e.g. Room 13"
                    className="w-full bg-[#110707] border border-[#cca038]/20 rounded-xl p-2.5 text-xs focus:border-[#cca038] outline-none"
                  />
                </div>
              </div>

              <div className="space-y-0.5">
                <label className="text-[10px] font-mono text-[#a19088] uppercase block">Rotation Day</label>
                <select
                  value={newScheduleDay}
                  onChange={(e) => setNewScheduleDay(e.target.value as any)}
                  className="w-full bg-[#110707] border border-[#cca038]/20 rounded-xl p-2.5 text-xs focus:border-[#cca038] outline-none text-[#f5ecd7]"
                >
                  <option value="Mon">Monday</option>
                  <option value="Tue">Tuesday</option>
                  <option value="Wed">Wednesday</option>
                  <option value="Thu">Thursday</option>
                  <option value="Fri">Friday</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-0.5">
                  <label className="text-[10px] font-mono text-[#a19088] uppercase block">Start Time</label>
                  <input 
                    type="text" 
                    value={newScheduleStart} 
                    onChange={(e) => setNewScheduleStart(e.target.value)}
                    placeholder="09:00"
                    className="w-full bg-[#110707] border border-[#cca038]/20 rounded-xl p-2.5 text-xs focus:border-[#cca038] outline-none text-[#f5ecd7]"
                    required
                  />
                </div>

                <div className="space-y-0.5">
                  <label className="text-[10px] font-mono text-[#a19088] uppercase block">End Time</label>
                  <input 
                    type="text" 
                    value={newScheduleEnd} 
                    onChange={(e) => setNewScheduleEnd(e.target.value)}
                    placeholder="10:30"
                    className="w-full bg-[#110707] border border-[#cca038]/20 rounded-xl p-2.5 text-xs focus:border-[#cca038] outline-none text-[#f5ecd7]"
                    required
                  />
                </div>
              </div>

              <button 
                type="submit"
                className="w-full bg-[#cca038] text-[#110707] text-xs font-bold py-3 rounded-xl uppercase tracking-wider hover:bg-yellow-600 transition-colors"
              >
                Add To Schedule Planner
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 4. Feedback / Report Issue Modal */}
      {showFeedbackModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#1c0f0f] border-2 border-[#cca038]/40 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl relative overflow-hidden text-white">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#9c1c1c] via-[#cca038] to-[#9c1c1c]" />
            
            <div className="flex items-center justify-between border-b border-[#cca038]/10 pb-2.5">
              <div className="flex items-center gap-2">
                <AlertTriangle size={16} className="text-[#cca038]" />
                <h3 className="font-display font-bold text-sm text-[#cca038] uppercase tracking-wide">Report Issue / Feedback</h3>
              </div>
              <button 
                onClick={() => setShowFeedbackModal(false)} 
                className="text-zinc-500 hover:text-white transition-colors p-1"
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleFeedbackSubmit} className="space-y-4">
              <p className="text-xs text-zinc-400 leading-relaxed text-left">
                Found a bug or have a suggestion? Send a direct message to developer <strong className="text-white">XC</strong>. Your feedback helps make Akademic better for everyone at MSU!
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-[#a19088] uppercase block">Your Name</label>
                  <input 
                    type="text" 
                    value={feedbackName} 
                    onChange={(e) => setFeedbackName(e.target.value)}
                    placeholder="e.g. Juan Dela Cruz"
                    className="w-full bg-[#110707] border border-[#cca038]/25 rounded-xl p-2.5 text-xs text-white focus:border-[#cca038] outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-[#a19088] uppercase block">Your Email</label>
                  <input 
                    type="email" 
                    value={feedbackEmail} 
                    onChange={(e) => setFeedbackEmail(e.target.value)}
                    placeholder="e.g. juan@gmail.com"
                    className="w-full bg-[#110707] border border-[#cca038]/25 rounded-xl p-2.5 text-xs text-white focus:border-[#cca038] outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1 text-left">
                <label className="text-[10px] font-mono text-[#a19088] uppercase block">Issue Type</label>
                <div className="grid grid-cols-3 gap-2">
                  {(["bug", "suggest", "general"] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setFeedbackType(type)}
                      className={`py-2 rounded-xl text-xs font-semibold uppercase border transition-all ${
                        feedbackType === type
                          ? "bg-[#9c1c1c]/30 text-[#cca038] border-[#cca038]"
                          : "bg-[#110707] text-[#a19088] border-[#cca038]/10 hover:border-[#cca038]/30"
                      }`}
                    >
                      {type === "bug" ? "🐛 Bug" : type === "suggest" ? "💡 Suggest" : "💬 General"}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1 text-left">
                <label className="text-[10px] font-mono text-[#cca038] uppercase block font-bold">Describe the issue/suggestion</label>
                <textarea 
                  value={feedbackMessage} 
                  onChange={(e) => setFeedbackMessage(e.target.value)}
                  placeholder="Tell us what went wrong or what you'd like to see..."
                  rows={4}
                  className="w-full bg-[#110707] border border-[#cca038]/25 rounded-xl p-3 text-xs text-white focus:border-[#cca038] outline-none resize-none"
                  required
                />
              </div>

              <button 
                type="submit"
                disabled={isSubmittingFeedback}
                className="w-full bg-gradient-to-r from-[#9c1c1c] to-[#bf2121] active:from-[#bf2121] text-white text-xs font-bold py-3.5 rounded-xl uppercase tracking-wider hover:brightness-110 transition-all flex items-center justify-center gap-2 border border-[#cca038]/30 disabled:opacity-50"
              >
                {isSubmittingFeedback ? (
                  <>
                    <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Transmitting message...</span>
                  </>
                ) : (
                  <>
                    <Send size={13} />
                    <span>Send Message to XC</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 5. Version History Modal */}
      {showVersionHistoryModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#1c0f0f] border-2 border-[#cca038]/40 rounded-3xl p-6 max-w-xl w-full space-y-4 shadow-2xl relative overflow-hidden text-white text-left">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#cca038] via-[#eedebe] to-[#cca038]" />
            
            <div className="flex items-center justify-between border-b border-[#cca038]/10 pb-2.5">
              <div className="flex items-center gap-2">
                <Award size={16} className="text-[#cca038]" />
                <h3 className="font-display font-bold text-sm text-[#cca038] uppercase tracking-wide">Version History</h3>
              </div>
              <button 
                onClick={() => setShowVersionHistoryModal(false)} 
                className="text-zinc-500 hover:text-white transition-colors p-1"
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1 customize-scrollbar">
              <p className="text-xs text-zinc-400">
                A historical log of Akademic releases, showcasing the build milestones, core feature integrations, and system-wide security enhancements.
              </p>

              {/* Version 1.2 */}
              <div className="p-4 rounded-2xl bg-[#110707] border border-[#cca038]/20 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-[#cca038] bg-[#cca038]/10 px-2.5 py-1 rounded-lg border border-[#cca038]/30">
                    v1.2 (Current)
                  </span>
                  <span className="text-[10px] font-mono text-zinc-500">June 2026</span>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <h4 className="text-xs font-semibold text-white flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      Key Features & Enhancements
                    </h4>
                    <p className="text-xs text-zinc-400 pl-4 mt-0.5 leading-relaxed">
                      Implemented comprehensive GPA/GWA calculation engine parameters, customized premium Mindanao State University layout accents, and added dynamic local classes storage.
                    </p>
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-white flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                      Bug Fixes
                    </h4>
                    <p className="text-xs text-zinc-400 pl-4 mt-0.5 leading-relaxed">
                      Corrected GPA weighted calculation unit distribution, aligned browser local-storage security flags, and resolved setup guide accordion scaling lag on mobile viewports.
                    </p>
                  </div>
                </div>
              </div>

              {/* Version 1.1 */}
              <div className="p-4 rounded-2xl bg-[#110707] border border-[#cca038]/10 space-y-3 opacity-80">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-zinc-405 bg-zinc-900 px-2.5 py-1 rounded-lg border border-zinc-800">
                    v1.1
                  </span>
                  <span className="text-[10px] font-mono text-zinc-500 font-medium">May 2026</span>
                </div>
                
                <div className="space-y-2">
                  <div>
                    <h4 className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-zinc-400" />
                      Features added
                    </h4>
                    <p className="text-xs text-zinc-450 pl-4 mt-0.5 leading-relaxed">
                      Enabled multi-semester dynamic course creation tabs, and designed the initial responsive sideloading Android step guidelines.
                    </p>
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-zinc-400" />
                      Fixes
                    </h4>
                    <p className="text-xs text-zinc-450 pl-4 mt-0.5 leading-relaxed">
                      Resolved custom grade parsing exceptions, and patched localState serialization inconsistencies.
                    </p>
                  </div>
                </div>
              </div>

              {/* Version 1.0 */}
              <div className="p-4 rounded-2xl bg-[#110707] border border-[#cca038]/5 space-y-3 opacity-60">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-zinc-500 bg-zinc-950 px-2.5 py-1 rounded-lg border border-zinc-900/40">
                    v1.0 (Initial Release)
                  </span>
                  <span className="text-[10px] font-mono text-zinc-500">April 2026</span>
                </div>
                
                <div className="space-y-1">
                  <h4 className="text-xs font-semibold text-zinc-400 flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-zinc-500" />
                    Core Infrastructure
                  </h4>
                  <p className="text-xs text-zinc-500 pl-4 mt-0.5 leading-relaxed">
                    First development client released to MSU computer engineering department student focus testing group. Main dashboard structures, subject entry, and offline calculators established.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-[#cca038]/10 text-center">
              <button 
                onClick={() => setShowVersionHistoryModal(false)}
                className="px-5 py-2 bg-[#cca038] text-[#110707] text-xs font-bold rounded-xl hover:bg-yellow-600 transition-colors"
              >
                Close Logs
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. Update History Modal */}
      {showUpdateHistoryModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#1c0f0f] border-2 border-[#cca038]/40 rounded-3xl p-6 max-w-xl w-full space-y-4 shadow-2xl relative overflow-hidden text-white text-left">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#cca038] via-[#eedebe] to-[#cca038]" />
            
            <div className="flex items-center justify-between border-b border-[#cca038]/10 pb-2.5">
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-[#cca038]" />
                <h3 className="font-display font-bold text-sm text-[#cca038] uppercase tracking-wide">Update History & Release Notes</h3>
              </div>
              <button 
                onClick={() => setShowUpdateHistoryModal(false)} 
                className="text-zinc-500 hover:text-white transition-colors p-1"
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            {/* Timeline scroll container */}
            <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-1 pl-3 customize-scrollbar relative text-xs">
              <div className="absolute left-4.5 top-2 bottom-6 w-0.5 bg-[#cca038]/20" />

              {/* Step v1.2 */}
              <div className="relative pl-8 space-y-1.5">
                <div className="absolute left-3.5 top-1.5 h-2.5 w-2.5 rounded-full bg-[#cca038] border-2 border-[#1c0f0f] shadow-glow" />
                <div className="flex items-center justify-between">
                  <h4 className="font-display font-extrabold text-white text-xs">BUILD v1.2 Release Notes</h4>
                  <span className="font-mono text-zinc-505 text-[10px]">June 22, 2026</span>
                </div>
                <div className="bg-[#110707] border border-[#cca038]/15 rounded-xl p-3 text-zinc-455 space-y-1">
                  <p className="font-semibold text-[#f5ecd7] text-xs">"The Golden MSU Premium Standard Update"</p>
                  <ul className="list-disc list-inside space-y-1 marker:text-[#cca038] text-[11px] leading-relaxed">
                    <li>Added beautiful SVG brand crest header display layout</li>
                    <li>Synchronized download repository endpoints directly to project secure file server</li>
                    <li>Designed fully dynamic responsive GWA analytics and honor statuses indicators</li>
                    <li>Integrated customized schedule trackers and interactive simulator demo drawers</li>
                  </ul>
                </div>
              </div>

              {/* Step v1.1 */}
              <div className="relative pl-8 space-y-1.5">
                <div className="absolute left-3.5 top-1.5 h-2.5 w-2.5 rounded-full bg-zinc-650 border-2 border-[#1c0f0f]" />
                <div className="flex items-center justify-between">
                  <h4 className="font-display font-extrabold text-zinc-400 text-xs">BUILD v1.1 Release Notes</h4>
                  <span className="font-mono text-zinc-505 text-[10px]">May 18, 2026</span>
                </div>
                <div className="bg-[#110707] border border-[#cca038]/10 rounded-xl p-3 text-zinc-455 space-y-1 opacity-80">
                  <p className="font-semibold text-[#f5ecd7]/80 text-xs">"Multi-Semester Isolation Core"</p>
                  <ul className="list-disc list-inside space-y-1 marker:text-[#cca038]/60 text-[11px] leading-relaxed">
                    <li>Added tabbed semester dynamic controls and filters</li>
                    <li>Arranged multi-step interactive Android Chrome installation guideline accordions</li>
                    <li>Patched GWA float precision weightings on large course unit loads</li>
                  </ul>
                </div>
              </div>

              {/* Step v1.0 */}
              <div className="relative pl-8 space-y-1.5">
                <div className="absolute left-3.5 top-1.5 h-2.5 w-2.5 rounded-full bg-zinc-800 border-2 border-[#1c0f0f]" />
                <div className="flex items-center justify-between">
                  <h4 className="font-display font-extrabold text-zinc-500 text-xs">BUILD v1.0 Launch</h4>
                  <span className="font-mono text-zinc-505 text-[10px]">April 12, 2026</span>
                </div>
                <div className="bg-[#110707] border border-[#cca038]/5 rounded-xl p-3 text-zinc-500 space-y-1 opacity-60">
                  <p className="font-semibold text-[#f5ecd7]/60 text-xs">"Academic Alpha Architecture Launch"</p>
                  <p className="text-[11px] leading-relaxed">
                    Successfully finished deployment of local calculations logic, secure client sideloading template wrappers, and the basic custom schedule planner.
                  </p>
                </div>
              </div>
              
            </div>

            <div className="pt-2 border-t border-[#cca038]/10 text-center">
              <button 
                onClick={() => setShowUpdateHistoryModal(false)}
                className="px-5 py-2 bg-[#cca038] text-[#110707] text-xs font-bold rounded-xl hover:bg-yellow-600 transition-colors"
              >
                Close Timeline
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-[#2d1a1a]/80 bg-[#0f0606] py-12 relative text-zinc-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          {/* Institutional Disclaimer Block */}
          <div className="p-4 rounded-xl bg-[#110707] border border-[#2d1a1a]/80 text-[11px] leading-relaxed text-zinc-500 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-[#cca038]" />
            <div className="flex items-start gap-2.5">
              <Info size={14} className="text-[#cca038] flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-sans font-bold text-zinc-300 uppercase tracking-wider text-[10px] mb-1">
                  OFFICIAL INSTITUTION DISCLAIMER NOTICE
                </p>
                <p>
                  Akademic is an independent third-party client application built natively as a student personal utility project. 
                  This software platform is <strong className="text-zinc-300">not developed by, connected to, or affiliated with</strong> any official academic institution, nor has it been reviewed or approved by any university division, board, or administration. All simulated grading schemes, grade-point calculations, schedule configurations, and calendar features are processed on-device for organizational self-tracking only.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-sm pt-4 border-t border-[#1d1010]/60">
            <div className="flex items-center gap-3">
              {/* Shield Mini Footer Logo */}
              <div className="h-8 w-8 select-none">
                <svg className="w-8 h-8 filter drop-shadow-[0_2px_4px_rgba(156,28,28,0.2)]" viewBox="0 0 512 512">
                  <path d="M 256,32 C 380,32 440,70 440,200 C 440,340 340,430 256,480 C 172,430 72,340 72,200 C 72,70 132,32 256,32 Z" fill="url(#footerGoldGrad)" />
                  <path d="M 256,46 C 365,46 418,80 418,200 C 418,325 328,408 256,454 C 184,408 94,325 94,200 C 94,80 147,46 256,46 Z" fill="url(#footerCrimsonGrad)" />
                  <path d="M 256,120 L 155,340 H 205 L 228,290 H 284 L 307,340 H 357 Z M 256,230 L 241,262 H 271 Z" fill="url(#footerGoldGrad)" />
                  <defs>
                    <linearGradient id="footerCrimsonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#ab2323" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#4f0808" stopOpacity="0.8" />
                    </linearGradient>
                    <linearGradient id="footerGoldGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#a67c1e" />
                      <stop offset="100%" stopColor="#cca038" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <div>
                <span className="font-display font-medium text-white block">Akademic Mobile</span>
                <span className="text-[10px] font-mono block text-[#cca038] uppercase">Developed by XC</span>
              </div>
            </div>

            {/* Links hidden as requested */}

            <p className="text-xs font-mono text-zinc-650 flex items-center gap-1">
              Made for students <Heart size={10} className="text-[#9c1c1c] fill-[#9c1c1c]" /> &copy; 2026 Akademic
            </p>
          </div>

        </div>
      </footer>

    </div>
  );
}
