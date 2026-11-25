import { describe, expect, it } from "vitest";
import { contentType, defaultFilters, language, matches, shadowReach } from "@/lib/filters";
import type { Video } from "@/lib/types";
const v = (o: Partial<Video> = {}): Video => ({ id: "1", platform: "tiktok", url: "", thumbnailUrl: "", creator: { handle: "a", name: "a", followers: 10_000 }, publishedAt: new Date().toISOString(), durationSeconds: 20, views: 10_000, likes: 0, comments: 0, shares: 0, engagementRate: 5, caption: "", transcript: "", onScreenText: [], hashtags: [], score: 50, scoreReason: "", ...o });
describe("filters", () => {
  it("shadow reach: promo spoken but caption silent = pub cachée", () => expect(shadowReach(v({ transcript: "j'utilise ce produit, lien en bio" }))).toBe("cachee"));
  it("shadow reach: #ad in hashtags = pub déclarée", () => expect(shadowReach(v({ transcript: "lien en bio, code promo", hashtags: ["ad"] }))).toBe("declaree"));
  it("shadow reach: no promo = sans pub", () => expect(shadowReach(v({ transcript: "ma routine du soir" }))).toBe("aucune"));
  it("detects ads by #ad hashtag", () => expect(contentType(v({ hashtags: ["ad"] }))).toBe("ads"));
  it("filters by min views", () => expect(matches(v({ views: 5000 }), { ...defaultFilters, minViews: 10_000 })).toBe(false));
  it("filters by period", () => expect(matches(v({ publishedAt: "2020-01-01" }), { ...defaultFilters, period: "30" })).toBe(false));
  it("#adorable is not a disclosure", () => expect(shadowReach(v({ hashtags: ["adorable"], transcript: "j'utilise ce produit, lien en bio" }))).toBe("cachee"));
  it("detects French despite shared words", () => expect(language(v({ caption: "que la crème est top pour la peau, je la mets avec mon sérum" }))).toBe("fr"));
  it("unknown duration/followers excluded when filtered", () => {
    expect(matches(v({ durationSeconds: 0 }), { ...defaultFilters, duration: "short" })).toBe(false);
    expect(matches(v({ creator: { handle: "a", name: "a", followers: 0 } }), { ...defaultFilters, creatorSize: "nano" })).toBe(false);
  });
});
