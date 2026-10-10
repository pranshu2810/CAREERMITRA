import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Sparkles, CheckCircle2, XCircle, Clock, Award, Zap,
  Flame, HelpCircle, ChevronRight, ChevronLeft, RotateCcw,
  BookOpen, Check, ShieldCheck, Share2, Printer, Trophy, ArrowRight, Grid
} from 'lucide-react';
import useStore from '../store/useStore';
import { playClickSound, playCorrectSound, playWrongSound, playLevelUpSound } from '../utils/soundFX';
import confetti from 'canvas-confetti';
import toast from 'react-hot-toast';

export default function AssessmentQuizModal({ assessment, onClose }) {
  const {
    savePhaseAssessment, saveReadinessAssessment, soundEnabled, user
  } = useStore();

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

  if (!assessment || !assessment.questions || assessment.questions.length === 0) return null;

  const questions = assessment.questions;
  const currentQuestion = questions[currentIndex];
  const isMajor = assessment.isMajorReadinessExam;

  const handleSelectOption = (optIndex) => {
    if (selectedAnswers[currentIndex] !== undefined) return; // already answered

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
    // pick 2 random wrong options to eliminate
    const shuffled = wrongIndexes.sort(() => 0.5 - Math.random());
    const toEliminate = shuffled.slice(0, 2);

    setEliminatedOptions({ ...eliminatedOptions, [currentIndex]: toEliminate });
    setLifelines({ ...lifelines, fiftyFifty: lifelines.fiftyFifty - 1 });
    toast.success('⚡ 50:50 Lifeline used! 2 incorrect answers removed.');
  };

  const handleAiHint = () => {
    if (lifelines.aiHint <= 0 || revealedHints[currentIndex]) return;
    playClickSound(soundEnabled);
    setRevealedHints({ ...revealedHints, [currentIndex]: true });
    setLifelines({ ...lifelines, aiHint: lifelines.aiHint - 1 });
    toast.success('💡 AI Insight hint unlocked!');
  };

  const handleFinish = () => {
    // Calculate final score
    let score = 0;
    questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctIndex) {
        score++;
      }
    });

    const total = questions.length;
    const percentage = Math.round((score / total) * 100);
    const passed = percentage >= 70;

    const resultData = {
      score,
      total,
      percentage,
      passed,
      maxStreak,
      answers: selectedAnswers,
      verdict: percentage >= 90 ? 'Mastery Grade' : (percentage >= 70 ? 'Industry Ready' : 'In Training'),
    };

    if (isMajor) {
      saveReadinessAssessment(assessment.careerId, resultData);
    } else {
      savePhaseAssessment(assessment.careerId, assessment.phaseIndex, resultData);
    }

    setIsFinished(true);
    playLevelUpSound(soundEnabled);
    confetti({
      particleCount: 100,
      spread: 90,
      origin: { y: 0.5 },
      colors: ['#ec4899', '#7c3aed', '#06b6d4', '#f59e0b', '#10b981'],
    });
  };

  const answeredCount = Object.keys(selectedAnswers).length;
  const progressPercent = Math.round((answeredCount / questions.length) * 100);

  // Minutes and seconds formatting
  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Compute final stats
  let correctTotal = 0;
  questions.forEach((q, idx) => {
    if (selectedAnswers[idx] === q.correctIndex) correctTotal++;
  });
  const finalScorePercent = Math.round((correctTotal / questions.length) * 100);
  const isPassed = finalScorePercent >= 70;

  return (
    <div
      className="modal-overlay"
      style={{
        zIndex: 1100,
        backdropFilter: 'blur(18px)',
        background: 'rgba(3, 2, 16, 0.88)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px 14px',
      }}
    >
      <motion.div
        className="modal-panel"
        initial={{ opacity: 0, scale: 0.94, y: 25 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 15 }}
        transition={{ duration: 0.35, ease: [0.34, 1.56, 0.64, 1] }}
        style={{
          width: '100%',
          maxWidth: 880,
          maxHeight: '92vh',
          background: 'linear-gradient(135deg, rgba(16, 12, 42, 0.99) 0%, rgba(9, 7, 28, 0.99) 100%)',
          border: isMajor ? '2px solid rgba(236, 72, 153, 0.5)' : '1px solid rgba(124, 58, 237, 0.45)',
          borderRadius: 24,
          boxShadow: isMajor
            ? '0 30px 100px rgba(0, 0, 0, 0.85), 0 0 60px rgba(236, 72, 153, 0.35)'
            : '0 25px 90px rgba(0, 0, 0, 0.85), 0 0 50px rgba(124, 58, 237, 0.3)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
        }}
      >
        {/* Animated Top Glow Strip */}
        <div style={{
          height: 4,
          width: '100%',
          background: isMajor
            ? 'linear-gradient(90deg, #ec4899, #f59e0b, #7c3aed, #06b6d4)'
            : 'linear-gradient(90deg, #7c3aed, #06b6d4, #10b981)',
        }} />

        {/* ── SCREEN 1: Active Assessment View ── */}
        {!isFinished && (
          <>
            {/* Header / HUD */}
            <div style={{
              padding: '20px 28px 16px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              background: 'rgba(255, 255, 255, 0.02)',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span
                      className="badge"
                      style={{
                        background: isMajor ? 'rgba(236, 72, 153, 0.2)' : 'rgba(124, 58, 237, 0.2)',
                        color: isMajor ? '#f472b6' : '#c4b5fd',
                        border: isMajor ? '1px solid rgba(236, 72, 153, 0.4)' : '1px solid rgba(124, 58, 237, 0.35)',
                        fontWeight: 700,
                      }}
                    >
                      {isMajor ? '🌌 MAJOR CAREER READINESS EXAM' : `⚡ PHASE ${Number(assessment.phaseIndex) + 1} ASSESSMENT`}
                    </span>
                    <span className="badge" style={{ background: 'rgba(255, 255, 255, 0.05)', color: 'var(--color-text-secondary)' }}>
                      {assessment.careerTitle}
                    </span>
                  </div>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', margin: 0, fontFamily: 'var(--font-display)' }}>
                    {isMajor ? 'Galactic Domain Readiness Simulation' : assessment.phaseTitle}
                  </h2>
                </div>

                {/* Telemetry badges */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div
                    style={{
                      display: 'flex', alignItems: 'center', gap: 6,
                      padding: '6px 12px',
                      background: timeLeft < 300 ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                      border: timeLeft < 300 ? '1px solid #ef4444' : '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: 12,
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      color: timeLeft < 300 ? '#fca5a5' : '#e2e8f0',
                    }}
                  >
                    <Clock size={13} color={timeLeft < 300 ? '#fca5a5' : '#94a3b8'} />
                    {formatTime(timeLeft)}
                  </div>

                  {streak >= 2 && (
                    <motion.div
                      initial={{ scale: 0.8 }}
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 4,
                        padding: '6px 12px',
                        background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(236, 72, 153, 0.2))',
                        border: '1px solid rgba(245, 158, 11, 0.4)',
                        borderRadius: 12,
                        fontSize: '0.8rem',
                        fontWeight: 800,
                        color: '#fbbf24',
                      }}
                    >
                      <Flame size={14} color="#f59e0b" /> {streak}x Combo
                    </motion.div>
                  )}

                  <button
                    onClick={() => setShowQuestionGrid(!showQuestionGrid)}
                    className="btn btn-ghost btn-sm"
                    style={{ border: '1px solid rgba(124, 58, 237, 0.3)', padding: '6px 10px', gap: 4 }}
                    title="View question navigator grid"
                  >
                    <Grid size={13} /> {answeredCount}/{questions.length}
                  </button>

                  <button
                    onClick={onClose}
                    className="btn btn-ghost btn-sm"
                    style={{ padding: 6, borderRadius: '50%' }}
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* Progress bar */}
              <div style={{ marginTop: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', marginBottom: 4 }}>
                  <span style={{ color: 'var(--color-text-muted)' }}>
                    Question {currentIndex + 1} of {questions.length}
                  </span>
                  <span style={{ fontWeight: 700, color: '#a78bfa' }}>
                    {answeredCount} Answered ({progressPercent}%)
                  </span>
                </div>
                <div style={{ height: 6, background: 'rgba(255, 255, 255, 0.08)', borderRadius: 999, overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${((currentIndex + 1) / questions.length) * 100}%`,
                      background: 'linear-gradient(90deg, #7c3aed, #06b6d4)',
                      transition: 'width 0.3s ease',
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Question Grid Dropdown Drawer */}
            <AnimatePresence>
              {showQuestionGrid && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  style={{
                    background: 'rgba(8, 6, 26, 0.95)',
                    borderBottom: '1px solid rgba(124, 58, 237, 0.25)',
                    padding: '14px 28px',
                    overflow: 'hidden',
                  }}
                >
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: 8 }}>
                    Jump to any question:
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(15, 1fr)', gap: 6 }}>
                    {questions.map((q, idx) => {
                      const answered = selectedAnswers[idx] !== undefined;
                      const isCurrent = idx === currentIndex;
                      return (
                        <button
                          key={idx}
                          onClick={() => {
                            setCurrentIndex(idx);
                            setShowQuestionGrid(false);
                          }}
                          style={{
                            height: 28,
                            borderRadius: 6,
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            border: isCurrent ? '2px solid #a855f7' : '1px solid rgba(255,255,255,0.1)',
                            background: answered ? 'rgba(16, 185, 129, 0.25)' : 'rgba(255, 255, 255, 0.05)',
                            color: answered ? '#6ee7b7' : '#94a3b8',
                          }}
                        >
                          {idx + 1}
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Question Body */}
            <div style={{
              padding: '28px 32px',
              flex: 1,
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: 20,
            }}>
              {/* Question metadata & Lifelines */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
                <div style={{ display: 'flex', gap: 8 }}>
                  <span className="badge" style={{ background: 'rgba(124, 58, 237, 0.15)', color: '#c4b5fd', border: '1px solid rgba(124, 58, 237, 0.3)' }}>
                    {currentQuestion.topic || 'Domain Concept'}
                  </span>
                  <span className="badge" style={{ background: 'rgba(255, 255, 255, 0.06)', color: 'var(--color-text-secondary)' }}>
                    {currentQuestion.difficulty || 'Intermediate'}
                  </span>
                </div>

                {/* Lifeline buttons */}
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    onClick={handleFiftyFifty}
                    disabled={lifelines.fiftyFifty <= 0 || eliminatedOptions[currentIndex] !== undefined || selectedAnswers[currentIndex] !== undefined}
                    className="btn btn-sm btn-ghost"
                    style={{
                      border: '1px solid rgba(245, 158, 11, 0.4)',
                      color: lifelines.fiftyFifty > 0 ? '#fbbf24' : '#64748b',
                      fontSize: '0.75rem',
                      padding: '4px 10px',
                      gap: 4,
                    }}
                    title="Eliminate two incorrect options"
                  >
                    <Zap size={12} /> 50:50 ({lifelines.fiftyFifty})
                  </button>

                  <button
                    onClick={handleAiHint}
                    disabled={lifelines.aiHint <= 0 || revealedHints[currentIndex] || selectedAnswers[currentIndex] !== undefined}
                    className="btn btn-sm btn-ghost"
                    style={{
                      border: '1px solid rgba(6, 182, 212, 0.4)',
                      color: lifelines.aiHint > 0 ? '#67e8f9' : '#64748b',
                      fontSize: '0.75rem',
                      padding: '4px 10px',
                      gap: 4,
                    }}
                    title="Unlock an AI hint"
                  >
                    <HelpCircle size={12} /> AI Hint ({lifelines.aiHint})
                  </button>
                </div>
              </div>

              {/* AI Hint Reveal Box */}
              {revealedHints[currentIndex] && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    padding: '12px 16px',
                    borderRadius: 12,
                    background: 'rgba(6, 182, 212, 0.1)',
                    border: '1px solid rgba(6, 182, 212, 0.35)',
                    fontSize: '0.82rem',
                    color: '#a5f3fc',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                  }}
                >
                  <Sparkles size={16} color="#06b6d4" />
                  <span><strong>AI Clue:</strong> {currentQuestion.hint || 'Carefully evaluate standard production tradeoffs and boundary safety.'}</span>
                </motion.div>
              )}

              {/* Question Text */}
              <div style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.18rem',
                fontWeight: 700,
                color: '#fff',
                lineHeight: 1.5,
              }}>
                <span style={{ color: '#a78bfa', marginRight: 8 }}>Q{currentIndex + 1}.</span>
                {currentQuestion.question}
              </div>

              {/* Options Cards */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {currentQuestion.options.map((opt, optIdx) => {
                  const isSelected = selectedAnswers[currentIndex] === optIdx;
                  const isCorrect = currentQuestion.correctIndex === optIdx;
                  const hasAnswered = selectedAnswers[currentIndex] !== undefined;
                  const isEliminated = (eliminatedOptions[currentIndex] || []).includes(optIdx);

                  let bg = 'rgba(255, 255, 255, 0.03)';
                  let border = '1px solid rgba(255, 255, 255, 0.08)';
                  let textColor = '#e2e8f0';

                  if (isEliminated) {
                    bg = 'rgba(255, 255, 255, 0.01)';
                    border = '1px dashed rgba(255, 255, 255, 0.05)';
                    textColor = 'rgba(255, 255, 255, 0.2)';
                  } else if (hasAnswered) {
                    if (isCorrect) {
                      bg = 'rgba(16, 185, 129, 0.16)';
                      border = '1.5px solid #10b981';
                      textColor = '#6ee7b7';
                    } else if (isSelected) {
                      bg = 'rgba(239, 68, 68, 0.16)';
                      border = '1.5px solid #ef4444';
                      textColor = '#fca5a5';
                    }
                  }

                  const letter = String.fromCharCode(65 + optIdx);

                  return (
                    <motion.div
                      key={optIdx}
                      whileHover={!hasAnswered && !isEliminated ? { scale: 1.01, x: 4 } : {}}
                      onClick={() => !isEliminated && handleSelectOption(optIdx)}
                      style={{
                        padding: '14px 18px',
                        borderRadius: 14,
                        background: bg,
                        border,
                        cursor: hasAnswered || isEliminated ? 'default' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 14,
                        transition: 'all 0.2s',
                        opacity: isEliminated ? 0.35 : 1,
                      }}
                    >
                      <div
                        style={{
                          width: 32, height: 32, borderRadius: 10,
                          background: isSelected
                            ? (isCorrect ? '#10b981' : '#ef4444')
                            : (hasAnswered && isCorrect ? '#10b981' : 'rgba(255, 255, 255, 0.08)'),
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontWeight: 800,
                          fontSize: '0.85rem',
                          color: isSelected || (hasAnswered && isCorrect) ? '#fff' : '#c4b5fd',
                          flexShrink: 0,
                        }}
                      >
                        {letter}
                      </div>

                      <div style={{ flex: 1, fontSize: '0.92rem', color: textColor, lineHeight: 1.45 }}>
                        {opt}
                      </div>

                      {hasAnswered && (
                        <div>
                          {isCorrect && <CheckCircle2 size={20} color="#10b981" />}
                          {!isCorrect && isSelected && <XCircle size={20} color="#ef4444" />}
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>

              {/* Detailed Explanation Reveal (after answered) */}
              {selectedAnswers[currentIndex] !== undefined && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    padding: '16px 20px',
                    borderRadius: 14,
                    background: selectedAnswers[currentIndex] === currentQuestion.correctIndex
                      ? 'rgba(16, 185, 129, 0.08)'
                      : 'rgba(239, 68, 68, 0.08)',
                    border: selectedAnswers[currentIndex] === currentQuestion.correctIndex
                      ? '1px solid rgba(16, 185, 129, 0.25)'
                      : '1px solid rgba(239, 68, 68, 0.25)',
                    marginTop: 4,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700, fontSize: '0.85rem', marginBottom: 4, color: selectedAnswers[currentIndex] === currentQuestion.correctIndex ? '#34d399' : '#f87171' }}>
                    <BookOpen size={14} />
                    {selectedAnswers[currentIndex] === currentQuestion.correctIndex ? 'Correct Analysis ✓' : 'Concept Explanation:'}
                  </div>
                  <p style={{ fontSize: '0.84rem', color: 'var(--color-text-secondary)', lineHeight: 1.5, margin: 0 }}>
                    {currentQuestion.explanation}
                  </p>
                </motion.div>
              )}
            </div>

            {/* Bottom Footer Actions */}
            <div style={{
              padding: '16px 28px',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              background: 'rgba(10, 7, 26, 0.95)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <button
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className="btn btn-ghost btn-sm"
                style={{ gap: 6 }}
              >
                <ChevronLeft size={16} /> Previous
              </button>

              <div style={{ display: 'flex', gap: 10 }}>
                {currentIndex < questions.length - 1 ? (
                  <button
                    onClick={handleNext}
                    className="btn btn-primary btn-sm"
                    style={{ padding: '8px 24px', gap: 6 }}
                  >
                    Next Question <ChevronRight size={16} />
                  </button>
                ) : (
                  <button
                    onClick={handleFinish}
                    className="btn btn-primary btn-sm"
                    style={{
                      padding: '8px 28px',
                      background: 'linear-gradient(135deg, #10b981, #06b6d4)',
                      fontWeight: 800,
                      gap: 6,
                    }}
                  >
                    Submit Assessment 🚀
                  </button>
                )}
              </div>
            </div>
          </>
        )}

        {/* ── SCREEN 2: Evaluation & Score Card View ── */}
        {isFinished && (
          <div style={{
            padding: '36px 32px',
            overflowY: 'auto',
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            gap: 20,
          }}>
            {/* Badge Insignia */}
            <motion.div
              initial={{ scale: 0, rotate: -30 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', damping: 12, stiffness: 200 }}
              style={{
                width: 80, height: 80, borderRadius: '50%',
                background: isPassed
                  ? 'linear-gradient(135deg, #10b981, #06b6d4)'
                  : 'linear-gradient(135deg, #ec4899, #7c3aed)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 38,
                boxShadow: isPassed
                  ? '0 0 40px rgba(16, 185, 129, 0.5)'
                  : '0 0 40px rgba(236, 72, 153, 0.4)',
              }}
            >
              {isPassed ? '🏆' : '🎯'}
            </motion.div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 8 }}>
                <span
                  className="badge"
                  style={{
                    background: isPassed ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                    color: isPassed ? '#34d399' : '#fbbf24',
                    border: isPassed ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid rgba(245, 158, 11, 0.4)',
                    fontWeight: 700,
                  }}
                >
                  {isPassed ? 'PASSED & CERTIFIED' : 'NEEDS PRACTICE'}
                </span>
                <span className="badge badge-primary">
                  {isMajor ? 'Major Career Readiness' : `Phase ${Number(assessment.phaseIndex) + 1}`}
                </span>
              </div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 900, color: '#fff', marginBottom: 4 }}>
                {isPassed ? 'Domain Mastery Confirmed!' : 'Keep Pushing Your Limits!'}
              </h2>
              <p style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)', maxWidth: 540 }}>
                {isMajor
                  ? `Comprehensive career readiness simulation completed for ${assessment.careerTitle}.`
                  : `Phase assessment evaluated across 30 technical domain competencies.`}
              </p>
            </div>

            {/* Score Metric Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, width: '100%', maxWidth: 650 }}>
              <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(124, 58, 237, 0.25)', borderRadius: 16, padding: '16px 12px' }}>
                <div style={{ fontSize: '1.6rem', fontWeight: 900, color: isPassed ? '#34d399' : '#f87171', fontFamily: 'var(--font-display)' }}>
                  {finalScorePercent}%
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Accuracy</div>
              </div>
              <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(124, 58, 237, 0.25)', borderRadius: 16, padding: '16px 12px' }}>
                <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#fff', fontFamily: 'var(--font-display)' }}>
                  {correctTotal}/30
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Correct</div>
              </div>
              <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(124, 58, 237, 0.25)', borderRadius: 16, padding: '16px 12px' }}>
                <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#fbbf24', fontFamily: 'var(--font-display)' }}>
                  {maxStreak}x
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Max Streak</div>
              </div>
              <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(124, 58, 237, 0.25)', borderRadius: 16, padding: '16px 12px' }}>
                <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#a78bfa', fontFamily: 'var(--font-display)' }}>
                  +{isPassed ? (isMajor ? 300 : 150) : 50}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>XP Earned</div>
              </div>
            </div>

            {/* Official Certificate for Major Readiness Assessment */}
            {isMajor && isPassed && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  width: '100%',
                  maxWidth: 680,
                  background: 'linear-gradient(135deg, rgba(20, 14, 50, 0.95), rgba(10, 8, 30, 0.98))',
                  border: '2px solid rgba(236, 72, 153, 0.6)',
                  borderRadius: 20,
                  padding: '24px 28px',
                  boxShadow: '0 0 40px rgba(236, 72, 153, 0.25)',
                  position: 'relative',
                  textAlign: 'left',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <ShieldCheck size={20} color="#ec4899" />
                    <span style={{ fontSize: '0.8rem', fontWeight: 800, letterSpacing: '0.08em', color: '#fbcfe8', textTransform: 'uppercase' }}>
                      Official CareerMitra Galactic Certification
                    </span>
                  </div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>
                    ID: CM-CERT-{Date.now().toString(36).toUpperCase()}
                  </span>
                </div>

                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff', marginBottom: 4 }}>
                  {user?.name || 'Cosmic Pioneer'} is Certified Career Ready
                </div>
                <div style={{ fontSize: '0.85rem', color: '#c4b5fd', marginBottom: 14 }}>
                  Target Domain: <strong>{assessment.careerTitle}</strong> · Validated with {finalScorePercent}% Exam Score
                </div>

                <div style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
                  This credential validates rigorous competency across system architecture, practical implementation, and domain edge-case problem solving.
                </div>
              </motion.div>
            )}

            {/* Review Mode Accordion */}
            {reviewMode && (
              <div style={{ width: '100%', maxWidth: 740, textAlign: 'left', marginTop: 10 }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#fff', marginBottom: 14 }}>
                  Detailed Breakdown of All 30 Questions:
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {questions.map((q, idx) => {
                    const userOpt = selectedAnswers[idx];
                    const isCorrect = userOpt === q.correctIndex;
                    return (
                      <div
                        key={idx}
                        style={{
                          padding: '14px 18px',
                          borderRadius: 12,
                          background: 'rgba(255, 255, 255, 0.02)',
                          border: isCorrect ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(239, 68, 68, 0.3)',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                          <span style={{ fontSize: '0.86rem', fontWeight: 700, color: '#fff' }}>
                            Q{idx + 1}. {q.question}
                          </span>
                          <span style={{ fontSize: '0.72rem', fontWeight: 700, color: isCorrect ? '#34d399' : '#f87171' }}>
                            {isCorrect ? '✓ Correct' : '✗ Incorrect'}
                          </span>
                        </div>
                        <div style={{ fontSize: '0.78rem', color: '#cbd5e1', marginBottom: 4 }}>
                          Your choice: <strong>{userOpt !== undefined ? q.options[userOpt] : 'Unanswered'}</strong>
                        </div>
                        {!isCorrect && (
                          <div style={{ fontSize: '0.78rem', color: '#34d399', marginBottom: 4 }}>
                            Correct choice: <strong>{q.options[q.correctIndex]}</strong>
                          </div>
                        )}
                        <div style={{ fontSize: '0.76rem', color: 'var(--color-text-muted)', lineHeight: 1.45 }}>
                          {q.explanation}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: 12, marginTop: 14 }}>
              <button
                onClick={() => setReviewMode(!reviewMode)}
                className="btn btn-ghost btn-sm"
                style={{ border: '1px solid rgba(124, 58, 237, 0.3)', gap: 6 }}
              >
                <BookOpen size={14} />
                {reviewMode ? 'Hide Review' : 'Review All 30 Answers'}
              </button>

              <button
                onClick={() => {
                  setSelectedAnswers({});
                  setCurrentIndex(0);
                  setIsFinished(false);
                  setStreak(0);
                  setTimeLeft((assessment.timeLimitMinutes || 30) * 60);
                }}
                className="btn btn-ghost btn-sm"
                style={{ gap: 6 }}
              >
                <RotateCcw size={14} /> Retake Assessment
              </button>

              <button
                onClick={onClose}
                className="btn btn-primary btn-sm"
                style={{ padding: '8px 24px' }}
              >
                Return to Roadmap
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
