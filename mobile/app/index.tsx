import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
// Local fallback for CategoryTabs component when the original module cannot be resolved.
// This keeps the app working during lint/type checks and in environments where the
// ../src/components/CategoryTabs path isn't available.
function CategoryTabs({
  categories,
  selected,
  onSelect,
}: {
  categories: string[];
  selected: string;
  onSelect: (c: string) => void;
}) {
  return (
    <View style={{ flexDirection: 'row', gap: 8, paddingHorizontal: 16, marginVertical: 12 }}>
      {categories.map((c) => (
        <Pressable
          key={c}
          onPress={() => onSelect(c)}
          style={{
            paddingHorizontal: 12,
            paddingVertical: 8,
            borderRadius: 20,
            backgroundColor: c === selected ? colors.accent : 'transparent',
          }}
        >
          <Text style={{ color: c === selected ? '#fff' : colors.textSecondary }}>{c}</Text>
        </Pressable>
      ))}
    </View>
  );
}

type Dish = {
  id: number;
  nom: string;
  prix: number;
  categorie: string;
  disponible: boolean;
};

function DishCard({
  dish,
  onPress,
  onToggleAvailability,
}: {
  dish: Dish;
  onPress: () => void;
  onToggleAvailability: (value: boolean) => void;
}) {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{dish.nom}</Text>
        <Text style={styles.cardPrice}>{dish.prix} DA</Text>
      </View>
      <Text style={styles.cardCategory}>{dish.categorie}</Text>
      <Pressable
        style={[
          styles.availabilityButton,
          dish.disponible ? styles.available : styles.unavailable,
        ]}
        onPress={() => onToggleAvailability(!dish.disponible)}
      >
        <Text style={dish.disponible ? styles.availableText : styles.unavailableText}>
          {dish.disponible ? 'Available' : 'Unavailable'}
        </Text>
      </Pressable>
    </Pressable>
  );
}

function BottomNavBar({ active }: { active: string }) {
  return (
    <View style={styles.bottomNav}>
      <Pressable style={styles.bottomNavItem}>
        <Ionicons name="home-outline" size={22} color={active === 'menu' ? colors.accent : colors.textSecondary} />
      </Pressable>
      <Pressable style={styles.bottomNavItem}>
        <Ionicons name="receipt-outline" size={22} color={active === 'orders' ? colors.accent : colors.textSecondary} />
      </Pressable>
      <Pressable style={styles.bottomNavItem}>
        <Ionicons name="person-outline" size={22} color={active === 'profile' ? colors.accent : colors.textSecondary} />
      </Pressable>
    </View>
  );
}

// Local fallback for theme colors to avoid unresolved import during lint/type checks
const colors = {
  background: '#000000',
  textPrimary: '#002b90',
  textSecondary: '#b40000',
  textMuted: '#007521',
  surface: '#F8FAFC',
  accent: '#7c8d00',
};


const MOCK_DISHES: Dish[] = [
  { id: 1, nom: 'Tacos Poulet', prix: 45, categorie: 'Tacos', disponible: true },
  { id: 2, nom: 'Cheeseburger XL', prix: 65, categorie: 'Burgers', disponible: false },
  { id: 3, nom: 'Coca-Cola 33cl', prix: 15, categorie: 'Drinks', disponible: true },
];

const CATEGORIES = ['All', 'Tacos', 'Burgers', 'Drinks'];

export default function MenuScreen() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Tacos');
  const [dishes, setDishes] = useState<Dish[]>(MOCK_DISHES);

  const filtered = useMemo(() => {
    return dishes.filter((d) => {
      const matchesCategory = category === 'All' || d.categorie === category;
      const matchesSearch = d.nom.toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [dishes, category, search]);

  function toggleAvailability(id: number, value: boolean) {
    setDishes((prev) => prev.map((d) => (d.id === id ? { ...d, disponible: value } : d)));
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Menu</Text>
        <View style={styles.headerIcons}>
          <Ionicons name="star-outline" size={20} color={colors.textSecondary} />
          <Ionicons name="thumbs-up-outline" size={20} color={colors.textSecondary} />
        </View>
      </View>

      <View style={styles.searchRow}>
        <Ionicons name="search" size={18} color={colors.textMuted} />
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search a dish..."
          placeholderTextColor={colors.textMuted}
          style={styles.searchInput}
        />
      </View>

      <CategoryTabs categories={CATEGORIES} selected={category} onSelect={setCategory} />

      <FlatList
        data={filtered}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={{ paddingBottom: 100 }}
        renderItem={({ item }) => (
          <DishCard
            dish={item}
            onPress={() => router.push(`/${item.id}`)}
            onToggleAvailability={(value) => toggleAvailability(item.id, value)}
          />
        )}
      />

      <Pressable style={styles.fab} onPress={() => router.push('/modal')}>
        <Ionicons name="add" size={28} color="#fff" />
      </Pressable>

      <BottomNavBar active="menu" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16 },
  title: { color: colors.textPrimary, fontSize: 20, fontWeight: '700' },
  headerIcons: { flexDirection: 'row', gap: 14 },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.surface,
    marginHorizontal: 16,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  searchInput: { flex: 1, color: colors.textPrimary },
  card: {
    backgroundColor: colors.surface,
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: { color: colors.textPrimary, fontSize: 16, fontWeight: '700' },
  cardPrice: { color: colors.textSecondary, fontSize: 14 },
  cardCategory: { color: colors.textMuted, fontSize: 12, marginBottom: 12 },
  availabilityButton: { alignSelf: 'flex-start', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 12 },
  available: { backgroundColor: '#22c55e' },
  unavailable: { backgroundColor: '#f87171' },
  availableText: { color: '#fff', fontWeight: '600' },
  unavailableText: { color: '#fff', fontWeight: '600' },
  bottomNav: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 12,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  bottomNavItem: { padding: 10, borderRadius: 16 },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 90,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.accent,
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
  },
});