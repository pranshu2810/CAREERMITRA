import React, { useState } from 'react';
import {
  StyleSheet, View, Text, ScrollView, TouchableOpacity, SafeAreaView
} from 'react-native';

const DEFAULT_ROADMAP_PHASES = [
  {
    phase: 'Phase 1: Mathematical Foundations & Python',
    skills: [
      { id: 'math', title: 'Linear Algebra, Calculus & Statistics', hours: 25, status: 'completed' },
      { id: 'python', title: 'Modern Python (NumPy, Pandas, Vectorization)', hours: 20, status: 'completed' },
    ],
  },
  {
    phase: 'Phase 2: Core Machine Learning & PyTorch',
    skills: [
      { id: 'ml', title: 'Supervised & Unsupervised Learning Architectures', hours: 30, status: 'in_progress' },
      { id: 'pytorch', title: 'Deep Learning & Neural Network Optimization', hours: 35, status: 'available' },
    ],
  },
  {
    phase: 'Phase 3: Transformers, LLMs & Advanced RAG',
    skills: [
      { id: 'transformers', title: 'Attention Mechanisms & Hugging Face Ecosystem', hours: 35, status: 'locked' },
      { id: 'rag', title: 'Vector DBs, Semantic Search & Agentic Pipelines', hours: 40, status: 'locked' },
    ],
  },
  {
    phase: 'Phase 4: MLOps & Production Scale Systems',
    skills: [
      { id: 'mlops', title: 'Model Serving, Quantization & Low-Latency APIs', hours: 30, status: 'locked' },
      { id: 'monitoring', title: 'Telemetry, Drift Detection & Distributed Inference', hours: 25, status: 'locked' },
    ],
  },
];

export default function RoadmapScreen({ career, onBack }) {
  const [phases, setPhases] = useState(DEFAULT_ROADMAP_PHASES);

  const toggleSkill = (phaseIdx, skillIdx) => {
    const updated = JSON.parse(JSON.stringify(phases));
    const current = updated[phaseIdx].skills[skillIdx];
    current.status = current.status === 'completed' ? 'in_progress' : 'completed';
    setPhases(updated);
  };

  const totalSkills = phases.reduce((acc, p) => acc + p.skills.length, 0);
  const completedSkills = phases.reduce(
    (acc, p) => acc + p.skills.filter(s => s.status === 'completed').length,
    0
  );
  const progressPercent = Math.round((completedSkills / totalSkills) * 100);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Top Header */}
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <Text style={styles.backText}>← Back to Galaxy</Text>
        </TouchableOpacity>

        <Text style={styles.roleTitle}>{career?.title || 'AI Engineer'}</Text>
        <Text style={styles.clusterTitle}>Cosmic Roadmap & Milestone Matrix</Text>

        {/* Progress Card */}
        <View style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>Overall Mastery Progress</Text>
            <Text style={styles.progressValue}>{progressPercent}%</Text>
          </View>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
          </View>
          <Text style={styles.progressSub}>
            {completedSkills} of {totalSkills} core milestones unlocked
          </Text>
        </View>

        {/* Phases */}
        {phases.map((phase, pIdx) => (
          <View key={pIdx} style={styles.phaseCard}>
            <Text style={styles.phaseTitle}>{phase.phase}</Text>
            {phase.skills.map((skill, sIdx) => {
              const isDone = skill.status === 'completed';
              return (
                <TouchableOpacity
                  key={skill.id}
                  style={[styles.skillRow, isDone && styles.skillRowDone]}
                  activeOpacity={0.7}
                  onPress={() => toggleSkill(pIdx, sIdx)}
                >
                  <View style={[styles.checkCircle, isDone && styles.checkCircleDone]}>
                    <Text style={styles.checkIcon}>{isDone ? '✓' : '○'}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.skillTitle, isDone && styles.skillTitleDone]}>
                      {skill.title}
                    </Text>
                    <Text style={styles.skillHours}>{skill.hours} hrs · Tap to toggle</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#060417',
  },
  container: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 60,
  },
  backBtn: {
    marginBottom: 12,
  },
  backText: {
    color: '#a78bfa',
    fontSize: 14,
    fontWeight: '600',
  },
  roleTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#fff',
  },
  clusterTitle: {
    fontSize: 13,
    color: '#67e8f9',
    marginBottom: 18,
  },
  progressCard: {
    backgroundColor: '#100c28',
    borderColor: 'rgba(124, 58, 237, 0.3)',
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressLabel: {
    color: '#f4f4f5',
    fontSize: 13,
    fontWeight: '600',
  },
  progressValue: {
    color: '#10b981',
    fontSize: 14,
    fontWeight: '800',
  },
  progressBarBg: {
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#7c3aed',
    borderRadius: 4,
  },
  progressSub: {
    color: '#94a3b8',
    fontSize: 11,
  },
  phaseCard: {
    backgroundColor: '#100c28',
    borderWidth: 1,
    borderColor: 'rgba(124, 58, 237, 0.2)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
  },
  phaseTitle: {
    color: '#c4b5fd',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 12,
  },
  skillRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.04)',
    gap: 12,
  },
  skillRowDone: {
    opacity: 0.8,
  },
  checkCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: 'rgba(124, 58, 237, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkCircleDone: {
    backgroundColor: '#10b981',
    borderColor: '#10b981',
  },
  checkIcon: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },
  skillTitle: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  skillTitleDone: {
    color: '#a1a1aa',
    textDecorationLine: 'line-through',
  },
  skillHours: {
    color: '#71717a',
    fontSize: 11,
    marginTop: 2,
  },
});
