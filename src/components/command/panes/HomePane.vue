<template>
    <CommandGroup ref="pane">
        <CommandItem data-pane="ThemePane" label="Change theme"
            >Change theme...</CommandItem
        >
        <CommandItem data-pane="LanguagePane" label="Change language"
            >Change language...</CommandItem
        >
        <CommandItem data-pane="TimePane" label="Change test time"
            >Change test time...</CommandItem
        >
        <CommandItem data-option="reset-settings" label="Reset all settings"
            >Reset all settings</CommandItem
        >
    </CommandGroup>
</template>

<script setup>
import CommandGroup from "@/components/command/base/CommandGroup.vue";
import CommandItem from "@/components/command/base/CommandItem.vue";
</script>
