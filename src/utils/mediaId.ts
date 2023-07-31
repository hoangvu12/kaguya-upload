const MAPPING_NAMESPACE = "kaguya_mapping";

export interface Mapping {
  anilistId: number;
  sourceId: string;
  mediaId: string;
  extra?: Record<string, string>;
}

export function getMediaId(anilistId: number, sourceId: string): Mapping {
  try {
    const mappings = getMappings(anilistId);

    const mapping = mappings.find((media) => media?.sourceId === sourceId);

    return mapping;
  } catch (err) {
    console.error("Failed to get mapping", err);

    return null;
  }
}

export function saveMapping(
  anilistId: number,
  sourceId: string,
  mediaId: string,
  extra?: Record<string, string>
) {
  try {
    const mappings = getMappings(anilistId);

    const mapping = mappings.find((media) => media?.sourceId === sourceId);

    if (mapping) {
      mapping.mediaId = mediaId;
    } else {
      mappings.push({ anilistId, sourceId, mediaId, extra });
    }

    localStorage.setItem(MAPPING_NAMESPACE, JSON.stringify(mappings));

    return true;
  } catch (err) {
    console.error("Failed to save mapping", err);

    return false;
  }
}

export function getMappings(anilistId: number): Mapping[] {
  try {
    const data = localStorage.getItem(MAPPING_NAMESPACE);

    if (!data) return [];

    const parsedData: Mapping[] = JSON.parse(data);

    if (!parsedData?.length) return [];

    return parsedData.filter((map) => map.anilistId === anilistId);
  } catch (err) {
    console.error("Failed to get mappings", err);

    return [];
  }
}
