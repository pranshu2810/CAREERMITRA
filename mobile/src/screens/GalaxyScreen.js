import React, { useState, useEffect } from 'react';
import {
  StyleSheet, View, Text, FlatList, TouchableOpacity, SafeAreaView, TextInput, ActivityIndicator
} from 'react-native';
import { api } from '../api/config';

// Fallback catalog if backend is not reachable locally
const DEFAULT_CAREERS = [
  { id: 'ai-engineer', title: 'AI Engineer', cluster: 'AI & Data Intelligence', salary: '$125k - $210k', demand: 'High', months: 6, growth: '+34%' },
  { id: 'fullstack-architect', title: 'Full-Stack Architect', cluster: 'Software Engineering', salary: '$115k - $185k', demand: 'Very High', months: 5, growth: '+22%' },
  { id: 'cloud-devops', title: 'Cloud DevOps Engineer', cluster: 'Cloud & Infrastructure', salary: '$120k - $190k', demand: 'High', months: 5, growth: '+28%' },
  { id: 'cybersecurity-analyst', title: 'Cybersecurity Specialist', cluster: 'Security & Privacy', salary: '$110k - $175k', demand: 'Extreme', months: 6, growth: '+32%' },
  { id: 'data-scientist', title: 'Data Scientist', cluster: 'AI & Data Intelligence', salary: '$115k - $180k', demand: 'High', months: 6, growth: '+26%' },
  { id: 'mobile-engineer', title: 'Mobile App Engineer', cluster: 'Mobile & IoT', salary: '$105k - $165k', demand: 'High', months: 4, growth: '+20%' },
];

export default function GalaxyScreen({ onSelectCareer, user }) {
  const [careers, setCareers] = useState(DEFAULT_CAREERS);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const res = await api.getCareers();
      if (res && res.careers && res.careers.length > 0) {
        setCareers(res.careers.map(c => ({
          id: c.id,
          title: c.title,
          cluster: c.clusterName || c.cluster,
          salary: c.salaryRange,
          demand: c.demand,
          months: c.avgMonths,
          growth: c.growthRate,
        })));
      }
      setLoading(false);
    }
    loadData();
  }, []);

  const clusters = ['All', 'AI & Data', 'Software', 'Cloud', 'Security'];

  const filtered = careers.filter(c => {
    const matchesSearch = c.title.toLowerCase().includes(search.toLowerCase()) ||
                          c.cluster.toLowerCase().includes(search.toLowerCase());
    if (filter === 'All') return matchesSearch;
    return matchesSearch && c.cluster.toLowerCase().includes(filter.toLowerCase().replace(' & data', ''));
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Top Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Career Galaxy 🌌</Text>
            <Text style={styles.subtitle}>
              Explorer: {user?.name || 'Guest'} · Level {user?.level || 1}
            </Text>
          </View>
          <View style={styles.xpBadge}>
            <Text style={styles.xpText}>✦ {user?.xp || 150} XP</Text>
          </View>
        </View>

        {/* Search */}
        <TextInput
          style={styles.searchBar}
          placeholder="Search cosmic roles or domains..."
          placeholderTextColor="#71717a"
          value={search}
          onChangeText={setSearch}
        />

        {/* Filters */}
        <View style={styles.filterRow}>
          {clusters.map(cat => (
            <TouchableOpacity
              key={cat}
              style={[styles.filterChip, filter === cat && styles.activeFilterChip]}
              onPress={() => setFilter(cat)}
            >
              <Text style={[styles.filterText, filter === cat && styles.activeFilterText]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Career Constellation Cards */}
        {loading ? (
          <ActivityIndicator color="#7c3aed" style={{ marginTop: 40 }} />
        ) : (
          <FlatList
            data={filtered}
            keyExtractor={item => item.id}
            contentContainerStyle={{ paddingBottom: 80 }}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.careerCard}
                activeOpacity={0.8}
                onPress={() => onSelectCareer(item)}
              >
                <View style={styles.cardTop}>
                  <Text style={styles.clusterTag}>{item.cluster}</Text>
                  <Text style={styles.growthBadge}>{item.growth}</Text>
                </View>

                <Text style={styles.careerTitle}>{item.title}</Text>

                <View style={styles.cardBottom}>
                  <Text style={styles.salaryText}>{item.salary}</Text>
                  <Text style={styles.durationText}>{item.months} months</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#060417',
  },
  container: {
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#fff',
  },
  subtitle: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 2,
  },
  xpBadge: {
    backgroundColor: 'rgba(124, 58, 237, 0.25)',
    borderWidth: 1,
    borderColor: 'rgba(124, 58, 237, 0.5)',
    borderRadius: 999,
    paddingVertical: 5,
    paddingHorizontal: 12,
  },
  xpText: {
    color: '#c4b5fd',
    fontSize: 12,
    fontWeight: '700',
  },
  searchBar: {
    backgroundColor: '#100c28',
    borderWidth: 1,
    borderColor: 'rgba(124, 58, 237, 0.3)',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    color: '#fff',
    fontSize: 14,
    marginBottom: 12,
  },
  filterRow: {
    flexDirection: 'row',
    marginBottom: 16,
    flexWrap: 'wrap',
    gap: 8,
  },
  filterChip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 999,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  activeFilterChip: {
    backgroundColor: 'rgba(124, 58, 237, 0.35)',
    borderWidth: 1,
    borderColor: '#7c3aed',
  },
  filterText: {
    color: '#a1a1aa',
    fontSize: 12,
  },
  activeFilterText: {
    color: '#fff',
    fontWeight: '700',
  },
  careerCard: {
    backgroundColor: '#100c28',
    borderWidth: 1,
    borderColor: 'rgba(124, 58, 237, 0.25)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  clusterTag: {
    color: '#67e8f9',
    fontSize: 11,
    fontWeight: '600',
  },
  growthBadge: {
    color: '#10b981',
    fontSize: 12,
    fontWeight: '700',
  },
  careerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 12,
  },
  cardBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
  },
  salaryText: {
    color: '#c4b5fd',
    fontSize: 13,
    fontWeight: '600',
  },
  durationText: {
    color: '#94a3b8',
    fontSize: 12,
  },
});
