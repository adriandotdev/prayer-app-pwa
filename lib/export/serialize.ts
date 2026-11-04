import type { Database } from "@/lib/database.types";

type Tables = Database["public"]["Tables"];
type Row<T extends keyof Tables> = Tables[T]["Row"];

export type ExportInput = {
  userId: string;
  email: string | null;
  profile: Row<"profiles"> | null;
  prayers: Row<"prayers">[];
  collections: Row<"collections">[];
  collectionPrayers: Row<"collection_prayers">[];
  favorites: Row<"prayer_favorites">[];
  intentions: Row<"intentions">[];
  rosarySessions: Row<"rosary_sessions">[];
  exportedAt: Date;
};

export const EXPORT_VERSION = 1;

/**
 * Shapes the signed-in user's rows into the downloadable export. Pure so it can be tested
 * without Supabase. Only the user's own prayers are included (starter prayers are shared
 * content), but favorites that point at starter prayers are kept by prayer id. Internal
 * columns (the generated search vector and the deprecated is_favorite flag) are left out.
 */
export function buildExport(input: ExportInput) {
  const ownPrayers = input.prayers.filter((p) => p.user_id === input.userId);
  const ownCollectionIds = new Set(input.collections.map((c) => c.id));

  return {
    version: EXPORT_VERSION,
    exportedAt: input.exportedAt.toISOString(),
    account: { id: input.userId, email: input.email },
    profile: input.profile
      ? {
          displayName: input.profile.display_name,
          timezone: input.profile.timezone,
          preferredLanguage: input.profile.preferred_language,
          createdAt: input.profile.created_at,
        }
      : null,
    prayers: ownPrayers.map((p) => ({
      id: p.id,
      title: p.title,
      body: p.body,
      source: p.source,
      createdAt: p.created_at,
      updatedAt: p.updated_at,
    })),
    collections: [...input.collections]
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((c) => ({
        id: c.id,
        name: c.name,
        createdAt: c.created_at,
        prayerIds: input.collectionPrayers
          .filter((cp) => cp.collection_id === c.id && ownCollectionIds.has(cp.collection_id))
          .sort((a, b) => a.sort_order - b.sort_order)
          .map((cp) => cp.prayer_id),
      })),
    favorites: input.favorites.map((f) => ({ prayerId: f.prayer_id, createdAt: f.created_at })),
    intentions: input.intentions.map((i) => ({
      id: i.id,
      text: i.text,
      isAnswered: i.is_answered,
      answeredAt: i.answered_at,
      createdAt: i.created_at,
    })),
    rosarySessions: input.rosarySessions.map((s) => ({
      id: s.id,
      mysterySet: s.mystery_set,
      completedAt: s.completed_at,
      intentionId: s.intention_id,
    })),
  };
}
