interface Meta {
    title: string;
    description: string;
    emoji: string;
    tags: string[];
    difficulty: string;
}

interface Flashcard {
    id: number;
    question: string;
    answer: string;
}

export interface FlashcardDeck {
    meta: Meta;
    flashcards: Flashcard[];
}

export interface ClassData {
    title: string;
    description: string;
    emoji: string;
    decks: string[];
}

function parseMarkdownDeck(content: string): FlashcardDeck {
    // Split the content into frontmatter and cards
    const [, frontmatter, ...rest] = content.split('---\n');
    // Parse frontmatter
    const meta: Meta = {
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
        // First, load the class definition using fetch
        const classResponse = await fetch(`/data/${classDir}/class.json`);
        if (!classResponse.ok) throw new Error(`Failed to load class definition for ${classDir}`);
        const classData: ClassData = await classResponse.json();

        // Load all decks using fetch
        const decksPromises = classData.decks.map(async (deckPath: string) => {
            const isMarkdown = deckPath.endsWith('.md');
            const fullPath = `/data/${classDir}/${deckPath.replace('./', '')}`;

            const response = await fetch(fullPath);
            if (!response.ok) throw new Error(`Failed to load deck: ${fullPath}`);

            if (isMarkdown) {
                const content = await response.text();
                return parseMarkdownDeck(content);
            } else {
                return await response.json() as FlashcardDeck;
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
    return ['HungarianHistory', 'NyelvtanSzofajok', 'Helyesiras'];
}
