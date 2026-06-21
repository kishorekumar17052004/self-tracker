// Tailwind's JIT scanner needs to see full literal class names somewhere in
// the source, so this map spells every class out instead of building strings
// like `bg-track-${accent}` at runtime.

export const ACCENTS = {
  technical: {
    label: "Technical",
    text: "text-track-technical",
    bg: "bg-track-technical",
    tint: "bg-track-technicalTint",
    border: "border-track-technical",
    ring: "ring-track-technical",
    dot: "bg-track-technical",
  },
  communication: {
    label: "Communication",
    text: "text-track-communication",
    bg: "bg-track-communication",
    tint: "bg-track-communicationTint",
    border: "border-track-communication",
    ring: "ring-track-communication",
    dot: "bg-track-communication",
  },
  aptitude: {
    label: "Aptitude",
    text: "text-track-aptitude",
    bg: "bg-track-aptitude",
    tint: "bg-track-aptitudeTint",
    border: "border-track-aptitude",
    ring: "ring-track-aptitude",
    dot: "bg-track-aptitude",
  },
  consistency: {
    label: "Consistency",
    text: "text-track-consistency",
    bg: "bg-track-consistency",
    tint: "bg-track-consistencyTint",
    border: "border-track-consistency",
    ring: "ring-track-consistency",
    dot: "bg-track-consistency",
  },
  others: {
    label: "Others",
    text: "text-track-others",
    bg: "bg-track-others",
    tint: "bg-track-othersTint",
    border: "border-track-others",
    ring: "ring-track-others",
    dot: "bg-track-others",
  },
  classes: {
    label: "Classes",
    text: "text-track-classes",
    bg: "bg-track-classes",
    tint: "bg-track-classesTint",
    border: "border-track-classes",
    ring: "ring-track-classes",
    dot: "bg-track-classes",
  },
};

export const accentList = Object.keys(ACCENTS);

export const PRIORITY_STYLES = {
  Low: "bg-track-consistencyTint text-track-consistency",
  Medium: "bg-track-aptitudeTint text-track-aptitude",
  High: "bg-track-communicationTint text-track-communication",
};
