import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Sparkles, CheckCircle2, XCircle, Clock, Award, Zap,
  Flame, HelpCircle, ChevronRight, ChevronLeft, RotateCcw,
  BookOpen, Check, ShieldCheck, Share2, Trophy, Grid, Layers,
  Compass, ExternalLink
} from 'lucide-react';
import useStore from '../store/useStore';
import { playClickSound, playCorrectSound, playWrongSound, playLevelUpSound } from '../utils/soundFX';
import { CAREER_NODES } from '../data/careers';
import { generatePhaseAssessment, generateReadinessAssessment } from '../utils/assessmentGenerator';
import confetti from 'canvas-confetti';
import toast from 'react-hot-toast';

export default function QuizAssessmentView() {
  const {
    activeAssessment, closeQuizAssessment, savePhaseAssessment,
    saveReadinessAssessment, soundEnabled, user, selectedCareer,
    getAllCareers, setActiveAssessment
  } = useStore();

  const allCareers = getAllCareers();
  const career = selectedCareer || allCareers[0];

  // If no assessment in store, fallback to phase 1 assessment for current career
  const assessment = activeAssessment || generatePhaseAssessment(career, 0, career?.roadmapPhases?.[0] || { title: 'Foundations' });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({}); // { [questionIndex]: optionIndex }
  const [eliminatedOptions, setEliminatedOptions] = useState({}); // { [questionIndex]: [opt1, opt2] }
  const [revealedHints, setRevealedHints] = useState({}); // { [questionIndex]: boolean }
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [showQuestionGrid, setShowQuestionGrid] = useState(false);
  const [reviewMode, setReviewMode] = useState(false);
  const [lifelines, setLifelines] = useState({ fiftyFifty: 2, aiHint: 3 });
  const [timeLeft, setTimeLeft] = useState((assessment?.timeLimitMinutes || 30) * 60);

  // Timer countdown
  useEffect(() => {
    if (isFinished) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleFinish();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isFinished]);

  // Keyboard navigation (1-4 for options, arrows for navigation)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isFinished && !reviewMode) return;
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
      if (['1', '2', '3', '4'].includes(e.key)) {
        handleSelectOption(parseInt(e.key, 10) - 1);
      }
      if (['a', 'A'].includes(e.key)) handleSelectOption(0);
      if (['b', 'B'].includes(e.key)) handleSelectOption(1);
      if (['c', 'C'].includes(e.key)) handleSelectOption(2);
      if (['d', 'D'].includes(e.key)) handleSelectOption(3);
      if (e.key === 'Escape') closeQuizAssessment();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, selectedAnswers, isFinished, reviewMode]);

  const questions = assessment?.questions || [];
  const currentQuestion = questions[currentIndex] || questions[0];
  const isMajor = assessment?.isMajorReadinessExam;

  if (!questions || questions.length === 0) {
    return (
      <div style={{ paddingTop: 100, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
        <h2 style={{ color: '#fff' }}>No assessment questions available</h2>
        <button className="btn btn-primary" onClick={closeQuizAssessment}>Return to Roadmap</button>
      </div>
    );
  }

  const handleSelectOption = (optIndex) => {
    if (selectedAnswers[currentIndex] !== undefined) return; // already answered
    if (!currentQuestion || optIndex < 0 || optIndex >= (currentQuestion.options?.length || 4)) return;

    const isCorrect = optIndex === currentQuestion.correctIndex;
    const nextAnswers = { ...selectedAnswers, [currentIndex]: optIndex };
    setSelectedAnswers(nextAnswers);

    if (isCorrect) {
      playCorrectSound(soundEnabled);
      const nextStreak = streak + 1;
      setStreak(nextStreak);
      if (nextStreak > maxStreak) setMaxStreak(nextStreak);
      if (nextStreak >= 3) {
        confetti({
          particleCount: 25,
          spread: 45,
          origin: { y: 0.65 },
          colors: ['#ec4899', '#f59e0b', '#10b981'],
        });
      }
    } else {
      playWrongSound(soundEnabled);
      setStreak(0);
    }
  };

  const handleNext = () => {
    playClickSound(soundEnabled);
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    playClickSound(soundEnabled);
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleFiftyFifty = () => {
    if (lifelines.fiftyFifty <= 0 || eliminatedOptions[currentIndex]) return;
    playClickSound(soundEnabled);

    const wrongIndexes = [0, 1, 2, 3].filter((i) => i !== currentQuestion.correctIndex);
    const shuffled = wrongIndexes.sort(() => 0.5 - Math.random());
    const toEliminate = shuffled.slice(0, 2);

    setEliminatedOptions({ ...eliminatedOptions, [currentIndex]: toEliminate });
    setLifelines({ ...lifelines, fiftyFifty: lifelines.fiftyFifty - 1 });
    toast.success('⚡ 50:50 Lifeline: 2 incorrect options eliminated!');
  };

  const handleAiHint = () => {
    if (lifelines.aiHint <= 0 || revealedHints[currentIndex]) return;
    playClickSound(soundEnabled);

    setRevealedHints({ ...revealedHints, [currentIndex]: true });
    setLifelines({ ...lifelines, aiHint: lifelines.aiHint - 1 });
    toast('💡 AI Engineering Hint activated!', { icon: '🤖' });
  };

  const calculateScore = () => {
    let correctCount = 0;
    questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctIndex) {
        correctCount++;
      }
    });
    const percentage = Math.round((correctCount / questions.length) * 100);
    return {
      score: correctCount,
      total: questions.length,
      percentage,
      passed: percentage >= 70,
    };
  };

  const handleFinish = () => {
    playLevelUpSound(soundEnabled);
    setIsFinished(true);

    const result = calculateScore();
    if (isMajor) {
      saveReadinessAssessment(assessment.careerId, {
        score: result.score,
        total: result.total,
        percentage: result.percentage,
        passed: result.passed,
        maxStreak,
        verdict: result.passed ? 'Industry Hiring Ready' : 'Competency Reinforcement Needed',
      });
    } else {
      savePhaseAssessment(assessment.careerId, assessment.phaseIdx, {
        score: result.score,
        total: result.total,
        percentage: result.percentage,
        passed: result.passed,
        maxStreak,
      });
    }

    if (result.passed) {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.5 },
        colors: ['#7c3aed', '#ec4899', '#06b6d4', '#10b981', '#f59e0b'],
      });
    }
  };

  const handleRetake = () => {
    setCurrentIndex(0);
    setSelectedAnswers({});
    setEliminatedOptions({});
    setRevealedHints({});
    setStreak(0);
    setIsFinished(false);
    setReviewMode(false);
    setLifelines({ fiftyFifty: 2, aiHint: 3 });
    setTimeLeft((assessment?.timeLimitMinutes || 30) * 60);
    toast('Assessment reset for retake. Good luck!', { icon: '🔄' });
  };

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins}:${rem < 10 ? '0' : ''}${rem}`;
  };

  const result = calculateScore();
  const answeredCount = Object.keys(selectedAnswers).length;
  const progressPercent = Math.round((answeredCount / questions.length) * 100);

  return (
    <div style={{ paddingTop: 78, minHeight: '100vh', paddingBottom: 60, position: 'relative' }}>
      {/* Background ambient lighting */}
      <div style={{
        position: 'fixed',
        top: 80,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '80vw',
        height: '400px',
        background: isMajor
          ? 'radial-gradient(circle, rgba(236, 72, 153, 0.12) 0%, rgba(124, 58, 237, 0.05) 60%, transparent 80%)'
          : 'radial-gradient(circle, rgba(124, 58, 237, 0.15) 0%, rgba(6, 182, 212, 0.05) 60%, transparent 80%)',
        filter: 'blur(70px)',
        pointerEvents: 'none',
        zIndex: 0,
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>

        {/* ── Top Navigation Bar ── */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 14,
          padding: '16px 20px',
          background: 'rgba(12, 10, 32, 0.85)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(124, 58, 237, 0.25)',
          borderRadius: 16,
          marginBottom: 24,
        }}>
          {/* Back button & Title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <button
              onClick={closeQuizAssessment}
              className="btn btn-ghost btn-sm"
              style={{
                gap: 6,
                fontWeight: 700,
                color: '#c4b5fd',
                border: '1px solid rgba(124, 58, 237, 0.3)',
                padding: '8px 14px',
              }}
            >
              <ArrowLeft size={16} /> Back to Roadmap
            </button>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span className={`badge ${isMajor ? 'badge-accent' : 'badge-primary'}`} style={{ fontSize: '0.72rem' }}>
                  {isMajor ? 'MAJOR CAREER CAPSTONE EXAM' : `PHASE ${Number(assessment?.phaseIdx || 0) + 1} MASTERY ARENA`}
                </span>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                  {assessment?.careerTitle || career?.title}
                </span>
              </div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', fontWeight: 800, margin: '2px 0 0', color: '#fff' }}>
                {assessment?.title || 'Technical Competency Evaluation (30 MCQs)'}
              </h2>
            </div>
          </div>

          {/* Timer, Streak & Lifelines */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            {/* Timer */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '6px 14px',
              borderRadius: 10,
              background: timeLeft < 300 ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255, 255, 255, 0.05)',
              border: `1px solid ${timeLeft < 300 ? 'rgba(239, 68, 68, 0.5)' : 'rgba(255, 255, 255, 0.1)'}`,
              color: timeLeft < 300 ? '#f87171' : '#f0ecff',
              fontWeight: 700,
              fontSize: '0.86rem',
            }}>
              <Clock size={15} />
              <span>{formatTime(timeLeft)}</span>
            </div>

            {/* Streak */}
            {streak > 1 && (
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 4,
                  padding: '6px 12px',
                  borderRadius: 10,
                  background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(236, 72, 153, 0.2))',
                  border: '1px solid rgba(245, 158, 11, 0.4)',
                  color: '#fbbf24',
                  fontWeight: 800,
                  fontSize: '0.84rem',
                }}
              >
                <Flame size={15} />
                <span>{streak}x Streak!</span>
              </motion.div>
            )}

            {/* Lifelines */}
            {!isFinished && (
              <div style={{ display: 'flex', gap: 6 }}>
                <button
                  onClick={handleFiftyFifty}
                  disabled={lifelines.fiftyFifty <= 0 || eliminatedOptions[currentIndex]}
                  className="btn btn-ghost btn-sm"
                  style={{
                    padding: '6px 10px',
                    fontSize: '0.76rem',
                    opacity: lifelines.fiftyFifty <= 0 || eliminatedOptions[currentIndex] ? 0.4 : 1,
                    border: '1px solid rgba(124, 58, 237, 0.3)',
                  }}
                  title="Eliminates 2 wrong choices"
                >
                  ⚡ 50:50 ({lifelines.fiftyFifty})
                </button>
                <button
                  onClick={handleAiHint}
                  disabled={lifelines.aiHint <= 0 || revealedHints[currentIndex]}
                  className="btn btn-ghost btn-sm"
                  style={{
                    padding: '6px 10px',
                    fontSize: '0.76rem',
                    opacity: lifelines.aiHint <= 0 || revealedHints[currentIndex] ? 0.4 : 1,
                    border: '1px solid rgba(6, 182, 212, 0.3)',
                    color: '#67e8f9',
                  }}
                  title="Reveal architectural hint"
                >
                  💡 AI Hint ({lifelines.aiHint})
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ── Progress Bar ── */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, fontSize: '0.82rem' }}>
            <span style={{ color: 'var(--color-text-muted)' }}>
              Question <strong>{currentIndex + 1}</strong> of <strong>{questions.length}</strong> · {answeredCount} answered
            </span>
            <span style={{ color: '#c4b5fd', fontWeight: 700 }}>
              {progressPercent}% Complete
            </span>
          </div>
          <div className="progress-bar" style={{ height: 6, background: 'rgba(255, 255, 255, 0.08)' }}>
            <div
              className="progress-fill"
              style={{
                width: `${progressPercent}%`,
                background: isMajor
                  ? 'linear-gradient(90deg, #ec4899, #7c3aed)'
                  : 'linear-gradient(90deg, #7c3aed, #06b6d4)',
              }}
            />
          </div>
        </div>

        {/* ── MAIN INTERACTIVE CONTENT ── */}
        {!isFinished || reviewMode ? (
          <div style={{ display: 'grid', gridTemplateColumns: showQuestionGrid ? '1fr 280px' : '1fr', gap: 24 }}>
            {/* Question Stage */}
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="glass-card"
              style={{
                padding: '32px 36px',
                background: 'linear-gradient(135deg, rgba(16, 12, 38, 0.95) 0%, rgba(8, 6, 24, 0.98) 100%)',
                border: '1.5px solid rgba(124, 58, 237, 0.35)',
                borderRadius: 22,
                boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5), 0 0 35px rgba(124, 58, 237, 0.15)',
              }}
            >
              {/* Question Category & Level */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <span className="badge badge-primary" style={{ fontSize: '0.72rem' }}>
                    {currentQuestion.category || 'Core Architecture'}
                  </span>
                  <span className="badge" style={{ background: 'rgba(255,255,255,0.06)', color: '#cbd5e1', fontSize: '0.72rem' }}>
                    {currentQuestion.difficulty || 'Industry Standard'}
                  </span>
                </div>
                <button
                  onClick={() => setShowQuestionGrid(!showQuestionGrid)}
                  className="btn btn-ghost btn-sm"
                  style={{ gap: 6, fontSize: '0.78rem', color: '#c4b5fd' }}
                >
                  <Grid size={14} /> {showQuestionGrid ? 'Hide Matrix' : 'Question Matrix (30)'}
                </button>
              </div>

              {/* Question Text */}
              <h3 style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.35rem',
                fontWeight: 800,
                color: '#fff',
                lineHeight: 1.5,
                marginBottom: 24,
              }}>
                {currentIndex + 1}. {currentQuestion.question}
              </h3>

              {/* AI Hint Revelation Box */}
              {revealedHints[currentIndex] && currentQuestion.hint && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  style={{
                    padding: '12px 18px',
                    borderRadius: 12,
                    background: 'rgba(6, 182, 212, 0.12)',
                    border: '1px solid rgba(6, 182, 212, 0.35)',
                    marginBottom: 20,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                  }}
                >
                  <span style={{ fontSize: 20 }}>🤖</span>
                  <div style={{ fontSize: '0.84rem', color: '#a5f3fc' }}>
                    <strong>AI Technical Hint:</strong> {currentQuestion.hint}
                  </div>
                </motion.div>
              )}

              {/* Options Grid */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 28 }}>
                {currentQuestion.options.map((opt, optIdx) => {
                  const isSelected = selectedAnswers[currentIndex] === optIdx;
                  const isAnswered = selectedAnswers[currentIndex] !== undefined;
                  const isCorrect = optIdx === currentQuestion.correctIndex;
                  const isEliminated = (eliminatedOptions[currentIndex] || []).includes(optIdx);

                  let background = 'rgba(255, 255, 255, 0.03)';
                  let borderColor = 'rgba(255, 255, 255, 0.08)';
                  let textColor = '#f0ecff';

                  if (isAnswered) {
                    if (isCorrect) {
                      background = 'rgba(16, 185, 129, 0.18)';
                      borderColor = 'rgba(16, 185, 129, 0.55)';
                      textColor = '#34d399';
                    } else if (isSelected) {
                      background = 'rgba(239, 68, 68, 0.18)';
                      borderColor = 'rgba(239, 68, 68, 0.55)';
                      textColor = '#f87171';
                    }
                  } else if (isSelected) {
                    background = 'rgba(124, 58, 237, 0.2)';
                    borderColor = 'rgba(124, 58, 237, 0.5)';
                  }

                  if (isEliminated) {
                    return (
                      <div
                        key={optIdx}
                        style={{
                          padding: '14px 18px',
                          borderRadius: 14,
                          background: 'rgba(255, 255, 255, 0.01)',
                          border: '1px dashed rgba(255, 255, 255, 0.08)',
                          color: 'var(--color-text-muted)',
                          textDecoration: 'line-through',
                          opacity: 0.35,
                          fontSize: '0.9rem',
                        }}
                      >
                        {String.fromCharCode(65 + optIdx)}. {opt} (Eliminated)
                      </div>
                    );
                  }

                  return (
                    <motion.div
                      key={optIdx}
                      whileHover={!isAnswered ? { x: 4, scale: 1.008 } : {}}
                      whileTap={!isAnswered ? { scale: 0.99 } : {}}
                      onClick={() => handleSelectOption(optIdx)}
                      style={{
                        padding: '16px 20px',
                        borderRadius: 14,
                        background,
                        border: `1.5px solid ${borderColor}`,
                        color: textColor,
                        cursor: isAnswered ? 'default' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 16,
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                        <span style={{
                          width: 30, height: 30, borderRadius: 8,
                          background: 'rgba(255, 255, 255, 0.06)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '0.84rem', fontWeight: 800,
                          color: isAnswered && isCorrect ? '#10b981' : '#c4b5fd',
                        }}>
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <span style={{ fontSize: '0.94rem', fontWeight: 500, lineHeight: 1.4 }}>
                          {opt}
                        </span>
                      </div>

                      {isAnswered && (
                        <div>
                          {isCorrect && <CheckCircle2 size={20} color="#10b981" />}
                          {isSelected && !isCorrect && <XCircle size={20} color="#ef4444" />}
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>

              {/* Feedback & Explanation Card */}
              {selectedAnswers[currentIndex] !== undefined && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    padding: '20px 24px',
                    borderRadius: 14,
                    background: selectedAnswers[currentIndex] === currentQuestion.correctIndex
                      ? 'rgba(16, 185, 129, 0.1)'
                      : 'rgba(239, 68, 68, 0.1)',
                    border: `1px solid ${selectedAnswers[currentIndex] === currentQuestion.correctIndex
                      ? 'rgba(16, 185, 129, 0.3)'
                      : 'rgba(239, 68, 68, 0.3)'}`,
                    marginBottom: 24,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <BookOpen size={16} color={selectedAnswers[currentIndex] === currentQuestion.correctIndex ? '#10b981' : '#f87171'} />
                    <span style={{
                      fontWeight: 800,
                      fontSize: '0.9rem',
                      color: selectedAnswers[currentIndex] === currentQuestion.correctIndex ? '#34d399' : '#f87171',
                    }}>
                      {selectedAnswers[currentIndex] === currentQuestion.correctIndex
                        ? 'Mastery Confirmed! (+50 XP Earned)'
                        : 'Key Learning Takeaway & Industry Rationale'}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.86rem', color: '#e2e8f0', lineHeight: 1.6, margin: 0 }}>
                    {currentQuestion.explanation}
                  </p>
                </motion.div>
              )}

              {/* Navigation Bar */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 12,
                paddingTop: 18,
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              }}>
                <button
                  onClick={handlePrev}
                  disabled={currentIndex === 0}
                  className="btn btn-ghost btn-sm"
                  style={{ gap: 6, opacity: currentIndex === 0 ? 0.3 : 1 }}
                >
                  <ChevronLeft size={16} /> Previous Question
                </button>

                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  {currentIndex < questions.length - 1 ? (
                    <button
                      onClick={handleNext}
                      className="btn btn-primary btn-sm"
                      style={{ padding: '8px 22px', gap: 6, fontWeight: 700 }}
                    >
                      Next Question <ChevronRight size={16} />
                    </button>
                  ) : (
                    <button
                      onClick={handleFinish}
                      className="btn btn-primary btn-sm"
                      style={{
                        padding: '8px 24px',
                        background: 'linear-gradient(135deg, #10b981, #06b6d4)',
                        gap: 6,
                        fontWeight: 800,
                      }}
                    >
                      <Trophy size={16} /> Complete & Grade Assessment
                    </button>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Question Jump Grid Sidebar */}
            {showQuestionGrid && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="glass-card"
                style={{
                  padding: 22,
                  background: 'rgba(12, 10, 32, 0.95)',
                  border: '1px solid rgba(124, 58, 237, 0.3)',
                  borderRadius: 18,
                  height: 'fit-content',
                }}
              >
                <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '0.95rem', fontWeight: 800, color: '#fff', marginBottom: 14 }}>
                  Question Matrix (30 MCQs)
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8 }}>
                  {questions.map((q, qIdx) => {
                    const answered = selectedAnswers[qIdx] !== undefined;
                    const isCorrect = answered && selectedAnswers[qIdx] === q.correctIndex;
                    const isCurrent = qIdx === currentIndex;

                    let bg = 'rgba(255, 255, 255, 0.04)';
                    let border = 'rgba(255, 255, 255, 0.1)';
                    let color = 'var(--color-text-muted)';

                    if (answered) {
                      bg = isCorrect ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)';
                      border = isCorrect ? 'rgba(16, 185, 129, 0.5)' : 'rgba(239, 68, 68, 0.5)';
                      color = isCorrect ? '#34d399' : '#f87171';
                    }

                    if (isCurrent) {
                      border = '2px solid #c4b5fd';
                    }

                    return (
                      <button
                        key={qIdx}
                        onClick={() => {
                          playClickSound(soundEnabled);
                          setCurrentIndex(qIdx);
                        }}
                        style={{
                          height: 36,
                          borderRadius: 8,
                          background: bg,
                          border: `1px solid ${border}`,
                          color,
                          fontWeight: 700,
                          fontSize: '0.8rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {qIdx + 1}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </div>
        ) : (
          /* ── RESULTS & OFFICIAL CERTIFICATE SCREEN ── */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card"
            style={{
              padding: '40px 48px',
              maxWidth: 780,
              margin: '0 auto',
              background: 'linear-gradient(135deg, rgba(16, 12, 38, 0.98) 0%, rgba(8, 6, 24, 0.99) 100%)',
              border: result.passed
                ? '2px solid rgba(16, 185, 129, 0.45)'
                : '2px solid rgba(239, 68, 68, 0.45)',
              borderRadius: 24,
              boxShadow: result.passed
                ? '0 25px 60px rgba(0,0,0,0.6), 0 0 50px rgba(16, 185, 129, 0.2)'
                : '0 25px 60px rgba(0,0,0,0.6), 0 0 50px rgba(239, 68, 68, 0.2)',
              textAlign: 'center',
            }}
          >
            {/* Trophy or Badge Icon */}
            <div style={{
              width: 80, height: 80, borderRadius: '50%',
              margin: '0 auto 20px',
              background: result.passed
                ? 'linear-gradient(135deg, rgba(16,185,129,0.25), rgba(6,182,212,0.25))'
                : 'linear-gradient(135deg, rgba(239,68,68,0.25), rgba(245,158,11,0.25))',
              border: `2px solid ${result.passed ? '#10b981' : '#f87171'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 38,
            }}>
              {result.passed ? '🏆' : '🎯'}
            </div>

            <span className="badge" style={{
              background: result.passed ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)',
              color: result.passed ? '#34d399' : '#f87171',
              fontWeight: 800,
              fontSize: '0.8rem',
              marginBottom: 12,
            }}>
              {result.passed ? 'VERIFIED COMPETENCY ACHIEVED' : 'ASSESSMENT COMPLETED · RETAKE RECOMMENDED'}
            </span>

            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 900, color: '#fff', margin: '8px 0 12px' }}>
              {result.passed ? 'Cosmic Mastery Certification' : 'Assessment Summary & Growth Report'}
            </h2>

            <p style={{ color: 'var(--color-text-secondary)', maxWidth: 540, margin: '0 auto 28px', fontSize: '0.92rem', lineHeight: 1.6 }}>
              {result.passed
                ? `Outstanding performance! You successfully demonstrated mastery across the 30 technical competencies evaluated for ${career?.title}.`
                : `You scored ${result.percentage}%. We recommend reviewing the detailed answer explanations and retaking the assessment to earn your official mastery certificate.`}
            </p>

            {/* Score Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 16,
              maxWidth: 520,
              margin: '0 auto 32px',
            }}>
              <div style={{ padding: '16px', borderRadius: 14, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ fontSize: '1.8rem', fontWeight: 900, color: result.passed ? '#34d399' : '#f87171', fontFamily: 'var(--font-display)' }}>
                  {result.percentage}%
                </div>
                <div style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Final Score</div>
              </div>

              <div style={{ padding: '16px', borderRadius: 14, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#67e8f9', fontFamily: 'var(--font-display)' }}>
                  {result.score} / {result.total}
                </div>
                <div style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Correct Answers</div>
              </div>

              <div style={{ padding: '16px', borderRadius: 14, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#fbbf24', fontFamily: 'var(--font-display)' }}>
                  +{result.passed ? (isMajor ? '300' : '150') : '50'} XP
                </div>
                <div style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>XP Awarded</div>
              </div>
            </div>

            {/* Action buttons */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 14, flexWrap: 'wrap' }}>
              <button
                onClick={() => setReviewMode(true)}
                className="btn btn-ghost"
                style={{ gap: 8, fontWeight: 700, border: '1px solid rgba(124, 58, 237, 0.3)' }}
              >
                <BookOpen size={16} /> Review All 30 Answers
              </button>

              <button
                onClick={handleRetake}
                className="btn btn-secondary"
                style={{ gap: 8, fontWeight: 700 }}
              >
                <RotateCcw size={16} /> Retake Assessment
              </button>

              <button
                onClick={closeQuizAssessment}
                className="btn btn-primary"
                style={{ gap: 8, fontWeight: 800, padding: '10px 24px' }}
              >
                ← Return to Roadmap
              </button>
            </div>
          </motion.div>
        )}

      </div>
    </div>
  );
}
