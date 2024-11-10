import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import FlashcardItem from '../components/FlashcardItem.vue';
import { loadClass, listClasses } from '../utils/classLoader';
const { defineProps, defineSlots, defineEmits, defineExpose, defineModel, defineOptions, withDefaults, } = await import('vue');
const CARDS_PER_SESSION = 5;
const router = useRouter();
const classes = ref([]);
const currentClass = ref(null);
const currentDeck = ref(null);
const currentIndex = ref(0);
const isNavigatingForward = ref(true);
const currentFlashcards = computed(() => currentDeck.value?.flashcards || []);
const currentCard = computed(() => currentFlashcards.value[currentIndex.value]);
const transitionName = computed(() => isNavigatingForward.value ? 'slide-forward' : 'slide-backward');
// Load available classes on mount
onMounted(async () => {
    try {
        const availableClasses = await listClasses();
        const loadedClasses = await Promise.all(availableClasses.map(classDir => loadClass(classDir)));
        classes.value = loadedClasses;
    }
    catch (error) {
        console.error('Error loading classes:', error);
    }
});
const getStorageKey = (classTitle, deckTitle) => `${classTitle}-${deckTitle}-ratings`;
const loadRatings = (storageKey) => {
    try {
        return JSON.parse(localStorage.getItem(storageKey) || '{}');
    }
    catch {
        return {};
    }
};
const selectCardsForSession = (deck, classTitle) => {
    const storageKey = getStorageKey(classTitle, deck.meta.title);
    const ratings = loadRatings(storageKey);
    // Sort cards based on their ratings
    const sortedCards = [...deck.flashcards].sort((a, b) => {
        const ratingA = ratings[a.id] || 0; // 0 for unrated cards
        const ratingB = ratings[b.id] || 0;
        // Prioritize unrated cards
        if (ratingA === 0 && ratingB !== 0)
            return -1;
        if (ratingB === 0 && ratingA !== 0)
            return 1;
        // Then sort by rating (lower ratings first)
        return ratingA - ratingB;
    });
    // Take first CARDS_PER_SESSION cards
    return sortedCards.slice(0, CARDS_PER_SESSION);
};
const selectClass = (classData) => {
    currentClass.value = classData;
    currentDeck.value = null;
    currentIndex.value = 0;
};
const selectDeck = (deck) => {
    if (!currentClass.value)
        return;
    // Create a new deck object with filtered cards
    currentDeck.value = {
        ...deck,
        flashcards: selectCardsForSession(deck, currentClass.value.classData.title)
    };
    currentIndex.value = 0;
};
const nextCard = () => {
    if (currentIndex.value < currentFlashcards.value.length - 1) {
        isNavigatingForward.value = true;
        currentIndex.value++;
    }
    else {
        // Navigate to completion view when reaching the end
        router.push({
            name: 'completion',
            params: {
                classTitle: currentClass.value.classData.title,
                deckTitle: currentDeck.value.meta.title
            }
        });
    }
};
const previousCard = () => {
    if (currentIndex.value > 0) {
        isNavigatingForward.value = false;
        currentIndex.value--;
    }
};
const handleKeyPress = (event) => {
    if (!currentDeck.value)
        return;
    switch (event.key) {
        case ' ':
        case 'Spacebar':
            event.preventDefault();
            const cardElement = document.querySelector('.card-content');
            if (cardElement) {
                cardElement.click();
            }
            break;
        case 'ArrowLeft':
        case 'Backspace':
            event.preventDefault();
            previousCard();
            break;
        case 'Enter':
        case 'ArrowRight':
            event.preventDefault();
            nextCard();
            break;
    }
};
const handleFlip = () => {
    // This function can be used to handle any additional logic when a card is flipped
    // For now it's just a placeholder for future functionality
};
const handleRate = ({ cardId, rating }) => {
    // Store the rating in localStorage
    if (currentClass.value && currentDeck.value) {
        const storageKey = getStorageKey(currentClass.value.classData.title, currentDeck.value.meta.title);
        const storedRatings = loadRatings(storageKey);
        storedRatings[cardId] = rating;
        localStorage.setItem(storageKey, JSON.stringify(storedRatings));
    }
    // Advance to the next card
    nextCard();
};
onMounted(() => {
    window.addEventListener('keydown', handleKeyPress);
});
onUnmounted(() => {
    window.removeEventListener('keydown', handleKeyPress);
});
; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_fnComponent = (await import('vue')).defineComponent({});
;
let __VLS_functionalComponentProps;
function __VLS_template() {
    const __VLS_ctx = {};
    const __VLS_localComponents = {
        ...{},
        ...{},
        ...__VLS_ctx,
    };
    let __VLS_components;
    const __VLS_localDirectives = {
        ...{},
        ...__VLS_ctx,
    };
    let __VLS_directives;
    let __VLS_styleScopedClasses;
    // CSS variable injection 
    // CSS variable injection end 
    let __VLS_resolvedLocalAndGlobalComponents;
    __VLS_elementAsFunction(__VLS_intrinsicElements.main, __VLS_intrinsicElements.main)({ ...{ class: ("min-h-screen py-8 px-4 ctp-mocha bg-gradient-to-b from-ctp-base to-ctp-crust") }, });
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("max-w-2xl mx-auto") }, });
    __VLS_elementAsFunction(__VLS_intrinsicElements.header, __VLS_intrinsicElements.header)({ ...{ class: ("text-center mb-8") }, });
    __VLS_elementAsFunction(__VLS_intrinsicElements.h1, __VLS_intrinsicElements.h1)({ ...{ class: ("text-5xl font-bold mb-2 text-ctp-pink from-ctp-pink to-ctp-mauve") }, });
    if (!__VLS_ctx.currentClass) {
        __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("mb-8") }, });
        __VLS_elementAsFunction(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({ ...{ class: ("text-2xl mb-4 text-ctp-subtext0") }, });
        __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("flex justify-center gap-4 flex-wrap") }, });
        for (const [classData] of __VLS_getVForSourceType((__VLS_ctx.classes))) {
            __VLS_elementAsFunction(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({ ...{ onClick: (...[$event]) => {
                        if (!((!__VLS_ctx.currentClass)))
                            return;
                        __VLS_ctx.selectClass(classData);
                    } }, key: ((classData.classData.title)), ...{ class: ("px-6 py-4 rounded-lg bg-ctp-surface0 hover:bg-ctp-surface1 transition-colors duration-200 group") }, });
            __VLS_elementAsFunction(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({ ...{ class: ("text-3xl block mb-2") }, });
            (classData.classData.emoji);
            __VLS_elementAsFunction(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({ ...{ class: ("block text-ctp-text font-medium") }, });
            (classData.classData.title);
            __VLS_elementAsFunction(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({ ...{ class: ("text-sm text-ctp-subtext0") }, });
            (classData.classData.description);
        }
    }
    else {
        __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("flex items-center justify-center gap-2 mb-4") }, });
        __VLS_elementAsFunction(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({ ...{ onClick: (...[$event]) => {
                    if (!(!((!__VLS_ctx.currentClass))))
                        return;
                    __VLS_ctx.currentClass = null;
                } }, ...{ class: ("text-ctp-subtext0 hover:text-ctp-text") }, });
        __VLS_elementAsFunction(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({ ...{ class: ("text-2xl text-ctp-subtext0") }, });
        (__VLS_ctx.currentClass.classData.title);
        if (__VLS_ctx.currentDeck) {
            __VLS_elementAsFunction(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({ ...{ class: ("text-ctp-subtext0") }, });
            (__VLS_ctx.currentIndex + 1);
            (__VLS_ctx.currentFlashcards.length);
        }
        if (!__VLS_ctx.currentDeck) {
            __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("flex justify-center gap-4 mb-4") }, });
            for (const [deck] of __VLS_getVForSourceType((__VLS_ctx.currentClass.decks))) {
                __VLS_elementAsFunction(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({ ...{ onClick: (...[$event]) => {
                            if (!(!((!__VLS_ctx.currentClass))))
                                return;
                            if (!((!__VLS_ctx.currentDeck)))
                                return;
                            __VLS_ctx.selectDeck(deck);
                        } }, key: ((deck.meta.title)), ...{ class: ("text-3xl hover:scale-110 transition-transform duration-200 relative group") }, });
                (deck.meta.emoji);
                __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-ctp-surface0 text-ctp-text text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap") }, });
                (deck.meta.description);
            }
        }
    }
    const __VLS_0 = __VLS_resolvedLocalAndGlobalComponents.transition;
    /** @type { [typeof __VLS_components.Transition, typeof __VLS_components.transition, typeof __VLS_components.Transition, typeof __VLS_components.transition, ] } */
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({ name: ((__VLS_ctx.transitionName)), mode: ("out-in"), }));
    const __VLS_2 = __VLS_1({ name: ((__VLS_ctx.transitionName)), mode: ("out-in"), }, ...__VLS_functionalComponentArgsRest(__VLS_1));
    if (__VLS_ctx.currentCard) {
        // @ts-ignore
        [FlashcardItem,];
        // @ts-ignore
        const __VLS_6 = __VLS_asFunctionalComponent(FlashcardItem, new FlashcardItem({ ...{ 'onFlip': {} }, ...{ 'onRate': {} }, key: ((__VLS_ctx.currentCard.id)), card: ((__VLS_ctx.currentCard)), ...{ class: ("mb-8") }, }));
        const __VLS_7 = __VLS_6({ ...{ 'onFlip': {} }, ...{ 'onRate': {} }, key: ((__VLS_ctx.currentCard.id)), card: ((__VLS_ctx.currentCard)), ...{ class: ("mb-8") }, }, ...__VLS_functionalComponentArgsRest(__VLS_6));
        let __VLS_11;
        const __VLS_12 = {
            onFlip: (__VLS_ctx.handleFlip)
        };
        const __VLS_13 = {
            onRate: (__VLS_ctx.handleRate)
        };
        let __VLS_8;
        let __VLS_9;
        var __VLS_10;
    }
    __VLS_nonNullable(__VLS_5.slots).default;
    var __VLS_5;
    if (__VLS_ctx.currentDeck) {
        __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("flex justify-center gap-4") }, });
        __VLS_elementAsFunction(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({ ...{ onClick: (__VLS_ctx.previousCard) }, ...{ class: ("px-4 py-2 rounded-lg bg-ctp-lavender hover:bg-ctp-mauve active:bg-ctp-mauve/75 transition-colors duration-200") }, disabled: ((__VLS_ctx.currentIndex === 0)), ...{ class: (({ 'opacity-50 cursor-not-allowed': __VLS_ctx.currentIndex === 0 })) }, });
        __VLS_elementAsFunction(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({ ...{ onClick: (__VLS_ctx.nextCard) }, ...{ class: ("px-4 py-2 rounded-lg bg-ctp-lavender hover:bg-ctp-mauve active:bg-ctp-mauve/75 transition-colors duration-200") }, disabled: ((__VLS_ctx.currentIndex === __VLS_ctx.currentFlashcards.length - 1)), ...{ class: (({ 'opacity-50 cursor-not-allowed': __VLS_ctx.currentIndex === __VLS_ctx.currentFlashcards.length - 1 })) }, });
    }
    if (__VLS_ctx.currentDeck) {
        __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("mt-8 flex justify-center gap-2") }, });
        for (const [_, index] of __VLS_getVForSourceType((__VLS_ctx.currentFlashcards))) {
            __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ key: ((index)), ...{ class: ("w-3 h-3 rounded-full") }, ...{ class: ((index === __VLS_ctx.currentIndex ? 'bg-ctp-blue' : 'bg-ctp-surface0')) }, });
        }
    }
    __VLS_styleScopedClasses['min-h-screen'];
    __VLS_styleScopedClasses['py-8'];
    __VLS_styleScopedClasses['px-4'];
    __VLS_styleScopedClasses['ctp-mocha'];
    __VLS_styleScopedClasses['bg-gradient-to-b'];
    __VLS_styleScopedClasses['from-ctp-base'];
    __VLS_styleScopedClasses['to-ctp-crust'];
    __VLS_styleScopedClasses['max-w-2xl'];
    __VLS_styleScopedClasses['mx-auto'];
    __VLS_styleScopedClasses['text-center'];
    __VLS_styleScopedClasses['mb-8'];
    __VLS_styleScopedClasses['text-5xl'];
    __VLS_styleScopedClasses['font-bold'];
    __VLS_styleScopedClasses['mb-2'];
    __VLS_styleScopedClasses['text-ctp-pink'];
    __VLS_styleScopedClasses['from-ctp-pink'];
    __VLS_styleScopedClasses['to-ctp-mauve'];
    __VLS_styleScopedClasses['mb-8'];
    __VLS_styleScopedClasses['text-2xl'];
    __VLS_styleScopedClasses['mb-4'];
    __VLS_styleScopedClasses['text-ctp-subtext0'];
    __VLS_styleScopedClasses['flex'];
    __VLS_styleScopedClasses['justify-center'];
    __VLS_styleScopedClasses['gap-4'];
    __VLS_styleScopedClasses['flex-wrap'];
    __VLS_styleScopedClasses['px-6'];
    __VLS_styleScopedClasses['py-4'];
    __VLS_styleScopedClasses['rounded-lg'];
    __VLS_styleScopedClasses['bg-ctp-surface0'];
    __VLS_styleScopedClasses['hover:bg-ctp-surface1'];
    __VLS_styleScopedClasses['transition-colors'];
    __VLS_styleScopedClasses['duration-200'];
    __VLS_styleScopedClasses['group'];
    __VLS_styleScopedClasses['text-3xl'];
    __VLS_styleScopedClasses['block'];
    __VLS_styleScopedClasses['mb-2'];
    __VLS_styleScopedClasses['block'];
    __VLS_styleScopedClasses['text-ctp-text'];
    __VLS_styleScopedClasses['font-medium'];
    __VLS_styleScopedClasses['text-sm'];
    __VLS_styleScopedClasses['text-ctp-subtext0'];
    __VLS_styleScopedClasses['flex'];
    __VLS_styleScopedClasses['items-center'];
    __VLS_styleScopedClasses['justify-center'];
    __VLS_styleScopedClasses['gap-2'];
    __VLS_styleScopedClasses['mb-4'];
    __VLS_styleScopedClasses['text-ctp-subtext0'];
    __VLS_styleScopedClasses['hover:text-ctp-text'];
    __VLS_styleScopedClasses['text-2xl'];
    __VLS_styleScopedClasses['text-ctp-subtext0'];
    __VLS_styleScopedClasses['text-ctp-subtext0'];
    __VLS_styleScopedClasses['flex'];
    __VLS_styleScopedClasses['justify-center'];
    __VLS_styleScopedClasses['gap-4'];
    __VLS_styleScopedClasses['mb-4'];
    __VLS_styleScopedClasses['text-3xl'];
    __VLS_styleScopedClasses['hover:scale-110'];
    __VLS_styleScopedClasses['transition-transform'];
    __VLS_styleScopedClasses['duration-200'];
    __VLS_styleScopedClasses['relative'];
    __VLS_styleScopedClasses['group'];
    __VLS_styleScopedClasses['absolute'];
    __VLS_styleScopedClasses['bottom-full'];
    __VLS_styleScopedClasses['left-1/2'];
    __VLS_styleScopedClasses['transform'];
    __VLS_styleScopedClasses['-translate-x-1/2'];
    __VLS_styleScopedClasses['mb-2'];
    __VLS_styleScopedClasses['px-3'];
    __VLS_styleScopedClasses['py-1'];
    __VLS_styleScopedClasses['bg-ctp-surface0'];
    __VLS_styleScopedClasses['text-ctp-text'];
    __VLS_styleScopedClasses['text-sm'];
    __VLS_styleScopedClasses['rounded-lg'];
    __VLS_styleScopedClasses['opacity-0'];
    __VLS_styleScopedClasses['group-hover:opacity-100'];
    __VLS_styleScopedClasses['transition-opacity'];
    __VLS_styleScopedClasses['duration-200'];
    __VLS_styleScopedClasses['whitespace-nowrap'];
    __VLS_styleScopedClasses['mb-8'];
    __VLS_styleScopedClasses['flex'];
    __VLS_styleScopedClasses['justify-center'];
    __VLS_styleScopedClasses['gap-4'];
    __VLS_styleScopedClasses['px-4'];
    __VLS_styleScopedClasses['py-2'];
    __VLS_styleScopedClasses['rounded-lg'];
    __VLS_styleScopedClasses['bg-ctp-lavender'];
    __VLS_styleScopedClasses['hover:bg-ctp-mauve'];
    __VLS_styleScopedClasses['active:bg-ctp-mauve/75'];
    __VLS_styleScopedClasses['transition-colors'];
    __VLS_styleScopedClasses['duration-200'];
    __VLS_styleScopedClasses['opacity-50'];
    __VLS_styleScopedClasses['cursor-not-allowed'];
    __VLS_styleScopedClasses['px-4'];
    __VLS_styleScopedClasses['py-2'];
    __VLS_styleScopedClasses['rounded-lg'];
    __VLS_styleScopedClasses['bg-ctp-lavender'];
    __VLS_styleScopedClasses['hover:bg-ctp-mauve'];
    __VLS_styleScopedClasses['active:bg-ctp-mauve/75'];
    __VLS_styleScopedClasses['transition-colors'];
    __VLS_styleScopedClasses['duration-200'];
    __VLS_styleScopedClasses['opacity-50'];
    __VLS_styleScopedClasses['cursor-not-allowed'];
    __VLS_styleScopedClasses['mt-8'];
    __VLS_styleScopedClasses['flex'];
    __VLS_styleScopedClasses['justify-center'];
    __VLS_styleScopedClasses['gap-2'];
    __VLS_styleScopedClasses['w-3'];
    __VLS_styleScopedClasses['h-3'];
    __VLS_styleScopedClasses['rounded-full'];
    var __VLS_slots;
    var __VLS_inheritedAttrs;
    const __VLS_refs = {};
    var $refs;
    var $el;
    return {
        attrs: {},
        slots: __VLS_slots,
        refs: $refs,
        rootEl: $el,
    };
}
;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            FlashcardItem: FlashcardItem,
            classes: classes,
            currentClass: currentClass,
            currentDeck: currentDeck,
            currentIndex: currentIndex,
            currentFlashcards: currentFlashcards,
            currentCard: currentCard,
            transitionName: transitionName,
            selectClass: selectClass,
            selectDeck: selectDeck,
            nextCard: nextCard,
            previousCard: previousCard,
            handleFlip: handleFlip,
            handleRate: handleRate,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
    __typeEl: {},
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=HomeView.vue.js.map