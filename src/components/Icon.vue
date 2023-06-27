<template>
    <i v-html="iconSvg"></i>
</template>

<script setup>
import feather from "feather-icons";

const props = defineProps(["icon"]);

const iconSvg = feather.icons[props.icon].toSvg();
</script>
