<template>
    <span class="loader"></span>
</template>

<style scoped>
.loader {
    width: 75px;
    height: 75px;
    border-radius: 50%;
    display: inline-block;
    position: relative;
    background: linear-gradient(
        0deg,
        rgba(0, 0, 0, 0) 33%,
        var(--color-ui-primary) 100%
    );
    box-sizing: border-box;
    animation: rotation 1s linear infinite;
    margin: auto;
}
.loader::after {
    content: "";
    box-sizing: border-box;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 70px;
    height: 70px;
    border-radius: 50%;
    background: var(--color-background);
}
@keyframes rotation {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}
</style>
