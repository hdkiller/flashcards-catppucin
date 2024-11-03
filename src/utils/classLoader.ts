interface Flashcard {
  id: number;
  question: string;
  answer: string;
}

interface FlashcardMeta {
  title: string;
  description: string;
  emoji: string;
}

interface FlashcardDeck {
  meta: FlashcardMeta;
  flashcards: Flashcard[];
}

interface ClassData {
  title: string;
  description: string;
  emoji: string;
  decks: string[];
}

export async function loadClass(classDir: string): Promise<{ classData: ClassData; decks: FlashcardDeck[] }> {
  try {
    // Load class.json
    // @vite-ignore
    const classModule = await import(`../data/${classDir}/class.json`);
    const classData: ClassData = classModule.default;

    // Load all decks
    const decksPromises = classData.decks.map(async (deckPath) => {
      const fullPath = `../data/${classDir}/${deckPath.replace('./', '')}`;
      // @vite-ignore
      const deckModule = await import(fullPath);
      return deckModule.default as FlashcardDeck;
    });

    const decks = await Promise.all(decksPromises);
    return { classData, decks };
  } catch (error) {
    console.error(`Error loading class ${classDir}:`, error);
    throw error;
  }
}

export async function listClasses(): Promise<string[]> {
  // Return both available classes
  return ['HungarianHistory', 'NyelvtanSzofajok'];
}

export type { Flashcard, FlashcardMeta, FlashcardDeck, ClassData };
