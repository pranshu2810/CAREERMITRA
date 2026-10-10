import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { careerClusters, defaultCareers } from './data/defaultBlueprints.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// 1. Get career clusters and all available roles
app.get('/api/careers', (req, res) => {
  res.json({
    success: true,
    clusters: careerClusters,
    careers: defaultCareers.map(c => ({
      id: c.id,
      title: c.title,
      cluster: c.cluster,
      clusterName: c.clusterName,
      icon: c.icon,
      tagline: c.tagline,
      salaryRange: c.salaryRange,
      growthRate: c.growthRate,
      demand: c.demand,
      difficulty: c.difficulty,
      avgMonths: c.avgMonths,
      radarStats: c.radarStats,
      skillCount: c.skillsTree.reduce((acc, p) => acc + p.skills.length, 0)
    }))
  });
});

// 2. Get specific career by ID
app.get('/api/career/:id', (req, res) => {
  const career = defaultCareers.find(c => c.id === req.params.id);
  if (!career) {
    return res.status(404).json({ success: false, message: 'Career blueprint not found' });
  }
  res.json({ success: true, career });
});

// 3. Helper: Generate roadmap with Google Gemini API
async function callGeminiRoadmap(apiKey, roleTitle, backgroundSkills, targetMonths, hoursPerWeek) {
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
  
  const systemPrompt = `You are CareerMitra AI, an elite Cosmic Career Navigator and Staff Principal Engineer.
Generate an exhaustive, highly structured, production-grade learning roadmap for the target career: "${roleTitle}".
The user has background skills: "${backgroundSkills || 'None / Beginner'}".
Target timeline: ${targetMonths || 6} months.
Available study time: ${hoursPerWeek || 15} hours/week.

You MUST respond strictly with valid JSON without any markdown formatting or surrounding backticks. The JSON schema must strictly match:
{
  "id": "generated-${Date.now()}",
  "title": "${roleTitle}",
  "tagline": "A high-impact summary",
  "salaryRange": "$110k - $190k / yr",
  "growthRate": "+28%",
  "demand": "High",
  "difficulty": "Intermediate to Advanced",
  "avgMonths": ${targetMonths || 6},
  "radarStats": { "math": 75, "coding": 85, "systems": 80, "mlCore": 70, "cloud": 75, "product": 65 },
  "skillsTree": [
    {
      "phaseId": 1,
      "phaseTitle": "Phase 1: Foundations",
      "phaseDesc": "Foundational technical core",
      "skills": [
        {
          "id": "skill-1",
          "title": "Title of Skill",
          "level": "Foundational",
          "estHours": 25,
          "tags": ["Tag1", "Tag2"],
          "description": "Comprehensive explanation of this competency",
          "prerequisites": [],
          "resources": [
            { "type": "docs", "title": "Resource Title", "url": "https://..." }
          ],
          "project": {
            "title": "Real-world portfolio capstone title",
            "brief": "Detailed project brief",
            "deliverables": ["Deliverable 1", "Deliverable 2"]
          },
          "quiz": [
            {
              "question": "Deep technical question?",
              "options": ["A", "B", "C", "D"],
              "correctIndex": 1,
              "explanation": "Why B is correct"
            }
          ]
        }
      ]
    }
  ]
}
Include exactly 4 progressive phases with 2 highly detailed skills each (8 total skills).`;

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: systemPrompt }] }],
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.3
      }
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!rawText) throw new Error("Empty response received from Gemini");

  return JSON.parse(rawText);
}

