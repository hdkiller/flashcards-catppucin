import { defineComponent, ref, watch, onMounted, onUnmounted, computed } from 'vue';
import { marked } from 'marked';
export default defineComponent({
    name: 'FlashcardItem',
    props: {
        card: {
            type: Object,
            required: true
        }
    },
    emits: ['flip', 'rate'],
    setup(props, { emit }) {
        const isFlipped = ref(false);
        const ratings = [
            { emoji: '😕', value: 1, label: 'Hard' },
            { emoji: '🙂', value: 2, label: 'Okay' },
            { emoji: '😊', value: 3, label: 'Easy' },
            { emoji: '😎', value: 4, label: 'Nailed it' }
        ];
        const currentContent = computed(() => {
            const content = isFlipped.value ? props.card.answer : props.card.question;
            return marked(content);
        });
        // Compute if the text is short (for question) or long (for answer)
        const isShortText = computed(() => {
            return props.card.question.length < 50;
        });
        const isLongText = computed(() => {
            return props.card.answer.length > 200;
        });
        watch(() => props.card, () => {
            isFlipped.value = false;
        }, { deep: true });
        const toggleCard = () => {
            isFlipped.value = !isFlipped.value;
            emit('flip', isFlipped.value);
        };
        const rateCard = (rating) => {
            emit('rate', { cardId: props.card.id, rating });
        };
        const handleKeyDown = (event) => {
            if (!isFlipped.value) {
                const cardElement = document.querySelector('.card-content');
                if (cardElement) {
                    cardElement.classList.add('shake');
                    setTimeout(() => {
                        cardElement.classList.remove('shake');
                    }, 500);
                }
                return;
            }
            const key = event.key;
            if (['1', '2', '3', '4'].includes(key)) {
                event.preventDefault();
                const rating = parseInt(key);
                rateCard(rating);
            }
        };
        onMounted(() => {
            window.addEventListener('keydown', handleKeyDown);
        });
        onUnmounted(() => {
            window.removeEventListener('keydown', handleKeyDown);
        });
        return {
            isFlipped,
            toggleCard,
            ratings,
            rateCard,
            currentContent,
            isShortText,
            isLongText
        };
    }
});
; /* PartiallyEnd: #3632/script.vue */
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
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ onClick: (__VLS_ctx.toggleCard) }, ...{ class: ("card min-h-[360px] mx-auto rounded-lg shadow-lg transition-colors duration-300 outline outline-ctp-pink relative flex") }, ...{ class: (({ 'bg-ctp-crust': !__VLS_ctx.isFlipped, 'bg-ctp-mauve/50 text-ctp-text ': __VLS_ctx.isFlipped })) }, });
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("card-content flex-1 flex items-center justify-center text-center p-6") }, });
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("markdown-content w-full") }, ...{ class: (({
                'text-ctp-subtext0': !__VLS_ctx.isFlipped,
                'text-ctp-text': __VLS_ctx.isFlipped,
                'text-4xl': !__VLS_ctx.isFlipped && __VLS_ctx.isShortText,
                'text-3xl': (!__VLS_ctx.isFlipped && !__VLS_ctx.isShortText) || (__VLS_ctx.isFlipped && !__VLS_ctx.isLongText),
                'text-2xl': __VLS_ctx.isFlipped && __VLS_ctx.isLongText
            })) }, });
    __VLS_asFunctionalDirective(__VLS_directives.vHtml)(null, { ...__VLS_directiveBindingRestFields, modifiers: {}, value: (__VLS_ctx.currentContent) }, null, null);
    if (__VLS_ctx.isFlipped) {
        __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ onClick: () => { } }, ...{ class: ("absolute bottom-0 left-0 right-0 flex justify-center gap-4 p-4 bg-ctp-surface0 bg-opacity-90 rounded-b-lg") }, });
        for (const [rating] of __VLS_getVForSourceType((__VLS_ctx.ratings))) {
            __VLS_elementAsFunction(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({ ...{ onClick: (...[$event]) => {
                        if (!((__VLS_ctx.isFlipped)))
                            return;
                        __VLS_ctx.rateCard(rating.value);
                    } }, key: ((rating.value)), ...{ class: ("text-2xl hover:transform hover:scale-125 transition-transform duration-200 cursor-pointer") }, title: ((rating.label)), });
            (rating.emoji);
        }
    }
    __VLS_styleScopedClasses['card'];
    __VLS_styleScopedClasses['min-h-[360px]'];
    __VLS_styleScopedClasses['mx-auto'];
    __VLS_styleScopedClasses['rounded-lg'];
    __VLS_styleScopedClasses['shadow-lg'];
    __VLS_styleScopedClasses['transition-colors'];
    __VLS_styleScopedClasses['duration-300'];
    __VLS_styleScopedClasses['outline'];
    __VLS_styleScopedClasses['outline-ctp-pink'];
    __VLS_styleScopedClasses['relative'];
    __VLS_styleScopedClasses['flex'];
    __VLS_styleScopedClasses['bg-ctp-crust'];
    __VLS_styleScopedClasses['bg-ctp-mauve/50'];
    __VLS_styleScopedClasses['text-ctp-text'];
    __VLS_styleScopedClasses['card-content'];
    __VLS_styleScopedClasses['flex-1'];
    __VLS_styleScopedClasses['flex'];
    __VLS_styleScopedClasses['items-center'];
    __VLS_styleScopedClasses['justify-center'];
    __VLS_styleScopedClasses['text-center'];
    __VLS_styleScopedClasses['p-6'];
    __VLS_styleScopedClasses['markdown-content'];
    __VLS_styleScopedClasses['w-full'];
    __VLS_styleScopedClasses['text-ctp-subtext0'];
    __VLS_styleScopedClasses['text-ctp-text'];
    __VLS_styleScopedClasses['text-4xl'];
    __VLS_styleScopedClasses['text-3xl'];
    __VLS_styleScopedClasses['text-2xl'];
    __VLS_styleScopedClasses['absolute'];
    __VLS_styleScopedClasses['bottom-0'];
    __VLS_styleScopedClasses['left-0'];
    __VLS_styleScopedClasses['right-0'];
    __VLS_styleScopedClasses['flex'];
    __VLS_styleScopedClasses['justify-center'];
    __VLS_styleScopedClasses['gap-4'];
    __VLS_styleScopedClasses['p-4'];
    __VLS_styleScopedClasses['bg-ctp-surface0'];
    __VLS_styleScopedClasses['bg-opacity-90'];
    __VLS_styleScopedClasses['rounded-b-lg'];
    __VLS_styleScopedClasses['text-2xl'];
    __VLS_styleScopedClasses['hover:transform'];
    __VLS_styleScopedClasses['hover:scale-125'];
    __VLS_styleScopedClasses['transition-transform'];
    __VLS_styleScopedClasses['duration-200'];
    __VLS_styleScopedClasses['cursor-pointer'];
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
let __VLS_self;
//# sourceMappingURL=FlashcardItem.vue.js.map