import { Position, type Node, type NodeProps } from "@xyflow/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";

import { useFilteredPhotos_GLOBAL } from "@/context/globals/filteredPhotosStore";
import { useSections_GLOBAL } from "@/context/globals/sectionsStore";
import type { GalleryPhoto } from "@/lib/galleryData";
import NodeWrapper from '@/middleware/windows/pipeline/NodeWrapper';
import { OutputHandle } from '@/middleware/windows/pipeline/OutputHandle';
import AllPhotosGridVirtuoso from '@/pages/components/AllPhotosGridVirtuoso';
import { Box, MenuItem, Select, Stack, Typography } from '@mui/material';

type SelectionNodeData = {
  photos?: GalleryPhoto[];
  limit?: number;
  typeName?: string;
  sectionId?: string;
};

function SelectionNode({
  data,
}: NodeProps<Node<SelectionNodeData>>) {
  // Same route-driven photo resolution as ScrollerDrawer.
  const { type_name = "", id: sectionId = "" } = useParams();
  const sections = useSections_GLOBAL();
  const photosFiltered = useFilteredPhotos_GLOBAL();

  const [selectedTypeName, setSelectedTypeName] = useState(
    () => data.typeName ?? type_name
  );
  const [selectedSectionId, setSelectedSectionId] = useState(
    () => data.sectionId ?? sectionId
  );

  const availableTypes = useMemo(
    () => sections.filter((section) => section.type && section.data?.length),
    [sections]
  );
  const selectedType = availableTypes.find(
    (section) => section.type === selectedTypeName
  );
  const availableSectionIds = useMemo<string[]>(
    () => (selectedType?.data ?? []).map((item: { name: string }) => item.name),
    [selectedType]
  );
  const showAll = selectedTypeName === "";

  const photos = useMemo(() => {
    if (showAll) return photosFiltered;

    const foundSet = selectedType?.data?.find(
      (item: { name: string; photos?: GalleryPhoto[] }) =>
        item.name === selectedSectionId
    );

    return foundSet?.photos ?? [];
  }, [showAll, photosFiltered, selectedSectionId, selectedType]);

  useEffect(() => {
    if (selectedTypeName && !selectedType) {
      setSelectedTypeName(availableTypes[0]?.type ?? "");
      return;
    }

    if (
      selectedTypeName &&
      !availableSectionIds.includes(selectedSectionId)
    ) {
      setSelectedSectionId(availableSectionIds[0] ?? "");
    }
  }, [availableSectionIds, availableTypes, selectedSectionId, selectedType, selectedTypeName]);

  // How many of the matched photos are actually used downstream.
  // Defaults to 10 once the real photo count is known, unless a
  // previously saved limit already exists.
  const [limit, setLimit] = useState(() => data.limit ?? Math.min(10, photos.length));
  const limitInitializedRef = useRef(data.limit !== undefined);

  useEffect(() => {
    if (limitInitializedRef.current || photos.length === 0) return;

    limitInitializedRef.current = true;
    setLimit(Math.min(10, photos.length));
  }, [photos.length]);

  useEffect(() => {
    setLimit((current) => Math.min(current, photos.length));
  }, [photos.length]);

  const selectedPhotos = useMemo(
    () => photos.slice(0, limit),
    [photos, limit]
  );

  // Mutate data in place (like the slider nodes) so the pipeline engine
  // always reads the latest value, even from a listener bound this render.
  useEffect(() => {
    data.photos = selectedPhotos;
    data.limit = limit;
    data.typeName = selectedTypeName;
    data.sectionId = selectedSectionId;

    window.dispatchEvent(new CustomEvent("pipeline:changed"));
  }, [data, selectedPhotos, limit, selectedSectionId, selectedTypeName]);

  return <>
    <NodeWrapper type="selection">
      <small>
        {selectedPhotos.length} of {photos.length} photo{photos.length === 1 ? "" : "s"} used
      </small>

      <Stack spacing={1}>
        <Typography variant="caption" color="text.secondary">
          Photo selection
        </Typography>
        <Select
          size="small"
          value={selectedTypeName}
          onChange={(event) => {
            const nextTypeName = event.target.value;
            const nextType = availableTypes.find(
              (section) => section.type === nextTypeName
            );
            setSelectedTypeName(nextTypeName);
            setSelectedSectionId(nextType?.data?.[0]?.name ?? "");
          }}
          displayEmpty
        >
          <MenuItem value="">All photos</MenuItem>
          {availableTypes.map((section) => (
            <MenuItem key={section.type} value={section.type}>
              {section.type}
            </MenuItem>
          ))}
        </Select>

        <Select
          size="small"
          value={showAll ? "" : selectedSectionId}
          onChange={(event) => setSelectedSectionId(event.target.value)}
          disabled={showAll || availableSectionIds.length === 0}
          displayEmpty
        >
          <MenuItem value="">
            <em>{showAll ? "All sections" : "Select a section"}</em>
          </MenuItem>
          {availableSectionIds.map((availableSectionId) => (
            <MenuItem key={availableSectionId} value={availableSectionId}>
              {availableSectionId}
            </MenuItem>
          ))}
        </Select>
      </Stack>

      <input
        type="range"
        min={0}
        max={photos.length}
        step={1}
        value={limit}
        onChange={(event) => setLimit(Number(event.target.value))}
      />

      <Box sx={{ height: '900px', width: '900px', overflow: 'auto' }}>
        <AllPhotosGridVirtuoso photos={selectedPhotos} width={200} height={100} />
      </Box>

    </NodeWrapper>
    <OutputHandle id="image" position={Position.Top} />
  </>;
}

export default SelectionNode;
