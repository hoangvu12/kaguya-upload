const MAPPING_NAMESPACE = "kaguya_mapping";

export interface Mapping {
  anilistId: number;
  sourceId: string;
  mediaId: string;
  extra?: Record<string, string>;
}

export function getMediaId(anilistId: number, sourceId: string): Mapping {
  try {
    const mappings = getMappings();

    const mapping = mappings.find(
      (media) => media?.sourceId === sourceId && media.anilistId === anilistId
    );

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
    const mappings = getMappings();

    const mapping = mappings.find(
      (media) => media?.sourceId === sourceId && media.anilistId === anilistId
    );

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

export function getMappings(): Mapping[] {
  try {
    const data = localStorage.getItem(MAPPING_NAMESPACE);

    if (!data) return [];

    const parsedData: Mapping[] = JSON.parse(data);

    if (!parsedData?.length) return [];

    return parsedData;
  } catch (err) {
    console.error("Failed to get mappings", err);

    return [];
  }
}