// 4. Generate AI Roadmap endpoint
app.post('/api/roadmap/generate', async (req, res) => {
  try {
    const { roleId, customRoleTitle, backgroundSkills = [], targetMonths = 6, hoursPerWeek = 15, apiKey } = req.body;
    const effectiveApiKey = apiKey || process.env.GEMINI_API_KEY;

    let baseCareer = defaultCareers.find(c => c.id === roleId);

    // If custom title requested or external Gemini API key provided, attempt Gemini first
    if (effectiveApiKey && (customRoleTitle || !baseCareer)) {
      try {
        const titleToGenerate = customRoleTitle || (baseCareer ? baseCareer.title : 'Software Engineer');
        const aiRoadmap = await callGeminiRoadmap(
          effectiveApiKey,
          titleToGenerate,
          Array.isArray(backgroundSkills) ? backgroundSkills.join(', ') : backgroundSkills,
          targetMonths,
          hoursPerWeek
        );
        return res.json({
          success: true,
          source: 'gemini-ai',
          roadmap: aiRoadmap
        });
      } catch (geminiErr) {
        console.warn('Gemini API call failed, falling back to synthesis engine:', geminiErr.message);
      }
    }

    // If no custom title matched, use base career or default to AI engineer
    if (!baseCareer) {
      if (customRoleTitle) {
        // Find best match in our rich catalog
        const match = defaultCareers.find(c => 
          c.title.toLowerCase().includes(customRoleTitle.toLowerCase()) ||
          c.cluster.toLowerCase().includes(customRoleTitle.toLowerCase())
        );
        baseCareer = match ? JSON.parse(JSON.stringify(match)) : JSON.parse(JSON.stringify(defaultCareers[0]));
        baseCareer.title = customRoleTitle;
      } else {
        baseCareer = JSON.parse(JSON.stringify(defaultCareers[0]));
      }
    } else {
      baseCareer = JSON.parse(JSON.stringify(baseCareer));
    }

    // Synthesize & adapt roadmap based on user background, target pace, and hours per week
    const bgSkillList = Array.isArray(backgroundSkills) 
      ? backgroundSkills.map(s => s.toLowerCase().trim())
      : backgroundSkills.toLowerCase().split(',').map(s => s.trim()).filter(Boolean);

    let totalSynthesizedHours = 0;
    const paceMultiplier = hoursPerWeek > 0 ? (15 / hoursPerWeek) : 1;

    baseCareer.skillsTree.forEach(phase => {
      phase.skills.forEach(skill => {
        // Adjust estimated hours based on pace
        skill.estHours = Math.max(10, Math.round(skill.estHours * Math.min(1.5, Math.max(0.6, paceMultiplier))));
        totalSynthesizedHours += skill.estHours;

        // Auto-detect if user already has background skill
        const matched = bgSkillList.some(bg => 
          skill.tags.some(tag => tag.toLowerCase().includes(bg)) ||
          skill.title.toLowerCase().includes(bg)
        );
        skill.status = matched ? 'exempt' : 'not_started';
      });
    });

    baseCareer.totalHours = totalSynthesizedHours;
    baseCareer.userPace = { hoursPerWeek, targetMonths };
    baseCareer.createdAt = new Date().toISOString();

    res.json({
      success: true,
      source: 'synthesis-engine',
      roadmap: baseCareer
    });
  } catch (error) {
    console.error('Roadmap generation error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// 5. Dynamic Replanning Endpoint
app.post('/api/roadmap/replan', (req, res) => {
  try {
    const { roadmap, completedSkills = [], exemptSkills = [], targetGoal, hoursPerWeek = 15 } = req.body;
    if (!roadmap || !roadmap.skillsTree) {
      return res.status(400).json({ success: false, message: 'Invalid roadmap payload' });
    }

    const updatedRoadmap = JSON.parse(JSON.stringify(roadmap));
    const completedSet = new Set(completedSkills);
    const exemptSet = new Set(exemptSkills);
    const satisfiedSet = new Set([...completedSkills, ...exemptSkills]);

    let totalSkills = 0;
    let completedCount = 0;
    let remainingHours = 0;
    let totalHours = 0;
    let earnedXP = 0;

    updatedRoadmap.skillsTree.forEach(phase => {
      phase.skills.forEach(skill => {
        totalSkills++;
        totalHours += skill.estHours || 20;

        if (completedSet.has(skill.id)) {
          skill.status = 'completed';
          completedCount++;
          earnedXP += (skill.estHours || 20) * 10;
        } else if (exemptSet.has(skill.id)) {
          skill.status = 'exempt';
          completedCount++;
          earnedXP += 50; // Bonus for prior knowledge
        } else {
          // Check prerequisites
          const prereqsMet = (skill.prerequisites || []).every(pr => satisfiedSet.has(pr));
          skill.status = prereqsMet ? 'available' : 'locked';
          remainingHours += (skill.estHours || 20);
        }
      });
    });

    const progressPercent = totalSkills > 0 ? Math.round((completedCount / totalSkills) * 100) : 0;
    const weeksRemaining = hoursPerWeek > 0 ? Math.ceil(remainingHours / hoursPerWeek) : 0;
    const estCompletionDate = new Date();
    estCompletionDate.setDate(estCompletionDate.getDate() + (weeksRemaining * 7));

    // Dynamic replanner insights
    const nextRecommended = [];
    updatedRoadmap.skillsTree.forEach(phase => {
      phase.skills.forEach(skill => {
        if (skill.status === 'available') {
          nextRecommended.push({
            id: skill.id,
            title: skill.title,
            phase: phase.phaseTitle,
            estHours: skill.estHours
          });
        }
      });
    });

    res.json({
      success: true,
      roadmap: updatedRoadmap,
      metrics: {
        totalSkills,
        completedCount,
        progressPercent,
        totalHours,
        remainingHours,
        weeksRemaining,
        estCompletionDate: estCompletionDate.toISOString().split('T')[0],
        earnedXP,
        level: Math.floor(earnedXP / 200) + 1,
        nextRecommended: nextRecommended.slice(0, 3)
      }
    });
  } catch (error) {
    console.error('Replanning error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// 6. Career Comparison Matrix Endpoint
app.post('/api/career/compare', (req, res) => {
  try {
    const { roleIdA, roleIdB } = req.body;
    const careerA = defaultCareers.find(c => c.id === roleIdA);
    const careerB = defaultCareers.find(c => c.id === roleIdB);

    if (!careerA || !careerB) {
      return res.status(404).json({ success: false, message: 'One or both career roles not found' });
    }

    // Extract all tags/skills
    const skillsA = new Set();
    const skillsB = new Set();

    careerA.skillsTree.forEach(p => p.skills.forEach(s => {
      skillsA.add(s.title);
      (s.tags || []).forEach(t => skillsA.add(t));
    }));

    careerB.skillsTree.forEach(p => p.skills.forEach(s => {
      skillsB.add(s.title);
      (s.tags || []).forEach(t => skillsB.add(t));
    }));

    const commonSkills = [...skillsA].filter(x => skillsB.has(x));
    const uniqueToA = [...skillsA].filter(x => !skillsB.has(x));
    const uniqueToB = [...skillsB].filter(x => !skillsA.has(x));

    const totalUnique = new Set([...skillsA, ...skillsB]).size;
    const overlapPercent = totalUnique > 0 ? Math.round((commonSkills.length / totalUnique) * 100) : 0;

    res.json({
      success: true,
      comparison: {
        careerA: {
          id: careerA.id,
          title: careerA.title,
          cluster: careerA.clusterName,
          salaryRange: careerA.salaryRange,
          growthRate: careerA.growthRate,
          demand: careerA.demand,
          avgMonths: careerA.avgMonths,
          radarStats: careerA.radarStats
        },
        careerB: {
          id: careerB.id,
          title: careerB.title,
          cluster: careerB.clusterName,
          salaryRange: careerB.salaryRange,
          growthRate: careerB.growthRate,
          demand: careerB.demand,
          avgMonths: careerB.avgMonths,
          radarStats: careerB.radarStats
        },
        metrics: {
          overlapPercent,
          commonSkillsCount: commonSkills.length,
          commonSkills: commonSkills.slice(0, 12),
          uniqueToA: uniqueToA.slice(0, 10),
          uniqueToB: uniqueToB.slice(0, 10)
        }
      }
    });
  } catch (error) {
    console.error('Comparison error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// 7. Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    app: 'CareerMitra - Cosmic AI Career Navigator',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Fallback route for SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🌌 CareerMitra Server is orbiting on http://localhost:${PORT}`);
});
