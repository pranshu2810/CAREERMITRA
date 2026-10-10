import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Save, Plus, X, Briefcase, Clock, Target, Sparkles } from 'lucide-react';
import useStore from '../store/useStore';
import { CAREER_NODES, SKILL_LEVELS } from '../data/careers';
import toast from 'react-hot-toast';

const COMMON_SKILLS = [
  'Python', 'JavaScript', 'React', 'Node.js', 'SQL', 'Machine Learning',
  'Docker', 'AWS', 'Git', 'Linux', 'TypeScript', 'Figma', 'Data Analysis',
  'REST APIs', 'CI/CD', 'Agile', 'MongoDB', 'PostgreSQL', 'GraphQL', 'TensorFlow',
];

export default function ProfileView() {
  const { userProfile, setUserProfile, setActiveView, savedRoadmaps, deleteSavedRoadmap, setSelectedCareer, setActiveRoadmap, getAllCareers } = useStore();
  const allCareers = getAllCareers();

  const [form, setForm] = useState({
    name: userProfile?.name || '',
    email: userProfile?.email || '',
    currentRole: userProfile?.currentRole || '',
    experience: userProfile?.experience || '0–1 years',
    skills: userProfile?.skills || [],
    skillInput: '',
    goalCareer: userProfile?.goalCareer || '',
    timelineMonths: userProfile?.timelineMonths || 12,
    learningStyle: userProfile?.learningStyle || 'Balanced',
    hoursPerWeek: userProfile?.hoursPerWeek || 15,
  });

  const [saved, setSaved] = useState(false);

  const update = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  const addSkill = (skill) => {
    if (!skill || form.skills.includes(skill)) return;
    update('skills', [...form.skills, skill]);
    update('skillInput', '');
  };

  const removeSkill = (skill) => update('skills', form.skills.filter((s) => s !== skill));

  const handleSave = () => {
    const profile = { ...form };
    delete profile.skillInput;
    setUserProfile(profile);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    toast.success('✅ Profile saved!', { style: { background: '#0e0a2e', color: '#f0ecff', border: '1px solid rgba(124,58,237,0.4)' } });
  };

  const loadSavedRoadmap = (roadmap) => {
    const career = allCareers.find((c) => c.id === roadmap.careerId);
    if (career) {
      setSelectedCareer(career);
      setActiveRoadmap(roadmap);
      setActiveView('roadmap');
    }
  };

  return (
    <div style={{ paddingTop: 88, minHeight: '100vh' }}>
      <div className="container" style={{ paddingTop: 32, paddingBottom: 60 }}>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 32 }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 900, marginBottom: 8 }}>
            <span className="text-gradient">My Profile</span>
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
            Your profile helps the AI generate hyper-personalized career roadmaps.
          </p>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 24 }}>

          {/* Left: Profile Form */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* Basic Info */}
            <motion.div className="glass-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} style={{ padding: 28 }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: 20, display: 'flex', gap: 8, alignItems: 'center' }}>
                <User size={18} color="var(--color-primary-glow)" /> Basic Info
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                {[
                  { id: 'profile-name', label: 'Full Name', field: 'name', placeholder: 'Priya Sharma' },
                  { id: 'profile-email', label: 'Email', field: 'email', placeholder: 'priya@example.com' },
                  { id: 'profile-role', label: 'Current Role', field: 'currentRole', placeholder: 'e.g. CS Student, Junior Dev' },
                ].map(({ id, label, field, placeholder }) => (
                  <div key={field} style={field === 'currentRole' ? { gridColumn: '1 / -1' } : {}}>
                    <label htmlFor={id} style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', display: 'block', marginBottom: 8 }}>{label}</label>
                    <input id={id} className="form-input" placeholder={placeholder} value={form[field]} onChange={(e) => update(field, e.target.value)} />
                  </div>
                ))}
                <div>
                  <label htmlFor="profile-experience" style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', display: 'block', marginBottom: 8 }}>Experience Level</label>
                  <select id="profile-experience" className="form-input" value={form.experience} onChange={(e) => update('experience', e.target.value)}>
                    {['0–1 years', '1–3 years', '3–5 years', '5+ years'].map((v) => <option key={v} value={v}>{v}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="profile-learning" style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', display: 'block', marginBottom: 8 }}>Learning Style</label>
                  <select id="profile-learning" className="form-input" value={form.learningStyle} onChange={(e) => update('learningStyle', e.target.value)}>
                    {['Visual', 'Hands-on Projects', 'Reading', 'Video Courses', 'Balanced'].map((v) => <option key={v} value={v}>{v}</option>)}
                  </select>
                </div>
              </div>
            </motion.div>

            {/* Career Goals */}
            <motion.div className="glass-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} style={{ padding: 28 }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: 20, display: 'flex', gap: 8, alignItems: 'center' }}>
                <Target size={18} color="var(--color-accent)" /> Career Goals
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label htmlFor="profile-goal" style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', display: 'block', marginBottom: 8 }}>Target Career</label>
                  <select id="profile-goal" className="form-input" value={form.goalCareer} onChange={(e) => update('goalCareer', e.target.value)}>
                    <option value="">Select a career goal…</option>
                    {allCareers.map((c) => <option key={c.id} value={c.id}>{c.icon} {c.title}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', display: 'block', marginBottom: 8 }}>
                    Timeline: {form.timelineMonths} months
                  </label>
                  <input
                    id="profile-timeline"
                    type="range" min={3} max={24} value={form.timelineMonths}
                    onChange={(e) => update('timelineMonths', Number(e.target.value))}
                    style={{ width: '100%', accentColor: 'var(--color-primary-glow)' }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--color-text-muted)', marginTop: 4 }}>
                    <span>3 mo</span><span>24 mo</span>
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', display: 'block', marginBottom: 8 }}>
                    Study Hours/Week: {form.hoursPerWeek}h
                  </label>
                  <input
                    id="profile-hours"
                    type="range" min={5} max={60} step={5} value={form.hoursPerWeek}
                    onChange={(e) => update('hoursPerWeek', Number(e.target.value))}
                    style={{ width: '100%', accentColor: 'var(--color-accent)' }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--color-text-muted)', marginTop: 4 }}>
                    <span>5h</span><span>60h</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Skills */}
            <motion.div className="glass-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} style={{ padding: 28 }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: 20, display: 'flex', gap: 8, alignItems: 'center' }}>
                <Sparkles size={18} color="var(--color-gold)" /> Current Skills
              </h2>

              {/* Quick-add chips */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginBottom: 10 }}>Quick add:</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {COMMON_SKILLS.filter((s) => !form.skills.includes(s)).slice(0, 12).map((skill) => (
                    <button
                      key={skill}
                      className="btn btn-ghost btn-sm"
                      style={{ fontSize: '0.72rem', padding: '3px 10px' }}
                      onClick={() => addSkill(skill)}
                    >
                      <Plus size={10} /> {skill}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom input */}
              <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
                <input
                  id="profile-skill-input"
                  className="form-input"
                  placeholder="Type a custom skill…"
                  value={form.skillInput}
                  onChange={(e) => update('skillInput', e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') addSkill(form.skillInput.trim()); }}
                  style={{ flex: 1 }}
                />
                <button className="btn btn-accent btn-sm" onClick={() => addSkill(form.skillInput.trim())}>Add</button>
              </div>

              {/* Current skills */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {form.skills.map((skill) => (
                  <div key={skill} style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    padding: '5px 12px',
                    background: 'rgba(124,58,237,0.15)',
                    border: '1px solid rgba(124,58,237,0.3)',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.8rem', color: '#c4b5fd',
                  }}>
                    {skill}
                    <button onClick={() => removeSkill(skill)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#c4b5fd', padding: 0, display: 'flex' }}>
                      <X size={12} />
                    </button>
                  </div>
                ))}
                {form.skills.length === 0 && <span style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>No skills added yet</span>}
              </div>
            </motion.div>

            {/* Save Button */}
            <motion.button
              id="profile-save"
              className="btn btn-primary btn-lg"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSave}
              style={{ justifyContent: 'center', position: 'relative' }}
            >
              <Save size={18} />
              {saved ? '✓ Profile Saved!' : 'Save Profile'}
            </motion.button>
          </div>

          {/* Right: Saved Roadmaps + Summary */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* Profile Summary Card */}
            <motion.div className="glass-card" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} style={{ padding: 24 }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: 16, fontSize: '1rem' }}>👤 Profile Summary</h3>
              {userProfile ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {[
                    { icon: '🧑‍💼', label: 'Name', value: userProfile.name || '—' },
                    { icon: '💼', label: 'Role', value: userProfile.currentRole || '—' },
                    { icon: '📅', label: 'Experience', value: userProfile.experience || '—' },
                    { icon: '🎯', label: 'Goal', value: CAREER_NODES.find((c) => c.id === userProfile.goalCareer)?.title || '—' },
                    { icon: '⏱️', label: 'Timeline', value: `${userProfile.timelineMonths || 12} months` },
                    { icon: '🛠️', label: 'Skills', value: `${userProfile.skills?.length || 0} skills` },
                  ].map(({ icon, label, value }) => (
                    <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      <span style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>{icon} {label}</span>
                      <span style={{ fontSize: '0.82rem', fontWeight: 500 }}>{value}</span>
                    </div>
                  ))}
                  {userProfile.skills?.length > 0 && (
                    <div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: 8 }}>Skills:</div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                        {userProfile.skills.slice(0, 8).map((s) => (
                          <span key={s} style={{ fontSize: '0.7rem', padding: '2px 8px', background: 'rgba(124,58,237,0.12)', color: '#c4b5fd', borderRadius: 'var(--radius-full)', border: '1px solid rgba(124,58,237,0.2)' }}>{s}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  <button className="btn btn-primary btn-sm" style={{ marginTop: 8, justifyContent: 'center' }} onClick={() => {
                    const goalCareer = CAREER_NODES.find((c) => c.id === userProfile.goalCareer);
                    if (goalCareer) { useStore.getState().setSelectedCareer(goalCareer); useStore.getState().setActiveView('roadmap'); }
                  }}>
                    <Sparkles size={14} /> Generate Roadmap
                  </button>
                </div>
              ) : (
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>Save your profile to see a summary.</p>
              )}
            </motion.div>

            {/* Saved Roadmaps */}
            <motion.div className="glass-card" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 }} style={{ padding: 24 }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: 16, fontSize: '1rem' }}>💾 Saved Roadmaps ({savedRoadmaps.length})</h3>
              {savedRoadmaps.length === 0 ? (
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>No saved roadmaps yet. Generate one and click Save.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {savedRoadmaps.map((r) => {
                    const career = CAREER_NODES.find((c) => c.id === r.careerId);
                    if (!career) return null;
                    return (
                      <div key={r.careerId} style={{
                        display: 'flex', gap: 12, alignItems: 'center',
                        padding: '12px 14px',
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.07)',
                        borderRadius: 10,
                      }}>
                        <span style={{ fontSize: 22 }}>{career.icon}</span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontWeight: 600, fontSize: '0.88rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{career.title}</div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', marginTop: 2 }}>
                            {new Date(r.generatedAt).toLocaleDateString()} · {r.skillMatch}% match
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button className="btn btn-ghost btn-sm" style={{ padding: '4px 8px', fontSize: '0.72rem' }} onClick={() => loadSavedRoadmap(r)}>Open</button>
                          <button onClick={() => deleteSavedRoadmap(r.careerId)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', padding: 4 }}>
                            <X size={14} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
