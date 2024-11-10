import { useRouter } from 'vue-router';
const { defineProps, defineSlots, defineEmits, defineExpose, defineModel, defineOptions, withDefaults, } = await import('vue');
const router = useRouter();
const restartSession = () => {
    router.go(-1); // Go back to previous page instead of home | BUG: this has to be refactored | File: Coding | ID: 1730670887 |
}; /* PartiallyEnd: #3632/scriptSetup.vue */
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
    let __VLS_resolvedLocalAndGlobalComponents;
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("flex flex-col items-center justify-center min-h-screen ctp-mocha bg-gradient-to-b from-ctp-base to-ctp-crust") }, });
    __VLS_elementAsFunction(__VLS_intrinsicElements.h1, __VLS_intrinsicElements.h1)({ ...{ class: ("text-6xl font-bold mb-8 text-ctp-pink") }, });
    __VLS_elementAsFunction(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({ ...{ onClick: (__VLS_ctx.restartSession) }, ...{ class: ("px-6 py-3 bg-ctp-lavender text-ctp-base rounded-lg hover:bg-ctp-mauve transition-colors") }, });
    __VLS_styleScopedClasses['flex'];
    __VLS_styleScopedClasses['flex-col'];
    __VLS_styleScopedClasses['items-center'];
    __VLS_styleScopedClasses['justify-center'];
    __VLS_styleScopedClasses['min-h-screen'];
    __VLS_styleScopedClasses['ctp-mocha'];
    __VLS_styleScopedClasses['bg-gradient-to-b'];
    __VLS_styleScopedClasses['from-ctp-base'];
    __VLS_styleScopedClasses['to-ctp-crust'];
    __VLS_styleScopedClasses['text-6xl'];
    __VLS_styleScopedClasses['font-bold'];
    __VLS_styleScopedClasses['mb-8'];
    __VLS_styleScopedClasses['text-ctp-pink'];
    __VLS_styleScopedClasses['px-6'];
    __VLS_styleScopedClasses['py-3'];
    __VLS_styleScopedClasses['bg-ctp-lavender'];
    __VLS_styleScopedClasses['text-ctp-base'];
    __VLS_styleScopedClasses['rounded-lg'];
    __VLS_styleScopedClasses['hover:bg-ctp-mauve'];
    __VLS_styleScopedClasses['transition-colors'];
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
            restartSession: restartSession,
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
//# sourceMappingURL=CompletionView.vue.js.map