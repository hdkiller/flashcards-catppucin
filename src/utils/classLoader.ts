interface Flashcard {
  id: number;
  question: string;
  answer: string;
}

interface FlashcardMeta {
  title: string;
  description: string;
  emoji: string;
  tags?: string[];
  difficulty?: string;
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

function parseMarkdownDeck(content: string): FlashcardDeck {
  // Split the content into frontmatter and cards
  const [, frontmatter, ...rest] = content.split('---\n');

  // Parse frontmatter
  const meta: FlashcardMeta = {
    title: '',
    description: '',
    emoji: '',
    tags: [],
    difficulty: ''
  };

  frontmatter.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split(':');
    if (key && valueParts.length) {
      const value = valueParts.join(':').trim();
      switch (key.trim()) {
        case 'title':
          meta.title = value;
          break;
        case 'description':
          meta.description = value;
          break;
        case 'emoji':
          meta.emoji = value.replace(/"/g, '');
          break;
        case 'tags':
          meta.tags = value.split(',').map(tag => tag.trim());
          break;
        case 'difficulty':
          meta.difficulty = value;
          break;
      }
    }
  });

  // Parse cards
  const cardsContent = rest.join('---\n');
  const cards = cardsContent
    .split('---')
    .filter(card => card.trim())
    .map((card, index) => {
      const [front, back] = card.trim().split('***').map(part => part.trim());
      return {
        id: index + 1,
        question: front,
        answer: back
      };
    });

  return {
    meta,
    flashcards: cards
  };
}

export async function loadClass(classDir: string): Promise<{ classData: ClassData; decks: FlashcardDeck[] }> {
  try {
    // Load class.json
    const classData: ClassData = (await import(`../data/${classDir}/class.json`)).default;

    // Load all decks
    const decksPromises = classData.decks.map(async (deckPath) => {
      const isMarkdown = deckPath.endsWith('.md');
      const fullPath = `../data/${classDir}/${deckPath.replace('./', '')}`;

      if (isMarkdown) {
        // For markdown files, load as text
        const content = await fetch(new URL(fullPath, import.meta.url)).then(res => res.text());
        return parseMarkdownDeck(content);
      } else {
        // For JSON files
        const module = await import(/* @vite-ignore */ fullPath);
        return module.default as FlashcardDeck;
      }
    });

    const decks = await Promise.all(decksPromises);
    return { classData, decks };
  } catch (error) {
    console.error(`Error loading class ${classDir}:`, error);
    throw error;
  }
}

export async function listClasses(): Promise<string[]> {
  // Return all available classes
  return ['HungarianHistory', 'NyelvtanSzofajok', 'Helyesiras'];
}

export type { Flashcard, FlashcardMeta, FlashcardDeck, ClassData };
