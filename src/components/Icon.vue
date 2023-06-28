<template>
    <i
        style="
            display: grid;
            place-content: center center;
            vertical-align: middle;
        "
        v-html="iconSvg"
        v-bind="$attrs"
    ></i>
</template>

<script setup>
import feather from "feather-icons";

const props = defineProps({
    icon: {
        type: String,
        required: true,
    },
    size: {
        type: Number,
        default: 24,
    },
});

const iconSvg = feather.icons[props.icon].toSvg({
    width: props.size,
    height: props.size,
});
</script>
