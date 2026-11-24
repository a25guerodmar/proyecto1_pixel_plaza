<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import Phaser from 'phaser';
import { MapScene } from '../game/MapScene';

const emit = defineEmits(['mapa-carregat', 'canviZona']);

const contenidor = ref(null);
let game = null;

onMounted(() => {
    game = new Phaser.Game({
        type: Phaser.AUTO,
        width: 640,
        height: 480,
        backgroundColor: '#0f172a',
        pixelArt: true,
        physics: {
            default: 'arcade',
            arcade: {gravity: {y:0}} // el 0 es para la vista zenital
        },
        parent: contenidor.value,
        scene: [MapScene]
    });

    // Recibimos el evento de MapScene y lo enviamos a App.vue
    game.events.on('mapa-carregat', (elements) => {
        emit('mapa-carregat', elements);
    });
});

onUnmounted(() => {
    game?.destroy(true);
});
</script>

<template>
    <div ref="contenidor"></div>
</template>